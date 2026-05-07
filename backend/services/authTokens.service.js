import crypto from 'crypto';
import jwt from 'jsonwebtoken';

/**
 * Each issuance gets a unique `jti` so tokens never alias across users/sessions.
 * FUTURE: Refresh tokens, asymmetric signing, revocation list.
 */
export function signUserToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET missing');
  const jti = crypto.randomUUID();
  return jwt.sign({ sub: userId, jti }, secret, { expiresIn: '7d' });
}
