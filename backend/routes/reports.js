const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Lecturer creates a report
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'lecturer') {
      return res.status(403).json({ message: 'Only lecturers can submit reports' });
    }

    let {
      course_id,
      course_name,
      course_code,
      faculty_name,
      class_name,
      week_of_reporting,
      date_of_lecture,
      actual_number_present,
      total_registered,
      venue,
      scheduled_lecture_time,
      topic_taught,
      learning_outcomes,
      lecturer_recommendations
    } = req.body;

    // 🔹 If course_id not provided → create a new course
    if (!course_id) {
      if (!course_name || !course_code) {
        return res.status(400).json({ message: 'Either select an existing course or enter course details' });
      }

      const courseResult = await pool.query(
        `INSERT INTO courses (faculty_name, class_name, course_name, course_code, venue, scheduled_time, total_registered)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          faculty_name,
          class_name,
          course_name,
          course_code,
          venue || '',
          scheduled_lecture_time || '',
          total_registered || 0
        ]
      );

      course_id = courseResult.rows[0].id; // newly created course id
    } else {
      // 🔹 If total_registered not provided, fetch from courses table
      if (!total_registered) {
        const course = await pool.query(
          `SELECT total_registered FROM courses WHERE id = $1`,
          [course_id]
        );
        if (course.rows.length > 0) {
          total_registered = course.rows[0].total_registered;
        }
      }
    }

    // 🔹 Insert report
    const result = await pool.query(
      `INSERT INTO reports (
        course_id, faculty_name, class_name, week_of_reporting, date_of_lecture,
        lecturer_name, actual_number_present, total_registered,
        venue, scheduled_lecture_time, topic_taught,
        learning_outcomes, lecturer_recommendations
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id`,
      [
        course_id,
        faculty_name,
        class_name,
        week_of_reporting,
        date_of_lecture,
        req.user.name,
        actual_number_present,
        total_registered,
        venue,
        scheduled_lecture_time,
        topic_taught,
        learning_outcomes,
        lecturer_recommendations
      ]
    );

    res.json({ id: result.rows[0].id, message: 'Report submitted successfully' });
  } catch (err) {
    console.error('❌ Error creating report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reports (role-based)
router.get('/', auth, async (req, res) => {
  try {
    let query = `
      SELECT r.*, c.course_name, c.course_code, c.class_name, c.faculty_name
      FROM reports r
      JOIN courses c ON r.course_id = c.id
      ORDER BY r.date_of_lecture DESC
    `;
    let params = [];

    if (req.user.role === 'lecturer') {
      query = `
        SELECT r.*, c.course_name, c.course_code, c.class_name, c.faculty_name
        FROM reports r
        JOIN courses c ON r.course_id = c.id
        WHERE r.lecturer_name = $1
        ORDER BY r.date_of_lecture DESC
      `;
      params = [req.user.name];
    }

    if (req.user.role === 'student') {
      query = `
        SELECT r.*, c.course_name, c.course_code, c.class_name, c.faculty_name
        FROM reports r
        JOIN courses c ON r.course_id = c.id
        JOIN student_courses sc ON sc.course_id = c.id
        WHERE sc.student_id = $1
        ORDER BY r.date_of_lecture DESC
      `;
      params = [req.user.id];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single report
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, c.course_name, c.course_code, c.class_name, c.faculty_name
       FROM reports r
       JOIN courses c ON r.course_id = c.id
       WHERE r.id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PRL adds feedback to a report
router.put('/:id/feedback', auth, async (req, res) => {
  try {
    if (req.user.role !== 'prl') {
      return res.status(403).json({ message: 'Only PRLs can add feedback' });
    }

    const { feedback } = req.body;
    await pool.query(
      'UPDATE reports SET prl_feedback = $1 WHERE id = $2',
      [feedback, req.params.id]
    );

    res.json({ message: 'Feedback added successfully' });
  } catch (err) {
    console.error('❌ Error adding feedback:', err);
    res.status(500).json({ message: 'Error adding feedback' });
  }
});

module.exports = router;
