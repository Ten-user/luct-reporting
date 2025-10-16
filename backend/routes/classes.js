const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get classes (role-based)
router.get('/', auth, async (req, res) => {
  try {
    let query = '';
    let params = [];

    if (req.user.role === 'lecturer') {
      // Lecturer → only their assigned classes
      query = `
        SELECT c.*
        FROM courses c
        JOIN course_lecturers cl ON cl.course_id = c.id
        WHERE cl.lecturer_id = $1
        ORDER BY c.class_name`;
      params = [req.user.id];

    } else if (req.user.role === 'prl') {
      // PRL → only classes in their faculty
      query = `
        SELECT * FROM courses
        WHERE faculty_name = $1
        ORDER BY class_name`;
      params = [req.user.faculty_name];

    } else if (req.user.role === 'pl') {
      // PL → all classes
      query = 'SELECT * FROM courses ORDER BY class_name';
      params = [];

    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (err) {
    console.error("❌ Error fetching classes:", err);
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

module.exports = router;
