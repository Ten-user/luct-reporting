const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET all assigned lecturers (PL only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl') {
      return res.status(403).json({ message: 'Only PL can view assignments' });
    }

    const result = await pool.query(`
      SELECT l.id, c.course_name, c.course_code, u.name AS lecturer_name, u.email
      FROM lectures l
      JOIN courses c ON l.course_id = c.id
      JOIN users u ON l.lecturer_id = u.id
      ORDER BY c.course_name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Fetch lecturers error:', err);
    res.status(500).json({ message: 'Error fetching assigned lecturers' });
  }
});

// POST assign lecturer
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl') {
      return res.status(403).json({ message: 'Only PL can assign lecturers' });
    }

    const { course_id, lecturer_id } = req.body;

    await pool.query(
      'INSERT INTO lectures (course_id, lecturer_id) VALUES ($1, $2)',
      [course_id, lecturer_id]
    );

    res.json({ message: 'Lecturer assigned successfully' });
  } catch (err) {
    console.error('❌ Assign lecturer error:', err);
    res.status(500).json({ message: 'Error assigning lecturer' });
  }
});

// DELETE unassign lecturer
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'pl') {
      return res.status(403).json({ message: 'Only PL can unassign lecturers' });
    }

    await pool.query('DELETE FROM lectures WHERE id = $1', [req.params.id]);

    res.json({ message: 'Lecturer unassigned successfully' });
  } catch (err) {
    console.error('❌ Unassign lecturer error:', err);
    res.status(500).json({ message: 'Error unassigning lecturer' });
  }
});

module.exports = router;
