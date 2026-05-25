/**
 * AI Service — Provider Abstraction Layer
 *
 * Dev  : AI_PROVIDER=lmstudio  → LM Studio local (ReqBrain Zephyr-7B)
 * Deploy: AI_PROVIDER=gemini   → Google Gemini 2.0 Flash (free tier)
 *         AI_PROVIDER=openai   → OpenAI gpt-4o-mini
 *
 * Chỉ cần đổi AI_PROVIDER trong .env khi deploy — frontend/backend không thay gì.
 */

// ── System Prompts (ISO 29148) ────────────────────────────────────────────────
// Ngắn gọn để phù hợp với context window nhỏ của local model (1024–4096 tokens)

const SYSTEM_CREATE = `You are ReqBrain (ISO 29148:2018 requirements assistant).
Output ONLY requirement lines in this EXACT pipe-delimited format. No headings, no bullets, no explanations.

REQ-F001 | Functional | High | System: The system shall [specific action with measurable detail]. | AC: [verifiable criterion]
REQ-NF001 | Non-Functional | Medium | System: The system shall [quality attribute with threshold]. | AC: [measurable test criterion]

Rules: Each line starts with REQ-, contains exactly 5 pipe-separated fields. Use shall (mandatory), should (recommended), may (optional). No vague terms (fast, easy, suitable, user-friendly).`;

// One-shot format example injected for local LM Studio model to anchor the output format
const FEWSHOT_CREATE = [
  {
    role: 'user',
    content: 'Users log in using phone number and 6-digit OTP. OTP expires in 3 minutes. After 5 failed attempts, lock account for 30 minutes.',
  },
  {
    role: 'assistant',
    content: 'REQ-F001 | Functional | High | User: The system shall allow users to log in with a registered phone number and a 6-digit OTP. | AC: Valid phone and OTP accepted; user redirected to dashboard within 2 seconds\nREQ-F002 | Functional | High | System: The system shall invalidate the OTP 180 seconds after issuance or upon first successful use. | AC: Expired OTP rejected with "OTP expired" error message\nREQ-F003 | Functional | High | System: The system shall lock the user account for 1800 seconds after 5 consecutive failed OTP attempts. | AC: Account locked; countdown shown; unlocks automatically after 30 minutes',
  },
];

const SYSTEM_AUDIT = `You are ReqBrain, an ISO 29148:2018 requirements auditor.
Read EVERY requirement in the input. For EACH requirement, check for these issue types:

F09-SYNTAX   : wrong modal verb — uses "will","must","can","would" instead of "shall"(mandatory)/"should"(recommended)/"may"(optional); or missing modal verb entirely
F10-AMBIGUOUS: vague unmeasurable terms — fast, slow, easy, quickly, good, efficient, suitable, user-friendly, simple, appropriate, adequate
F11-CONFLICT : contradicts another requirement in the document
F12-MISSING  : missing actor (who does it), missing AC (acceptance criteria), or missing numeric threshold

Output ONLY these exact line types — NO prose, NO explanations, NO markdown:
SCORE: [0-100]
ISSUE: [REQ-ID] [F09-SYNTAX|F10-AMBIGUOUS|F11-CONFLICT|F12-MISSING] - [what is wrong] | FIX: [exact replacement text]

Scoring: start 100, subtract 5 per F09, 3 per F10, 8 per F11, 2 per F12.
If document has NO issues: output SCORE: 100 only.`;

// One-shot example — uses realistic mixed requirements so model learns:
// (a) user message starts with audit prefix, (b) use actual REQ IDs from input,
// (c) skip well-formed requirements, (d) output SCORE + ISSUE lines only
const FEWSHOT_AUDIT = [
  {
    role: 'user',
    content: 'Audit these SRS requirements for ISO 29148 compliance:\n\nREQ-001: Users can login quickly with their account.\nREQ-002: The system shall validate OTP within 30 seconds. AC: valid OTP accepted; expired OTP rejected.\nREQ-003: The system must lock account after too many failed attempts.',
  },
  {
    role: 'assistant',
    content: 'SCORE: 77\nISSUE: REQ-001 [F09-SYNTAX] - Missing modal verb "shall/should/may" | FIX: "The system shall allow users to log in using their registered account"\nISSUE: REQ-001 [F10-AMBIGUOUS] - "quickly" is vague with no measurable threshold | FIX: "within 2 seconds of submitting credentials"\nISSUE: REQ-003 [F09-SYNTAX] - Uses "must" instead of "shall" | FIX: Replace "must" with "shall"\nISSUE: REQ-003 [F12-MISSING] - "too many" is not measurable; no count defined | FIX: "after 5 consecutive failed login attempts"',
  },
];

// ── Response Parser ───────────────────────────────────────────────────────────

function parseResponse(mode, rawText) {
  if (!rawText || !rawText.trim()) {
    return { type: 'text', rawText: 'No response from model.' };
  }
  if (mode === 'create') return parseCreateResponse(rawText);
  if (mode === 'audit')  return parseAuditResponse(rawText);
  return { type: 'text', rawText };
}

function parseCreateResponse(text) {
  const requirements = [];
  const lines = text.split('\n');
  let autoIdx = { F: 1, NF: 1 };

  for (const raw of lines) {
    // Preprocess: strip common markdown / numbered-list / bullet artifacts
    let line = raw.trim()
      .replace(/\*\*(REQ-[A-Z0-9]+)\*\*/g, '$1')  // **REQ-F001** → REQ-F001
      .replace(/^\d+[\.\)]\s*/, '')                  // "1. " or "1) " → ""
      .replace(/^[-*+]\s+/, '');                     // "- " "* " "+ " → ""

    if (!line) continue;

    // ── Format: REQ-F001 | Functional | High | Actor: text | AC: criterion
    const fullMatch = line.match(
      /^(REQ-[A-Z0-9]+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^:]+):\s*([^|]+)\|\s*AC:\s*(.+)$/i
    );
    if (fullMatch) {
      requirements.push({
        id:          fullMatch[1].trim(),
        type:        fullMatch[2].trim(),
        priority:    fullMatch[3].trim(),
        actor:       fullMatch[4].trim(),
        requirement: fullMatch[5].trim(),
        acceptance:  fullMatch[6].trim(),
      });
      continue;
    }

    // ── Looser match: any line containing shall/should/may
    const shallMatch = line.match(/^(?:\d+[\.\)]\s*)?(?:\*+\s*)?(.*\b(?:shall|should|may)\b.+)$/i);
    if (shallMatch && !line.startsWith('#') && !line.toLowerCase().startsWith('note')) {
      const reqText = shallMatch[1].trim();
      const isNF    = /\b(performance|security|availability|reliability|scalability|response time|latency|throughput|uptime|concurrent)\b/i.test(reqText);
      const key     = isNF ? 'NF' : 'F';
      const isHigh  = /\bshall\b/i.test(reqText);
      requirements.push({
        id:          `REQ-${key}${String(autoIdx[key]++).padStart(3, '0')}`,
        type:        isNF ? 'Non-Functional' : 'Functional',
        priority:    isHigh ? 'High' : 'Medium',
        actor:       guessActor(reqText),
        requirement: reqText,
        acceptance:  '',
      });
    }
  }

  if (requirements.length > 0) {
    return { type: 'requirements', requirements, rawText: text };
  }
  return { type: 'text', rawText: text };
}

function guessActor(text) {
  if (/\buser\b/i.test(text))              return 'User';
  if (/\badmin(istrator)?\b/i.test(text))  return 'Admin';
  if (/\bba\b|business analyst/i.test(text)) return 'BA';
  return 'System';
}

function parseAuditResponse(text) {
  // Extract SCORE
  const scoreMatch = text.match(/SCORE:\s*(\d+)/i)
                  || text.match(/[Hh]ealth\s+[Ss]core[:\s]+(\d+)/);
  let score = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : null;

  // Extract ISSUEs
  const issues = [];
  const issuePattern = /ISSUE:\s*([A-Z0-9_\-]+)\s+\[(F(?:09|10|11|12)-[A-Z]+)\]\s*-\s*(.+?)(?:\s*\|\s*FIX:\s*(.+))?$/gim;
  let m;
  while ((m = issuePattern.exec(text)) !== null) {
    issues.push({
      reqId:       m[1].trim(),
      category:    m[2].trim(),
      description: m[3].trim(),
      fix:         m[4]?.trim() || '',
    });
  }

  // Auto-calculate score if model didn't provide it
  if (score === null) {
    const f09 = issues.filter(i => i.category.startsWith('F09')).length;
    const f10 = issues.filter(i => i.category.startsWith('F10')).length;
    const f11 = issues.filter(i => i.category.startsWith('F11')).length;
    const f12 = issues.filter(i => i.category.startsWith('F12')).length;
    score = Math.max(0, 100 - f09 * 5 - f10 * 3 - f11 * 8 - f12 * 2);
  }

  if (issues.length > 0 || scoreMatch) {
    return { type: 'audit', score, issues, rawText: text };
  }

  // Model didn't follow the format — return raw text with score=null signal
  return { type: 'audit', score: null, issues: [], rawText: text };
}

// ── LM Studio Provider ────────────────────────────────────────────────────────

class LMStudioProvider {
  constructor() {
    this.name     = 'LM Studio (ReqBrain)';
    this.endpoint = (process.env.AI_BASE_URL || 'http://localhost:1234').replace(/\/$/, '');
    this.model    = process.env.AI_MODEL || 'reelicit_-_zephyr-7b-beta-reqbrain';
    // ngrok free tier trả HTML interstitial nếu thiếu header này
    this.extraHeaders = this.endpoint.includes('ngrok')
      ? { 'ngrok-skip-browser-warning': 'true' }
      : {};
  }

  async ping() {
    try {
      const r = await fetch(`${this.endpoint}/v1/models`, {
        headers: this.extraHeaders,
        signal: AbortSignal.timeout(10000), // tăng từ 3s → 10s cho Render-US→ngrok→VN
      });
      return r.ok;
    } catch {
      return false;
    }
  }

  async chat(mode, message, history = []) {
    const systemContent = mode === 'audit' ? SYSTEM_AUDIT : SYSTEM_CREATE;

    const trimmedHistory = history.slice(-4).map(h => ({
      role:    h.role === 'assistant' ? 'assistant' : 'user',
      content: String(h.content).slice(0, 500),
    }));

    // Inject one-shot format example so local model anchors on the correct output format
    const fewShot = mode === 'create' ? FEWSHOT_CREATE : mode === 'audit' ? FEWSHOT_AUDIT : [];

    const messages = [
      { role: 'system', content: systemContent },
      ...fewShot,
      ...trimmedHistory,
      { role: 'user',   content: message },
    ];

    const body = JSON.stringify({
      model:       this.model,
      messages,
      temperature: 0.15,
      max_tokens:  600,   // giảm để tiết kiệm VRAM/RAM
      stream:      false,
    });

    // Retry tối đa 5 lần — xử lý "Model reloaded." khi LM Studio JIT reload
    const MAX_RETRIES = 5;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const r = await fetch(`${this.endpoint}/v1/chat/completions`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...this.extraHeaders },
        body,
        signal: AbortSignal.timeout(300000),
      });

      if (!r.ok) {
        const errText = await r.text().catch(() => '');

        // LM Studio trả 400 khi JIT reload ("Model reloaded.") hoặc model crash — đợi rồi retry
        if (r.status === 400 && attempt < MAX_RETRIES) {
          const isCrash   = errText.includes('crashed') || errText.includes('Exit code');
          const waitMs    = isCrash ? 10000 : 8000;  // tăng từ 5s→8s, crash từ 8s→10s
          const reason    = isCrash ? 'model crashed' : 'model reloading';
          console.log(`[AI] LM Studio ${reason}, waiting ${waitMs / 1000}s then retry (attempt ${attempt}/${MAX_RETRIES})...`);
          await new Promise(res => setTimeout(res, waitMs));
          continue;
        }

        throw new Error(`LM Studio ${r.status}: ${errText.slice(0, 200)}`);
      }

      const data = await r.json();
      const rawText = data.choices?.[0]?.message?.content?.trim() || '';
      return parseResponse(mode, rawText);
    }

    throw new Error('LM Studio model reload retry limit exceeded.');
  }
}

// ── Google Gemini Provider (for deploy) ──────────────────────────────────────

class GeminiProvider {
  constructor() {
    this.name   = 'Google Gemini';
    this.apiKey = process.env.AI_API_KEY || '';
    this.model  = process.env.AI_MODEL || 'gemini-2.0-flash';
  }

  async ping() {
    return !!this.apiKey;
  }

  async chat(mode, message, history = []) {
    if (!this.apiKey) throw new Error('AI_API_KEY not set for Gemini provider');
    const systemContent = mode === 'audit' ? SYSTEM_AUDIT : SYSTEM_CREATE;

    const contents = [
      ...history.slice(-4).map(h => ({
        role:  h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(h.content).slice(0, 500) }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          system_instruction: { parts: [{ text: systemContent }] },
          contents,
          generationConfig: { temperature: 0.15, maxOutputTokens: 2048 },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!r.ok) {
      const err = await r.text().catch(() => '');
      throw new Error(`Gemini ${r.status}: ${err.slice(0, 200)}`);
    }

    const data  = await r.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    return parseResponse(mode, rawText);
  }
}

// ── OpenAI Provider (for deploy) ─────────────────────────────────────────────

class OpenAIProvider {
  constructor() {
    this.name   = 'OpenAI';
    this.apiKey = process.env.AI_API_KEY || '';
    this.model  = process.env.AI_MODEL || 'gpt-4o-mini';
  }

  async ping() {
    return !!this.apiKey;
  }

  async chat(mode, message, history = []) {
    if (!this.apiKey) throw new Error('AI_API_KEY not set for OpenAI provider');
    const systemContent = mode === 'audit' ? SYSTEM_AUDIT : SYSTEM_CREATE;

    const messages = [
      { role: 'system', content: systemContent },
      ...history.slice(-4).map(h => ({
        role:    h.role === 'assistant' ? 'assistant' : 'user',
        content: String(h.content).slice(0, 500),
      })),
      { role: 'user', content: message },
    ];

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body:   JSON.stringify({ model: this.model, messages, temperature: 0.15, max_tokens: 2048 }),
      signal: AbortSignal.timeout(30000),
    });

    if (!r.ok) {
      const err = await r.text().catch(() => '');
      throw new Error(`OpenAI ${r.status}: ${err.slice(0, 200)}`);
    }

    const data    = await r.json();
    const rawText = data.choices?.[0]?.message?.content?.trim() || '';
    return parseResponse(mode, rawText);
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

function getAIProvider() {
  const p = (process.env.AI_PROVIDER || 'lmstudio').toLowerCase();
  if (p === 'gemini') return new GeminiProvider();
  if (p === 'openai') return new OpenAIProvider();
  return new LMStudioProvider(); // default: lmstudio
}

module.exports = { getAIProvider };
