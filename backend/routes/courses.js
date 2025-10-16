const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get courses - role aware
router.get('/', auth, async (req, res) => {
  try {
    const role = req.user.role;
    let query = '';
    let params = [];

    if (role === 'student') {
      query = `
        SELECT c.*
        FROM courses c
        JOIN student_courses sc ON sc.course_id = c.id
        WHERE sc.student_id = $1
        ORDER BY c.course_name
      `;
      params = [req.user.id];

    } else if (role === 'lecturer') {
      query = `
        SELECT c.*
        FROM courses c
        JOIN course_lecturers cl ON cl.course_id = c.id
        WHERE cl.lecturer_id = $1
        ORDER BY c.course_name
      `;
      params = [req.user.id];

    } else if (role === 'prl') {
      query = `
        SELECT c.*
        FROM courses c
        WHERE c.faculty_name = $1
        ORDER BY c.course_name
      `;
      params = [req.user.faculty_name];

    } else {
      // PL: all courses + lecturers
      query = `
        SELECT c.*, STRING_AGG(u.name, ', ') AS lecturers
        FROM courses c
        LEFT JOIN course_lecturers cl ON cl.course_id = c.id
        LEFT JOIN users u ON cl.lecturer_id = u.id
        GROUP BY c.id
        ORDER BY c.course_name
      `;
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error('❌ Courses fetch error:', err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Add course - PL only
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl') {
      return res.status(403).json({ message: 'Only Program Leaders can add courses' });
    }

    const {
      faculty_name,
      class_name,
      course_name,
      course_code,
      venue,
      scheduled_time,
      total_registered
    } = req.body;

    const result = await pool.query(
      `INSERT INTO courses
        (faculty_name, class_name, course_name, course_code, venue, scheduled_time, total_registered)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        faculty_name,
        class_name,
        course_name,
        course_code,
        venue || '',
        scheduled_time || '',
        total_registered || 0
      ]
    );

    res.json({ id: result.rows[0].id, message: 'Course added successfully' });

  } catch (err) {
    console.error('❌ Course add error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
