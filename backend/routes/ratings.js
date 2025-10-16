const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Student submits rating
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit ratings' });
    }

    const { course_id, rating, comment } = req.body;
    const studentId = req.user.id;

    await pool.query(
      'INSERT INTO ratings (student_id, course_id, rating, comment) VALUES ($1, $2, $3, $4)',
      [studentId, course_id, rating, comment]
    );

    res.json({ message: 'Rating submitted successfully' });

  } catch (err) {
    console.error('❌ Error submitting rating:', err);
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

// Get ratings (role-based)
router.get('/', auth, async (req, res) => {
  try {
    let query = '';
    let params = [];

    if (req.user.role === 'student') {
      query = `
        SELECT r.id, c.class_name, r.rating, r.comment, r.id AS created_at
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        WHERE r.student_id = $1
        ORDER BY r.id DESC
      `;
      params = [req.user.id];

    } else if (req.user.role === 'lecturer') {
      query = `
        SELECT r.id, c.class_name, r.rating, r.comment, u.name AS student_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.student_id = u.id
        JOIN lectures l ON l.course_id = c.id
        WHERE l.lecturer_id = $1
        ORDER BY r.id DESC
      `;
      params = [req.user.id];

    } else if (req.user.role === 'prl') {
      query = `
        SELECT r.id, c.class_name, r.rating, r.comment, u.name AS student_name, c.faculty_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.student_id = u.id
        WHERE c.faculty_name = $1
        ORDER BY r.id DESC
      `;
      params = [req.user.faculty_name];

    } else if (req.user.role === 'pl') {
      query = `
        SELECT r.id, c.class_name, r.rating, r.comment, u.name AS student_name, c.faculty_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.student_id = u.id
        ORDER BY r.id DESC
      `;
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (err) {
    console.error('❌ Error fetching ratings:', err);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
});

module.exports = router;
