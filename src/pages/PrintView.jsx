import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'

function V(val) { return val || '' }

function formatDOB(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN-u-nu-latn', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}
function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN-u-nu-latn', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}


/* ═══════════════════════════════════════════════════════════════
   COORDINATE SYSTEM
   ─────────────────
   Container:  794 px wide × 1123 px tall (A4 @96 dpi = 210×297 mm)
   The background image (form_page.png) is stretched to 100%×100%.

   All positions are expressed as PERCENTAGES of the container so
   they scale identically on screen and in the browser print dialog.

   HOW POSITIONS WERE DETERMINED
   ───────────────────────────────
   • Y (top %): calibrated by comparing screenshots where specific
     rows were confirmed correct, then interpolating row spacing.
     Observed row-to-row spacing ≈ 3.2 % of container height.
     Table starts at ≈ 22 % from top.

   • X (left %): measured from the form image by identifying where
     each label ends and the value cell begins.

   VERIFIED Y CENTRES
   ───────────────────
   NAME                23.9 %   ← confirmed correct in screenshot
   ADHAAR              27.1 %   ← confirmed correct
   FATHER              30.3 %   ← confirmed correct
   MOTHER              33.5 %   ← confirmed correct
   AGE / DOB / SEX     36.7 %   (row after MOTHER, spacing 3.2)
   PERM ADDR header    39.3 %   (no value placed here)
   HOUSE / PLACE       41.6 %
   STREET / POST       44.7 %
   DISTRICT / PIN      47.8 %
   EMAIL               50.9 %
   QUAL header         53.4 %   (no value)
   COURSE / REG        55.8 %
   MONTH / YEAR        58.8 %
   PCT / BOARD         61.8 %
   INSTITUTION         64.8 %
   CONTACT header      67.0 %   (no value)
   COL LABELS          68.8 %   (no value – static)
   MOBILE VALUES       71.5 %
   OFFICE header       74.2 %   (no value – dark banner)
   ADM / ENROLL        77.2 %
   CLASS / DATE        80.4 %
   CERTIFICATES        83.4 %
   FEE row header      86.0 %   (no value)
   FEE CHECKBOXES      87.8 %

   VERIFIED X STARTS (measured from form image, % of width)
   ──────────────────────────────────────────────────────────
   NAME value after label          27.5 %
   ADHAAR cell-1 left              37.5 %   (label ends ~36 %)
   ADHAAR cell-2 left              57.5 %   (1st divider ~57 %)
   ADHAAR cell-3 left              78.5 %   (2nd divider ~78 %)
   FATHER value                    22.6 %
   MOTHER value                    22.6 %
   AGE value                        5.0 %
   DOB value                       35.5 %   (DOB: label ends ~35 %)
   MALE tick                       83.5 %
   FEMALE tick                     91.5 %
   HOUSE / STREET / DISTRICT / EMAIL   9.0 %
   PLACE / POST / PIN             49.5 %   (right-col label ends ~48 %)
   COURSE / left-qual             9.0 %
   REGISTER NO                    54.0 %
   MONTH value                    22.0 %
   YEAR value                     56.5 %
   PCT value                      22.0 %
   BOARD value                    50.0 %
   INSTITUTION value              44.5 %
   FATHER mobile (center in col)   4.0 %  width=29%
   MOTHER mobile                  37.0 %  width=29%
   OWN mobile                     69.0 %  width=29%
   ADMISSION NO                   25.5 %
   ENROLLMENT NO                  57.5 %
   CLASS ADMITTED                 25.5 %
   DATE OF ADMISSION              57.5 %
   CERTIFICATES                   26.5 %
   ADM FEE tick                   12.5 %
   MISCELLANEOUS tick             26.5 %
   FIRST TERM tick                41.5 %
   SECOND TERM tick               56.5 %
   THIRD TERM tick                71.5 %
═══════════════════════════════════════════════════════════════ */

export default function PrintView() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const didAutoPrint = useRef(false)

  const [coords, setCoords] = useState({
    name: { top: 27.6, left: 36.0 },
    adhaar1: { top: 30.8, left: 37.5 },
    adhaar2: { top: 30.8, left: 57.5 },
    adhaar3: { top: 30.8, left: 78.5 },
    fatherName: { top: 33.4, left: 25.0 },
    motherName: { top: 35.8, left: 25.0 },
    age: { top: 38.6, left: 13.0 },
    dob: { top: 38.6, left: 41.0 },
    sexMale: { top: 38.6, left: 78 },
    sexFemale: { top: 38.6, left: 88.7 },
    house: { top: 43.8, left: 16.0 },
    place: { top: 43.8, left: 54.0 },
    street: { top: 46.3, left: 16.0 },
    post: { top: 46.3, left: 54.0 },
    district: { top: 49.0, left: 16.0 },
    pin: { top: 49.0, left: 54.0 },
    email: { top: 51.3, left: 13.5 },
    bloodgroup: { top: 51.3, left: 52.0 },
    course: { top: 56.2, left: 10.0 },
    registerNo: { top: 56.2, left: 52.0 },
    monthOfPassing: { top: 58.8, left: 18.0 },
    yearOfPassing: { top: 58.8, left: 52.5 },
    percentage: { top: 61.3, left: 22.5 },
    board: { top: 61.3, left: 50.0 },
    lastInstitution: { top: 64.0, left: 49.0 },
    fatherMobile: { top: 71.3, left: 6.7 },
    motherMobile: { top: 71.3, left: 30.8 },
    ownMobile: { top: 71.3, left: 60.5 },
    admissionNo: { top: 76.8, left: 28.0 },
    enrollmentNo: { top: 76.8, left: 65.5 },
    classAdmitted: { top: 79.8, left: 28.0 },
    dateOfAdmission: { top: 79.8, left: 68.5 },
    certificatesReceived: { top: 82.8, left: 33.5 },
    feeAdmission: { top: 88.2, left: 18.2 },
    feeMiscellaneous: { top: 88.2, left: 34.1 },
    feeFirstTerm: { top: 88.2, left: 45.3 },
    feeSecondTerm: { top: 88.2, left: 59.1 },
    feeThirdTerm: { top: 88.2, left: 71.9 }
  })


  useEffect(() => {
    ; (async () => {
      try {
        const res = await fetch(`/api/admissions/${id}`)
        if (!res.ok) { setNotFound(true); return }
        setData(await res.json())
      } catch { setNotFound(true) }
    })()
  }, [id])

  useEffect(() => {
    if (data && !didAutoPrint.current) {
      const go = searchParams.get('print') === '1' || searchParams.get('download') === '1'
      if (go) { didAutoPrint.current = true; setTimeout(() => window.print(), 900) }
    }
  }, [data, searchParams])

  if (notFound) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', background: '#f0f4f8', gap: 16
    }}>
      <div style={{ fontSize: '4rem' }}>📋</div>
      <h2 style={{ color: '#1a5c5c' }}>Admission Not Found</h2>
      <Link to="/admin" style={{
        padding: '10px 24px', textDecoration: 'none',
        background: '#1a5c5c', color: '#fff', borderRadius: 8
      }}>
        ← Back to Admin
      </Link>
    </div>
  )

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#888', fontSize: '1.2rem' }}>⏳ Loading…</p>
    </div>
  )

  const raw = V(data.adhaarCard).replace(/\s/g, '')
  const aa1 = raw.slice(0, 4)
  const aa2 = raw.slice(4, 8)
  const aa3 = raw.slice(8, 12)

  function Field({ fieldId, style = {}, children }) {
    const pos = coords[fieldId] || { top: 0, left: 0 }

    const baseStyle = {
      position: 'absolute',
      top: `${pos.top}%`,
      left: `${pos.left}%`,
      transform: 'translateY(-50%)',
      fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif',
      fontSize: '11.5pt',
      fontWeight: '400',
      color: '#000',
      whiteSpace: 'nowrap',
      lineHeight: 0.8,
      textTransform: 'uppercase',
      zIndex: 2,
      ...style,
    }

    return (
      <div id={`field-${fieldId}`} style={baseStyle}>
        {children}
      </div>
    )
  }

  return (
    <div className="print-view-page">

      {/* ────────── Toolbar (hidden on print) ────────── */}
      <div className="print-toolbar">
        <div>
          <h2>📄 {data.name || 'Admission Form'}</h2>
          <p style={{ fontSize: '0.78rem', color: '#888', marginTop: 3 }}>
            Ref: {data.refNo} · Submitted: {formatDate(data.submittedAt)}
          </p>
        </div>
        <div className="toolbar-actions">
          <Link to="/admin" className="btn-back">← Admin</Link>
          <button className="btn-primary" onClick={() => window.print()} id="printBtn">
            🖨 Print Form
          </button>
          <button className="btn-gold" onClick={() => window.print()} id="downloadBtn">
            ⬇ Download PDF
          </button>
        </div>
      </div>

      {/* ────────── A4 Print Preview ────────── */}
      <div className="print-preview-area">
        <div className="print-form-container" id="page1">

          {/* Background: the AL HIKMA form template */}
          <img src="/form_page.png" className="print-form-bg" alt="Admission Form Template" />

          {/* ══════════════════════════════════════════
              OVERLAID VALUES
              ══════════════════════════════════════════ */}

          {/* ── NAME OF THE APPLICANT ── */}
          <Field fieldId="name" style={{
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {V(data.name)}
          </Field>

          {/* ── ADHAAR CARD NUMBER — 3 cells, left-aligned ── */}
          <Field fieldId="adhaar1" style={{ fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif', letterSpacing: '0.2em' }}>
            {aa1}
          </Field>
          <Field fieldId="adhaar2" style={{ fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif', letterSpacing: '0.2em' }}>
            {aa2}
          </Field>
          <Field fieldId="adhaar3" style={{ fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif', letterSpacing: '0.2em' }}>
            {aa3}
          </Field>

          {/* ── FATHER'S NAME ── */}
          <Field fieldId="fatherName">{V(data.fatherName)}</Field>

          {/* ── MOTHER'S NAME ── */}
          <Field fieldId="motherName">{V(data.motherName)}</Field>

          {/* ── AGE ── */}
          <Field fieldId="age">{V(data.age)}</Field>

          {/* ── DOB ── */}
          <Field fieldId="dob">{formatDOB(data.dob)}</Field>

          {/* ── SEX (tick inside the checkbox square) ── */}
          {data.sex === 'Male' && (
            <Field fieldId="sexMale" style={{ width: '2.4%', textAlign: 'center', fontSize: '11pt', fontWeight: 900 }}>✓</Field>
          )}
          {data.sex === 'Female' && (
            <Field fieldId="sexFemale" style={{ width: '2.5%', textAlign: 'center', fontSize: '11pt', fontWeight: 900 }}>✓</Field>
          )}

          {/* ══════════ PERMANENT ADDRESS ══════════ */}

          {/* HOUSE */}
          <Field fieldId="house">{V(data.house)}</Field>
          {/* PLACE */}
          <Field fieldId="place">{V(data.place)}</Field>

          {/* STREET */}
          <Field fieldId="street">{V(data.street)}</Field>
          {/* POST */}
          <Field fieldId="post">{V(data.post)}</Field>

          {/* DISTRICT */}
          <Field fieldId="district">{V(data.district)}</Field>
          {/* PIN */}
          <Field fieldId="pin" style={{ fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif', letterSpacing: '0.1em' }}>
            {V(data.pin)}
          </Field>

          {/* EMAIL */}
          <Field fieldId="email">{V(data.email)}</Field>
          {/* BLOOD GROUP */}
          <Field fieldId="bloodgroup">{V(data.bloodgroup)}</Field>

          {/* ══════════ QUALIFICATION DETAILS ══════════ */}

          {/* COURSE */}
          <Field fieldId="course" style={{ width: '31.1%', textAlign: 'center' }}>{V(data.course)}</Field>
          {/* REGISTER NO */}
          <Field fieldId="registerNo" style={{ fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif', width: '29.2%', textAlign: 'center' }}>{V(data.registerNo)}</Field>

          {/* MONTH OF PASSING */}
          <Field fieldId="monthOfPassing" style={{ width: '21.1%', textAlign: 'center' }}>{V(data.monthOfPassing)}</Field>
          {/* YEAR OF PASSING */}
          <Field fieldId="yearOfPassing" style={{ width: '28.7%', textAlign: 'center' }}>{V(data.yearOfPassing)}</Field>

          {/* PERCENTAGE OF MARKS */}
          <Field fieldId="percentage" style={{ width: '17.6%', textAlign: 'center' }}>
            {data.percentage ? `${data.percentage}%` : ''}
          </Field>
          {/* BOARD */}
          <Field fieldId="board" style={{ width: '36.2%', textAlign: 'center' }}>{V(data.board)}</Field>

          {/* NAME OF INSTITUTION THE APPLICANT LAST ATTENDED */}
          <Field fieldId="lastInstitution" style={{ width: '41.2%', textAlign: 'center', whiteSpace: 'normal' }}>
            {V(data.lastInstitution)}
          </Field>

          {/* ══════════ CONTACT NUMBERS (MOBILE) ══════════ */}
          <Field fieldId="fatherMobile" style={{
            width: '29%', textAlign: 'center',
            fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif', letterSpacing: '0.07em',
          }}>
            {V(data.fatherMobile)}
          </Field>
          <Field fieldId="motherMobile" style={{
            width: '29%', textAlign: 'center',
            fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif', letterSpacing: '0.07em',
          }}>
            {V(data.motherMobile)}
          </Field>
          <Field fieldId="ownMobile" style={{
            width: '29%', textAlign: 'center',
            fontFamily: '"Arial Rounded MT Bold", "Arial Rounded MT", Arial, sans-serif', letterSpacing: '0.07em',
          }}>
            {V(data.ownMobile)}
          </Field>

          {/* ══════════ FOR OFFICE USE ONLY ══════════ */}

          {/* ADMISSION NO */}
          <Field fieldId="admissionNo" style={{ color: '#002244', fontWeight: 700 }}>
            {V(data.admissionNo)}
          </Field>
          {/* ENROLLMENT NO */}
          <Field fieldId="enrollmentNo" style={{ color: '#002244', fontWeight: 700 }}>
            {V(data.enrollmentNo)}
          </Field>

          {/* CLASS ADMITTED */}
          <Field fieldId="classAdmitted" style={{ color: '#002244', fontWeight: 700 }}>
            {V(data.classAdmitted)}
          </Field>
          {/* DATE OF ADMISSION */}
          <Field fieldId="dateOfAdmission" style={{ color: '#002244', fontWeight: 700 }}>
            {V(data.dateOfAdmission)}
          </Field>

          {/* CERTIFICATES RECEIVED */}
          <Field fieldId="certificatesReceived" style={{ color: '#002244', fontWeight: 700 }}>
            {V(data.certificatesReceived)}
          </Field>

          {/* ── FEE CHECKBOXES ── */}
          {data.admissionFee && <Field fieldId="feeAdmission" style={{ width: '1.6%', textAlign: 'center', fontSize: '10pt', fontWeight: 900, color: '#002244' }}>✓</Field>}
          {data.miscellaneous && <Field fieldId="feeMiscellaneous" style={{ width: '1.6%', textAlign: 'center', fontSize: '10pt', fontWeight: 900, color: '#002244' }}>✓</Field>}
          {data.firstTerm && <Field fieldId="feeFirstTerm" style={{ width: '1.6%', textAlign: 'center', fontSize: '10pt', fontWeight: 900, color: '#002244' }}>✓</Field>}
          {data.secondTerm && <Field fieldId="feeSecondTerm" style={{ width: '1.6%', textAlign: 'center', fontSize: '10pt', fontWeight: 900, color: '#002244' }}>✓</Field>}
          {data.thirdTerm && <Field fieldId="feeThirdTerm" style={{ width: '1.6%', textAlign: 'center', fontSize: '10pt', fontWeight: 900, color: '#002244' }}>✓</Field>}

        </div>
      </div>


    </div>
  )
}
