import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // 🔍 NEW
  const role = localStorage.getItem('role');
  const [form, setForm] = useState({
    faculty_name: '',
    class_name: '',
    course_name: '',
    course_code: '',
    venue: '',
    scheduled_time: '',
    total_registered: ''
  });

  useEffect(() => {
    fetchCourses();
    if (role === 'student') fetchMyCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await API.get('/courses');
      setCourses(res.data || []);
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyCourses() {
    try {
      const res = await API.get('/student-courses/my');
      setMyCourses(res.data || []);
    } catch (err) {
      console.error('❌ Error fetching my courses:', err);
    }
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function addCourse(e) {
    e.preventDefault();
    try {
      await API.post('/courses', form);
      alert('✅ Course added successfully');
      setForm({
        faculty_name: '',
        class_name: '',
        course_name: '',
        course_code: '',
        venue: '',
        scheduled_time: '',
        total_registered: ''
      });
      fetchCourses();
    } catch (err) {
      console.error('❌ Error adding course:', err);
      alert('Error adding course');
    }
  }

  async function enroll(courseId) {
    try {
      await API.post('/student-courses/enroll', { course_id: courseId });
      alert('✅ Enrolled');
      fetchMyCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling');
    }
  }

  async function unenroll(courseId) {
    try {
      await API.delete(`/student-courses/unenroll/${courseId}`);
      alert('✅ Unenrolled');
      fetchMyCourses();
    } catch (err) {
      alert('Error unenrolling');
    }
  }

  // 🔍 filter
  const filteredCourses = courses.filter(c =>
    c.course_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.course_code?.toLowerCase().includes(search.toLowerCase()) ||
    c.class_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.faculty_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading courses...</div>;

  return (
    <div>
      <h3>📘 Courses</h3>

      {/* 🔍 Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by course, code, class or faculty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Show Add Course form only for PL */}
      {role === 'pl' && (
        <form onSubmit={addCourse} className="mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <input name="faculty_name" value={form.faculty_name} onChange={onChange} className="form-control" placeholder="Faculty" required />
            </div>
            <div className="col-md-4">
              <input name="class_name" value={form.class_name} onChange={onChange} className="form-control" placeholder="Class" required />
            </div>
            <div className="col-md-4">
              <input name="course_name" value={form.course_name} onChange={onChange} className="form-control" placeholder="Course Name" required />
            </div>
            <div className="col-md-4">
              <input name="course_code" value={form.course_code} onChange={onChange} className="form-control" placeholder="Course Code" required />
            </div>
            <div className="col-md-4">
              <input name="venue" value={form.venue} onChange={onChange} className="form-control" placeholder="Venue" />
            </div>
            <div className="col-md-4">
              <input name="scheduled_time" value={form.scheduled_time} onChange={onChange} className="form-control" placeholder="Scheduled Time" />
            </div>
            <div className="col-md-4">
              <input type="number" name="total_registered" value={form.total_registered} onChange={onChange} className="form-control" placeholder="Total Registered" min="0" />
            </div>
          </div>
          <button className="btn btn-primary mt-2">Add Course</button>
        </form>
      )}

      {/* Courses Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Course</th>
            <th>Code</th>
            <th>Class</th>
            <th>Lecturers</th>
            <th>Venue</th>
            <th>Scheduled</th>
            <th>Registered</th>
            {role === 'student' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredCourses.length === 0 ? (
            <tr><td colSpan="8" className="text-center">No courses found.</td></tr>
          ) : (
            filteredCourses.map(c => {
              const enrolled = myCourses.some(mc => mc.id === c.id);
              return (
                <tr key={c.id}>
                  <td>{c.course_name}</td>
                  <td>{c.course_code}</td>
                  <td>{c.class_name}</td>
                  <td>{c.lecturers || 'Unassigned'}</td>
                  <td>{c.venue}</td>
                  <td>{c.scheduled_time}</td>
                  <td>{c.total_registered}</td>
                  {role === 'student' && (
                    <td>
                      {enrolled ? (
                        <button className="btn btn-danger btn-sm" onClick={() => unenroll(c.id)}>Unenroll</button>
                      ) : (
                        <button className="btn btn-success btn-sm" onClick={() => enroll(c.id)}>Enroll</button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
