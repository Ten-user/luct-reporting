const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Monitoring dashboard (role-based)
router.get('/', auth, async (req, res) => {
  try {
    let query = '';
    let params = [];

    if (req.user.role === 'student') {
      // Join with classes for attendance
      query = `
        SELECT cls.id, cls.date_of_lecture, cls.topic_taught, cls.learning_outcomes,
               cls.actual_number_present, cls.total_registered,
               c.class_name, c.faculty_name, u.name AS lecturer_name
        FROM classes cls
        JOIN courses c ON cls.course_id = c.id
        JOIN users u ON cls.lecturer_id = u.id
        JOIN student_courses sc ON sc.course_id = c.id
        WHERE sc.student_id = $1
        ORDER BY cls.date_of_lecture DESC
      `;
      params = [req.user.id];

    } else if (req.user.role === 'lecturer') {
      query = `
        SELECT cls.id, cls.date_of_lecture, cls.topic_taught, cls.learning_outcomes,
               cls.actual_number_present, cls.total_registered,
               c.class_name, c.faculty_name, u.name AS lecturer_name
        FROM classes cls
        JOIN courses c ON cls.course_id = c.id
        JOIN users u ON cls.lecturer_id = u.id
        WHERE cls.lecturer_id = $1
        ORDER BY cls.date_of_lecture DESC
      `;
      params = [req.user.id];

    } else if (req.user.role === 'prl') {
      query = `
        SELECT cls.id, cls.date_of_lecture, cls.topic_taught, cls.learning_outcomes,
               cls.actual_number_present, cls.total_registered,
               c.class_name, c.faculty_name, u.name AS lecturer_name
        FROM classes cls
        JOIN courses c ON cls.course_id = c.id
        JOIN users u ON cls.lecturer_id = u.id
        WHERE c.faculty_name = $1
        ORDER BY cls.date_of_lecture DESC
      `;
      params = [req.user.faculty_name];

    } else if (req.user.role === 'pl') {
      query = `
        SELECT cls.id, cls.date_of_lecture, cls.topic_taught, cls.learning_outcomes,
               cls.actual_number_present, cls.total_registered,
               c.class_name, c.faculty_name, u.name AS lecturer_name
        FROM classes cls
        JOIN courses c ON cls.course_id = c.id
        JOIN users u ON cls.lecturer_id = u.id
        ORDER BY cls.date_of_lecture DESC
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
