/**
 * Auth controller — verify Firebase tokens
 */
async function verifyToken(req, res) {
  const user = req.user;
  res.json({ uid: user.uid, email: user.email || '', verified: true });
}

async function getCurrentUser(req, res) {
  const user = req.user;
  res.json({ uid: user.uid, email: user.email || '', role: user.role || 'user' });
}

module.exports = { verifyToken, getCurrentUser };
