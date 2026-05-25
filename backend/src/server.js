require('dotenv').config();
const app  = require('./app');
const port = process.env.PORT || 3001;

async function startServer() {
  // ── Auto-seed nếu DB trống (Render reset SQLite mỗi lần redeploy) ──
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Thử đếm users. Nếu bảng chưa tồn tại (migration chưa chạy) catch sẽ bắt.
    const userCount = await prisma.user.count().catch(() => -1);

    if (userCount === 0) {
      console.log('  🌱  Database empty — running initial seed...');
      const { seedDatabase } = require('../prisma/seed');
      await seedDatabase(prisma);           // dùng chung PrismaClient, không disconnect
      console.log('  ✅  Seed complete');
    } else if (userCount > 0) {
      console.log(`  👤  Database ready (${userCount} users found)`);
    } else {
      // userCount === -1: bảng chưa tồn tại → migration chưa chạy
      console.log('  ⚠️  Tables not found — skipping seed (run "npx prisma migrate deploy" first)');
    }

    await prisma.$disconnect();
  } catch (e) {
    console.warn('  ⚠️  Auto-seed check skipped:', e.message);
  }

  // ── Start Express ────────────────────────────────────────────
  app.listen(port, () => {
    console.log('');
    console.log('  ✅  AI Audit Gate — Backend running');
    console.log(`  🌐  http://localhost:${port}`);
    console.log(`  📋  API docs: http://localhost:${port}/api/health`);
    console.log('');
  });
}

startServer();
