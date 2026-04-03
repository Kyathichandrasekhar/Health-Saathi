/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { verifyToken, getCurrentUser } = require('../controllers/auth.controller');

router.post('/verify', authMiddleware, verifyToken);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
