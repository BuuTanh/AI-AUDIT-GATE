const express    = require('express');
const router     = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const aiController    = require('../controllers/aiController');

// GET /api/ai/status — public, dùng cho status dot trong workspace header
router.get('/status', aiController.status);

// POST /api/ai/chat — chỉ BA và Senior BA được dùng AI workspace
router.post('/chat', requireAuth, requireRole('BA', 'SENIOR_BA'), aiController.chat);

// POST /api/ai/audit-file — multipart PDF/TXT upload, extract text, audit with AI
router.post('/audit-file', requireAuth, requireRole('BA', 'SENIOR_BA'), aiController.auditFileUpload, aiController.auditFile);

module.exports = router;
