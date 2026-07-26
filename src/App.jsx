import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdmissionForm from './pages/AdmissionForm.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import PrintView from './pages/PrintView.jsx'
import EditAdmission from './pages/EditAdmission.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<AdmissionForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected — require login */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/view/:id" element={
          <ProtectedRoute><PrintView /></ProtectedRoute>
        } />
        <Route path="/admin/edit/:id" element={
          <ProtectedRoute><EditAdmission /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
