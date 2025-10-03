// frontend/src/components/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">📘 LUCT Reporting System</h1>
        <p className="lead text-muted">
          A unified platform for lecture reporting, monitoring, and feedback.
        </p>
      </div>

      {/* Role Overview Section */}
      <div className="container mb-5">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title">🎓 Student</h5>
                <p className="card-text small text-muted">
                  Access course reports, monitor attendance, and submit ratings.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title">👨‍🏫 Lecturer</h5>
                <p className="card-text small text-muted">
                  Submit reports, track attendance, and share recommendations.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title">👨‍💼 PRL</h5>
                <p className="card-text small text-muted">
                  Monitor faculty performance and provide feedback to lecturers.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title">📋 Program Leader (PL)</h5>
                <p className="card-text small text-muted">
                  Manage courses, assign lecturers, and oversee institution-wide
                  reports and monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex gap-3">
        <Link to="/login" className="btn btn-primary btn-lg px-4">
          Login / Register
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-5 text-muted small">
        &copy; {new Date().getFullYear()} LUCT Reporting System. All rights
        reserved.
      </footer>
    </div>
  );
}
