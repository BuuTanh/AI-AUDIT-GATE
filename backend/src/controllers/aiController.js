const { getAIProvider } = require('../services/aiService');
const multer = require('multer');
// pdf-parse v1.1.1 — exports the parse function directly
const pdfParse = require('pdf-parse');
if (typeof pdfParse !== 'function') {
  throw new Error('[aiController] pdf-parse did not export a function. Run: npm install pdf-parse@1.1.1 and restart the server.');
}

// Multer: memory storage (no disk write)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// POST /api/ai/audit-file  — multipart file upload, extract text, send to AI
exports.auditFileUpload = upload.single('file');

exports.auditFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { originalname, buffer, mimetype } = req.file;
  let extractedText = '';

  try {
    const isPDF = /\.pdf$/i.test(originalname) || mimetype === 'application/pdf';
    const isTXT = /\.txt$/i.test(originalname) || mimetype === 'text/plain';

    if (isPDF) {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || '';
      } catch (pdfErr) {
        console.error('[AI] PDF parse error:', pdfErr.message);
        return res.status(422).json({
          error: 'Could not extract text from this PDF. The file may be scanned/image-only or password-protected. Try saving as a text-based PDF or convert to .txt first.'
        });
      }
    } else if (isTXT) {
      extractedText = buffer.toString('utf-8');
    } else {
      // DOCX or unknown: read as UTF-8 best-effort
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      return res.status(422).json({ error: 'No readable text found in the uploaded file. The PDF may contain only scanned images. Try saving as .txt and re-uploading.' });
    }

    const ai = getAIProvider();
    // Prefix thông báo cho model biết đây là nội dung cần audit (critical for format compliance)
    // Giới hạn 2000 ký tự — đủ phủ 5-8 requirements, an toàn với context window 4096 tokens
    const auditPrompt = 'Audit these SRS requirements for ISO 29148 compliance:\n\n'
      + extractedText.slice(0, 2000);
    const result = await ai.chat('audit', auditPrompt, []);
    res.json(result);
  } catch (err) {
    console.error('[AI] auditFile error:', err.message);
    const msg = err.message;
    res.status(502).json({
      error: msg.includes('fetch')
        ? 'Cannot reach LM Studio. Make sure the local server is started in LM Studio (localhost:1234).'
        : msg.includes('crashed') || msg.includes('Exit code')
        ? 'LM Studio model crashed (likely out of memory). Please reload the model in LM Studio, then try again with a smaller file or paste the text directly.'
        : msg.includes('retry limit')
        ? 'LM Studio model is unstable — please reload the model in LM Studio (Server > Stop > Load Model > Start) and try again.'
        : msg,
    });
  }
};

// POST /api/ai/chat
exports.chat = async (req, res) => {
  const { mode, message, history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }
  if (!['create', 'audit'].includes(mode)) {
    return res.status(400).json({ error: 'mode must be "create" or "audit"' });
  }

  try {
    const ai     = getAIProvider();
    const result = await ai.chat(mode, message.slice(0, 4000), history);
    res.json(result);
  } catch (err) {
    console.error('[AI] chat error:', err.message);
    const msg = err.message;
    res.status(502).json({
      error: msg.includes('fetch')
        ? 'Cannot reach LM Studio. Make sure the local server is started in LM Studio (localhost:1234).'
        : msg.includes('crashed') || msg.includes('Exit code')
        ? 'LM Studio model crashed. Please reload the model in LM Studio and try again.'
        : msg,
    });
  }
};

// GET /api/ai/status  — kiểm tra AI provider có online không
exports.status = async (req, res) => {
  try {
    const ai        = getAIProvider();
    const connected = await ai.ping();
    res.json({
      provider:  ai.name,
      connected,
      endpoint:  ai.endpoint || null,
      model:     process.env.AI_MODEL || null,
    });
  } catch (err) {
    res.json({ provider: 'unknown', connected: false, endpoint: null });
  }
};
