import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Pool Configuration (using the verified IPv4 pooler connection string)
const dbUri = 'postgresql://postgres.tsrjjqzgqkvhfpeiwula:alhikma%40123@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({
  connectionString: dbUri,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper to map DB snake_case rows to JS camelCase
function toCamel(row) {
  if (!row) return null;
  return {
    id: row.id,
    refNo: row.ref_no,
    name: row.name,
    adhaarCard: row.adhaar_card || '',
    fatherName: row.father_name,
    motherName: row.mother_name,
    age: row.age || '',
    dob: row.dob,
    sex: row.sex,
    house: row.house || '',
    place: row.place || '',
    street: row.street || '',
    post: row.post || '',
    district: row.district,
    pin: row.pin || '',
    email: row.email || '',
    course: row.course,
    registerNo: row.register_no || '',
    monthOfPassing: row.month_of_passing || '',
    yearOfPassing: row.year_of_passing || '',
    percentage: row.percentage ? parseFloat(row.percentage) : '',
    board: row.board || '',
    lastInstitution: row.last_institution || '',
    fatherMobile: row.father_mobile || '',
    motherMobile: row.mother_mobile || '',
    ownMobile: row.own_mobile,
    submittedAt: row.submitted_at,
    admissionNo: row.admission_no || '',
    enrollmentNo: row.enrollment_no || '',
    classAdmitted: row.class_admitted || '',
    dateOfAdmission: row.date_of_admission || '',
    certificatesReceived: row.certificates_received || '',
    admissionFee: row.admission_fee || false,
    miscellaneous: row.miscellaneous || false,
    firstTerm: row.first_term || false,
    secondTerm: row.second_term || false,
    thirdTerm: row.third_term || false
  };
}

// 1. GET ALL ADMISSIONS
app.get('/api/admissions', async (req, res) => {
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
app.get('/api/admissions/:id', async (req, res) => {
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

// 3. CREATE NEW ADMISSION
app.post('/api/admissions', async (req, res) => {
  const data = req.body;
  
  // Basic validation (matches validation in react form)
  if (!data.name?.trim() || !data.fatherName?.trim() || !data.motherName?.trim() || 
      !data.dob || !data.sex || !data.district?.trim() || !data.course?.trim() || 
      !data.ownMobile?.trim()) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO admissions (
      id, ref_no, name, adhaar_card, father_name, mother_name, age, dob, sex,
      house, place, street, post, district, pin, email, course, register_no,
      month_of_passing, year_of_passing, percentage, board, last_institution,
      father_mobile, mother_mobile, own_mobile, submitted_at,
      admission_no, enrollment_no, class_admitted, date_of_admission,
      certificates_received, admission_fee, miscellaneous,
      first_term, second_term, third_term
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24, $25, $26, $27,
      $28, $29, $30, $31, $32, $33, $34, $35, $36, $37
    ) RETURNING *
  `;

  const values = [
    data.id,
    data.refNo,
    data.name.toUpperCase(), // Store name in capitals as requested
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
    
    // Office use fields
    data.admissionNo || '',
    data.enrollmentNo || '',
    data.classAdmitted || '',
    data.dateOfAdmission || '',
    data.certificatesReceived || '',
    data.admissionFee || false,
    data.miscellaneous || false,
    data.firstTerm || false,
    data.secondTerm || false,
    data.thirdTerm || false
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
app.delete('/api/admissions/:id', async (req, res) => {
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
app.put('/api/admissions/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // Basic validation (matches validation in react form)
  if (!data.name?.trim() || !data.fatherName?.trim() || !data.motherName?.trim() || 
      !data.dob || !data.sex || !data.district?.trim() || !data.course?.trim() || 
      !data.ownMobile?.trim()) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    UPDATE admissions SET
      name = $1, adhaar_card = $2, father_name = $3, mother_name = $4, age = $5, dob = $6, sex = $7,
      house = $8, place = $9, street = $10, post = $11, district = $12, pin = $13, email = $14,
      course = $15, register_no = $16, month_of_passing = $17, year_of_passing = $18, percentage = $19,
      board = $20, last_institution = $21, father_mobile = $22, mother_mobile = $23, own_mobile = $24,
      admission_no = $25, enrollment_no = $26, class_admitted = $27, date_of_admission = $28,
      certificates_received = $29, admission_fee = $30, miscellaneous = $31,
      first_term = $32, second_term = $33, third_term = $34
    WHERE id = $35
    RETURNING *
  `;

  const values = [
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
    id
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

// Start server (only if run locally or not on serverless Vercel environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  });
}

export default app;
