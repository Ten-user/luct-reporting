// frontend/src/components/PRLReports.js
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function PRLReports() {
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState({});

  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role === 'prl') {
      API.get('/reports').then(res => setReports(res.data));
    }
  }, [role]);

  async function submitFeedback(id) {
    try {
      await API.put(`/reports/${id}/feedback`, { feedback: feedback[id] });
      alert('✅ Feedback saved');
    } catch (err) {
      console.error('❌ Error saving feedback:', err);
      alert('Error saving feedback');
    }
  }

  if (role !== 'prl') return <div>You are not authorized to view this page.</div>;

  return (
    <div>
      <h3>Reports (with Feedback)</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Course</th>
            <th>Lecturer</th>
            <th>Topic</th>
            <th>Recommendations</th>
            <th>Feedback (PRL)</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{new Date(r.date_of_lecture).toLocaleDateString()}</td>
              <td>{r.course_name} ({r.course_code})</td>
              <td>{r.lecturer_name}</td>
              <td>{r.topic_taught}</td>
              <td>{r.lecturer_recommendations}</td>
              <td>
                <textarea
                  className="form-control mb-1"
                  value={feedback[r.id] ?? r.prl_feedback ?? ''}
                  onChange={e => setFeedback({ ...feedback, [r.id]: e.target.value })}
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => submitFeedback(r.id)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr><td colSpan="6">No reports available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
