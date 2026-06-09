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
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

function validateForm(data) {
  const errors = {}
  if (!data.name.trim()) errors.name = 'Name is required'
  if (!data.fatherName.trim()) errors.fatherName = "Father's name is required"
  if (!data.motherName.trim()) errors.motherName = "Mother's name is required"
  if (!data.dob) errors.dob = 'Date of birth is required'
  if (!data.sex) errors.sex = 'Please select sex'
  if (!data.district.trim()) errors.district = 'District is required'
  if (!data.course.trim()) errors.course = 'Course is required'
  if (!data.ownMobile.trim()) errors.ownMobile = 'Own mobile is required'
  else if (!/^\d{10}$/.test(data.ownMobile.trim())) errors.ownMobile = 'Enter valid 10-digit number'
  return errors
}

export default function AdmissionForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [refNo, setRefNo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const errs = validateForm(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErr = document.querySelector('.error')
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmitting(true)
    const ref = 'AHK-' + Date.now().toString().slice(-6)
    const submission = {
      ...form,
      id: Date.now().toString(),
      refNo: ref,
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
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit application');
      }

      setRefNo(ref)
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
              <img src="/logo.png" alt="Al Hikma" style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}} />
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
                Submitted on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
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
            <img src="/logo.png" alt="Al Hikma" style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}} />
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
          <p style={{color:'rgba(255,255,255,0.6)', fontSize:'0.88rem', marginTop:4}}>Al Hikma Women's College · Indira Nagar, Kasaragod – 671 541</p>
          <p style={{marginTop:8}}>Fill in all required details carefully. Fields marked with <span style={{color:'#ff8080'}}>*</span> are mandatory.</p>
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
                <label htmlFor="name">Name of Applicant (in Capital Letters) *</label>
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
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>
            </div>

            <div className="field-grid grid-1" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label htmlFor="adhaarCard">Adhaar Card Number</label>
                <input
                  id="adhaarCard"
                  name="adhaarCard"
                  type="text"
                  value={form.adhaarCard}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                />
              </div>
            </div>

            <div className="field-grid grid-2" style={{ marginTop: 16 }}>
              <div className={fieldClass('fatherName')}>
                <label htmlFor="fatherName">Father's Name *</label>
                <input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  value={form.fatherName}
                  onChange={handleChange}
                  placeholder="Father's full name"
                  className={errors.fatherName ? 'error' : ''}
                />
                {errors.fatherName && <span className="error-msg">{errors.fatherName}</span>}
              </div>
              <div className={fieldClass('motherName')}>
                <label htmlFor="motherName">Mother's Name *</label>
                <input
                  id="motherName"
                  name="motherName"
                  type="text"
                  value={form.motherName}
                  onChange={handleChange}
                  placeholder="Mother's full name"
                  className={errors.motherName ? 'error' : ''}
                />
                {errors.motherName && <span className="error-msg">{errors.motherName}</span>}
              </div>
            </div>

            <div className="field-grid grid-3" style={{ marginTop: 16 }}>
              <div className="form-group">
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
                />
              </div>
              <div className={fieldClass('dob')}>
                <label htmlFor="dob">Date of Birth *</label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className={errors.dob ? 'error' : ''}
                />
                {errors.dob && <span className="error-msg">{errors.dob}</span>}
              </div>
              <div className={fieldClass('sex')}>
                <label>Sex *</label>
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
              <div className="form-group">
                <label htmlFor="house">House</label>
                <input id="house" name="house" type="text" value={form.house} onChange={handleChange} placeholder="House name / number" />
              </div>
              <div className="form-group">
                <label htmlFor="place">Place</label>
                <input id="place" name="place" type="text" value={form.place} onChange={handleChange} placeholder="Place" />
              </div>
              <div className="form-group">
                <label htmlFor="street">Street</label>
                <input id="street" name="street" type="text" value={form.street} onChange={handleChange} placeholder="Street" />
              </div>
              <div className="form-group">
                <label htmlFor="post">Post</label>
                <input id="post" name="post" type="text" value={form.post} onChange={handleChange} placeholder="Post office" />
              </div>
              <div className={fieldClass('district')}>
                <label htmlFor="district">District *</label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="District"
                  className={errors.district ? 'error' : ''}
                />
                {errors.district && <span className="error-msg">{errors.district}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="pin">PIN Code</label>
                <input id="pin" name="pin" type="text" value={form.pin} onChange={handleChange} placeholder="6-digit PIN" maxLength={6} />
              </div>
            </div>
            <div className="field-grid grid-1" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" />
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
                <label htmlFor="course">Course *</label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g. Plus Two, Degree"
                  className={errors.course ? 'error' : ''}
                />
                {errors.course && <span className="error-msg">{errors.course}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="registerNo">Register No.</label>
                <input id="registerNo" name="registerNo" type="text" value={form.registerNo} onChange={handleChange} placeholder="Exam register number" />
              </div>
              <div className="form-group">
                <label htmlFor="monthOfPassing">Month of Passing</label>
                <select id="monthOfPassing" name="monthOfPassing" value={form.monthOfPassing} onChange={handleChange}>
                  <option value="">Select Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="yearOfPassing">Year of Passing</label>
                <input id="yearOfPassing" name="yearOfPassing" type="number" value={form.yearOfPassing} onChange={handleChange} placeholder="e.g. 2024" min={2000} max={2030} />
              </div>
              <div className="form-group">
                <label htmlFor="percentage">Percentage of Marks</label>
                <input id="percentage" name="percentage" type="number" value={form.percentage} onChange={handleChange} placeholder="e.g. 85.5" min={0} max={100} step={0.01} />
              </div>
              <div className="form-group">
                <label htmlFor="board">Board</label>
                <input id="board" name="board" type="text" value={form.board} onChange={handleChange} placeholder="e.g. CBSE, State Board" />
              </div>
            </div>
            <div className="field-grid grid-1" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label htmlFor="lastInstitution">Name of Institution Last Attended</label>
                <input id="lastInstitution" name="lastInstitution" type="text" value={form.lastInstitution} onChange={handleChange} placeholder="Name of school / college" />
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
              <div className="form-group">
                <label htmlFor="fatherMobile">Father's Mobile</label>
                <input id="fatherMobile" name="fatherMobile" type="tel" value={form.fatherMobile} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
              </div>
              <div className="form-group">
                <label htmlFor="motherMobile">Mother's Mobile</label>
                <input id="motherMobile" name="motherMobile" type="tel" value={form.motherMobile} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
              </div>
              <div className={fieldClass('ownMobile')}>
                <label htmlFor="ownMobile">Own Mobile *</label>
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
