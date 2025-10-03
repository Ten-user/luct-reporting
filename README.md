
# LUCT Reporting App (Sample Implementation)

This repository is a **starter implementation** for the Web Application Development.
It includes a **React** frontend, an **Express / Node.js** backend, and a **MySQL** schema (for use with XAMPP).

## What is included
- `frontend/` — React app (Bootstrap) with login/register, report form and reports list.
- `backend/` — Express API with auth (JWT), courses and reports endpoints, and MySQL connection (mysql2).
- `sample.sql` — SQL file to create the database and tables, with sample course row.
- Scripts to install both frontend and backend dependencies and start both together.

## Quick setup (Windows / macOS / Linux)
1. Install prerequisites:
   - Node.js (v18+ recommended) and npm
   - XAMPP (to get MySQL / phpMyAdmin) or standalone MySQL server

2. Start MySQL with XAMPP (or ensure MySQL server is running).

3. Import the SQL schema:
   - Open phpMyAdmin (usually http://localhost/phpmyadmin)
   - Create or import `backend/sample.sql` (this file is in the `backend` folder of the extracted project).
   - The SQL will create a database named `luct_reporting` and tables `users`, `courses`, `reports`.

4. Configure backend database connection:
   - Copy `backend/.env.example` to `backend/.env` and set `DB_USER`, `DB_PASSWORD` according to your MySQL setup.
   - Default values assume user `root` with no password and DB `luct_reporting`.

5. From the project root (where `package.json` is), run:
   ```bash
   npm install
   npm start
   ```
   The first `npm install` will also install dependencies in both frontend and backend folders (via the `postinstall` script).
   `npm start` runs both backend (port 5000) and frontend (port 3000).

6. Open the app in your browser: http://localhost:3000

## Notes
- Default JWT secret and other sensitive values are in `backend/.env.example`. Update them for production.
- You can register new accounts (student / lecturer /prl / pl) using the Register form.
- Courses can be added via the backend API (`POST /api/courses`) — a sample course is provided in the SQL.
- This is a minimal but complete starter template — extend it to satisfy all assignment requirements and polish UI/UX.
