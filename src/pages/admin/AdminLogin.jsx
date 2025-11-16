"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import api from "../../utils/api"
import { setAdminToLocalStorage } from "../../utils/localStorage"

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    setError("")
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFieldErrors({})

    try {
      const response = await api.post('/admin/auth/login', formData)
      
      if (response.data.success) {
        setAdminToLocalStorage(response.data.data.admin, response.data.data.token)
        
        // Redirect to intended page or admin dashboard
        const from = location.state?.from?.pathname || '/admin'
        navigate(from, { replace: true })
      }
    } catch (err) {
      console.error('Admin login error:', err)
      const errorData = err.response?.data
      const errorMessage = errorData?.message || 'Admin login failed. Please try again.'
      
      setError(errorMessage)
      
      if (errorData?.errors) {
        setFieldErrors(errorData.errors)
      }

      if (errorData?.old) {
        setFormData(prev => ({
          ...prev,
          ...errorData.old,
          password: ""
        }))
      }

      if (!err.response) {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img src="/logo.png" alt="PayPal" className="h-12 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the PayPal administration panel
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Admin Email"
                className={`appearance-none rounded-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  fieldErrors.email 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1 px-3">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`appearance-none rounded-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  fieldErrors.password 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                required
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1 px-3">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In as Admin"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              ← Back to User Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}