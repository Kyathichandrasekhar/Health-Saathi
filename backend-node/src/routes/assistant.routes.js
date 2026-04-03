/**
 * Health assistant routes — proxies to FastAPI
 */
const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/assistant.controller');

router.post('/chat', chat);

module.exports = router;
