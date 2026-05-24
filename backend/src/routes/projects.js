const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole }  = require('../middleware/role');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs   = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// GET /api/projects — Tất cả roles xem được
router.get('/', requireAuth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: { select: { fullName: true, username: true } },
        _count: { select: { documents: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id — Chi tiết + documents
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        createdBy: { select: { fullName: true, username: true } },
        documents: {
          include: {
            author: { select: { fullName: true } },
            auditResult: true,
            approval: true,
          },
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects — BA only
router.post('/', requireAuth, requireRole('BA'), async (req, res) => {
  const { name, team } = req.body;
  if (!name || !team) return res.status(400).json({ error: 'name and team are required' });
  try {
    const project = await prisma.project.create({
      data: { name, team, createdById: req.user.id },
    });
    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/projects/:id — BA only
router.put('/:id', requireAuth, requireRole('BA'), async (req, res) => {
  const { name, team, status } = req.body;
  try {
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: { ...(name && { name }), ...(team && { team }), ...(status && { status }) },
    });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id — BA only
router.delete('/:id', requireAuth, requireRole('BA'), async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects/:id/documents/from-ai — save AI-generated requirements as a document
router.post('/:id/documents/from-ai', requireAuth, requireRole('BA', 'SENIOR_BA'), async (req, res) => {
  const { requirements, title, sessionId } = req.body;
  if (!requirements || !Array.isArray(requirements)) {
    return res.status(400).json({ error: 'requirements array is required' });
  }
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }

  try {
    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName  = `req-${timestamp}.json`;
    const filePath  = path.join(UPLOADS_DIR, fileName);

    // Write requirements JSON to disk
    fs.writeFileSync(filePath, JSON.stringify({ title: title.trim(), requirements, generatedAt: new Date().toISOString() }, null, 2), 'utf-8');

    const doc = await prisma.document.create({
      data: {
        projectId:   Number(req.params.id),
        name:        title.trim() + '.requirements.json',
        version:     'v1.0',
        filePath:    fileName,
        authorId:    req.user.id,
        reqCount:    requirements.length,
        healthScore: null,
        status:      'draft',
      },
    });

    res.status(201).json({ document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects/:id/documents — BA upload SRS
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

router.post('/:id/documents', requireAuth, requireRole('BA'), upload.single('file'), async (req, res) => {
  const { name, version } = req.body;
  if (!name) return res.status(400).json({ error: 'Document name is required' });
  try {
    const doc = await prisma.document.create({
      data: {
        projectId: Number(req.params.id),
        name,
        version: version || 'v1.0',
        filePath: req.file ? `/uploads/${req.file.filename}` : null,
        authorId: req.user.id,
      },
    });
    // Cập nhật status project nếu cần
    await prisma.project.update({
      where: { id: Number(req.params.id) },
      data:  { status: 'auditing' },
    });
    res.status(201).json({ document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
