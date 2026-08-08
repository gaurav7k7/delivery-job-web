import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/token.util.js';
import { User } from '../models/index.js';

export async function authenticate(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return next(ApiError.unauthorized('Authentication required'));

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return next(ApiError.unauthorized('Session expired, please sign in again'));
  }

  const user = await User.findOne({ _id: payload.sub, isDeleted: false, isActive: true })
    .select('+passwordChangedAt')
    .populate({ path: 'role', populate: { path: 'permissions' } });

  if (!user) return next(ApiError.unauthorized('Account no longer exists or is inactive'));

  // The User model has no refresh-token blacklist, so this is what actually
  // makes "change password" revoke sessions elsewhere: any token issued
  // before the most recent password change is rejected.
  if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime()) {
    return next(ApiError.unauthorized('Session expired, please sign in again'));
  }

  req.user = user;
  next();
}

export function authorize(...permissionKeys) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return next(ApiError.forbidden('You do not have permission to perform this action'));
    if (role.isSystem) return next(); // Super Admin bypass — never locked out

    const granted = new Set((role.permissions || []).map((p) => p.key));
    const hasAccess = permissionKeys.some((key) => granted.has(key));
    if (!hasAccess) return next(ApiError.forbidden('You do not have permission to perform this action'));
    next();
  };
}
