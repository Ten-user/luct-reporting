import React, { useEffect, useState } from "react";
import API from "../api";

export default function StudentCourses() {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchMyCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await API.get("/courses");
      setAllCourses(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyCourses() {
    try {
      const res = await API.get("/student-courses/my");
      setMyCourses(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching my courses:", err);
    }
  }

  async function enroll(courseId) {
    try {
      await API.post("/student-courses/enroll", { course_id: courseId });
      alert("✅ Enrolled successfully");
      fetchMyCourses();
    } catch (err) {
      console.error("❌ Error enrolling:", err);
      alert(err.response?.data?.message || "Error enrolling in course");
    }
  }

  if (loading) return <div>Loading courses...</div>;

  return (
    <div>
      <h3>📘 Available Courses</h3>
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th>Course</th>
            <th>Code</th>
            <th>Class</th>
            <th>Faculty</th>
            <th>Venue</th>
            <th>Scheduled</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allCourses.map((c) => (
            <tr key={c.id}>
              <td>{c.course_name}</td>
              <td>{c.course_code}</td>
              <td>{c.class_name}</td>
              <td>{c.faculty_name}</td>
              <td>{c.venue}</td>
              <td>{c.scheduled_time}</td>
              <td>
                {myCourses.some((mc) => mc.id === c.id) ? (
                  <span className="badge bg-success">Enrolled</span>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => enroll(c.id)}
                  >
                    Enroll
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>🎓 My Enrolled Courses</h3>
      <ul className="list-group">
        {myCourses.map((c) => (
          <li key={c.id} className="list-group-item">
            {c.course_name} ({c.class_name})
          </li>
        ))}
      </ul>
    </div>
  );
}
