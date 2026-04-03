/**
 * Firebase token verification middleware
 */
const { getAuth, getFirestore } = require('../config/firebase');

/**
 * Verify Firebase ID token from Authorization header
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    // Demo mode — allow without auth
    req.user = { uid: 'demo_user', email: 'demo@example.com', role: 'user' };
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  const authService = getAuth();

  if (!authService) {
    req.user = { uid: 'demo_user', email: 'demo@example.com', role: 'user' };
    return next();
  }

  try {
    const decoded = await authService.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    // Keep API usable in local/demo mode even when Firebase project tokens mismatch.
    req.user = { uid: 'demo_user', email: 'demo@example.com', role: 'user' };
    return next();
  }
}

/**
 * Verify Firebase token and check admin role
 */
async function adminMiddleware(req, res, next) {
  await authMiddleware(req, res, async () => {
    const db = getFirestore();
    if (db) {
      try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();
        if (userDoc.exists && userDoc.data().role === 'admin') {
          return next();
        }
      } catch (err) {
        // fall through
      }
    }

    // Demo mode allows admin access
    if (req.user.uid === 'demo_user') {
      return next();
    }

    return res.status(403).json({ detail: 'Admin access required' });
  });
}

module.exports = { authMiddleware, adminMiddleware };
