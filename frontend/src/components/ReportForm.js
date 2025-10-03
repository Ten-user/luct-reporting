import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ReportForm() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_id: '',
    faculty_name: '',
    class_name: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_code: '',
    actual_number_present: '',
    total_registered: '',
    venue: '',
    scheduled_lecture_time: '',
    topic_taught: '',
    learning_outcomes: '',
    lecturer_recommendations: ''
  });
  const [manualCourse, setManualCourse] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // read ?courseId=123 from URL
  useEffect(() => {
    API.get('/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error("❌ Error fetching courses:", err));

    const params = new URLSearchParams(location.search);
    const preselect = params.get("courseId");
    if (preselect) {
      setForm(f => ({ ...f, course_id: preselect }));
    }
  }, [location.search]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onCourseSelect(e) {
    const val = e.target.value;
    if (val === 'manual') {
      setManualCourse(true);
      setForm({ ...form, course_id: '', faculty_name: '', class_name: '', course_code: '' });
      return;
    }
    setManualCourse(false);
    const c = courses.find(x => String(x.id) === val);
    if (c) {
      setForm(f => ({
        ...f,
        course_id: c.id,
        faculty_name: c.faculty_name,
        class_name: c.class_name,
        course_code: c.course_code,
        total_registered: c.total_registered,
        venue: c.venue,
        scheduled_lecture_time: c.scheduled_time
      }));
    }
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await API.post('/reports', form);
      setMessage('✅ Report submitted successfully');
      setTimeout(() => navigate('/reports'), 1200);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error submitting report');
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4>📋 Lecturer Reporting Form</h4>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label>Choose Course</label>
            <select className="form-select" onChange={onCourseSelect} value={manualCourse ? 'manual' : form.course_id}>
              <option value="">-- select course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.course_name} ({c.course_code})
                </option>
              ))}
              <option value="manual">➕ Other (enter manually)</option>
            </select>
          </div>

          {manualCourse && (
            <>
              <div className="mb-3">
                <label>Course Name</label>
                <input name="course_name" value={form.course_name} onChange={onChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label>Course Code</label>
                <input name="course_code" value={form.course_code} onChange={onChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label>Faculty Name</label>
                <input name="faculty_name" value={form.faculty_name} onChange={onChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label>Class Name</label>
                <input name="class_name" value={form.class_name} onChange={onChange} className="form-control" required />
              </div>
            </>
          )}

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Week of Reporting</label>
              <input name="week_of_reporting" value={form.week_of_reporting} onChange={onChange} type="number" className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Date of Lecture</label>
              <input name="date_of_lecture" value={form.date_of_lecture} onChange={onChange} type="date" className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Venue</label>
              <input name="venue" value={form.venue} onChange={onChange} className="form-control" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Scheduled Lecture Time</label>
              <input name="scheduled_lecture_time" value={form.scheduled_lecture_time} onChange={onChange} className="form-control" />
            </div>
            <div className="col-md-3 mb-3">
              <label>Present</label>
              <input name="actual_number_present" value={form.actual_number_present} onChange={onChange} type="number" className="form-control" required />
            </div>
            <div className="col-md-3 mb-3">
              <label>Total Registered</label>
              <input name="total_registered" value={form.total_registered} onChange={onChange} type="number" className="form-control" required />
            </div>
          </div>

          <div className="mb-3">
            <label>Topic Taught</label>
            <textarea name="topic_taught" value={form.topic_taught} onChange={onChange} className="form-control"></textarea>
          </div>
          <div className="mb-3">
            <label>Learning Outcomes</label>
            <textarea name="learning_outcomes" value={form.learning_outcomes} onChange={onChange} className="form-control"></textarea>
          </div>
          <div className="mb-3">
            <label>Lecturer Recommendations</label>
            <textarea name="lecturer_recommendations" value={form.lecturer_recommendations} onChange={onChange} className="form-control"></textarea>
          </div>

          <button className="btn btn-primary">Submit Report</button>
        </form>
      </div>
    </div>
  );
}
