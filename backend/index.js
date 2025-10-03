require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// ✅ Route imports
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');
const coursesRoutes = require('./routes/courses');
const classesRoutes = require('./routes/classes');
const monitoringRoutes = require('./routes/monitoring');
const ratingsRoutes = require('./routes/ratings');
const courseLecturersRoutes = require('./routes/courseLecturers'); // ✅ FIXED
const studentCoursesRoutes = require('./routes/studentCourses');

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/lectures', courseLecturersRoutes); // ✅ FIXED
app.use('/api/student-courses', studentCoursesRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ message: 'LUCT Reporting API is running' });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Backend running on port ${port}`);
});
