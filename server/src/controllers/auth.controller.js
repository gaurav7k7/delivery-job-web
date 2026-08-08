import crypto from 'node:crypto';
import { User } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token.util.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.util.js';
import { sendMail, buildPasswordResetEmail } from '../services/email.service.js';
import { logActivity } from '../services/activityLog.service.js';
import { env } from '../config/env.js';

const LOCK_THRESHOLD = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt: user.lastLoginAt,
  };
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isDeleted: false })
    .select('+password +loginAttempts +lockUntil')
    .populate({ path: 'role', populate: { path: 'permissions' } });

  if (!user) throw ApiError.unauthorized('Invalid email or password');

  if (user.isLocked()) {
    throw ApiError.forbidden('Account temporarily locked due to too many failed login attempts. Try again later.');
  }

  if (!user.isActive) throw ApiError.forbidden('Your account has been deactivated. Contact an administrator.');

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= LOCK_THRESHOLD) {
      user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
      user.loginAttempts = 0;
    }
    await user.save();
    throw ApiError.unauthorized('Invalid email or password');
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken({ sub: user.id });
  const refreshToken = signRefreshToken({ sub: user.id });
  setAuthCookies(res, { accessToken, refreshToken });

  await logActivity({ user: user.id, action: 'login', module: 'auth', req });

  return new ApiResponse(200, toSafeUser(user), 'Logged in successfully').send(res);
};

export const logout = async (req, res) => {
  if (req.user) {
    await logActivity({ user: req.user.id, action: 'logout', module: 'auth', req });
  }
  clearAuthCookies(res);
  return new ApiResponse(200, null, 'Logged out successfully').send(res);
};

export const refresh = async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) throw ApiError.unauthorized('Session expired, please sign in again');

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    clearAuthCookies(res);
    throw ApiError.unauthorized('Session expired, please sign in again');
  }

  const user = await User.findOne({ _id: payload.sub, isDeleted: false, isActive: true }).select(
    '+passwordChangedAt'
  );
  if (!user) {
    clearAuthCookies(res);
    throw ApiError.unauthorized('Account no longer exists or is inactive');
  }

  if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime()) {
    clearAuthCookies(res);
    throw ApiError.unauthorized('Session expired, please sign in again');
  }

  const accessToken = signAccessToken({ sub: user.id });
  const newRefreshToken = signRefreshToken({ sub: user.id });
  setAuthCookies(res, { accessToken, refreshToken: newRefreshToken });

  return new ApiResponse(200, null, 'Session refreshed').send(res);
};

export const me = async (req, res) => {
  return new ApiResponse(200, toSafeUser(req.user)).send(res);
};

export const updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  }).populate({ path: 'role', populate: { path: 'permissions' } });

  return new ApiResponse(200, toSafeUser(user), 'Profile updated').send(res);
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

  user.password = newPassword;
  await user.save();

  clearAuthCookies(res);
  await logActivity({
    user: user.id,
    action: 'update',
    module: 'auth',
    entityId: user.id,
    changes: { field: 'password' },
    req,
  });

  return new ApiResponse(200, null, 'Password changed. Please sign in again.').send(res);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isDeleted: false, isActive: true });

  // Always respond the same way whether or not the account exists, so the
  // endpoint can't be used to enumerate registered admin emails.
  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetUrl = `${env.CLIENT_URL}/reset-password/${rawToken}`;
    const { subject, html, text } = buildPasswordResetEmail(resetUrl);
    await sendMail({ to: user.email, subject, html, text });
  }

  return new ApiResponse(200, null, 'If that email is registered, a reset link has been sent').send(res);
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
    isDeleted: false,
  });

  if (!user) throw ApiError.badRequest('Password reset link is invalid or has expired');

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return new ApiResponse(200, null, 'Password reset successfully. You can now sign in.').send(res);
};
