import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"
import OTPVerification from "./pages/auth/OTPVerification"
import ProtectedRoute from "./components/ProtectedRoute"
import UserDashboard from "./pages/user/UserDashboard"
import BusinessPage from "./pages/home/BusinessPage"
import SecurityPage from "./pages/home/SecurityPage"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProtectedRoute from "./components/AdminProtectedRoute"

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/security" element={<SecurityPage />} />
      
      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected User Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      {/* Fallback Route - 404 Page */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <a 
              href="/" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      } />
    </Routes>
  )
}

export default App