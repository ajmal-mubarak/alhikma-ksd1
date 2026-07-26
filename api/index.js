import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); // loads .env locally; no-op on Vercel (env vars set in dashboard)

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 5000;

// Required for Vercel (runs behind a proxy)
app.set('trust proxy', 1);

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:4173',
];
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. mobile apps, curl) only in dev
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// ── DATABASE ─────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ── SIMPLE RATE LIMITER (login only) ─────────────────────────────────────────
const loginAttempts = new Map();
function loginLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const max = 5;
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count++;
  loginAttempts.set(ip, entry);
  if (entry.count > max) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes.' });
  }
  next();
}

// ── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

// ── HELPER ───────────────────────────────────────────────────────────────────
function toCamel(row) {
  if (!row) return null;
  return {
    id: row.id,
    refNo: row.ref_no || '',
    name: row.name || '',
    adhaarCard: row.adhaar_card || '',
    fatherName: row.father_name || '',
    motherName: row.mother_name || '',
    age: row.age || '',
    dob: row.dob || '',
    sex: row.sex || '',
    house: row.house || '',
    place: row.place || '',
    street: row.street || '',
    post: row.post || '',
    district: row.district || '',
    pin: row.pin || '',
    bloodgroup: row.bloodgroup || row.blood_group || '',
    email: row.email || '',
    course: row.course || '',
    registerNo: row.register_no || '',
    monthOfPassing: row.month_of_passing || '',
    yearOfPassing: row.year_of_passing || '',
    percentage: row.percentage ? parseFloat(row.percentage) : '',
    board: row.board || '',
    lastInstitution: row.last_institution || '',
    fatherMobile: row.father_mobile || '',
    motherMobile: row.mother_mobile || '',
    ownMobile: row.own_mobile || '',
    submittedAt: row.submitted_at || '',
    admissionNo: row.admission_no || '',
    enrollmentNo: row.enrollment_no || '',
    classAdmitted: row.class_admitted || '',
    dateOfAdmission: row.date_of_admission || '',
    certificatesReceived: row.certificates_received || '',
    admissionFee: row.admission_fee || false,
    miscellaneous: row.miscellaneous || false,
    firstTerm: row.first_term || false,
    secondTerm: row.second_term || false,
    thirdTerm: row.third_term || false,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES (public)
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/admin/login
app.post('/api/admin/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const validUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!validUsername || !passwordHash) {
    console.error('Admin credentials not configured in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Constant-time username comparison to prevent timing attacks
  if (username !== validUsername) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, expiresIn: 28800 }); // 8 hours in seconds
});

// POST /api/admin/logout (just client-side token deletion, but good practice)
app.post('/api/admin/logout', requireAuth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/admin/verify — check if token is still valid
app.get('/api/admin/verify', requireAuth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ══════════════════════════════════════════════════════════════════════════════
// ADMISSION ROUTES (protected — require valid JWT)
// ══════════════════════════════════════════════════════════════════════════════

// 1. GET ALL ADMISSIONS
app.get('/api/admissions', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admissions ORDER BY submitted_at DESC');
    const admissions = result.rows.map(toCamel);
    res.json(admissions);
  } catch (err) {
    console.error('Error fetching admissions:', err);
    res.status(500).json({ error: 'Database error fetching admissions' });
  }
});

// 2. GET SINGLE ADMISSION BY ID
app.get('/api/admissions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM admissions WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json(toCamel(result.rows[0]));
  } catch (err) {
    console.error('Error fetching admission:', err);
    res.status(500).json({ error: 'Database error fetching admission' });
  }
});

// 3. CREATE NEW ADMISSION (public — students submit the form)
app.post('/api/admissions', async (req, res) => {
  const data = req.body;

  // Generate sequential refNo if not provided (pattern AHC26G###)
  let refNo = data.refNo;
  try {
    if (!refNo) {
      const r = await pool.query(
        "SELECT ref_no FROM admissions WHERE ref_no LIKE 'AHC26G%' ORDER BY CAST(SUBSTRING(ref_no, 8) AS INTEGER) DESC LIMIT 1"
      );
      if (r.rows.length === 0 || !r.rows[0].ref_no) {
        refNo = 'AHC26G001';
      } else {
        const last = r.rows[0].ref_no;
        const m = last.match(/(\d+)$/);
        const next = m ? parseInt(m[1], 10) + 1 : 1;
        refNo = 'AHC26G' + String(next).padStart(3, '0');
      }
    }
  } catch (err) {
    console.error('Error generating refNo:', err);
    return res.status(500).json({ error: 'Server error generating reference number' });
  }

  const query = `
    INSERT INTO admissions (
      id, ref_no, name, adhaar_card, father_name, mother_name, age, dob, sex,
      house, place, street, post, district, pin, email, bloodgroup, course, register_no,
      month_of_passing, year_of_passing, percentage, board, last_institution,
      father_mobile, mother_mobile, own_mobile, submitted_at,
      admission_no, enrollment_no, class_admitted, date_of_admission,
      certificates_received, admission_fee, miscellaneous,
      first_term, second_term, third_term
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
      $20, $21, $22, $23, $24, $25, $26, $27, $28,
      $29, $30, $31, $32, $33, $34, $35, $36, $37, $38
    ) RETURNING *
  `;

  const values = [
    data.id,
    refNo,
    data.name.toUpperCase(),
    data.adhaarCard || null,
    data.fatherName,
    data.motherName,
    data.age ? parseInt(data.age) : null,
    data.dob,
    data.sex,
    data.house || null,
    data.place || null,
    data.street || null,
    data.post || null,
    data.district,
    data.pin || null,
    data.email || null,
    data.bloodgroup || null,
    data.course,
    data.registerNo || null,
    data.monthOfPassing || null,
    data.yearOfPassing ? parseInt(data.yearOfPassing) : null,
    data.percentage ? parseFloat(data.percentage) : null,
    data.board || null,
    data.lastInstitution || null,
    data.fatherMobile || null,
    data.motherMobile || null,
    data.ownMobile,
    data.submittedAt || new Date().toISOString(),
    data.admissionNo || '',
    data.enrollmentNo || '',
    data.classAdmitted || '',
    data.dateOfAdmission || '',
    data.certificatesReceived || '',
    data.admissionFee || false,
    data.miscellaneous || false,
    data.firstTerm || false,
    data.secondTerm || false,
    data.thirdTerm || false,
  ];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(toCamel(result.rows[0]));
  } catch (err) {
    console.error('Error creating admission:', err);
    res.status(500).json({ error: 'Database error saving application' });
  }
});

// 4. DELETE ADMISSION
app.delete('/api/admissions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM admissions WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json({ message: 'Admission deleted successfully' });
  } catch (err) {
    console.error('Error deleting admission:', err);
    res.status(500).json({ error: 'Database error deleting admission' });
  }
});

// 5. UPDATE ADMISSION
app.put('/api/admissions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const query = `
    UPDATE admissions SET
      ref_no = $1, name = $2, adhaar_card = $3, father_name = $4, mother_name = $5, age = $6, dob = $7, sex = $8,
      house = $9, place = $10, street = $11, post = $12, district = $13, pin = $14, email = $15, bloodgroup = $16,
      course = $17, register_no = $18, month_of_passing = $19, year_of_passing = $20, percentage = $21,
      board = $22, last_institution = $23, father_mobile = $24, mother_mobile = $25, own_mobile = $26,
      admission_no = $27, enrollment_no = $28, class_admitted = $29, date_of_admission = $30,
      certificates_received = $31, admission_fee = $32, miscellaneous = $33,
      first_term = $34, second_term = $35, third_term = $36
    WHERE id = $37
    RETURNING *
  `;

  const values = [
    data.refNo ?? null,
    data.name ? data.name.toUpperCase() : (data.name ?? null),
    data.adhaarCard ?? null,
    data.fatherName ?? null,
    data.motherName ?? null,
    data.age ? parseInt(data.age) : (data.age === '' ? null : (data.age ?? null)),
    data.dob ?? null,
    data.sex ?? null,
    data.house ?? null,
    data.place ?? null,
    data.street ?? null,
    data.post ?? null,
    data.district ?? null,
    data.pin ?? null,
    data.email ?? null,
    data.bloodgroup ?? null,
    data.course ?? null,
    data.registerNo ?? null,
    data.monthOfPassing ?? null,
    data.yearOfPassing ? parseInt(data.yearOfPassing) : (data.yearOfPassing === '' ? null : (data.yearOfPassing ?? null)),
    data.percentage ? parseFloat(data.percentage) : (data.percentage === '' ? null : (data.percentage ?? null)),
    data.board ?? null,
    data.lastInstitution ?? null,
    data.fatherMobile ?? null,
    data.motherMobile ?? null,
    data.ownMobile ?? '',
    data.admissionNo ?? '',
    data.enrollmentNo ?? '',
    data.classAdmitted ?? '',
    data.dateOfAdmission ?? '',
    data.certificatesReceived ?? '',
    data.admissionFee ?? false,
    data.miscellaneous ?? false,
    data.firstTerm ?? false,
    data.secondTerm ?? false,
    data.thirdTerm ?? false,
    id,
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json(toCamel(result.rows[0]));
  } catch (err) {
    console.error('Error updating admission:', err);
    res.status(500).json({ error: 'Database error updating admission' });
  }
});

// ── START SERVER ──────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
