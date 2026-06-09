import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'

function V(val) {
  return val || ''
}

function formatDOB(dobStr) {
  if (!dobStr) return ''
  // Parse as local date to avoid timezone offset issues
  const [year, month, day] = dobStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDate(isoStr) {
  if (!isoStr) return ''
  return new Date(isoStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

/* ======================================================
   PAGE 1 — Exact replication of Al Hikma Admission Form
   ====================================================== */
function Page1({ data }) {
  return (
    <div className="a4-sheet" id="page1">

      {/* ── HEADER ── */}
      <div className="ah-header">
        <img src="/logo_icon.png" alt="Al Hikma Women's College Logo" className="ah-logo-img" style={{ objectFit: 'contain', objectPosition: 'center' }} />

        <div className="ah-title-block">
          <div className="ah-name">AL HIKMA</div>
          <div className="ah-womens">WOMEN'S COLLEGE</div>
          <div className="ah-arabic">كلية الحكمة للبنات</div>
          <div className="ah-location-bar">INDIRA NAGAR, KASARAGOD</div>
          <div className="ah-address">
            PODIPPALLAM, INDIRA NAGAR, CHENGALA P.O, KASARAGOD – 671 541<br />
            Mobile: 82 81 81 99 44 | Email: alhikmakasaragod@gmail.com
          </div>
        </div>

        <div className="ah-photo-box">
          AFFIX<br />A PASSPORT SIZE<br />PHOTOGRAPH<br />HERE
        </div>
      </div>

      <hr className="ah-divider" />

      {/* ── FORM TITLE ── */}
      <div className="ah-form-title-wrap">
        <div className="ah-form-title">ADMISSION FORM</div>
      </div>

      {/* ── MAIN FORM TABLE ── */}
      <table className="ah-form-table">
        <tbody>

          {/* NAME OF APPLICANT */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '38%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell" style={{ fontSize: '10pt' }}>
                        NAME OF THE APPLICANT:<br />
                        <span style={{ fontWeight: 400, fontSize: '7.5pt' }}>(IN CAPITAL LETTERS)</span>
                      </div>
                    </td>
                    <td>
                      <div className="ah-cell-value caps" style={{ minHeight: 36, display: 'flex', alignItems: 'center' }}>
                        {V(data.name)}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* ADHAAR CARD NUMBER */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '38%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">ADHAAR CARD NUMBER:</div>
                    </td>
                    <td style={{ width: '21%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell-value" style={{ fontFamily: 'monospace', letterSpacing: '0.1em', minHeight: 26 }}>
                        {V(data.adhaarCard).slice(0, 4)}
                      </div>
                    </td>
                    <td style={{ width: '21%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell-value" style={{ fontFamily: 'monospace', letterSpacing: '0.1em', minHeight: 26 }}>
                        {V(data.adhaarCard).replace(/\s/g, '').slice(4, 8)}
                      </div>
                    </td>
                    <td style={{ width: '20%' }}>
                      <div className="ah-cell-value" style={{ fontFamily: 'monospace', letterSpacing: '0.1em', minHeight: 26 }}>
                        {V(data.adhaarCard).replace(/\s/g, '').slice(8, 12)}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* FATHER'S NAME */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '38%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">FATHER'S NAME:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 26 }}>{V(data.fatherName)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* MOTHER'S NAME */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '38%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">MOTHER'S NAME:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 26 }}>{V(data.motherName)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* AGE | DOB | SEX */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '25%', borderRight: '1px solid #000' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr>
                            <td style={{ width: '40%', borderRight: '1px solid #000' }}>
                              <div className="ah-cell">AGE:</div>
                            </td>
                            <td>
                              <div className="ah-cell-value" style={{ minHeight: 26 }}>{V(data.age)}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style={{ width: '45%', borderRight: '1px solid #000' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr>
                            <td style={{ width: '28%', borderRight: '1px solid #000' }}>
                              <div className="ah-cell">DOB:</div>
                            </td>
                            <td>
                              <div className="ah-cell-value" style={{ minHeight: 26 }}>{formatDOB(data.dob)}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style={{ width: '30%' }}>
                      <div className="ah-sex-row">
                        <span style={{ fontWeight: 700, fontSize: '9pt' }}>SEX:</span>
                        <div className="ah-sex-item">
                          <div className="ah-checkbox">{data.sex === 'Male' ? '✓' : ''}</div>
                          <span style={{ fontWeight: 700, fontSize: '9pt' }}>MALE</span>
                        </div>
                        <div className="ah-sex-item">
                          <div className="ah-checkbox">{data.sex === 'Female' ? '✓' : ''}</div>
                          <span style={{ fontWeight: 700, fontSize: '9pt' }}>FEMALE</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* PERMANENT ADDRESS header */}
          <tr>
            <td colSpan={4} className="ah-section-header">PERMANENT ADDRESS:</td>
          </tr>

          {/* HOUSE | PLACE */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '12%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">HOUSE:</div>
                    </td>
                    <td style={{ width: '38%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.house)}</div>
                    </td>
                    <td style={{ width: '12%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">PLACE:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.place)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* STREET | POST */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '12%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">STREET:</div>
                    </td>
                    <td style={{ width: '38%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.street)}</div>
                    </td>
                    <td style={{ width: '12%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">POST:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.post)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* DISTRICT | PIN */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '12%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">DISTRICT:</div>
                    </td>
                    <td style={{ width: '38%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.district)}</div>
                    </td>
                    <td style={{ width: '12%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">PIN:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 24, fontFamily: 'monospace', letterSpacing: '0.08em' }}>{V(data.pin)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* EMAIL */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '12%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">EMAIL:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.email)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* QUALIFICATION DETAILS header */}
          <tr>
            <td colSpan={4} className="ah-section-header">QUALIFICATION DETAILS:</td>
          </tr>

          {/* COURSE | REGISTER NO */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '14%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">COURSE:</div>
                    </td>
                    <td style={{ width: '36%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.course)}</div>
                    </td>
                    <td style={{ width: '20%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">REGISTER NO.:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 24, fontFamily: 'monospace' }}>{V(data.registerNo)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* MONTH | YEAR OF PASSING */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '26%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">MONTH OF PASSING:</div>
                    </td>
                    <td style={{ width: '24%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.monthOfPassing)}</div>
                    </td>
                    <td style={{ width: '24%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">YEAR OF PASSING:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.yearOfPassing)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* PERCENTAGE | BOARD */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '26%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">PERCENTAGE OF MARKS:</div>
                    </td>
                    <td style={{ width: '24%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>
                        {V(data.percentage)}{data.percentage ? '%' : ''}
                      </div>
                    </td>
                    <td style={{ width: '14%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">BOARD:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.board)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* LAST INSTITUTION */}
          <tr>
            <td colSpan={4} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '58%', borderRight: '1px solid #000' }}>
                      <div className="ah-cell">NAME OF INSTITUTION THE APPLICANT LAST ATTENDED:</div>
                    </td>
                    <td>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.lastInstitution)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* CONTACT NUMBERS header */}
          <tr>
            <td colSpan={4} className="ah-section-header">CONTACT NUMBERS (MOBILE)</td>
          </tr>

          {/* Contact header labels */}
          <tr>
            <td style={{ width: '33.33%', textAlign: 'center', borderRight: '1px solid #000' }}>
              <div className="ah-cell" style={{ textAlign: 'center' }}>FATHER</div>
            </td>
            <td style={{ width: '33.33%', textAlign: 'center', borderRight: '1px solid #000' }}>
              <div className="ah-cell" style={{ textAlign: 'center' }}>MOTHER</div>
            </td>
            <td style={{ width: '33.34%', textAlign: 'center' }}>
              <div className="ah-cell" style={{ textAlign: 'center' }}>OWN</div>
            </td>
          </tr>

          {/* Contact values */}
          <tr>
            <td style={{ borderRight: '1px solid #000' }}>
              <div className="ah-cell-value" style={{ minHeight: 26, textAlign: 'center', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                {V(data.fatherMobile)}
              </div>
            </td>
            <td style={{ borderRight: '1px solid #000' }}>
              <div className="ah-cell-value" style={{ minHeight: 26, textAlign: 'center', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                {V(data.motherMobile)}
              </div>
            </td>
            <td>
              <div className="ah-cell-value" style={{ minHeight: 26, textAlign: 'center', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                {V(data.ownMobile)}
              </div>
            </td>
          </tr>

          {/* FOR OFFICE USE ONLY */}
          <tr>
            <td colSpan={4} className="ah-office-header">FOR OFFICE USE ONLY</td>
          </tr>

          {/* ADMISSION NO | ENROLLMENT NO */}
          <tr className="ah-office-bg">
            <td colSpan={4} style={{ padding: 0, background: '#fffff0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fffff0' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '26%', borderRight: '1px solid #000', background: '#fffff0' }}>
                      <div className="ah-cell">ADMISSION NO.:</div>
                    </td>
                    <td style={{ width: '24%', borderRight: '1px solid #000', background: '#fffff0' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.admissionNo)}</div>
                    </td>
                    <td style={{ width: '26%', borderRight: '1px solid #000', background: '#fffff0' }}>
                      <div className="ah-cell">ENROLLMENT NO.:</div>
                    </td>
                    <td style={{ background: '#fffff0' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.enrollmentNo)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* CLASS ADMITTED | DATE OF ADMISSION */}
          <tr className="ah-office-bg">
            <td colSpan={4} style={{ padding: 0, background: '#fffff0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fffff0' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '26%', borderRight: '1px solid #000', background: '#fffff0' }}>
                      <div className="ah-cell">CLASS ADMITTED:</div>
                    </td>
                    <td style={{ width: '24%', borderRight: '1px solid #000', background: '#fffff0' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.classAdmitted)}</div>
                    </td>
                    <td style={{ width: '26%', borderRight: '1px solid #000', background: '#fffff0' }}>
                      <div className="ah-cell">DATE OF ADMISSION:</div>
                    </td>
                    <td style={{ background: '#fffff0' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.dateOfAdmission)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* CERTIFICATES RECEIVED */}
          <tr>
            <td colSpan={4} style={{ padding: 0, background: '#fffff0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fffff0' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '32%', borderRight: '1px solid #000', background: '#fffff0' }}>
                      <div className="ah-cell">CERTIFICATES RECEIVED:</div>
                    </td>
                    <td style={{ background: '#fffff0' }}>
                      <div className="ah-cell-value" style={{ minHeight: 24 }}>{V(data.certificatesReceived)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* DETAILS OF FEE header */}
          <tr>
            <td colSpan={4} style={{ padding: 0, background: '#fffff0' }}>
              <div className="ah-cell" style={{ background: '#fffff0', fontSize: '9pt', padding: '5px 8px' }}>
                DETAILS OF FEE REMITTED AT THE TIME OF ADMISSION:
              </div>
            </td>
          </tr>

          {/* FEE CHECKBOXES */}
          <tr>
            <td colSpan={4} style={{ padding: 0, background: '#fffff0' }}>
              <div className="ah-fee-row" style={{ background: '#fffff0' }}>
                {[
                  ['ADMISSION FEE', data.admissionFee],
                  ['MISCELLANEOUS', data.miscellaneous],
                  ['FIRST TERM', data.firstTerm],
                  ['SECOND TERM', data.secondTerm],
                  ['THIRD TERM', data.thirdTerm],
                ].map(([label, val]) => (
                  <div key={label} className="ah-fee-item">
                    <div className="ah-checkbox">{val ? '✓' : ''}</div>
                    <span style={{ fontWeight: 700, fontSize: '8pt' }}>{label}</span>
                  </div>
                ))}
              </div>
            </td>
          </tr>

        </tbody>
      </table>

      {/* ── BOTTOM ── */}
      <div className="ah-bottom-row">
        <span>ADMINISTRATIVE MANAGER</span>
        <span>PRINCIPAL</span>
      </div>

    </div>
  )
}

/* ======================================================
   PAGE 2 — Exact replication of Malayalam rules page
   ====================================================== */
function Page2({ data }) {
  const submittedDate = data.submittedAt
    ? new Date(data.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''

  return (
    <div className="a4-sheet p2-sheet" id="page2">

      {/* Title */}
      <div className="p2-title">കോളേജ് – നിയമങ്ങളും നിർദേശങ്ങളും</div>

      {/* Main rules list */}
      <ul className="p2-list">
        <li>
          ഫോം ഫിൽ ചെയ്ത് <span className="p2-bold">₹ 3000</span> അഡ്മിഷൻ ഫീ അടക്കുന്നതോടെ നിങ്ങൾക്ക് കോളേജിൽ പ്രവേശനം ലഭിക്കും.
        </li>
        <li style={{ color: '#c0392b', fontWeight: 800 }}>
          <span className="p2-teal" style={{ color: '#c0392b' }}>യാതൊരു കാരണവശാലും അഡ്മിഷൻ ഫീ തിരികെ നൽകുന്നതല്ല.</span>
        </li>
        <li>
          ഒരു അക്കാദമിക വർഷത്തേക്കുള്ള <span className="p2-bold">കോളേജ് ഫീ ₹12,000</span> ആണ്.
        </li>
        <li>
          ജൂൺ മാസത്തിൽ തന്നെ ഒറ്റത്തവണയായി അടച്ചു തീർക്കുകയാണെങ്കിൽ ₹11,000 അടച്ചാൽ മതിയാവും.
        </li>
        <li>
          അല്ലെങ്കിൽ <span className="p2-bold">3 ഗഡുക്കൾ (3 Terms)</span> ആയാണ് ഫീസ് അടക്കേണ്ടത്.
        </li>
      </ul>

      {/* Term table */}
      <table className="p2-term-table">
        <thead>
          <tr>
            <th>1st TERM (BEFORE JULY 31)</th>
            <th>2nd TERM (BEFORE OCTOBER 31)</th>
            <th>3rd TERM (BEFORE JANUARY 31)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>₹ 4,000</strong></td>
            <td><strong>₹ 4,000</strong></td>
            <td><strong>₹ 4,000</strong></td>
          </tr>
        </tbody>
      </table>

      {/* More rules */}
      <ul className="p2-list">
        <li>
          ഏതെങ്കിലും കാരണവശാൽ <span className="p2-bold">പഠനം പാതി വഴിയിൽ ഉപേക്ഷിക്കുന്നവർ</span> ജൂലൈ അവസാനത്തിന് മുൻപാണെങ്കിൽ ആകെ ഫീസ്‌ 50% ഉം സെപ്റ്റംബർ അവസാനത്തിന് മുൻപാണെങ്കിൽ 75% ഉം നവംബറിന്‌ ശേഷമാണ് നിർത്തുന്നതെങ്കിൽ മുഴുവൻ ഫീസ്‌ അടച്ചു തീർക്കേണ്ടതാണ്.
        </li>
        <li>
          <span className="p2-bold">യൂണിവേഴ്സിറ്റി ഫീസും എക്സാമും</span> അതാത് സമയങ്ങളിൽ ക്ലിയർ ചെയ്യേണ്ടതാണ്.
        </li>
        <li>
          അഡ്മിഷൻ സമയത്ത് ഓഫീസിൽ ഏൽപ്പിക്കുന്ന <span className="p2-bold">എല്ലാ ഒറിജിനൽ സർട്ടിഫിക്കറ്റുകളും</span> കോഴ്‌സ് പൂർത്തിയാക്കുന്നതോടെ മാത്രമേ തിരികെ ലഭിക്കൂ.
        </li>
        <li>
          ഏതെങ്കിലും കാരണത്താൽ സർട്ടിഫിക്കറ്റുകൾ ആവശ്യം വരികയാണെങ്കിൽ <span className="p2-bold">₹2000 Caution Deposit</span> നൽകി കൈപ്പറ്റാവുന്നതാണ്.
        </li>
        <li>
          കൈപ്പറ്റിയ സർട്ടിഫിക്കറ്റ് <span className="p2-bold">10 ദിവസത്തിനകം തിരികെ</span> ഓഫീസിൽ നൽകി Caution Deposit തിരികെ വാങ്ങാവുന്നതാണ്.
        </li>
      </ul>

      <hr className="p2-divider" />

      {/* Attendance rules */}
      <ul className="p2-list">
        <li className="arrow-item">
          ക്ലാസ്സ് ദിവസങ്ങളിൽ <span className="p2-bold">രാവിലെ 09:50 ന് മുൻപായി</span> കോളേജിൽ എത്തേണ്ടതാണ്.
        </li>
        <li className="arrow-item">
          വെള്ളി, ഞായർ ദിവസങ്ങളും രണ്ടാം ശനിയും ഒഴിച്ചു ബാക്കി ആയതിനാൽ ഏറ്റവും ചുരുങ്ങിയത് <span className="p2-bold">മാസത്തിൽ ഒമ്പത് ലീവ് ലഭിക്കും</span>. അതുകൊണ്ടുതന്നെ ക്ലാസ് ദിവസങ്ങളിൽ യാതൊരു കാരണ വശാലും ലീവ് ആക്കാൻ പാടുള്ളതല്ല.
        </li>
        <li className="arrow-item">
          അത്യാവശ്യം ഒഴിച്ചുകൂടാൻ പറ്റാത്തതുമായ കാരണം കൊണ്ട് ലീവ് എടുക്കേണ്ടി വന്നാൽ <span className="p2-bold">രക്ഷിതാവ് ക്ലാസ് ടീച്ചറെ വിളിച്ച് അനുമതി വാങ്ങേണ്ടതാണ്.</span>
        </li>
        <li className="arrow-item">
          കോളേജ് നിർദേശിക്കുന്ന <span className="p2-bold">യൂണിഫോം</span> എല്ലാ കുട്ടികളും <span className="p2-bold">നിർബന്ധമായും ധരിച്ചിരിക്കണം</span>. കറുത്ത പർദ്ദയും കോളേജിൽ നിന്ന് നൽകുന്ന ഹിജാബുമാണ് നമ്മടെ യൂണിഫോം. കറുത്ത പർദ്ദ തന്നെ <span className="p2-bold">കൂടുതൽ ഡിസൈൻ ഉള്ളതോ മോഡൽ ആയതോ ധരിക്കാൻ പാടുള്ളതല്ല.</span>
        </li>
        <li className="arrow-item">
          രാവിലെ <span className="p2-bold">10:00</span> മുതൽ വൈകുന്നേരം <span className="p2-bold">03:30</span> വരെ ആണ് കോളേജ് സമയം.
        </li>
        <li className="arrow-item">
          മുഴുവൻ വിദ്യാർഥിനികളും കോളേജിൽ നിന്ന് ലഭിക്കുന്ന <span className="p2-bold">STUDENT ID CARD</span> നിർബന്ധമായും <span className="p2-bold">എല്ലാ ദിവസവും</span> ധരിച്ചിരിക്കണം.
        </li>
        <li className="arrow-item">
          രാവിലെ കൃത്യ സമയത്ത് വീട്ടിൽ നിന്ന് ഇറങ്ങുന്നുണ്ട് എന്നും വൈകുന്നേരം കൃത്യ സമയത്ത് തന്നെ <span className="p2-bold">മക്കൾ വീട്ടിൽ തിരിച്ചെത്തുന്നുണ്ടെന്നും രക്ഷിതാക്കൾ ഉറപ്പുവരുത്തണം.</span>
        </li>
        <li className="arrow-item">
          നിയമ ലംഘനങ്ങൾക്ക് <span className="p2-bold">ഫൈൻ അടക്കമുള്ള</span> മാതൃകാപരമായ <span className="p2-bold">ശിക്ഷാനടപടികൾ</span> ഉണ്ടായിരിക്കും നന്നാണ്.
        </li>
        <li className="arrow-item">
          എന്ത് ആവശ്യങ്ങൾക്കും രക്ഷിതാക്കൾ ഓഫീസ് നമ്പറിലോ ക്ലാസ് ടീച്ചറെയോ പ്രിൻസിപ്പലിനെയോ ബന്ധപ്പെടാവുന്നതാണ്.
        </li>
      </ul>

      {/* Declaration box */}
      <div className="p2-declaration-box">
        <p>
          മുകളിൽ പറഞ്ഞ എല്ലാ കാര്യങ്ങളും ഞാൻ / എന്റെ മകൾ കൃത്യമായി പാലിക്കുമെന്നും
          അവ ഞാൻ ശ്രദ്ധിക്കുമെന്നും വീഴ്ചകൾ വരുത്തുന്ന പക്ഷം കോളേജ് എടുക്കുന്ന ഏത്
          നടപടിക്കും സമ്മതമാണെന്നും ഞാൻ അറിയിച്ചുകൊള്ളുന്നു.
        </p>
      </div>

      {/* Signature table — all fields left blank for physical filling */}
      <table className="p2-sig-table">
        <tbody>
          <tr>
            <td style={{ width: '60%' }}>
              Parent Name:&nbsp;
              <span className="p2-sig-line" style={{ minWidth: 200 }}></span>
            </td>
            <td>
              Signature:&nbsp;
              <span className="p2-sig-line" style={{ minWidth: 130 }}></span>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ paddingTop: 6 }}>
              Student Name:&nbsp;
              <span className="p2-sig-line" style={{ minWidth: 260 }}></span>
              &nbsp;&nbsp;Signature:&nbsp;
              <span className="p2-sig-line" style={{ minWidth: 130 }}></span>
            </td>
          </tr>
          <tr>
            <td>
              Date:&nbsp;
              <span className="p2-sig-line" style={{ minWidth: 160 }}></span>
            </td>
            <td>
              Place:&nbsp;
              <span className="p2-sig-line" style={{ minWidth: 160 }}></span>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  )
}

/* ======================================================
   MAIN PRINT VIEW PAGE
   ====================================================== */
export default function PrintView() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const didAutoPrint = useRef(false)

  useEffect(() => {
    const loadAdmission = async () => {
      try {
        const response = await fetch(`/api/admissions/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true)
          } else {
            throw new Error('Server error')
          }
          return
        }
        const admissionData = await response.json()
        setData(admissionData)
      } catch (err) {
        console.error('Error fetching admission details:', err)
        setNotFound(true)
      }
    }
    if (id) {
      loadAdmission()
    }
  }, [id])

  useEffect(() => {
    if (data && !didAutoPrint.current) {
      const shouldPrint = searchParams.get('print') === '1'
      const shouldDownload = searchParams.get('download') === '1'
      if (shouldPrint || shouldDownload) {
        didAutoPrint.current = true
        setTimeout(() => window.print(), 900)
      }
    }
  }, [data, searchParams])

  if (notFound) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f4f8', gap: 16 }}>
        <div style={{ fontSize: '4rem' }}>📋</div>
        <h2 style={{ color: '#1a5c5c' }}>Admission Not Found</h2>
        <p style={{ color: '#888' }}>The admission record could not be found.</p>
        <Link to="/admin" className="btn-sm btn-view" style={{ padding: '10px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Back to Admin
        </Link>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f4f8' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⏳</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="print-view-page">
      {/* Toolbar – hidden on print */}
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

      {/* Preview */}
      <div className="print-preview-area">
        <Page1 data={data} />
        <Page2 data={data} />
      </div>
    </div>
  )
}
