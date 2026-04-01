#AI-Enhanced Lab Management System

An AI-powered Lab Management System designed to automate and streamline laboratory operations in educational institutions. This system improves efficiency, enhances security, and provides real-time insights using modern technologies and artificial intelligence.

## TABLE OF CONTENTS
1. Prerequisites
2. Project File Structure
3. Step-by-Step Setup
4. Running the System
5. Test Login Credentials
6. Feature Guide by Role
7. Email Configuration (Optional)
8. Troubleshooting Common Errors
9. API Endpoints Reference
10. Notes for Demo/Submission

---

## 1. PREREQUISITES

Before you begin, make sure you have the following installed:

### Node.js
- Required version: 14.0 or higher
- Download from: https://nodejs.org/en/download
- To verify: open a terminal and run:
  node --version
  npm --version
  Both should print a version number.

### A Code Editor (Optional but recommended)
- VS Code: https://code.visualstudio.com

### A Web Browser
- Chrome, Firefox, or Edge (any modern browser)

---

## 2. PROJECT FILE STRUCTURE

Your project folder must look exactly like this:

  lab-management-system/
  ├── index.html        ← Frontend (entire UI in one file)
  ├── server.js         ← Backend (Node.js + Express server)
  ├── package.json      ← Project dependencies
  ├── .env.example      ← Template for environment variables
  └── README.md         ← This guide

That's it. Only 5 files needed. No other setup required.

---

## 3. STEP-BY-STEP SETUP

### STEP 1 — Create the Project Folder

Open a terminal (Command Prompt / PowerShell / Terminal / Git Bash).

Create and navigate into the project folder:

  mkdir lab-management-system
  cd lab-management-system

### STEP 2 — Place All Project Files

Make sure these files are inside the folder:
  - index.html
  - server.js
  - package.json
  - .env.example
  - README.md

### STEP 3 — Create the .env File

Copy the example file:

  On Windows (Command Prompt):
    copy .env.example .env

  On Mac/Linux:
    cp .env.example .env

Open the .env file in any text editor.

For basic usage (no email), leave it as is — the system will work without email.
For email functionality, fill in your Gmail credentials (see Section 7).

Your .env file should look like:

  PORT=3002
  LAB_EMAIL=your_email@gmail.com
  LAB_PASSWORD=your_gmail_app_password
  ADMIN_EMAIL=admin@college.edu

### STEP 4 — Install Dependencies

While inside the project folder, run:

  npm install

This will download all required packages.
You should see a "node_modules" folder appear.
Expected packages: express, nodemailer, cors, dotenv, multer, body-parser, uuid

Wait for the install to finish (30–60 seconds depending on internet speed).

---

## 4. RUNNING THE SYSTEM

### STEP 5 — Start the Server

Run this command from inside the project folder:

  node server.js

If successful, you will see this in the terminal:

  ╔══════════════════════════════════════════════════╗
  ║       LAB MANAGEMENT SYSTEM — ERP Module         ║
  ╠══════════════════════════════════════════════════╣
  ║  Server running at: http://localhost:3002        ║
  ║  Open your browser and go to the URL above.     ║
  ╠══════════════════════════════════════════════════╣
  ║  Test Logins:                                    ║
  ║    Admin:   admin   / admin123                   ║
  ║    Faculty: faculty / fac123                     ║
  ║    Student: student / stu123                     ║
  ╚══════════════════════════════════════════════════╝

### STEP 6 — Open the Browser

Open any web browser and go to:

  http://localhost:3002

The Lab Management System login page will appear.

### STEP 7 — Login

Use one of the test credentials below.

---

## 5. TEST LOGIN CREDENTIALS

┌─────────────────┬──────────────┬────────────────────────────────────────────────┐
│ Role            │ Credentials  │ Access Level                                   │
├─────────────────┼──────────────┼────────────────────────────────────────────────┤
│ Lab In-charge   │ admin/admin123│ Full access — all modules, CRUD, reports       │
│ Faculty         │faculty/fac123 │ Schedule, manuals, grade submissions, resources│
│ Student         │student/stu123 │ View schedules, submit reports, book equipment │
└─────────────────┴──────────────┴────────────────────────────────────────────────┘

---

## 6. FEATURE GUIDE BY ROLE

### LAB IN-CHARGE (admin / admin123) — Full Access

  Dashboard
  → See KPI cards: Total Labs, Equipment, Maintenance Tickets, Bookings
  → View 4 analytics charts (Lab Utilization, Equipment Condition, Maintenance Trend, Usage)

  Equipment Inventory
  → Add new equipment with ID, name, lab, quantity, condition, maintenance dates
  → Edit existing equipment
  → Delete equipment
  → Filter by condition (Good / Fair / Needs Repair)
  → Search by name or lab

  Lab Schedule
  → Book a lab session (checks for double booking automatically)
  → View all sessions
  → Cancel sessions

  Experiment Manuals
  → Add experiment manuals with difficulty, duration, subject
  → Delete manuals
  → Students can view and download

  Equipment Usage Tracking
  → Log equipment usage with start/end time, purpose, condition after use
  → View full usage history

  Maintenance Records
  → Report a new maintenance issue
  → Update status: Open → In-Progress → Resolved
  → View all tickets with priority levels

  Learning Resources
  → Add PDF, Video, Notes, Links
  → Delete resources
  → Students can access all resources

  Student Submissions
  → View all submitted experiment reports
  → Grade submissions (A+, A, B+, B, C, D, F)
  → Add feedback comments

  Lab Attendance
  → Mark attendance for any batch and lab
  → View attendance percentage per session

  Equipment Booking
  → View all student booking requests
  → Approve or Reject requests

  Announcements
  → Post new announcements with priority (High/Medium/Low)
  → Target specific audiences (All / Faculty / Students)
  → Delete announcements

  Reports & Analytics
  → View KPI summary
  → Lab utilization chart
  → Equipment status chart
  → Maintenance summary table
  → Export to CSV
  → Print report

---

### FACULTY (faculty / fac123) — Academic Access

  Can access:
  + Lab Schedule → Book lab sessions, view all
  + Experiment Manuals → Add new manuals
  + Equipment Usage → Log usage
  + Maintenance Records → Report issues, update status
  + Learning Resources → Add resources
  + Student Submissions → Grade and review
  + Lab Attendance → Mark attendance
  + Equipment Booking → Approve/Reject requests
  + Announcements → View only
  + Dashboard → Full analytics view

  Cannot access:
  - Add/Delete Equipment (view only)
  - Post Announcements

---

### STUDENT (student / stu123) — Student Access

  Can access:
  + Dashboard → View announcements and KPIs
  + Equipment Inventory → View only
  + Lab Schedule → View only
  + Experiment Manuals → View and download
  + Learning Resources → View and download
  + Student Submissions → Submit own reports
  + Lab Attendance → View own attendance
  + Equipment Booking → Request equipment
  + Announcements → View all

  Cannot access:
  - Add/Edit/Delete anything except submitting reports and booking requests

---

## 7. EMAIL CONFIGURATION (OPTIONAL)

Email is optional. The system runs perfectly without it.
When email is not configured, emails are logged to the terminal instead.

To enable email (Gmail):

1. Go to your Google Account → Security → 2-Step Verification (must be ON)
2. Go to: https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail"
4. Copy the 16-character password
5. Open your .env file and fill in:

   LAB_EMAIL=yourname@gmail.com
   LAB_PASSWORD=xxxx xxxx xxxx xxxx    ← 16-char app password, no spaces

6. Restart the server: Ctrl+C, then node server.js again

Emails are triggered for:
  - New lab booking confirmations
  - Maintenance alerts (when equipment marked as Needs Repair)
  - Booking approval notifications

---

## 8. TROUBLESHOOTING COMMON ERRORS

─────────────────────────────────────────────────────────
ERROR: "Cannot find module 'express'"
─────────────────────────────────────────────────────────
  Cause: npm install was not run, or ran from wrong folder.
  Fix:
    1. Make sure you are inside the lab-management-system folder
    2. Run: npm install
    3. Verify node_modules folder exists

─────────────────────────────────────────────────────────
ERROR: "EADDRINUSE: address already in use :::3002"
─────────────────────────────────────────────────────────
  Cause: Port 3002 is already being used by another process.
  Fix Option 1:
    Stop the other process using the port.
    On Windows: netstat -ano | findstr :3002
                taskkill /PID <pid_number> /F
    On Mac/Linux: lsof -i :3002
                  kill -9 <pid_number>
  Fix Option 2:
    Change the port in .env: PORT=3003
    Then access at: http://localhost:3003

─────────────────────────────────────────────────────────
ERROR: "Cannot connect to server" on login page
─────────────────────────────────────────────────────────
  Cause: Server is not running, or wrong port.
  Fix:
    1. Make sure terminal is open and server.js is running
    2. You should see the startup banner in the terminal
    3. If not, run: node server.js
    4. Try opening: http://localhost:3002/health in browser
       You should see: {"status":"OK",...}

─────────────────────────────────────────────────────────
ERROR: "node is not recognized as a command"
─────────────────────────────────────────────────────────
  Cause: Node.js is not installed or not in PATH.
  Fix: Download and install from https://nodejs.org
       Restart terminal after installing.

─────────────────────────────────────────────────────────
ERROR: Charts not displaying
─────────────────────────────────────────────────────────
  Cause: No internet connection (Chart.js loads from CDN).
  Fix: Make sure you have internet access when first loading.
       Charts load from: cdn.jsdelivr.net

─────────────────────────────────────────────────────────
ERROR: Login page shows but login fails with network error
─────────────────────────────────────────────────────────
  Cause: Frontend is opened by double-clicking index.html
         instead of accessing via localhost.
  Fix: ALWAYS access via http://localhost:3002
       DO NOT open index.html directly as a file.

─────────────────────────────────────────────────────────
ERROR: "dotenv is not found" or .env not loading
─────────────────────────────────────────────────────────
  Cause: .env file missing.
  Fix: Run: cp .env.example .env  (Mac/Linux)
       or: copy .env.example .env  (Windows)

─────────────────────────────────────────────────────────
ERROR: White screen / blank page
─────────────────────────────────────────────────────────
  Cause: index.html missing from project folder.
  Fix: Make sure index.html is in the same folder as server.js

─────────────────────────────────────────────────────────
ISSUE: Data resets after server restart
─────────────────────────────────────────────────────────
  Cause: This is expected. The system uses in-memory storage.
  Note: Data is pre-seeded with demo data on every start.
  For persistent storage, a database like SQLite or MongoDB
  would need to be added (not required for demo purposes).

---

## 9. API ENDPOINTS REFERENCE

All endpoints return JSON in format: { success: true/false, message: "...", data: {...} }

  GET  /health                      → Server health check
  POST /login                       → Authenticate user
  POST /forgot-password             → Request password reset token
  POST /reset-password              → Reset password with token

  GET  /api/equipment               → List all equipment
  POST /api/equipment               → Add new equipment
  PUT  /api/equipment/:id           → Update equipment
  DELETE /api/equipment/:id         → Delete equipment

  GET  /api/schedules               → List all lab schedules
  POST /api/schedules               → Book a lab session
  DELETE /api/schedules/:id         → Cancel a session

  GET  /api/manuals                 → List all manuals
  POST /api/manuals                 → Add a manual
  DELETE /api/manuals/:id           → Delete a manual

  GET  /api/usage                   → List usage logs
  POST /api/usage                   → Log equipment usage

  GET  /api/maintenance             → List maintenance tickets
  POST /api/maintenance             → Create maintenance ticket
  PUT  /api/maintenance/:id         → Update ticket status

  GET  /api/resources               → List learning resources
  POST /api/resources               → Add a resource
  DELETE /api/resources/:id         → Delete a resource

  GET  /api/submissions             → List student submissions
  POST /api/submissions             → Submit a report
  PUT  /api/submissions/:id         → Grade a submission

  GET  /api/attendance              → List attendance records
  POST /api/attendance              → Mark attendance

  GET  /api/bookings                → List equipment bookings
  POST /api/bookings                → Create booking request
  PUT  /api/bookings/:id            → Approve/Reject booking

  GET  /api/announcements           → List announcements
  POST /api/announcements           → Post announcement
  DELETE /api/announcements/:id     → Delete announcement

  GET  /api/analytics               → Dashboard analytics data

  POST /send-email                  → Send custom email
  POST /send-booking-confirmation   → Send booking confirmation email
  POST /send-maintenance-alert      → Send maintenance alert email
  POST /send-usage-report           → Send usage report email

You can test the health endpoint immediately at:
  http://localhost:3002/health

---

## 10. NOTES FOR DEMO / SUBMISSION

### Pre-loaded Demo Data
The system comes with realistic demo data:
  - 8 equipment items across 5 labs
  - 3 lab schedules
  - 4 experiment manuals
  - 3 usage logs
  - 3 maintenance tickets (Open, In-Progress, Resolved)
  - 4 learning resources
  - 3 student submissions (Graded, Pending, Reviewed)
  - 2 attendance records
  - 2 equipment bookings
  - 3 announcements

### Demo Workflow Suggestions

  For Lab In-charge demo:
  1. Login as admin / admin123
  2. Show Dashboard (KPI cards + 4 charts)
  3. Go to Equipment → Add a new equipment
  4. Go to Maintenance → Update ticket to Resolved
  5. Go to Equipment Booking → Approve a pending request
  6. Go to Announcements → Post a new announcement
  7. Go to Reports → Export CSV

  For Faculty demo:
  1. Login as faculty / fac123
  2. Go to Lab Schedule → Book a new lab session
  3. Go to Experiment Manuals → Add a manual
  4. Go to Student Submissions → Grade a submission
  5. Go to Maintenance → Report an issue

  For Student demo:
  1. Login as student / stu123
  2. View Dashboard announcements
  3. Go to Experiment Manuals → Click Download
  4. Go to Submissions → Submit a new report
  5. Go to Equipment Booking → Request equipment

### Key Features to Highlight
  ✓ Role-based access control (3 roles, different permissions)
  ✓ Double-booking prevention for lab schedules
  ✓ Real-time analytics with Chart.js
  ✓ Email notification system (Nodemailer)
  ✓ Input validation on all forms
  ✓ ERP-ready modular architecture
  ✓ RESTful API design
  ✓ Responsive modern UI (Tailwind CSS)
  ✓ Toast notifications for all actions
  ✓ Maintenance auto-alerts for Needs Repair status

---

## QUICK REFERENCE COMMANDS

  Install dependencies:     npm install
  Start server:             node server.js
  Access in browser:        http://localhost:3002
  Health check:             http://localhost:3002/health
  Stop server:              Ctrl + C

---

## SYSTEM REQUIREMENTS SUMMARY

  Node.js:    v14.0 or higher
  npm:        v6.0 or higher
  Browser:    Chrome 90+ / Firefox 88+ / Edge 90+
  Internet:   Required for CDN (Tailwind CSS, Chart.js, Fonts)
  Port:       3002 (configurable via .env)
  OS:         Windows 10+, macOS 10.15+, Ubuntu 18.04+

---

Built as College ERP — Lab Management Module
Architecture: RESTful API | Modular | ERP-ready
Version: 1.0.0
