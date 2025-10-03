import React, { useEffect, useState } from "react";
import API from "../api";

export default function Monitoring() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 search state
  const role = localStorage.getItem("role"); // get user role

  useEffect(() => {
    API.get("/monitoring")
      .then((res) => setData(res.data))
      .catch((err) => console.error("❌ Error fetching monitoring:", err));
  }, []);

  // 🔍 Filtered data
  const filteredData = data.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.class_name?.toLowerCase().includes(term) ||
      r.faculty_name?.toLowerCase().includes(term) ||
      r.topic_taught?.toLowerCase().includes(term) ||
      r.learning_outcomes?.toLowerCase().includes(term) ||
      (role !== "student" && r.lecturer_name?.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <h3>📊 Monitoring Dashboard</h3>

      {/* 🔍 Search box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by class, faculty, lecturer, or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Class</th>
            <th>Faculty</th>
            {role !== "student" && <th>Lecturer</th>}
            <th>Topic</th>
            <th>Learning Outcomes</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={role !== "student" ? 7 : 6} className="text-center">
                No matching records found.
              </td>
            </tr>
          ) : (
            filteredData.map((r) => {
              const attendance =
                r.total_registered > 0
                  ? ((r.actual_number_present / r.total_registered) * 100).toFixed(1)
                  : "N/A";
              return (
                <tr key={r.id}>
                  <td>{new Date(r.date_of_lecture).toLocaleDateString()}</td>
                  <td>{r.class_name}</td>
                  <td>{r.faculty_name}</td>
                  {role !== "student" && <td>{r.lecturer_name}</td>}
                  <td>{r.topic_taught}</td>
                  <td>{r.learning_outcomes}</td>
                  <td>
                    {r.actual_number_present}/{r.total_registered} ({attendance}
                    %)
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
