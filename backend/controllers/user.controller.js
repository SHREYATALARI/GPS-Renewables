import User from '../models/User.model.js';

/** FUTURE: Pagination, search, org directory */
export async function searchUsers(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 2) {
      return res.json({ users: [] });
    }
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const users = await User.find({
      $or: [{ email: rx }, { name: rx }],
    })
      .select('name email role')
      .limit(15)
      .lean();

    res.json({
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    });
  } catch (e) {
    next(e);
  }
}
