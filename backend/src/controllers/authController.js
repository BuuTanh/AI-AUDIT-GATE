const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma  = new PrismaClient();

// ── POST /api/auth/login ─────────────────────────────────────
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Tìm user (hỗ trợ login bằng username hoặc email)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: username.trim() },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // So sánh password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id:       user.id,
        username: user.username,
        fullName: user.fullName,
        role:     user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id:       user.id,
        username: user.username,
        fullName: user.fullName,
        email:    user.email,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ error: 'Server error during login' });
  }
}

// ── GET /api/auth/me ─────────────────────────────────────────
async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('[getMe]', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// ── POST /api/auth/logout ────────────────────────────────────
// JWT là stateless — logout chỉ cần client xóa token.
// Endpoint này trả 200 để frontend có thể gọi đồng nhất.
function logout(req, res) {
  res.json({ message: 'Logged out successfully' });
}

module.exports = { login, getMe, logout };
