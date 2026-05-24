const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/auth');
const { login, getMe, logout } = require('../controllers/authController');

// POST /api/auth/login  — không cần token
router.post('/login', login);

// GET  /api/auth/me     — cần token hợp lệ
router.get('/me', requireAuth, getMe);

// POST /api/auth/logout — cần token (optional, chỉ để log)
router.post('/logout', requireAuth, logout);

module.exports = router;
