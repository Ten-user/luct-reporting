
-- Sample SQL for LUCT Reporting App
CREATE DATABASE IF NOT EXISTS luct_reporting;
USE luct_reporting;

-- Users table (register/login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  role ENUM('student','lecturer','prl','pl') DEFAULT 'student'
);

-- Courses table (stores total_registered once)
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_name VARCHAR(255),
  class_name VARCHAR(255),
  course_name VARCHAR(255),
  course_code VARCHAR(100),
  lecturer_name VARCHAR(255),
  venue VARCHAR(255),
  scheduled_time VARCHAR(100),
  total_registered INT DEFAULT 0
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_name VARCHAR(255),
  class_name VARCHAR(255),
  week_of_reporting INT,
  date_of_lecture DATE,
  course_name VARCHAR(255),
  course_code VARCHAR(100),
  lecturer_name VARCHAR(255),
  actual_number_present INT,
  total_registered INT,
  venue VARCHAR(255),
  scheduled_lecture_time VARCHAR(100),
  topic_taught TEXT,
  learning_outcomes TEXT,
  lecturer_recommendations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a sample course for testing
INSERT INTO courses (faculty_name, class_name, course_name, course_code, lecturer_name, venue, scheduled_time, total_registered)
VALUES ('Faculty of ICT', 'BSc IT Year 1', 'Introduction to Programming', 'CS101', 'Dr. M. Tutor', 'Room A1', '09:00 - 11:00', 60);
