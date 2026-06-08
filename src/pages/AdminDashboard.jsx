import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [admissions, setAdmissions] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadAdmissions()
  }, [])

  const loadAdmissions = () => {
    const data = JSON.parse(localStorage.getItem('alhikma_admissions') || '[]')
    setAdmissions(data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this admission?')) return
    const updated = admissions.filter(a => a.id !== id)
    localStorage.setItem('alhikma_admissions', JSON.stringify(updated))
    setAdmissions(updated)
  }

  const handlePrint = (id) => {
    window.open(`/admin/view/${id}?print=1`, '_blank')
  }

  const handleDownload = (id) => {
    window.open(`/admin/view/${id}?download=1`, '_blank')
  }

  const filtered = admissions.filter(a => {
    const q = search.toLowerCase()
    return (
      a.name?.toLowerCase().includes(q) ||
      a.refNo?.toLowerCase().includes(q) ||
      a.course?.toLowerCase().includes(q) ||
      a.district?.toLowerCase().includes(q) ||
      a.ownMobile?.includes(q)
    )
  })

  const today = new Date().toDateString()
  const todayCount = admissions.filter(a => new Date(a.submittedAt).toDateString() === today).length

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>📋 Admin Dashboard</h1>
          <p>Al Hikma Women's College — Admissions Management 2026</p>
        </div>
        <Link to="/" className="btn-sm btn-view" style={{ padding: '10px 22px', fontSize: '0.88rem', textDecoration: 'none' }}>
          ← Back to Form
        </Link>
      </header>

      <div className="admin-content">
        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div>
              <div className="stat-num">{admissions.length}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">📅</div>
            <div>
              <div className="stat-num">{todayCount}</div>
              <div className="stat-label">Today's Applications</div>
            </div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon">🎓</div>
            <div>
              <div className="stat-num">
                {[...new Set(admissions.map(a => a.course).filter(Boolean))].length}
              </div>
              <div className="stat-label">Courses Applied</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-header-bar">
            <h2>All Admissions</h2>
            <input
              type="text"
              className="search-input"
              placeholder="🔍  Search by name, course, ref..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="no-data">
              <div className="no-data-icon">📭</div>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 6 }}>
                {admissions.length === 0 ? 'No applications yet' : 'No results found'}
              </p>
              <p style={{ fontSize: '0.88rem' }}>
                {admissions.length === 0
                  ? 'Applications submitted by visitors will appear here.'
                  : 'Try a different search term.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admissions-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ref No.</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Mobile</th>
                    <th>District</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr key={a.id}>
                      <td style={{ color: '#aaa', fontWeight: 600 }}>{i + 1}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem', color: '#1a5276' }}>
                          {a.refNo}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{a.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#999' }}>{a.fatherName ? `S/o D/o ${a.fatherName}` : ''}</div>
                      </td>
                      <td>{a.course || '—'}</td>
                      <td>{a.ownMobile || '—'}</td>
                      <td>{a.district || '—'}</td>
                      <td style={{ fontSize: '0.8rem', color: '#888' }}>
                        {new Date(a.submittedAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                        <br />
                        <span style={{ fontSize: '0.72rem' }}>
                          {new Date(a.submittedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td><span className="status-badge">Received</span></td>
                      <td>
                        <div className="actions-cell">
                          <Link
                            to={`/admin/view/${a.id}`}
                            className="btn-sm btn-view"
                            title="View full form"
                          >
                            👁 View
                          </Link>
                          <button
                            className="btn-sm btn-print"
                            onClick={() => handlePrint(a.id)}
                            title="Print form"
                          >
                            🖨 Print
                          </button>
                          <button
                            className="btn-sm btn-download"
                            onClick={() => handleDownload(a.id)}
                            title="Download as PDF"
                          >
                            ⬇ PDF
                          </button>
                          <button
                            className="btn-sm btn-delete"
                            onClick={() => handleDelete(a.id)}
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.78rem', color: '#bbb' }}>
          Al Hikma Women's College — Indira Nagar, Kasaragod | Admin Panel
        </p>
      </div>
    </div>
  )
}
