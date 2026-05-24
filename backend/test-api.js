/**
 * Quick API test — chạy: node test-api.js
 * Server phải đang chạy tại localhost:3001
 */
const BASE = 'http://localhost:3001/api';

async function req(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  return { status: res.status, data };
}

function ok(label, condition, detail = '') {
  const icon = condition ? '✅' : '❌';
  console.log(`  ${icon}  ${label}${detail ? ' — ' + detail : ''}`);
  if (!condition) process.exitCode = 1;
}

async function run() {
  console.log('\n🧪  AI Audit Gate — API Test\n');

  // ── 1. Health check ─────────────────────────────────────────
  console.log('── Health ──');
  const h = await req('GET', '/health');
  ok('GET /health → 200', h.status === 200, h.data.status);

  // ── 2. Auth: login thành công ───────────────────────────────
  console.log('\n── Auth ──');
  const loginBA = await req('POST', '/auth/login', { username: 'ba.lananh', password: 'Ba@2025!' });
  ok('Login BA → 200',    loginBA.status === 200);
  ok('Token returned',   !!loginBA.data.token);
  ok('Role is BA',       loginBA.data.user?.role === 'BA');
  const tokenBA = loginBA.data.token;

  const loginSBA = await req('POST', '/auth/login', { username: 'sba.minh',  password: 'Sba@2025!' });
  ok('Login Senior BA → 200', loginSBA.status === 200, loginSBA.data.user?.fullName);
  ok('Role is SENIOR_BA',     loginSBA.data.user?.role === 'SENIOR_BA');
  const tokenSBA = loginSBA.data.token;

  const loginPM = await req('POST', '/auth/login', { username: 'pm.tuan',  password: 'Pm@2025!' });
  ok('Login PM → 200',  loginPM.status === 200, loginPM.data.user?.fullName);
  ok('Role is PM',      loginPM.data.user?.role === 'PM');
  const tokenPM = loginPM.data.token;

  const loginWrong = await req('POST', '/auth/login', { username: 'ba.lananh', password: 'wrong' });
  ok('Wrong password → 401', loginWrong.status === 401);

  const noToken = await req('GET', '/auth/me');
  ok('No token → 401',  noToken.status === 401);

  // ── 3. GET /auth/me ─────────────────────────────────────────
  const me = await req('GET', '/auth/me', null, tokenBA);
  ok('GET /auth/me → 200', me.status === 200, me.data.user?.fullName);

  // ── 4. Projects ─────────────────────────────────────────────
  console.log('\n── Projects ──');
  const projects = await req('GET', '/projects', null, tokenBA);
  ok('GET /projects → 200',  projects.status === 200);
  ok('Returns ≥6 projects',  projects.data.projects?.length >= 6,
     projects.data.projects?.map(p => p.name).join(', '));

  // BA tạo project mới
  const newProj = await req('POST', '/projects', { name: 'Test Project X', team: 'Test Team' }, tokenBA);
  ok('BA creates project → 201', newProj.status === 201, newProj.data.project?.name);

  // PM không được tạo project
  const pmCreate = await req('POST', '/projects', { name: 'Blocked', team: 'X' }, tokenPM);
  ok('PM cannot create → 403', pmCreate.status === 403);

  // ── 5. Reports ──────────────────────────────────────────────
  console.log('\n── Reports ──');
  const dash = await req('GET', '/reports/dashboard', null, tokenBA);
  ok('GET /reports/dashboard → 200', dash.status === 200,
     `avgScore=${dash.data.stats?.avgScore}`);

  const quality = await req('GET', '/reports/quality', null, tokenPM);
  ok('PM GET /reports/quality → 200', quality.status === 200,
     `${quality.data.quality?.length} projects, teamAvg=${quality.data.summary?.avgTeamScore}`);

  const baQuality = await req('GET', '/reports/quality', null, tokenBA);
  ok('BA cannot access /reports/quality → 403', baQuality.status === 403);

  // ── 6. Approvals queue (Senior BA) ─────────────────────────
  console.log('\n── Approvals ──');
  const approvals = await req('GET', '/approvals', null, tokenSBA);
  ok('Senior BA GET /approvals → 200', approvals.status === 200,
     `${approvals.data.approvals?.length} pending`);

  const baApprovals = await req('GET', '/approvals', null, tokenBA);
  ok('BA cannot access /approvals → 403', baApprovals.status === 403);

  console.log('\n─────────────────────────────────────────────');
  if (process.exitCode === 1) {
    console.log('❌  Some tests failed — check output above\n');
  } else {
    console.log('✅  All tests passed!\n');
  }
}

run().catch(e => { console.error('Test error:', e.message); process.exit(1); });
