import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

function validateForm(data) {
  const errors = {}
  if (!data.name?.trim()) errors.name = 'Name is required'
  if (!data.fatherName?.trim()) errors.fatherName = "Father's name is required"
  if (!data.motherName?.trim()) errors.motherName = "Mother's name is required"
  if (!data.dob) errors.dob = 'Date of birth is required'
  if (!data.sex) errors.sex = 'Please select sex'
  if (!data.district?.trim()) errors.district = 'District is required'
  if (!data.course?.trim()) errors.course = 'Course is required'
  if (!data.ownMobile?.trim()) errors.ownMobile = 'Own mobile is required'
  else if (!/^\d{10}$/.test(data.ownMobile.trim())) errors.ownMobile = 'Enter valid 10-digit number'
  return errors
}

export default function EditAdmission() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const response = await fetch(`/api/admissions/${id}`)
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Admission record not found' : 'Failed to fetch admission')
        }
        const data = await response.json()
        setForm(data)
      } catch (err) {
        console.error('Error loading admission:', err)
        setErrorMsg(err.message || 'Error loading data.')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchAdmission()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm(prev => ({ ...prev, [name]: val }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSaveSuccess(false)
    
    const errs = validateForm(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErr = document.querySelector('.error')
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to update application')
      }

      setSaveSuccess(true)
      setTimeout(() => {
        navigate('/admin')
      }, 1500)
    } catch (err) {
      console.error('Update error:', err)
      setErrorMsg(err.message || 'Server error. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const fieldClass = (name) => `form-group${errors[name] ? ' error' : ''}`

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f4f8' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⏳</div>
          <p>Loading application data...</p>
        </div>
      </div>
    )
  }

  if (errorMsg && !form) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f4f8', gap: 16 }}>
        <div style={{ fontSize: '4rem' }}>⚠️</div>
        <h2 style={{ color: '#c0392b' }}>Error</h2>
        <p style={{ color: '#888' }}>{errorMsg}</p>
        <Link to="/admin" className="btn-sm btn-view" style={{ padding: '10px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Back to Admin
        </Link>
      </div>
    )
  }

  return (
    <div className="page-wrapper" style={{ background: '#f0f4f8' }}>
      <header className="admin-header" style={{ background: 'linear-gradient(135deg, #0d3030, #1a5c5c)' }}>
        <div>
          <h1 style={{ color: '#fff' }}>✏️ Edit Admission</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)' }}>Reference: {form.refNo} · Edit details and office use parameters</p>
        </div>
        <Link to="/admin" className="btn-sm btn-view" style={{ padding: '10px 22px', fontSize: '0.88rem', textDecoration: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
          ← Cancel
        </Link>
      </header>

      <div className="form-page-content" style={{ marginTop: 24, maxWidth: 900 }}>
        {saveSuccess && (
          <div style={{ background: '#d4efdf', color: '#1e8449', padding: '16px 24px', borderRadius: 8, marginBottom: 20, textAlign: 'center', fontWeight: 600 }}>
            ✓ Changes saved successfully! Redirecting back to Admin...
          </div>
        )}

        <form className="form-card fade-in" onSubmit={handleSubmit} noValidate style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          
          {/* Office Use Only Section */}
          <div className="section-title" style={{ background: 'linear-gradient(90deg, #1a3a4a, #2c5d75)' }}>
            <span className="dot" style={{ background: '#f1c40f' }} />
            Office Use Only (Admin)
          </div>
          <div className="form-section" style={{ background: '#fefcf0' }}>
            <div className="field-grid grid-2">
              <div className="form-group">
                <label htmlFor="admissionNo" style={{ color: '#1a3a4a' }}>Admission No.</label>
                <input
                  id="admissionNo"
                  name="admissionNo"
                  type="text"
                  value={form.admissionNo}
                  onChange={handleChange}
                  placeholder="Office assigned admission number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="enrollmentNo" style={{ color: '#1a3a4a' }}>Enrollment No.</label>
                <input
                  id="enrollmentNo"
                  name="enrollmentNo"
                  type="text"
                  value={form.enrollmentNo}
                  onChange={handleChange}
                  placeholder="Office assigned enrollment number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="classAdmitted" style={{ color: '#1a3a4a' }}>Class Admitted</label>
                <input
                  id="classAdmitted"
                  name="classAdmitted"
                  type="text"
                  value={form.classAdmitted}
                  onChange={handleChange}
                  placeholder="Class"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfAdmission" style={{ color: '#1a3a4a' }}>Date of Admission</label>
                <input
                  id="dateOfAdmission"
                  name="dateOfAdmission"
                  type="text"
                  value={form.dateOfAdmission}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>

            <div className="field-grid grid-1" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label htmlFor="certificatesReceived" style={{ color: '#1a3a4a' }}>Certificates Received</label>
                <input
                  id="certificatesReceived"
                  name="certificatesReceived"
                  type="text"
                  value={form.certificatesReceived}
                  onChange={handleChange}
                  placeholder="SSLC, Plus Two, TC, Conduct etc."
                />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a3a4a', display: 'block', marginBottom: 8 }}>
                Details of Fee Remitted at the Time of Admission
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '10px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="admissionFee"
                    checked={form.admissionFee}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: '#1a3a4a' }}
                  />
                  Admission Fee
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="miscellaneous"
                    checked={form.miscellaneous}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: '#1a3a4a' }}
                  />
                  Miscellaneous
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="firstTerm"
                    checked={form.firstTerm}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: '#1a3a4a' }}
                  />
                  First Term
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="secondTerm"
                    checked={form.secondTerm}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: '#1a3a4a' }}
                  />
                  Second Term
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="thirdTerm"
                    checked={form.thirdTerm}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: '#1a3a4a' }}
                  />
                  Third Term
                </label>
              </div>
            </div>
          </div>

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
                  value={form.dob ? form.dob.split('T')[0] : ''}
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
            {errorMsg && (
              <p style={{ color: '#c0392b', marginBottom: 14, fontWeight: 600, fontSize: '0.9rem' }}>
                ❌ {errorMsg}
              </p>
            )}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/admin" className="btn-new" style={{ textDecoration: 'none', margin: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                Cancel
              </Link>
              <button type="submit" className="btn-submit" disabled={isSaving}>
                <span>{isSaving ? '⏳' : '💾'}</span>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
