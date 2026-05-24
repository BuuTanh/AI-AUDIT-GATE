const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole }  = require('../middleware/role');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/approvals — Senior BA xem hàng đợi
router.get('/', requireAuth, requireRole('SENIOR_BA', 'PM'), async (req, res) => {
  try {
    const approvals = await prisma.approval.findMany({
      where: req.user.role === 'SENIOR_BA' ? { status: 'pending' } : {},
      include: {
        document: {
          include: {
            project: { select: { name: true, team: true } },
            author:  { select: { fullName: true } },
            auditResult: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
    res.json({ approvals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/approvals/:id — Senior BA approve/reject
router.put('/:id', requireAuth, requireRole('SENIOR_BA'), async (req, res) => {
  const { status, notes } = req.body; // status: 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be approved or rejected' });
  }
  try {
    const approval = await prisma.approval.update({
      where: { id: Number(req.params.id) },
      data:  { status, notes, reviewedById: req.user.id, reviewedAt: new Date() },
    });
    // Cập nhật document status
    await prisma.document.update({
      where: { id: approval.documentId },
      data:  { status: status === 'approved' ? 'approved' : 'revision' },
    });
    // Cập nhật project health
    const docs = await prisma.document.findMany({ where: { projectId: (await prisma.document.findUnique({ where: { id: approval.documentId }, select: { projectId: true } })).projectId } });
    const approvedAll = docs.every(d => d.status === 'approved');
    const anyRevision = docs.some(d => d.status === 'revision');
    await prisma.project.update({
      where: { id: docs[0].projectId },
      data:  { status: approvedAll ? 'approved' : anyRevision ? 'revision' : 'auditing' },
    });

    res.json({ approval });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
