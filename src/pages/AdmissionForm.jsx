import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialForm = {
  name: '',
  adhaarCard: '',
  fatherName: '',
  motherName: '',
  age: '',
  dob: '',
  sex: '',
  house: '',
  place: '',
  street: '',
  post: '',
  district: '',
  pin: '',
  bloodgroup: '',
  email: '',
  course: '',
  registerNo: '',
  monthOfPassing: '',
  yearOfPassing: '',
  percentage: '',
  board: '',
  lastInstitution: '',
  fatherMobile: '',
  motherMobile: '',
  ownMobile: '',
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
]

function validateForm(data) {
  const errors = {}

  // Required fields: name and father's name only
  if (!data.name || !data.name.trim()) errors.name = 'Name is required'
  if (!data.fatherName || !data.fatherName.trim()) errors.fatherName = "Father's name is required"

  // Format validations (only run when a field is provided)
  if (data.ownMobile && data.ownMobile.trim() && !/^\d{10}$/.test(data.ownMobile.trim())) {
    errors.ownMobile = 'Enter valid 10-digit number'
  }
  if (data.fatherMobile && data.fatherMobile.trim() && !/^\d{10}$/.test(data.fatherMobile.trim())) {
    errors.fatherMobile = 'Enter valid 10-digit number'
  }
  if (data.motherMobile && data.motherMobile.trim() && !/^\d{10}$/.test(data.motherMobile.trim())) {
    errors.motherMobile = 'Enter valid 10-digit number'
  }
  if (data.pin && data.pin.trim() && !/^\d{6}$/.test(data.pin.trim())) {
    errors.pin = 'Enter valid 6-digit PIN code'
  }
  if (data.email && data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Enter valid email address'
  }
  if (data.adhaarCard && data.adhaarCard.trim()) {
    const adhaarClean = data.adhaarCard.replace(/\s+/g, '');
    if (!/^\d{12}$/.test(adhaarClean)) {
      errors.adhaarCard = 'Enter valid 12-digit Adhaar Card number'
    }
  }

  return errors
}

export default function AdmissionForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [refNo, setRefNo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Example / format hints shown under each input
  const helperHints = {
    name: 'ENTER FULL NAME IN CAPITALS',
    adhaarCard: 'XXXX XXXX XXXX',
    fatherName: "Father's full name",
    motherName: "Mother's full name",
    age: 'Age in years (10-60)',
    dob: 'dd/mm/yyyy',
    sex: 'Select Male or Female',
    house: 'House name / number',
    place: 'Place',
    street: 'Street',
    post: 'Post office',
    district: 'District',
    pin: '6-digit PIN',
    bloodgroup: 'Blood Group (e.g. O+ve,A-ve,B+ve,AB+ve)',
    email: 'example@email.com',
    course: 'e.g. Plus Two, Degree',
    registerNo: 'Exam register number',
    monthOfPassing: 'Select month',
    yearOfPassing: 'e.g. 2024',
    percentage: 'e.g. 85.5',
    board: 'e.g. CBSE, State Board',
    lastInstitution: 'Name of school / college',
    fatherMobile: '10-digit number',
    motherMobile: '10-digit number',
    ownMobile: '10-digit number',
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    // If every field is empty, block submission and show message
    const anyFilled = Object.values(form).some(v => String(v || '').trim() !== '')
    if (!anyFilled) {
      setSubmitError('Nothing to submit — please fill Name And Fathers Name.')
      return
    }
    const errs = validateForm(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErr = document.querySelector('.error')
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmitting(true)
    const submission = {
      ...form,
      id: Date.now().toString(),
      // Do not set refNo here; backend will generate AHC26G### when missing
      submittedAt: new Date().toISOString(),
      // Office use fields (blank at submission time)
      admissionNo: '',
      enrollmentNo: '',
      classAdmitted: '',
      dateOfAdmission: '',
      certificatesReceived: '',
      admissionFee: false,
      miscellaneous: false,
      firstTerm: false,
      secondTerm: false,
      thirdTerm: false,
    }

    try {
      const headers = { 'Content-Type': 'application/json' }
      if (anyFilled) headers['X-Allow-Partial'] = 'true'

      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers,
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit application');
      }

      const saved = await response.json()
      // use server-generated refNo (AHC26G###)
      setRefNo(saved.refNo || '')
      setSubmitted(true)
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Server error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleNewForm = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(false)
    setRefNo('')
    setSubmitError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fieldClass = (name) => `form-group${errors[name] ? ' error' : ''}`

  if (submitted) {
    return (
      <div className="page-wrapper">
        <header className="header-bar">
          <div className="header-logo-area">
            <div className="header-emblem">
              <img src="/logo.png" alt="Al Hikma" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
            </div>
            <div className="header-text">
              <h1>Al Hikma Women's College</h1>
              <p>Indira Nagar, Kasaragod — Admission Portal 2026</p>
            </div>
          </div>
        </header>
        <div className="form-page-content">
          <div className="form-card fade-in">
            <div className="success-overlay">
              <div className="success-icon">✓</div>
              <h2>Application Submitted!</h2>
              <p>Your admission application has been received successfully.</p>
              <p style={{ marginTop: 6, color: '#888', fontSize: '0.88rem' }}>
                Submitted on {new Date().toLocaleDateString('en-IN-u-nu-latn', { dateStyle: 'long' })}
              </p>
              <div className="success-ref">{refNo}</div>
              <p style={{ marginTop: 12, fontSize: '0.85rem', color: '#999' }}>
                Please note your reference number for future correspondence.
              </p>
              <button className="btn-new" onClick={handleNewForm}>
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <header className="header-bar">
        <div className="header-logo-area">
          <div className="header-emblem">
            <img src="/logo.png" alt="Al Hikma" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
          </div>
          <div className="header-text">
            <h1>Al Hikma Women's College</h1>
            <p>Indira Nagar, Kasaragod — Admission Portal 2026</p>
          </div>
        </div>
      </header>

      <div className="form-page-content">
        <div className="form-intro fade-in">
          <div className="form-badge">Academic Year 2026</div>
          <h2>Admission Application Form</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginTop: 4 }}>Al Hikma Women's College · Indira Nagar, Kasaragod – 671 541</p>
          <p style={{ marginTop: 8 }}>All fields are optional; provide information as applicable.</p>
        </div>

        <form className="form-card fade-in" onSubmit={handleSubmit} noValidate>
          {/* Personal Details */}
          <div className="section-title">
            <span className="dot" />
            Personal Information
          </div>
          <div className="form-section">
            <div className="field-grid grid-1">
              <div className={fieldClass('name')}>
                <label htmlFor="name">Name of Applicant (in Capital Letters) <span style={{ color: '#ff8080' }}>*</span></label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ENTER FULL NAME IN CAPITALS"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  className={errors.name ? 'error' : ''}
                  autoComplete="name"
                />
                {helperHints.name && <div className="helper-text">{helperHints.name}</div>}
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>
            </div>

            <div className="field-grid grid-1" style={{ marginTop: 16 }}>
              <div className={fieldClass('adhaarCard')}>
                <label htmlFor="adhaarCard">Adhaar Card Number</label>
                <input
                  id="adhaarCard"
                  name="adhaarCard"
                  type="text"
                  value={form.adhaarCard}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  className={errors.adhaarCard ? 'error' : ''}
                />
                {helperHints.adhaarCard && <div className="helper-text">{helperHints.adhaarCard}</div>}
                {errors.adhaarCard && <span className="error-msg">{errors.adhaarCard}</span>}
              </div>
            </div>

            <div className="field-grid grid-2" style={{ marginTop: 16 }}>
              <div className={fieldClass('fatherName')}>
                <label htmlFor="fatherName">Father's Name <span style={{ color: '#ff8080' }}>*</span></label>
                <input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  value={form.fatherName}
                  onChange={handleChange}
                  placeholder="Father's full name"
                  className={errors.fatherName ? 'error' : ''}
                />
                {helperHints.fatherName && <div className="helper-text">{helperHints.fatherName}</div>}
                {errors.fatherName && <span className="error-msg">{errors.fatherName}</span>}
              </div>
              <div className={fieldClass('motherName')}>
                <label htmlFor="motherName">Mother's Name</label>
                <input
                  id="motherName"
                  name="motherName"
                  type="text"
                  value={form.motherName}
                  onChange={handleChange}
                  placeholder="Mother's full name"
                  className={errors.motherName ? 'error' : ''}
                />
                {helperHints.motherName && <div className="helper-text">{helperHints.motherName}</div>}
                {errors.motherName && <span className="error-msg">{errors.motherName}</span>}
              </div>
            </div>

            <div className="field-grid grid-3" style={{ marginTop: 16 }}>
              <div className={fieldClass('age')}>
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Age"
                  min={10}
                  max={60}
                  className={errors.age ? 'error' : ''}
                />
                {helperHints.age && <div className="helper-text">{helperHints.age}</div>}
                {errors.age && <span className="error-msg">{errors.age}</span>}
              </div>
              <div className={fieldClass('dob')}>
                <label htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className={errors.dob ? 'error' : ''}
                />
                {helperHints.dob && <div className="helper-text">{helperHints.dob}</div>}
                {errors.dob && <span className="error-msg">{errors.dob}</span>}
              </div>
              <div className={fieldClass('sex')}>
                <label>Sex</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="sex"
                      value="Male"
                      checked={form.sex === 'Male'}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="sex"
                      value="Female"
                      checked={form.sex === 'Female'}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                </div>
                {helperHints.sex && <div className="helper-text">{helperHints.sex}</div>}
                {errors.sex && <span className="error-msg">{errors.sex}</span>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="section-title">
            <span className="dot" />
            Permanent Address
          </div>
          <div className="form-section">
            <div className="field-grid grid-2">
              <div className={fieldClass('house')}>
                <label htmlFor="house">House</label>
                <input
                  id="house"
                  name="house"
                  type="text"
                  value={form.house}
                  onChange={handleChange}
                  placeholder="House name / number"
                  className={errors.house ? 'error' : ''}
                />
                {helperHints.house && <div className="helper-text">{helperHints.house}</div>}
                {errors.house && <span className="error-msg">{errors.house}</span>}
              </div>
              <div className={fieldClass('place')}>
                <label htmlFor="place">Place</label>
                <input
                  id="place"
                  name="place"
                  type="text"
                  value={form.place}
                  onChange={handleChange}
                  placeholder="Place"
                  className={errors.place ? 'error' : ''}
                />
                {helperHints.place && <div className="helper-text">{helperHints.place}</div>}
                {errors.place && <span className="error-msg">{errors.place}</span>}
              </div>
              <div className={fieldClass('street')}>
                <label htmlFor="street">Street</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="Street"
                  className={errors.street ? 'error' : ''}
                />
                {helperHints.street && <div className="helper-text">{helperHints.street}</div>}
                {errors.street && <span className="error-msg">{errors.street}</span>}
              </div>
              <div className={fieldClass('post')}>
                <label htmlFor="post">Post</label>
                <input
                  id="post"
                  name="post"
                  type="text"
                  value={form.post}
                  onChange={handleChange}
                  placeholder="Post office"
                  className={errors.post ? 'error' : ''}
                />
                {helperHints.post && <div className="helper-text">{helperHints.post}</div>}
                {errors.post && <span className="error-msg">{errors.post}</span>}
              </div>
              <div className={fieldClass('district')}>
                <label htmlFor="district">District</label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="District"
                  className={errors.district ? 'error' : ''}
                />
                {helperHints.district && <div className="helper-text">{helperHints.district}</div>}
                {errors.district && <span className="error-msg">{errors.district}</span>}
              </div>
              <div className={fieldClass('pin')}>
                <label htmlFor="pin">PIN Code</label>
                <input
                  id="pin"
                  name="pin"
                  type="text"
                  value={form.pin}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  className={errors.pin ? 'error' : ''}
                />
                {helperHints.pin && <div className="helper-text">{helperHints.pin}</div>}
                {errors.pin && <span className="error-msg">{errors.pin}</span>}
              </div>
            </div>
            <div className="field-grid grid-2" style={{ marginTop: 16 }}>
              <div className={fieldClass('email')}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={errors.email ? 'error' : ''}
                />
                {helperHints.email && <div className="helper-text">{helperHints.email}</div>}
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
              <div className={fieldClass('bloodgroup')}>
                <label htmlFor="bloodgroup">Blood Group</label>
                <select
                  id="bloodgroup"
                  name="bloodgroup"
                  value={form.bloodgroup}
                  onChange={handleChange}
                  className={errors.bloodgroup ? 'error' : ''}
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                {helperHints.bloodgroup && <div className="helper-text">{helperHints.bloodgroup}</div>}
                {errors.bloodgroup && <span className="error-msg">{errors.bloodgroup}</span>}
              </div>
            </div>
          </div>

          {/* Qualification */}
          <div className="section-title">
            <span className="dot" />
            Qualification Details
          </div>
          <div className="form-section">
            <div className="field-grid grid-2">
              <div className={fieldClass('course')}>
                <label htmlFor="course">Course</label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g. Plus Two, Degree"
                  className={errors.course ? 'error' : ''}
                />
                {helperHints.course && <div className="helper-text">{helperHints.course}</div>}
                {errors.course && <span className="error-msg">{errors.course}</span>}
              </div>
              <div className={fieldClass('registerNo')}>
                <label htmlFor="registerNo">Register No.</label>
                <input
                  id="registerNo"
                  name="registerNo"
                  type="text"
                  value={form.registerNo}
                  onChange={handleChange}
                  placeholder="Exam register number"
                  className={errors.registerNo ? 'error' : ''}
                />
                {helperHints.registerNo && <div className="helper-text">{helperHints.registerNo}</div>}
                {errors.registerNo && <span className="error-msg">{errors.registerNo}</span>}
              </div>
              <div className={fieldClass('monthOfPassing')}>
                <label htmlFor="monthOfPassing">Month of Passing</label>
                <select
                  id="monthOfPassing"
                  name="monthOfPassing"
                  value={form.monthOfPassing}
                  onChange={handleChange}
                  className={errors.monthOfPassing ? 'error' : ''}
                >
                  <option value="">Select Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {helperHints.monthOfPassing && <div className="helper-text">{helperHints.monthOfPassing}</div>}
                {errors.monthOfPassing && <span className="error-msg">{errors.monthOfPassing}</span>}
              </div>
              <div className={fieldClass('yearOfPassing')}>
                <label htmlFor="yearOfPassing">Year of Passing</label>
                <input
                  id="yearOfPassing"
                  name="yearOfPassing"
                  type="number"
                  value={form.yearOfPassing}
                  onChange={handleChange}
                  placeholder="e.g. 2024"
                  min={2000}
                  max={2030}
                  className={errors.yearOfPassing ? 'error' : ''}
                />
                {helperHints.yearOfPassing && <div className="helper-text">{helperHints.yearOfPassing}</div>}
                {errors.yearOfPassing && <span className="error-msg">{errors.yearOfPassing}</span>}
              </div>
              <div className={fieldClass('percentage')}>
                <label htmlFor="percentage">Percentage of Marks</label>
                <input
                  id="percentage"
                  name="percentage"
                  type="number"
                  value={form.percentage}
                  onChange={handleChange}
                  placeholder="e.g. 85.5"
                  min={0}
                  max={100}
                  step={0.01}
                  className={errors.percentage ? 'error' : ''}
                />
                {helperHints.percentage && <div className="helper-text">{helperHints.percentage}</div>}
                {errors.percentage && <span className="error-msg">{errors.percentage}</span>}
              </div>
              <div className={fieldClass('board')}>
                <label htmlFor="board">Board</label>
                <input
                  id="board"
                  name="board"
                  type="text"
                  value={form.board}
                  onChange={handleChange}
                  placeholder="e.g. CBSE, State Board"
                  className={errors.board ? 'error' : ''}
                />
                {helperHints.board && <div className="helper-text">{helperHints.board}</div>}
                {errors.board && <span className="error-msg">{errors.board}</span>}
              </div>
            </div>
            <div className="field-grid grid-1" style={{ marginTop: 16 }}>
              <div className={fieldClass('lastInstitution')}>
                <label htmlFor="lastInstitution">Name of Institution Last Attended</label>
                <input
                  id="lastInstitution"
                  name="lastInstitution"
                  type="text"
                  value={form.lastInstitution}
                  onChange={handleChange}
                  placeholder="Name of school / college"
                  className={errors.lastInstitution ? 'error' : ''}
                />
                {helperHints.lastInstitution && <div className="helper-text">{helperHints.lastInstitution}</div>}
                {errors.lastInstitution && <span className="error-msg">{errors.lastInstitution}</span>}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="section-title">
            <span className="dot" />
            Contact Numbers (Mobile)
          </div>
          <div className="form-section">
            <div className="phone-grid">
              <div className={fieldClass('fatherMobile')}>
                <label htmlFor="fatherMobile">Father's Mobile</label>
                <input
                  id="fatherMobile"
                  name="fatherMobile"
                  type="tel"
                  value={form.fatherMobile}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  className={errors.fatherMobile ? 'error' : ''}
                />
                {helperHints.fatherMobile && <div className="helper-text">{helperHints.fatherMobile}</div>}
                {errors.fatherMobile && <span className="error-msg">{errors.fatherMobile}</span>}
              </div>
              <div className={fieldClass('motherMobile')}>
                <label htmlFor="motherMobile">Mother's Mobile</label>
                <input
                  id="motherMobile"
                  name="motherMobile"
                  type="tel"
                  value={form.motherMobile}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  className={errors.motherMobile ? 'error' : ''}
                />
                {helperHints.motherMobile && <div className="helper-text">{helperHints.motherMobile}</div>}
                {errors.motherMobile && <span className="error-msg">{errors.motherMobile}</span>}
              </div>
              <div className={fieldClass('ownMobile')}>
                <label htmlFor="ownMobile">Own Mobile</label>
                <input
                  id="ownMobile"
                  name="ownMobile"
                  type="tel"
                  value={form.ownMobile}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  className={errors.ownMobile ? 'error' : ''}
                />
                {helperHints.ownMobile && <div className="helper-text">{helperHints.ownMobile}</div>}
                {errors.ownMobile && <span className="error-msg">{errors.ownMobile}</span>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="submit-area">
            {submitError && (
              <p style={{ color: '#c0392b', marginBottom: 14, fontWeight: 600, fontSize: '0.9rem' }}>
                ❌ {submitError}
              </p>
            )}
            <button type="submit" className="btn-submit" id="submitAdmission" disabled={isSubmitting}>
              <span>{isSubmitting ? '⏳' : '📩'}</span>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <p style={{ marginTop: 14, fontSize: '0.8rem', color: '#aaa' }}>
              By submitting, you agree that all information provided is accurate.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
