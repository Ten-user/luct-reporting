// frontend/src/components/Lectures.js
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [form, setForm] = useState({ course_id: '', lecturer_id: '' });
  const [message, setMessage] = useState('');

  const role = localStorage.getItem('role');

  async function loadData() {
    if (role === 'pl') {
      const [lecturesRes, coursesRes, lecturersRes] = await Promise.all([
        API.get('/lectures'),
        API.get('/courses'),
        API.get('/auth/users?role=lecturer')
      ]);
      setLectures(lecturesRes.data);
      setCourses(coursesRes.data);
      setLecturers(lecturersRes.data);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [role]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    await API.post('/lectures', form);
    await loadData();
    setForm({ course_id: '', lecturer_id: '' });
    setMessage('✅ Lecturer assigned successfully');
    setTimeout(() => setMessage(''), 3000);
  }

  async function removeAssignment(id) {
    if (!window.confirm('Are you sure you want to unassign this lecturer?')) return;
    const res = await API.delete(`/lectures/${id}`);
    await loadData();
    if (res.data.assignment) {
      setMessage(
        `❌ Unassigned ${res.data.assignment.lecturer_name} from ${res.data.assignment.course_name} (${res.data.assignment.course_code})`
      );
      setTimeout(() => setMessage(''), 4000);
    }
  }

  if (role !== 'pl') return <div>You are not authorized to view this page.</div>;

  return (
    <div>
      <h3>Lectures (Assign Lecturers to Courses)</h3>

      {message && <div className="alert alert-info">{message}</div>}

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
              {c.course_name} ({c.course_code})
            </option>
          ))}
        </select>

        <select
          name="lecturer_id"
          value={form.lecturer_id}
          onChange={onChange}
          className="form-select mb-2"
          required
        >
          <option value="">Select lecturer</option>
          {lecturers.map(l => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.email})
            </option>
          ))}
        </select>

        <button className="btn btn-primary">Assign</button>
      </form>

      <h4>Assigned Lectures</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Course</th>
            <th>Code</th>
            <th>Lecturer</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map(l => (
            <tr key={l.id}>
              <td>{l.course_name}</td>
              <td>{l.course_code}</td>
              <td>{l.lecturer_name}</td>
              <td>{l.email}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeAssignment(l.id)}
                >
                  Unassign
                </button>
              </td>
            </tr>
          ))}
          {lectures.length === 0 && (
            <tr>
              <td colSpan="5">No lecturers assigned yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
