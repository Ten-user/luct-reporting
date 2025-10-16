const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Enroll in a course (student only)
router.post('/enroll', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll' });
    }

    const { course_id } = req.body;
    const student_id = req.user.id;

    // prevent duplicate enrollment
    const existing = await pool.query(
      'SELECT * FROM student_courses WHERE student_id = $1 AND course_id = $2',
      [student_id, course_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    await pool.query(
      'INSERT INTO student_courses (student_id, course_id) VALUES ($1, $2)',
      [student_id, course_id]
    );

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error('❌ Enroll error:', err);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
});

// Unenroll from a course
router.delete('/unenroll/:course_id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can unenroll' });
    }

    const course_id = req.params.course_id;
    const student_id = req.user.id;

    await pool.query(
      'DELETE FROM student_courses WHERE student_id = $1 AND course_id = $2',
      [student_id, course_id]
    );

    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    console.error('❌ Unenroll error:', err);
    res.status(500).json({ message: 'Error unenrolling from course' });
  }
});

// Get student's enrolled courses
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can view enrolled courses' });
    }

    const student_id = req.user.id;

    const result = await pool.query(
      `SELECT c.*
       FROM student_courses sc
       JOIN courses c ON sc.course_id = c.id
       WHERE sc.student_id = $1`,
      [student_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ My courses fetch error:', err);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
});

module.exports = router;
