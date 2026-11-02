import { createHash, randomBytes } from 'node:crypto';
import { env } from '../config/env.js';

export function hashSession(token) { return createHash('sha256').update(token).digest('hex'); }
export function anonymousSession(req, res, next) {
  let token = req.cookies?.amr_session;
  if (!token || token.length < 40) {
    token = randomBytes(32).toString('base64url');
    res.cookie('amr_session', token, { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: env.SESSION_TTL_DAYS * 86400000, path: '/' });
  }
  req.sessionHash = hashSession(token);
  next();
}
export function requireSameOrigin(req, res, next) {
  const origin = req.get('origin');
  if (origin && origin !== env.CLIENT_URL) return res.status(403).json({ success: false, error: { code: 'ORIGIN_REJECTED', message: 'Request origin is not allowed.' } });
  next();
}
