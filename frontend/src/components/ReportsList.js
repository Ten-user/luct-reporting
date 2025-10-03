import React, { useState, useEffect } from 'react';
import API from '../api';
import * as XLSX from 'xlsx';  // ✅ Excel export

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const role = localStorage.getItem('role');
  const [feedbacks, setFeedbacks] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get('/reports')
      .then(res => setReports(res.data))
      .catch(err => console.error("❌ Error fetching reports:", err));
  }, []);

  async function submitFeedback(id) {
    try {
      const feedback = feedbacks[id];
      await API.put(`/reports/${id}/feedback`, { feedback });
      alert("✅ Feedback saved");
      const res = await API.get('/reports');
      setReports(res.data);
    } catch (err) {
      console.error("❌ Error feedback:", err);
    }
  }

  // 🔹 Excel export function
  function exportToExcel() {
    const data = reports.map(r => ({
      ID: r.id,
      Date: new Date(r.date_of_lecture).toLocaleDateString(),
      Course: `${r.course_name} (${r.course_code})`,
      Lecturer: r.lecturer_name,
      Class: r.class_name,
      Faculty: r.faculty_name,
      "Present / Total": `${r.actual_number_present}/${r.total_registered}`,
      Topic: r.topic_taught,
      "Learning Outcomes": r.learning_outcomes,
      "PRL Feedback": r.prl_feedback || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, "LUCT_Reports.xlsx");
  }

  const filteredReports = reports.filter(r =>
    r.course_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.course_code?.toLowerCase().includes(search.toLowerCase()) ||
    r.class_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.lecturer_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.topic_taught?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h3>📊 Reports</h3>

      {/* 🔍 Search bar + Export button */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by course, code, class, lecturer, or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-success ms-2" onClick={exportToExcel}>
          ⬇️ Export Excel
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Course</th>
              <th>Lecturer</th>
              <th>Present / Total</th>
              <th>Topic</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No reports found.</td></tr>
            ) : (
              filteredReports.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{new Date(r.date_of_lecture).toLocaleDateString()}</td>
                  <td>{r.course_name} ({r.course_code})</td>
                  <td>{r.lecturer_name}</td>
                  <td>{r.actual_number_present} / {r.total_registered}</td>
                  <td>{r.topic_taught}</td>
                  <td>
                    {role === 'prl' ? (
                      <div className="d-flex">
                        <input
                          type="text"
                          value={feedbacks[r.id] ?? r.prl_feedback ?? ''}
                          onChange={e => setFeedbacks({ ...feedbacks, [r.id]: e.target.value })}
                          className="form-control me-2"
                        />
                        <button className="btn btn-sm btn-primary" onClick={() => submitFeedback(r.id)}>Save</button>
                      </div>
                    ) : (
                      <span>{r.prl_feedback || '—'}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
