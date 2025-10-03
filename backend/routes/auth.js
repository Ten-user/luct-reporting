const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // ✅ add middleware so we know who is logged in

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
      [name, email, hash, role || 'student']
    );

    const userId = result.insertId;
    const userRole = role || 'student';

    const token = jwt.sign(
      { id: userId, role: userRole, name },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: userId, name, email, role: userRole } });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ NEW: Get users (filter by role) – PL only
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl') {
      return res.status(403).json({ message: 'Only Program Leaders can view users' });
    }

    const { role } = req.query;
    let query = 'SELECT id, name, email, role FROM users';
    let params = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching users by role:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
