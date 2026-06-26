import User from '../models/User.js';

// GET /api/users  (admin)
export async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users: users.map((u) => u.toSafeJSON()) });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id/role  (admin)
export async function setUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'." });
    }
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't change your own role." });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}
