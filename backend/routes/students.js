const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get all students (PL or PRL only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl' && req.user.role !== 'prl') {
      return res.status(403).json({ message: 'Only PL or PRL can view students' });
    }

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE role = 'student' ORDER BY name"
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

module.exports = router;
