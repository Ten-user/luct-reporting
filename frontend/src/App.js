import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";

// Student modules
import Monitoring from "./components/Monitoring";
import Rating from "./components/Rating";
import StudentCourses from "./components/StudentCourses";

// Lecturer modules
import Classes from "./components/Classes";
import ReportForm from "./components/ReportForm";
import ReportsList from "./components/ReportsList";

// PRL + PL modules
import Courses from "./components/Courses";
import Lectures from "./components/Lectures";  // ✅ FIXED

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Student */}
          <Route path="/student-courses" element={<StudentCourses />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/rating" element={<Rating />} />

          {/* Lecturer */}
          <Route path="/classes" element={<Classes />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/reports" element={<ReportsList />} />

          {/* PRL */}
          <Route path="/courses" element={<Courses />} />

          {/* PL */}
          <Route path="/lectures" element={<Lectures />} /> {/* ✅ FIXED */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
