import { env, isProduction } from '../config/env.js';

const DURATION_MULTIPLIERS = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

function parseDurationMs(duration, fallbackMs) {
  const match = /^(\d+)\s*(ms|s|m|h|d)$/i.exec(String(duration).trim());
  if (!match) return fallbackMs;
  return Number(match[1]) * DURATION_MULTIPLIERS[match[2].toLowerCase()];
}

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/',
};

// Refresh token is only ever read on /api/auth/refresh and /api/auth/logout,
// so scoping its cookie path there keeps it out of every other request.
const refreshCookieOptions = { ...baseCookieOptions, path: '/api/auth' };

export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie('access_token', accessToken, {
    ...baseCookieOptions,
    maxAge: parseDurationMs(env.JWT_ACCESS_EXPIRES_IN, 15 * 60 * 1000),
  });
  res.cookie('refresh_token', refreshToken, {
    ...refreshCookieOptions,
    maxAge: parseDurationMs(env.JWT_REFRESH_EXPIRES_IN, 30 * 86_400_000),
  });
}

export function clearAuthCookies(res) {
  res.clearCookie('access_token', baseCookieOptions);
  res.clearCookie('refresh_token', refreshCookieOptions);
}
