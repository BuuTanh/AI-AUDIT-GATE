/**
 * config.js — AI Audit Gate frontend configuration
 *
 * Khi deploy Vercel: đổi AAG_API_BASE thành URL ngrok của bạn.
 * Khi dev local (Live Server :5500): để trống hoặc giữ nguyên,
 *   api.js sẽ tự fallback về http://localhost:3001/api
 *
 * ── Ví dụ ────────────────────────────────────────────────────
 *   window.AAG_API_BASE = 'https://yourname.ngrok-free.app/api';
 * ─────────────────────────────────────────────────────────────
 */
window.AAG_API_BASE = 'https://ai-audit-gate.onrender.com/api';
