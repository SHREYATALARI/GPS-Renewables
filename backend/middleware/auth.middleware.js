import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

/**
 * Stateless JWT auth: each login yields a unique token id (`jti`).
 * Sets req.user, req.userId, req.auth (request-scoped — never shared between requests).
 * FUTURE: Refresh tokens, token revocation list backed by Redis.
 */
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server misconfiguration' });
    }
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.sub).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    req.user = user;
    req.userId = user._id.toString();
    req.auth = {
      userId: req.userId,
      role: user.role,
      email: user.email,
      tokenId: decoded.jti ?? null,
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
}
