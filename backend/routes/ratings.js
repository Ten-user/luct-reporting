const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// 🎓 Student submits rating
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit ratings' });
    }

    const { course_id, score, feedback } = req.body;
    const userId = req.user.id;

    await pool.query(
      'INSERT INTO ratings (user_id, course_id, score, feedback) VALUES ($1, $2, $3, $4)',
      [userId, course_id, score, feedback]
    );

    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error('❌ Error submitting rating:', err);
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

// 🔹 Get ratings (role-based)
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
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC`;
      params = [req.user.id];

    } else if (req.user.role === 'lecturer') {
      // 👨‍🏫 Lecturer → ratings for their assigned courses
      query = `
        SELECT r.id, c.class_name, r.score, r.feedback, r.created_at, u.name AS student_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN course_lecturers cl ON cl.course_id = c.id
        JOIN users u ON r.user_id = u.id
        WHERE cl.lecturer_id = $1
        ORDER BY r.created_at DESC`;
      params = [req.user.id];

    } else if (req.user.role === 'prl') {
      // 👨‍💼 PRL → ratings only from their faculty
      query = `
        SELECT r.id, c.class_name, r.score, r.feedback, r.created_at,
               u.name AS student_name, c.faculty_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.user_id = u.id
        WHERE c.faculty_name = $1
        ORDER BY r.created_at DESC`;
      params = [req.user.faculty_name];

    } else if (req.user.role === 'pl') {
      // 📋 PL → all ratings
      query = `
        SELECT r.id, c.class_name, r.score, r.feedback, r.created_at,
               u.name AS student_name, c.faculty_name
        FROM ratings r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC`;
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
