import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Rating() {
  const [courses, setCourses] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [form, setForm] = useState({ course_id: '', score: '', feedback: '' });

  // Get role from localStorage (saved at login)
  const role = localStorage.getItem('role');

  useEffect(() => {
    // Students need courses list for submitting ratings
    if (role === 'student') {
      API.get('/courses').then(res => setCourses(res.data));
    }

    // Everyone fetches ratings (role-based from backend)
    API.get('/ratings').then(res => setMyRatings(res.data));
  }, [role]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await API.post('/ratings', form);
      const res = await API.get('/ratings');
      setMyRatings(res.data);
      setForm({ course_id: '', score: '', feedback: '' });
    } catch (err) {
      console.error('❌ Error submitting rating:', err);
      alert('Error submitting rating');
    }
  }

  return (
    <div>
      <h3>Ratings</h3>

      {/* Only Students can submit ratings */}
      {role === 'student' && (
        <form onSubmit={submit} className="mb-4">
          <select
            name="course_id"
            value={form.course_id}
            onChange={onChange}
            className="form-select mb-2"
            required
          >
            <option value="">Select course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.class_name} ({c.faculty_name})
              </option>
            ))}
          </select>
          <input
            type="number"
            name="score"
            value={form.score}
            onChange={onChange}
            placeholder="Score (1-5)"
            className="form-control mb-2"
            min="1"
            max="5"
            required
          />
          <textarea
            name="feedback"
            value={form.feedback}
            onChange={onChange}
            placeholder="Feedback"
            className="form-control mb-2"
          ></textarea>
          <button className="btn btn-primary">Submit</button>
        </form>
      )}

      {/* Ratings list (students see their own, lecturers see feedback for their courses, PRL/PL see all) */}
      <h4>{role === 'student' ? 'My Ratings' : 'Course Feedback'}</h4>
      <ul className="list-group">
        {myRatings.map(r => (
          <li key={r.id} className="list-group-item">
            <strong>{r.class_name}</strong> — Score: {r.score} — {r.feedback}
            {r.student_name && (
              <span className="text-muted"> (by {r.student_name})</span>
            )}
            {r.lecturer_name && role !== 'student' && (
              <span className="text-muted"> | Lecturer: {r.lecturer_name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
