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

    const { course_id, score, feedback } = req.body;
    const userId = req.user.id;

    await pool.query(
      'INSERT INTO ratings (user_id, course_id, score, feedback) VALUES (?, ?, ?, ?)',
      [userId, course_id, score, feedback]
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
      // 🎓 Student → see their own ratings
      query = `
        SELECT r.id, c.class_name, r.score, r.feedback, r.created_at
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        WHERE r.user_id = ?`;
      params = [req.user.id];

    } else if (req.user.role === 'lecturer') {
      // 👨‍🏫 Lecturer → ratings for their courses
      query = `
        SELECT r.id, c.class_name, r.score, r.feedback, r.created_at, u.name AS student_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.user_id = u.id
        WHERE c.lecturer_name = ?`;
      params = [req.user.name];

    } else if (req.user.role === 'prl') {
      // 👨‍💼 PRL → ratings only from their faculty
      query = `
        SELECT r.id, c.class_name, r.score, r.feedback, r.created_at, 
               u.name AS student_name, c.lecturer_name, c.faculty_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.user_id = u.id
        WHERE c.faculty_name = ?
        ORDER BY r.created_at DESC`;
      params = [req.user.faculty_name];

    } else {
      // 📋 PL → all ratings
      query = `
        SELECT r.id, c.class_name, r.score, r.feedback, r.created_at, 
               u.name AS student_name, c.lecturer_name, c.faculty_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC`;
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching ratings:', err);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
});

module.exports = router;
