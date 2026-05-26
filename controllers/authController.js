const userModel = require('../models/UserModel');

// Very simple token scheme for demo purposes
function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username & password required' });

  const user = userModel.findByUsername(username);
  if (!user || user.password !== password) return res.status(401).json({ error: 'invalid credentials' });

  // token is simple and predictable — ok for this coding test demo only
  const token = `token-${user.username}`;
  return res.json({ token, user: { id: user.id, username: user.username, displayName: user.displayName } });
}

module.exports = { login };
