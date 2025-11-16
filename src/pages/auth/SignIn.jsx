"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../home/components/Header"
import api from "../../utils/api"
import { setUserToLocalStorage } from "../../utils/localStorage"

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email
      }))
    }
    
    if (location.state?.success) {
      setSuccess(location.state.success)
    }
  }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    setError("")
    setSuccess("")
    
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
    setSuccess("")
    setFieldErrors({})

    try {
      const response = await api.post('/auth/login', formData)
      
      if (response.data.success) {
        setSuccess('Login successful! Redirecting...')
        setUserToLocalStorage(response.data.data.user, response.data.data.token)
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorData = err.response?.data
      const errorMessage = errorData?.message || 'Login failed. Please try again.'
      
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="text-3xl font-bold text-black mb-6">PayPal</div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email or mobile number"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${
                  fieldErrors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                }`}
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${
                  fieldErrors.password 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                }`}
                required
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="text-right">
              <a href="#" className="text-blue-600 hover:underline text-sm font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Log In"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <button
            onClick={() => navigate("/signup")}
            className="w-full border-2 border-black hover:bg-black hover:text-white text-black py-3 rounded-full font-semibold transition"
          >
            Sign Up
          </button>

          <div className="text-center mt-8">
            <button className="text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto">
              <span className="text-lg">🇺🇸</span>
              <span className="text-sm">English</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900">Contact Us</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Legal</a>
          <a href="#" className="hover:text-gray-900">Policy Updates</a>
          <a href="#" className="hover:text-gray-900">Worldwide</a>
        </div>
      </footer>
    </div>
  )
}