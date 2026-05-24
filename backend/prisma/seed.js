/**
 * Seed script — chạy: node prisma/seed.js
 * Xóa data cũ → tạo accounts + projects + documents mẫu
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ── Xóa data cũ (theo thứ tự FK) ──────────────────────────
  await prisma.aIMessage.deleteMany();
  await prisma.aISession.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.auditResult.deleteMany();
  await prisma.document.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log('  🗑️  Cleared old data');

  // ── Tạo Users ──────────────────────────────────────────────
  const hash = pwd => bcrypt.hashSync(pwd, 10);

  const users = await Promise.all([
    prisma.user.create({ data: {
      username: 'ba.lananh', email: 'lananh@nab.com',
      passwordHash: hash('Ba@2025!'), fullName: 'Lan Anh', role: 'BA',
    }}),
    prisma.user.create({ data: {
      username: 'sba.minh', email: 'minh@nab.com',
      passwordHash: hash('Sba@2025!'), fullName: 'Minh Nguyen', role: 'SENIOR_BA',
    }}),
    prisma.user.create({ data: {
      username: 'pm.tuan', email: 'tuan@nab.com',
      passwordHash: hash('Pm@2025!'), fullName: 'Tuấn Lê', role: 'PM',
    }}),
    prisma.user.create({ data: {
      username: 'demo', email: 'demo@nab.com',
      passwordHash: hash('Demo@2025'), fullName: 'Demo User', role: 'BA',
    }}),
  ]);

  const [ba, sba, pm, demo] = users;
  console.log('  👤  Created 4 users');

  // ── Tạo 6 Projects ─────────────────────────────────────────
  const projectsData = [
    { name: 'NAB Mobile Banking v2',    team: 'Digital Banking Core',  status: 'approved',  score: 85, issues: 3  },
    { name: 'Core Banking Upgrade 2.0', team: 'Core Infrastructure',   status: 'auditing',  score: 74, issues: 34 },
    { name: 'TradePortal Migration',    team: 'Capital Markets',       status: 'revision',  score: 30, issues: 48 },
    { name: 'Retail Loan Engine',       team: 'Credit Risk Tech',      status: 'approved',  score: 90, issues: 1  },
    { name: 'Corporate IDAM',           team: 'Security Ops',          status: 'auditing',  score: 55, issues: 15 },
    { name: 'Customer 360 View',        team: 'Data Engineering',      status: 'approved',  score: 80, issues: 5  },
  ];

  for (const pd of projectsData) {
    const project = await prisma.project.create({
      data: { name: pd.name, team: pd.team, status: pd.status, createdById: ba.id },
    });

    // Tạo 1-2 documents mỗi project
    const docCount = pd.status === 'approved' ? 2 : 1;
    for (let i = 1; i <= docCount; i++) {
      const ver = `v1.${i - 1}`;
      const docStatus = i === docCount ? pd.status : 'approved';
      const docScore  = i === docCount ? pd.score : Math.min(pd.score + 10, 100);

      const doc = await prisma.document.create({
        data: {
          projectId:   project.id,
          name:        `SRS_${pd.name.replace(/\s+/g, '_')}_${ver}.pdf`,
          version:     ver,
          authorId:    ba.id,
          healthScore: docScore,
          reqCount:    Math.floor(Math.random() * 150) + 50,
          status:      docStatus,
        },
      });

      // Tạo AuditResult
      const issueTypes = [
        { type: 'Ambiguous language', severity: 'medium', count: Math.ceil(pd.issues * 0.4) },
        { type: 'Missing fields',     severity: 'low',    count: Math.ceil(pd.issues * 0.3) },
        { type: 'Logic conflict',     severity: 'high',   count: Math.floor(pd.issues * 0.3) },
      ];
      await prisma.auditResult.create({
        data: {
          documentId: doc.id,
          score:      docScore,
          totalReqs:  doc.reqCount,
          issuesCount: pd.issues,
          issuesJson:  JSON.stringify(issueTypes),
        },
      });

      // Tạo Approval cho docs đã duyệt hoặc đang chờ
      if (docStatus === 'approved') {
        await prisma.approval.create({
          data: {
            documentId:   doc.id,
            submittedById: ba.id,
            reviewedById:  sba.id,
            status:        'approved',
            notes:         'SRS meets all quality standards. Approved.',
            submittedAt:   new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            reviewedAt:    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        });
      } else if (docStatus === 'auditing') {
        await prisma.approval.create({
          data: {
            documentId:    doc.id,
            submittedById: ba.id,
            status:        'pending',
            submittedAt:   new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    console.log(`  📁  Project: ${pd.name} (${docCount} doc${docCount > 1 ? 's' : ''})`);
  }

  // ── Tạo AI Sessions mẫu cho BA ────────────────────────────
  const session1 = await prisma.aISession.create({
    data: { userId: ba.id, mode: 'create', title: 'SRS Mobile Banking v2 — Sprint 8' },
  });
  await prisma.aIMessage.createMany({
    data: [
      { sessionId: session1.id, type: 'ai',   content: '<div class="chat-msg chat-msg-ai"><div class="chat-bubble">Hello! I\'m ReqBrain. How can I help you today?</div></div>' },
      { sessionId: session1.id, type: 'user', content: '<div class="chat-msg chat-msg-user"><div class="chat-bubble">Help me write requirements for the login screen</div></div>' },
      { sessionId: session1.id, type: 'ai',   content: '<div class="chat-msg chat-msg-ai"><div class="chat-bubble">Sure! Here are the requirements for the login screen...</div></div>' },
    ],
  });

  console.log('  🤖  Created sample AI session');

  // ── Summary ────────────────────────────────────────────────
  console.log('\n✅  Seed complete!\n');
  console.log('  ┌─────────────────────────────────────────┐');
  console.log('  │           TEST ACCOUNTS                 │');
  console.log('  ├──────────────┬────────────┬─────────────┤');
  console.log('  │ Role         │ Username   │ Password    │');
  console.log('  ├──────────────┼────────────┼─────────────┤');
  console.log('  │ BA           │ ba.lananh  │ Ba@2025!    │');
  console.log('  │ Senior BA    │ sba.minh   │ Sba@2025!   │');
  console.log('  │ PM           │ pm.tuan    │ Pm@2025!    │');
  console.log('  │ Demo (BA)    │ demo       │ Demo@2025   │');
  console.log('  └──────────────┴────────────┴─────────────┘');
  console.log('');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
