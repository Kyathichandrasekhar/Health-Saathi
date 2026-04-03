/**
 * QR code routes
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const { generateQR, validateQR } = require('../controllers/qr.controller');

router.post('/generate', authMiddleware, generateQR);
router.post('/validate', adminMiddleware, validateQR);

module.exports = router;
