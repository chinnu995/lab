// ============================================================
// LAB MANAGEMENT SYSTEM - Backend Server
// College ERP Module | Node.js + Express
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3002;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ─── In-Memory Data Store (acts as DB for demo) ──────────────
const db = {
  users: [
    { id: '1', username: 'admin',   password: 'admin123', role: 'lab-incharge', name: 'Dr. Rajesh Kumar',    email: 'admin@lab.edu',   dept: 'Computer Science' },
    { id: '2', username: 'faculty', password: 'fac123',   role: 'faculty',      name: 'Prof. Anita Sharma',  email: 'faculty@lab.edu', dept: 'Computer Science' },
    { id: '3', username: 'student', password: 'stu123',   role: 'student',      name: 'Rohan Verma',         email: 'student@lab.edu', dept: 'Computer Science', batch: 'CS-2023-A' }
  ],
  equipment: [
    { id: 'EQ001', name: 'Oscilloscope',         lab: 'Electronics Lab',    total: 10, available: 8, condition: 'Good',        lastMaintenance: '2024-10-01', nextMaintenance: '2025-04-01', description: 'Digital oscilloscope 100MHz' },
    { id: 'EQ002', name: 'Function Generator',   lab: 'Electronics Lab',    total: 8,  available: 6, condition: 'Good',        lastMaintenance: '2024-09-15', nextMaintenance: '2025-03-15', description: 'Dual channel function generator' },
    { id: 'EQ003', name: 'Multimeter',           lab: 'Electronics Lab',    total: 20, available: 15,condition: 'Fair',        lastMaintenance: '2024-08-01', nextMaintenance: '2025-02-01', description: 'Digital multimeter' },
    { id: 'EQ004', name: 'Arduino Kit',          lab: 'Embedded Systems Lab',total:15, available: 12,condition: 'Good',        lastMaintenance: '2024-11-01', nextMaintenance: '2025-05-01', description: 'Arduino UNO starter kit' },
    { id: 'EQ005', name: 'Soldering Station',    lab: 'Electronics Lab',    total: 12, available: 9, condition: 'Needs Repair',lastMaintenance: '2024-07-01', nextMaintenance: '2025-01-01', description: 'Temperature controlled soldering station' },
    { id: 'EQ006', name: 'Power Supply (DC)',    lab: 'Physics Lab',        total: 10, available: 10,condition: 'Good',        lastMaintenance: '2024-10-15', nextMaintenance: '2025-04-15', description: 'Variable DC power supply 0-30V' },
    { id: 'EQ007', name: 'Microscope',           lab: 'Biology Lab',        total: 8,  available: 5, condition: 'Fair',        lastMaintenance: '2024-09-01', nextMaintenance: '2025-03-01', description: 'Compound light microscope 1000x' },
    { id: 'EQ008', name: 'Network Switch',       lab: 'Networking Lab',     total: 6,  available: 6, condition: 'Good',        lastMaintenance: '2024-11-15', nextMaintenance: '2025-05-15', description: 'Cisco 24-port managed switch' }
  ],
  schedules: [
    { id: 'SCH001', lab: 'Electronics Lab',    date: '2025-01-20', startTime: '09:00', endTime: '11:00', faculty: 'Prof. Anita Sharma', batch: 'CS-2023-A', purpose: 'Circuit Analysis Experiment', status: 'Confirmed' },
    { id: 'SCH002', lab: 'Networking Lab',     date: '2025-01-20', startTime: '11:00', endTime: '13:00', faculty: 'Prof. Anita Sharma', batch: 'CS-2023-B', purpose: 'TCP/IP Configuration',        status: 'Confirmed' },
    { id: 'SCH003', lab: 'Embedded Systems Lab',date:'2025-01-21', startTime: '14:00', endTime: '16:00', faculty: 'Prof. Anita Sharma', batch: 'CS-2022-A', purpose: 'Arduino Programming',          status: 'Confirmed' }
  ],
  manuals: [
    { id: 'MAN001', title: 'Ohms Law Verification',       subject: 'Electronics',         lab: 'Electronics Lab',     difficulty: 'Beginner',     duration: '2 hours',   description: 'Verify Ohms Law using basic circuit components', createdBy: 'Prof. Anita Sharma', date: '2024-12-01', fileUrl: '#' },
    { id: 'MAN002', title: 'Op-Amp Circuits',             subject: 'Analog Electronics',  lab: 'Electronics Lab',     difficulty: 'Intermediate', duration: '3 hours',   description: 'Design and test operational amplifier circuits',  createdBy: 'Prof. Anita Sharma', date: '2024-12-10', fileUrl: '#' },
    { id: 'MAN003', title: 'Arduino LED Control',         subject: 'Embedded Systems',    lab: 'Embedded Systems Lab',difficulty: 'Beginner',     duration: '2 hours',   description: 'Control LEDs using Arduino GPIO pins',            createdBy: 'Prof. Anita Sharma', date: '2024-12-15', fileUrl: '#' },
    { id: 'MAN004', title: 'Network Packet Analysis',     subject: 'Computer Networks',   lab: 'Networking Lab',      difficulty: 'Advanced',     duration: '4 hours',   description: 'Analyze network packets using Wireshark',         createdBy: 'Prof. Anita Sharma', date: '2024-12-20', fileUrl: '#' }
  ],
  usageLogs: [
    { id: 'USE001', equipment: 'Oscilloscope',     lab: 'Electronics Lab',     usedBy: 'Rohan Verma',  startTime: '2025-01-15 09:00', endTime: '2025-01-15 11:00', purpose: 'Circuit Analysis', quantity: 1, conditionAfter: 'Good' },
    { id: 'USE002', equipment: 'Arduino Kit',      lab: 'Embedded Systems Lab',usedBy: 'Priya Singh',  startTime: '2025-01-16 10:00', endTime: '2025-01-16 12:00', purpose: 'LED Project',      quantity: 2, conditionAfter: 'Good' },
    { id: 'USE003', equipment: 'Multimeter',       lab: 'Electronics Lab',     usedBy: 'Amit Kumar',   startTime: '2025-01-17 14:00', endTime: '2025-01-17 15:30', purpose: 'Voltage Testing',  quantity: 3, conditionAfter: 'Fair' }
  ],
  maintenance: [
    { id: 'MAINT001', equipment: 'Soldering Station', lab: 'Electronics Lab', issue: 'Temperature control not working properly', priority: 'High',   status: 'Open',        reportedBy: 'Prof. Anita Sharma', reportedDate: '2025-01-10', resolvedDate: null },
    { id: 'MAINT002', equipment: 'Multimeter',        lab: 'Electronics Lab', issue: 'Display flickering on two units',          priority: 'Medium', status: 'In-Progress', reportedBy: 'Prof. Anita Sharma', reportedDate: '2025-01-12', resolvedDate: null },
    { id: 'MAINT003', equipment: 'Microscope',        lab: 'Biology Lab',     issue: 'Lens cleaning required',                   priority: 'Low',    status: 'Resolved',    reportedBy: 'Dr. Rajesh Kumar',   reportedDate: '2025-01-05', resolvedDate: '2025-01-08' }
  ],
  resources: [
    { id: 'RES001', title: 'Introduction to Digital Electronics',  type: 'PDF',   subject: 'Electronics',    lab: 'Electronics Lab',     uploadedBy: 'Prof. Anita Sharma', date: '2024-12-01', fileUrl: '#', size: '2.4 MB' },
    { id: 'RES002', title: 'Arduino Programming Tutorial',         type: 'Video', subject: 'Embedded Systems',lab: 'Embedded Systems Lab', uploadedBy: 'Prof. Anita Sharma', date: '2024-12-10', fileUrl: '#', size: '45 MB' },
    { id: 'RES003', title: 'Network Protocols Reference Guide',    type: 'PDF',   subject: 'Networking',      lab: 'Networking Lab',       uploadedBy: 'Prof. Anita Sharma', date: '2024-12-15', fileUrl: '#', size: '1.8 MB' },
    { id: 'RES004', title: 'VLSI Design Notes',                    type: 'Notes', subject: 'VLSI',            lab: 'Electronics Lab',      uploadedBy: 'Prof. Anita Sharma', date: '2024-12-20', fileUrl: '#', size: '560 KB' }
  ],
  submissions: [
    { id: 'SUB001', studentName: 'Rohan Verma',  batch: 'CS-2023-A', experiment: 'Ohms Law Verification',  submittedDate: '2025-01-15', status: 'Graded',   grade: 'A',  comments: 'Excellent work and detailed observation.' },
    { id: 'SUB002', studentName: 'Priya Singh',  batch: 'CS-2023-A', experiment: 'Op-Amp Circuits',        submittedDate: '2025-01-16', status: 'Pending',  grade: null, comments: '' },
    { id: 'SUB003', studentName: 'Amit Kumar',   batch: 'CS-2023-B', experiment: 'Arduino LED Control',    submittedDate: '2025-01-17', status: 'Reviewed', grade: 'B+', comments: 'Good but needs better documentation.' }
  ],
  attendance: [
    { id: 'ATT001', date: '2025-01-20', lab: 'Electronics Lab',    batch: 'CS-2023-A', faculty: 'Prof. Anita Sharma', totalStudents: 30, present: 27, absent: 3, absentees: ['Rohan Verma','Priya Singh','Amit Kumar'] },
    { id: 'ATT002', date: '2025-01-21', lab: 'Embedded Systems Lab',batch: 'CS-2022-A',faculty: 'Prof. Anita Sharma', totalStudents: 28, present: 25, absent: 3, absentees: ['Student A','Student B','Student C'] }
  ],
  bookings: [
    { id: 'BOOK001', studentName: 'Rohan Verma', batch: 'CS-2023-A', equipment: 'Oscilloscope', lab: 'Electronics Lab', date: '2025-01-22', startTime: '10:00', endTime: '12:00', purpose: 'Project work', status: 'Pending',  requestedDate: '2025-01-18' },
    { id: 'BOOK002', studentName: 'Priya Singh', batch: 'CS-2023-A', equipment: 'Arduino Kit',  lab: 'Embedded Systems Lab',date:'2025-01-23',startTime: '14:00', endTime: '16:00', purpose: 'Mini project',  status: 'Approved', requestedDate: '2025-01-17' }
  ],
  announcements: [
    { id: 'ANN001', title: 'Lab Safety Orientation',          content: 'All students must attend the mandatory lab safety orientation on January 25th at 10:00 AM in Electronics Lab. Attendance is compulsory.',    priority: 'High',   postedBy: 'Dr. Rajesh Kumar', date: '2025-01-15', targetAudience: 'All' },
    { id: 'ANN002', title: 'Electronics Lab Closed on Jan 26', content: 'Electronics Lab will remain closed on Republic Day (January 26th). All scheduled sessions have been rescheduled.',                       priority: 'Medium', postedBy: 'Dr. Rajesh Kumar', date: '2025-01-14', targetAudience: 'All' },
    { id: 'ANN003', title: 'New Equipment Available',          content: 'Five new Arduino UNO kits and two Raspberry Pi 4 kits have been added to the Embedded Systems Lab inventory.',                             priority: 'Low',    postedBy: 'Dr. Rajesh Kumar', date: '2025-01-13', targetAudience: 'Faculty' }
  ],
  passwordResets: {}
};

// ─── Email Transporter ────────────────────────────────────────
let transporter = null;
try {
  if (process.env.LAB_EMAIL && process.env.LAB_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.LAB_EMAIL, pass: process.env.LAB_PASSWORD }
    });
  }
} catch (e) {
  console.log('[Email] Transporter not configured. Emails will be logged only.');
}

async function sendEmail(to, subject, html) {
  if (!transporter) {
    console.log(`[EMAIL STUB] To: ${to} | Subject: ${subject}`);
    return { success: true, stub: true };
  }
  try {
    await transporter.sendMail({ from: process.env.LAB_EMAIL, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error('[Email Error]', err.message);
    return { success: false, error: err.message };
  }
}

// ─── Helper ───────────────────────────────────────────────────
function success(res, data, msg = 'Success') {
  res.json({ success: true, message: msg, data });
}
function failure(res, msg, code = 400) {
  res.status(code).json({ success: false, message: msg });
}

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', server: 'Lab Management System', port: PORT, timestamp: new Date().toISOString() });
});

// ─── Serve Frontend ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── AUTH ─────────────────────────────────────────────────────
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return failure(res, 'Username and password are required.');
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) return failure(res, 'Incorrect username or password.', 401);
    const { password: _, ...safeUser } = user;
    success(res, safeUser, 'Login successful.');
  } catch (e) { failure(res, 'Server error. Please try again later.', 500); }
});

app.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return failure(res, 'Email is required.');
    const user = db.users.find(u => u.email === email);
    if (!user) return failure(res, 'No account found with this email.');
    const token = uuidv4();
    db.passwordResets[token] = { userId: user.id, expires: Date.now() + 3600000 };
    sendEmail(email, 'Lab Management System – Password Reset', `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>Your password reset token is: <strong>${token}</strong></p>
      <p>This expires in 1 hour.</p>`);
    success(res, { token }, 'Reset link sent to email.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/reset-password', (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return failure(res, 'Token and new password required.');
    const reset = db.passwordResets[token];
    if (!reset || Date.now() > reset.expires) return failure(res, 'Invalid or expired token.');
    const user = db.users.find(u => u.id === reset.userId);
    if (!user) return failure(res, 'User not found.');
    user.password = newPassword;
    delete db.passwordResets[token];
    success(res, null, 'Password reset successfully.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── EQUIPMENT ────────────────────────────────────────────────
app.get('/api/equipment', (req, res) => {
  try { success(res, db.equipment); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/equipment', (req, res) => {
  try {
    const { name, lab, total, available, condition, lastMaintenance, nextMaintenance, description } = req.body;
    if (!name || !lab || total === undefined) return failure(res, 'Name, lab and total quantity are required.');
    const eq = { id: 'EQ' + String(db.equipment.length + 1).padStart(3, '0'), name, lab, total: parseInt(total), available: parseInt(available) || parseInt(total), condition: condition || 'Good', lastMaintenance: lastMaintenance || '', nextMaintenance: nextMaintenance || '', description: description || '' };
    db.equipment.push(eq);
    if (eq.condition === 'Needs Repair') {
      sendEmail(process.env.ADMIN_EMAIL || 'admin@lab.edu', 'Maintenance Alert', `<h3>Equipment Needs Repair</h3><p><strong>${eq.name}</strong> in ${eq.lab} has been marked as Needs Repair.</p>`);
    }
    success(res, eq, 'Equipment added successfully.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.put('/api/equipment/:id', (req, res) => {
  try {
    const idx = db.equipment.findIndex(e => e.id === req.params.id);
    if (idx === -1) return failure(res, 'Equipment not found.', 404);
    const prev = db.equipment[idx];
    db.equipment[idx] = { ...prev, ...req.body, id: prev.id };
    if (req.body.condition === 'Needs Repair' && prev.condition !== 'Needs Repair') {
      sendEmail(process.env.ADMIN_EMAIL || 'admin@lab.edu', 'Maintenance Alert', `<h3>Equipment Now Needs Repair</h3><p><strong>${db.equipment[idx].name}</strong> in ${db.equipment[idx].lab} condition changed to Needs Repair.</p>`);
    }
    success(res, db.equipment[idx], 'Equipment updated.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.delete('/api/equipment/:id', (req, res) => {
  try {
    const idx = db.equipment.findIndex(e => e.id === req.params.id);
    if (idx === -1) return failure(res, 'Equipment not found.', 404);
    db.equipment.splice(idx, 1);
    success(res, null, 'Equipment deleted.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── SCHEDULES ────────────────────────────────────────────────
app.get('/api/schedules', (req, res) => {
  try { success(res, db.schedules); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/schedules', (req, res) => {
  try {
    const { lab, date, startTime, endTime, faculty, batch, purpose } = req.body;
    if (!lab || !date || !startTime || !endTime || !faculty || !batch) return failure(res, 'All schedule fields are required.');
    const conflict = db.schedules.find(s => s.lab === lab && s.date === date && !(endTime <= s.startTime || startTime >= s.endTime));
    if (conflict) return failure(res, `Lab "${lab}" is already booked from ${conflict.startTime} to ${conflict.endTime} on ${date}.`);
    const s = { id: 'SCH' + String(db.schedules.length + 1).padStart(3, '0'), lab, date, startTime, endTime, faculty, batch, purpose: purpose || '', status: 'Confirmed' };
    db.schedules.push(s);
    sendEmail(process.env.ADMIN_EMAIL || 'admin@lab.edu', 'Lab Booking Confirmation', `<h3>Lab Booked</h3><p><strong>${lab}</strong> on ${date} from ${startTime} to ${endTime} by ${faculty} for batch ${batch}.</p>`);
    success(res, s, 'Schedule added successfully.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.delete('/api/schedules/:id', (req, res) => {
  try {
    const idx = db.schedules.findIndex(s => s.id === req.params.id);
    if (idx === -1) return failure(res, 'Schedule not found.', 404);
    db.schedules.splice(idx, 1);
    success(res, null, 'Schedule deleted.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── MANUALS ─────────────────────────────────────────────────
app.get('/api/manuals', (req, res) => {
  try { success(res, db.manuals); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/manuals', (req, res) => {
  try {
    const { title, subject, lab, difficulty, duration, description, createdBy } = req.body;
    if (!title || !subject || !lab) return failure(res, 'Title, subject and lab are required.');
    const m = { id: 'MAN' + String(db.manuals.length + 1).padStart(3, '0'), title, subject, lab, difficulty: difficulty || 'Beginner', duration: duration || '2 hours', description: description || '', createdBy: createdBy || 'Faculty', date: new Date().toISOString().split('T')[0], fileUrl: '#' };
    db.manuals.push(m);
    success(res, m, 'Manual added successfully.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.delete('/api/manuals/:id', (req, res) => {
  try {
    const idx = db.manuals.findIndex(m => m.id === req.params.id);
    if (idx === -1) return failure(res, 'Manual not found.', 404);
    db.manuals.splice(idx, 1);
    success(res, null, 'Manual deleted.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── USAGE LOGS ───────────────────────────────────────────────
app.get('/api/usage', (req, res) => {
  try { success(res, db.usageLogs); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/usage', (req, res) => {
  try {
    const { equipment, lab, usedBy, startTime, endTime, purpose, quantity, conditionAfter } = req.body;
    if (!equipment || !usedBy || !startTime) return failure(res, 'Equipment, user and start time are required.');
    const log = { id: 'USE' + String(db.usageLogs.length + 1).padStart(3, '0'), equipment, lab: lab || '', usedBy, startTime, endTime: endTime || '', purpose: purpose || '', quantity: parseInt(quantity) || 1, conditionAfter: conditionAfter || 'Good' };
    db.usageLogs.push(log);
    success(res, log, 'Usage logged.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── MAINTENANCE ─────────────────────────────────────────────
app.get('/api/maintenance', (req, res) => {
  try { success(res, db.maintenance); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/maintenance', (req, res) => {
  try {
    const { equipment, lab, issue, priority, reportedBy } = req.body;
    if (!equipment || !issue || !reportedBy) return failure(res, 'Equipment, issue and reporter are required.');
    const m = { id: 'MAINT' + String(db.maintenance.length + 1).padStart(3, '0'), equipment, lab: lab || '', issue, priority: priority || 'Medium', status: 'Open', reportedBy, reportedDate: new Date().toISOString().split('T')[0], resolvedDate: null };
    db.maintenance.push(m);
    sendEmail(process.env.ADMIN_EMAIL || 'admin@lab.edu', 'Maintenance Alert – New Ticket', `<h3>New Maintenance Ticket</h3><p><strong>${equipment}</strong> in ${lab}: ${issue}</p><p>Priority: ${priority}</p><p>Reported by: ${reportedBy}</p>`);
    success(res, m, 'Maintenance ticket created.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.put('/api/maintenance/:id', (req, res) => {
  try {
    const idx = db.maintenance.findIndex(m => m.id === req.params.id);
    if (idx === -1) return failure(res, 'Ticket not found.', 404);
    db.maintenance[idx] = { ...db.maintenance[idx], ...req.body };
    if (req.body.status === 'Resolved') db.maintenance[idx].resolvedDate = new Date().toISOString().split('T')[0];
    success(res, db.maintenance[idx], 'Ticket updated.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── RESOURCES ───────────────────────────────────────────────
app.get('/api/resources', (req, res) => {
  try { success(res, db.resources); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/resources', (req, res) => {
  try {
    const { title, type, subject, lab, uploadedBy, size } = req.body;
    if (!title || !subject) return failure(res, 'Title and subject are required.');
    const r = { id: 'RES' + String(db.resources.length + 1).padStart(3, '0'), title, type: type || 'PDF', subject, lab: lab || '', uploadedBy: uploadedBy || 'Faculty', date: new Date().toISOString().split('T')[0], fileUrl: '#', size: size || 'N/A' };
    db.resources.push(r);
    success(res, r, 'Resource added.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.delete('/api/resources/:id', (req, res) => {
  try {
    const idx = db.resources.findIndex(r => r.id === req.params.id);
    if (idx === -1) return failure(res, 'Resource not found.', 404);
    db.resources.splice(idx, 1);
    success(res, null, 'Resource deleted.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── SUBMISSIONS ─────────────────────────────────────────────
app.get('/api/submissions', (req, res) => {
  try { success(res, db.submissions); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/submissions', (req, res) => {
  try {
    const { studentName, batch, experiment } = req.body;
    if (!studentName || !experiment) return failure(res, 'Student name and experiment are required.');
    const s = { id: 'SUB' + String(db.submissions.length + 1).padStart(3, '0'), studentName, batch: batch || '', experiment, submittedDate: new Date().toISOString().split('T')[0], status: 'Pending', grade: null, comments: '' };
    db.submissions.push(s);
    success(res, s, 'Submission uploaded.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.put('/api/submissions/:id', (req, res) => {
  try {
    const idx = db.submissions.findIndex(s => s.id === req.params.id);
    if (idx === -1) return failure(res, 'Submission not found.', 404);
    db.submissions[idx] = { ...db.submissions[idx], ...req.body };
    success(res, db.submissions[idx], 'Submission updated.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── ATTENDANCE ──────────────────────────────────────────────
app.get('/api/attendance', (req, res) => {
  try { success(res, db.attendance); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/attendance', (req, res) => {
  try {
    const { date, lab, batch, faculty, totalStudents, present, absent, absentees } = req.body;
    if (!date || !lab || !batch) return failure(res, 'Date, lab and batch are required.');
    const a = { id: 'ATT' + String(db.attendance.length + 1).padStart(3, '0'), date, lab, batch, faculty: faculty || '', totalStudents: parseInt(totalStudents) || 0, present: parseInt(present) || 0, absent: parseInt(absent) || 0, absentees: absentees || [] };
    db.attendance.push(a);
    success(res, a, 'Attendance recorded.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── BOOKINGS ────────────────────────────────────────────────
app.get('/api/bookings', (req, res) => {
  try { success(res, db.bookings); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/bookings', (req, res) => {
  try {
    const { studentName, batch, equipment, lab, date, startTime, endTime, purpose } = req.body;
    if (!studentName || !equipment || !date) return failure(res, 'Student name, equipment and date are required.');
    const b = { id: 'BOOK' + String(db.bookings.length + 1).padStart(3, '0'), studentName, batch: batch || '', equipment, lab: lab || '', date, startTime: startTime || '', endTime: endTime || '', purpose: purpose || '', status: 'Pending', requestedDate: new Date().toISOString().split('T')[0] };
    db.bookings.push(b);
    success(res, b, 'Booking request submitted.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.put('/api/bookings/:id', (req, res) => {
  try {
    const idx = db.bookings.findIndex(b => b.id === req.params.id);
    if (idx === -1) return failure(res, 'Booking not found.', 404);
    db.bookings[idx] = { ...db.bookings[idx], ...req.body };
    if (req.body.status === 'Approved') {
      sendEmail(process.env.ADMIN_EMAIL || 'admin@lab.edu', 'Booking Approved', `<h3>Equipment Booking Approved</h3><p>${db.bookings[idx].studentName}'s request for <strong>${db.bookings[idx].equipment}</strong> on ${db.bookings[idx].date} has been approved.</p>`);
    }
    success(res, db.bookings[idx], 'Booking updated.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── ANNOUNCEMENTS ───────────────────────────────────────────
app.get('/api/announcements', (req, res) => {
  try { success(res, db.announcements); }
  catch (e) { failure(res, 'Server error.', 500); }
});

app.post('/api/announcements', (req, res) => {
  try {
    const { title, content, priority, postedBy, targetAudience } = req.body;
    if (!title || !content) return failure(res, 'Title and content are required.');
    const a = { id: 'ANN' + String(db.announcements.length + 1).padStart(3, '0'), title, content, priority: priority || 'Medium', postedBy: postedBy || 'Admin', date: new Date().toISOString().split('T')[0], targetAudience: targetAudience || 'All' };
    db.announcements.push(a);
    success(res, a, 'Announcement posted.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

app.delete('/api/announcements/:id', (req, res) => {
  try {
    const idx = db.announcements.findIndex(a => a.id === req.params.id);
    if (idx === -1) return failure(res, 'Announcement not found.', 404);
    db.announcements.splice(idx, 1);
    success(res, null, 'Announcement deleted.');
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── ANALYTICS / REPORTS ─────────────────────────────────────
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = {
      summary: {
        totalLabs: [...new Set(db.equipment.map(e => e.lab))].length,
        totalEquipment: db.equipment.length,
        openMaintenanceTickets: db.maintenance.filter(m => m.status !== 'Resolved').length,
        todaysBookings: db.schedules.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
        equipmentNeedsRepair: db.equipment.filter(e => e.condition === 'Needs Repair').length,
        availableLabs: [...new Set(db.equipment.map(e => e.lab))].length
      },
      labUtilization: (() => {
        const labs = [...new Set(db.schedules.map(s => s.lab))];
        return labs.map(lab => ({ lab, sessions: db.schedules.filter(s => s.lab === lab).length }));
      })(),
      equipmentCondition: {
        Good: db.equipment.filter(e => e.condition === 'Good').length,
        Fair: db.equipment.filter(e => e.condition === 'Fair').length,
        NeedsRepair: db.equipment.filter(e => e.condition === 'Needs Repair').length
      },
      maintenanceTrend: [
        { month: 'Sep', count: 2 }, { month: 'Oct', count: 3 }, { month: 'Nov', count: 1 },
        { month: 'Dec', count: 4 }, { month: 'Jan', count: db.maintenance.length }
      ],
      usageByLab: (() => {
        const labs = [...new Set(db.usageLogs.map(u => u.lab))];
        return labs.map(lab => ({ lab, usages: db.usageLogs.filter(u => u.lab === lab).length }));
      })()
    };
    success(res, analytics);
  } catch (e) { failure(res, 'Server error.', 500); }
});

// ─── EMAIL ENDPOINTS ─────────────────────────────────────────
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject) return failure(res, 'Recipient and subject required.');
    const result = await sendEmail(to, subject, body || '');
    success(res, result, 'Email sent.');
  } catch (e) { failure(res, 'Email send failed.', 500); }
});

app.post('/send-booking-confirmation', async (req, res) => {
  try {
    const { to, bookingDetails } = req.body;
    const html = `<h2>Lab Booking Confirmation</h2><pre>${JSON.stringify(bookingDetails, null, 2)}</pre>`;
    const result = await sendEmail(to, 'Lab Booking Confirmed', html);
    success(res, result, 'Booking confirmation sent.');
  } catch (e) { failure(res, 'Failed.', 500); }
});

app.post('/send-maintenance-alert', async (req, res) => {
  try {
    const { to, details } = req.body;
    const html = `<h2>Maintenance Alert</h2><pre>${JSON.stringify(details, null, 2)}</pre>`;
    const result = await sendEmail(to, 'Maintenance Alert', html);
    success(res, result, 'Alert sent.');
  } catch (e) { failure(res, 'Failed.', 500); }
});

app.post('/send-usage-report', async (req, res) => {
  try {
    const { to } = req.body;
    const html = `<h2>Usage Report</h2><p>Total logs: ${db.usageLogs.length}</p>`;
    const result = await sendEmail(to, 'Lab Usage Report', html);
    success(res, result, 'Report sent.');
  } catch (e) { failure(res, 'Failed.', 500); }
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.message);
  res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║       LAB MANAGEMENT SYSTEM — ERP Module         ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Server running at: http://localhost:${PORT}        ║`);
  console.log('║  Open your browser and go to the URL above.      ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log('║  Test Logins:                                     ║');
  console.log('║    Admin:   admin   / admin123                    ║');
  console.log('║    Faculty: faculty / fac123                      ║');
  console.log('║    Student: student / stu123                      ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});
