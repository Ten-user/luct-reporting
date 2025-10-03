import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_id: '',
    week_of_reporting: '',
    date_of_lecture: '',
    actual_number_present: '',
    total_registered: '',
    venue: '',
    scheduled_lecture_time: '',
    topic_taught: '',
    learning_outcomes: '',
    lecturer_recommendations: ''
  });

  useEffect(() => {
    // fetch reports
    API.get('/reports').then(res => setReports(res.data));

    // fetch courses (lecturer’s assigned)
    API.get('/courses').then(res => setCourses(res.data));
  }, []);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await API.post('/reports', form);
      const res = await API.get('/reports');
      setReports(res.data);

      // reset form
      setForm({
        course_id: '',
        week_of_reporting: '',
        date_of_lecture: '',
        actual_number_present: '',
        total_registered: '',
        venue: '',
        scheduled_lecture_time: '',
        topic_taught: '',
        learning_outcomes: '',
        lecturer_recommendations: ''
      });
    } catch (err) {
      console.error('❌ Error submitting report:', err);
      alert('Error submitting report');
    }
  }

  return (
    <div>
      <h3>Submit a Report</h3>
      <form onSubmit={submit} className="mb-4">
        {/* Course dropdown */}
        <select
          name="course_id"
          value={form.course_id}
          onChange={onChange}
          className="form-select mb-2"
          required
        >
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.course_name} ({c.course_code}) — {c.class_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="week_of_reporting"
          value={form.week_of_reporting}
          onChange={onChange}
          placeholder="Week of Reporting"
          className="form-control mb-2"
          required
        />
        <input
          type="date"
          name="date_of_lecture"
          value={form.date_of_lecture}
          onChange={onChange}
          className="form-control mb-2"
          required
        />
        <input
          type="number"
          name="actual_number_present"
          value={form.actual_number_present}
          onChange={onChange}
          placeholder="Number Present"
          className="form-control mb-2"
          required
        />
        <input
          type="number"
          name="total_registered"
          value={form.total_registered}
          onChange={onChange}
          placeholder="Total Registered"
          className="form-control mb-2"
          required
        />
        <input
          name="venue"
          value={form.venue}
          onChange={onChange}
          placeholder="Venue"
          className="form-control mb-2"
          required
        />
        <input
          name="scheduled_lecture_time"
          value={form.scheduled_lecture_time}
          onChange={onChange}
          placeholder="Scheduled Time"
          className="form-control mb-2"
          required
        />
        <textarea
          name="topic_taught"
          value={form.topic_taught}
          onChange={onChange}
          placeholder="Topic Taught"
          className="form-control mb-2"
          required
        />
        <textarea
          name="learning_outcomes"
          value={form.learning_outcomes}
          onChange={onChange}
          placeholder="Learning Outcomes"
          className="form-control mb-2"
          required
        />
        <textarea
          name="lecturer_recommendations"
          value={form.lecturer_recommendations}
          onChange={onChange}
          placeholder="Recommendations"
          className="form-control mb-2"
        />
        <button className="btn btn-primary">Submit</button>
      </form>

      <h3>My Reports</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Class</th>
            <th>Course</th>
            <th>Topic</th>
            <th>Learning Outcomes</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{new Date(r.date_of_lecture).toLocaleDateString()}</td>
              <td>{r.class_name}</td>
              <td>{r.course_name} ({r.course_code})</td>
              <td>{r.topic_taught}</td>
              <td>{r.learning_outcomes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
