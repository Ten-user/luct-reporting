const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Monitoring dashboard (role-based)
router.get('/', auth, async (req, res) => {
  try {
    let query = '';
    let params = [];

    // 🎓 Student: only their enrolled courses
    if (req.user.role === 'student') {
      query = `
        SELECT r.id, r.date_of_lecture, r.topic_taught, r.learning_outcomes,
               c.class_name, c.faculty_name, u.name AS lecturer_name
        FROM reports r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.lecturer_id = u.id
        JOIN student_courses sc ON sc.course_id = c.id
        WHERE sc.student_id = $1
        ORDER BY r.date_of_lecture DESC
      `;
      params = [req.user.id];
    }

    // 👨‍🏫 Lecturer: their own reports
    else if (req.user.role === 'lecturer') {
      query = `
        SELECT r.id, r.date_of_lecture, r.topic_taught, r.learning_outcomes,
               c.class_name, c.faculty_name, u.name AS lecturer_name
        FROM reports r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.lecturer_id = u.id
        WHERE r.lecturer_id = $1
        ORDER BY r.date_of_lecture DESC
      `;
      params = [req.user.id];
    }

    // 👨‍💼 PRL: only reports in their faculty
    else if (req.user.role === 'prl') {
      query = `
        SELECT r.id, r.date_of_lecture, r.topic_taught, r.learning_outcomes,
               c.class_name, c.faculty_name, u.name AS lecturer_name
        FROM reports r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.lecturer_id = u.id
        WHERE c.faculty_name = $1
        ORDER BY r.date_of_lecture DESC
      `;
      params = [req.user.faculty_name];
    }

    // 📋 PL: all reports
    else if (req.user.role === 'pl') {
      query = `
        SELECT r.id, r.date_of_lecture, r.topic_taught, r.learning_outcomes,
               c.class_name, c.faculty_name, u.name AS lecturer_name
        FROM reports r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.lecturer_id = u.id
        ORDER BY r.date_of_lecture DESC
      `;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Monitoring error:', err);
    res.status(500).json({ message: 'Error fetching monitoring data' });
  }
});

module.exports = router;
