import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdmissionForm from './pages/AdmissionForm.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import PrintView from './pages/PrintView.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdmissionForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/view/:id" element={<PrintView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
