// backend/routes/lectures.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// 🔹 Get all assignments (PL only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl') {
      return res.status(403).json({ message: 'Only Program Leaders can view assignments' });
    }

    const result = await pool.query(`
      SELECT cl.id, c.course_name, c.course_code, u.name AS lecturer_name, u.email
      FROM course_lecturers cl
      JOIN courses c ON cl.course_id = c.id
      JOIN users u ON cl.lecturer_id = u.id
      ORDER BY c.course_name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching lecture assignments:', err);
    res.status(500).json({ message: 'Error fetching lecture assignments' });
  }
});

// 🔹 Assign lecturer to a course (PL only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl') {
      return res.status(403).json({ message: 'Only Program Leaders can assign lecturers' });
    }

    const { course_id, lecturer_id } = req.body;

    await pool.query(
      'INSERT INTO course_lecturers (course_id, lecturer_id) VALUES ($1, $2)',
      [course_id, lecturer_id]
    );

    res.json({ message: 'Lecturer assigned successfully' });
  } catch (err) {
    console.error('❌ Error assigning lecturer:', err);
    res.status(500).json({ message: 'Error assigning lecturer' });
  }
});

// 🔹 Unassign lecturer from a course (PL only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl') {
      return res.status(403).json({ message: 'Only Program Leaders can unassign lecturers' });
    }

    // Fetch assignment details before deleting
    const result = await pool.query(
      `SELECT cl.id, c.course_name, c.course_code, u.name AS lecturer_name, u.email
       FROM course_lecturers cl
       JOIN courses c ON cl.course_id = c.id
       JOIN users u ON cl.lecturer_id = u.id
       WHERE cl.id = $1`,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const assignment = result.rows[0];

    // Delete the assignment
    await pool.query('DELETE FROM course_lecturers WHERE id = $1', [req.params.id]);

    res.json({
      message: 'Lecturer unassigned successfully',
      assignment
    });
  } catch (err) {
    console.error('❌ Error unassigning lecturer:', err);
    res.status(500).json({ message: 'Error unassigning lecturer' });
  }
});

module.exports = router;
