import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 NEW

  useEffect(() => {
    API.get('/classes')
      .then(res => setClasses(res.data))
      .catch(err => console.error("❌ Error fetching classes:", err));
  }, []);

  const filteredClasses = classes.filter(c =>
    c.class_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.course_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.course_code?.toLowerCase().includes(search.toLowerCase()) ||
    c.venue?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h3>📚 My Classes</h3>

      {/* 🔍 Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by class, course, code or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Class</th>
            <th>Course</th>
            <th>Code</th>
            <th>Venue</th>
            <th>Scheduled</th>
            <th>Registered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.length === 0 ? (
            <tr><td colSpan="7" className="text-center">No classes found.</td></tr>
          ) : (
            filteredClasses.map(c => (
              <tr key={c.id}>
                <td>{c.class_name}</td>
                <td>{c.course_name}</td>
                <td>{c.course_code}</td>
                <td>{c.venue}</td>
                <td>{c.scheduled_time}</td>
                <td>{c.total_registered}</td>
                <td>
                  <Link to={`/report?courseId=${c.id}`} className="btn btn-sm btn-primary">
                    Submit Report
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
