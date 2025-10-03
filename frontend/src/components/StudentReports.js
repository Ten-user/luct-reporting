// frontend/src/components/StudentReports.js
import React, { useEffect, useState } from "react";
import API from "../api";

export default function StudentReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const res = await API.get("/reports"); // backend filters by student role
      setReports(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching student reports:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading your reports...</div>;
  if (!reports.length) return <div>No reports available for your courses.</div>;

  return (
    <div>
      <h3 className="mb-4">📘 My Reports</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Course</th>
            <th>Class</th>
            <th>Topic</th>
            <th>Learning Outcomes</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.date_of_lecture).toLocaleDateString()}</td>
              <td>{r.course_name} ({r.course_code})</td>
              <td>{r.class_name}</td>
              <td>{r.topic_taught}</td>
              <td>{r.learning_outcomes}</td>
              <td>{r.actual_number_present} / {r.total_registered}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
