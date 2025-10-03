// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('role');

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">LUCT Reporting</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navmenu">
          {token && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              {/* 🎓 Student */}
              {role === 'student' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/student-courses">Enroll Courses</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/monitoring">Monitoring</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/rating">Rating</Link>
                  </li>
                </>
              )}

              {/* 👨‍🏫 Lecturer */}
              {role === 'lecturer' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/classes">Classes</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/report">Reports</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/monitoring">Monitoring</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/rating">Rating</Link>
                  </li>
                </>
              )}

              {/* 👨‍💼 PRL */}
              {role === 'prl' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/courses">Courses</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/reports">Reports</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/monitoring">Monitoring</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/rating">Rating</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/classes">Classes</Link>
                  </li>
                </>
              )}

              {/* 📋 Program Leader (PL) */}
              {role === 'pl' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/courses">Courses</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/reports">Reports</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/monitoring">Monitoring</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/classes">Classes</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/lectures">Lectures</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/rating">Rating</Link>
                  </li>
                </>
              )}
            </ul>
          )}

          <div className="d-flex">
            {token ? (
              <>
                <span className="navbar-text text-white me-2">
                  Hi, {userName || 'User'} ({role})
                </span>
                <button className="btn btn-outline-light" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link className="btn btn-outline-light" to="/login">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
