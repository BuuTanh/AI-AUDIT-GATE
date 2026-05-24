const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/sessions — danh sách sessions của user hiện tại
router.get('/', requireAuth, async (req, res) => {
  try {
    const sessions = await prisma.aISession.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sessions — tạo session mới
router.post('/', requireAuth, async (req, res) => {
  const { mode, title, projectId } = req.body;
  try {
    const session = await prisma.aISession.create({
      data: {
        userId:    req.user.id,
        mode:      mode    || 'create',
        title:     title   || 'New Session',
        projectId: projectId ? Number(projectId) : null,
      },
    });
    res.status(201).json({ session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/sessions/:id — đổi tên / project
router.patch('/:id', requireAuth, async (req, res) => {
  const { title, projectId } = req.body;
  try {
    const session = await prisma.aISession.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(title     !== undefined && { title }),
        ...(projectId !== undefined && { projectId: projectId ? Number(projectId) : null }),
      },
    });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sessions/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.aISession.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sessions/:id/messages — load toàn bộ tin nhắn
router.get('/:id/messages', requireAuth, async (req, res) => {
  try {
    const messages = await prisma.aIMessage.findMany({
      where: { sessionId: Number(req.params.id) },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sessions/:id/messages — lưu 1 tin nhắn mới
router.post('/:id/messages', requireAuth, async (req, res) => {
  const { type, content } = req.body;
  if (!type || !content) return res.status(400).json({ error: 'type and content required' });
  try {
    const message = await prisma.aIMessage.create({
      data: { sessionId: Number(req.params.id), type, content },
    });
    // Cập nhật updatedAt của session
    await prisma.aISession.update({
      where: { id: Number(req.params.id) },
      data:  { updatedAt: new Date() },
    });
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sessions/:id/messages/bulk — lưu nhiều tin nhắn cùng lúc (sync từ localStorage)
router.post('/:id/messages/bulk', requireAuth, async (req, res) => {
  const { messages } = req.body; // [{ type, content }]
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'messages must be an array' });
  try {
    // Xóa cũ rồi insert mới (replace all)
    await prisma.aIMessage.deleteMany({ where: { sessionId: Number(req.params.id) } });
    await prisma.aIMessage.createMany({
      data: messages.map(m => ({ sessionId: Number(req.params.id), type: m.type, content: m.content })),
    });
    await prisma.aISession.update({
      where: { id: Number(req.params.id) },
      data:  { updatedAt: new Date() },
    });
    res.json({ saved: messages.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
