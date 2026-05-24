const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole }  = require('../middleware/role');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/reports/dashboard — stats cho BA / Senior BA
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const [totalProjects, auditingCount, approvedCount, revisionCount, documents, audits] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { status: 'auditing' } }),
        prisma.project.count({ where: { status: 'approved' } }),
        prisma.project.count({ where: { status: 'revision' } }),
        prisma.document.findMany({ select: { healthScore: true } }),
        prisma.auditResult.findMany({ select: { issuesJson: true } }),
      ]);

    // Avg health score
    const scored = documents.filter(d => d.healthScore !== null);
    const avgScore = scored.length
      ? Math.round(scored.reduce((s, d) => s + d.healthScore, 0) / scored.length)
      : 0;

    // Issue type breakdown
    const issueCounts = {};
    audits.forEach(a => {
      try {
        JSON.parse(a.issuesJson).forEach(i => {
          issueCounts[i.type] = (issueCounts[i.type] || 0) + (i.count || 1);
        });
      } catch (_) {}
    });

    res.json({
      stats: { totalProjects, auditingCount, approvedCount, revisionCount, avgScore },
      issueCounts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/quality — PM xem chất lượng theo dự án
router.get('/quality', requireAuth, requireRole('PM', 'SENIOR_BA'), async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: { select: { fullName: true } },
        documents: {
          select: { healthScore: true, status: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Tính toán stats mỗi project
    const quality = projects.map(p => {
      const scored    = p.documents.filter(d => d.healthScore !== null);
      const avgScore  = scored.length
        ? Math.round(scored.reduce((s, d) => s + d.healthScore, 0) / scored.length)
        : null;
      const openIssues   = p.documents.filter(d => d.status !== 'approved').length;
      const pendingReview = p.documents.filter(d => d.status === 'auditing').length;

      return {
        id:          p.id,
        name:        p.name,
        team:        p.team,
        status:      p.status,
        baLead:      p.createdBy.fullName,
        avgScore,
        openIssues,
        pendingReview,
        totalDocs:   p.documents.length,
        passingThreshold: avgScore !== null && avgScore >= 75,
      };
    });

    // Summary stats
    const avgTeamScore = quality.filter(p => p.avgScore !== null).length
      ? Math.round(quality.filter(p => p.avgScore !== null)
          .reduce((s, p) => s + p.avgScore, 0) / quality.filter(p => p.avgScore !== null).length)
      : 0;

    res.json({
      quality,
      summary: {
        avgTeamScore,
        passing:       quality.filter(p => p.passingThreshold).length,
        total:         quality.length,
        pendingReview: quality.reduce((s, p) => s + p.pendingReview, 0),
        totalIssues:   quality.reduce((s, p) => s + p.openIssues, 0),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
