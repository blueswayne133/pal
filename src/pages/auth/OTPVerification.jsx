"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import api from "../../utils/api"
import { setUserToLocalStorage } from "../../utils/localStorage"

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(1800)
  const [email, setEmail] = useState("")
  const [otpToken, setOtpToken] = useState("")
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()

  // Initialize from location state
  useEffect(() => {
    console.log('OTP Verification - Location state:', location.state)
    if (location.state?.email) {
      setEmail(location.state.email)
    }
    if (location.state?.otpToken) {
      setOtpToken(location.state.otpToken)
    }
    if (location.state?.message) {
      setError(location.state.message)
    }
  }, [location.state])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus()
      }

      // Auto-submit when all fields are filled
      if (newOtp.every(digit => digit !== "") && index === 5) {
        handleVerify(newOtp.join(""))
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, 6)
      while (newOtp.length < 6) newOtp.push("")
      setOtp(newOtp)
      
      // Focus the last input
      const lastFilledIndex = newOtp.findIndex(digit => digit === "") - 1
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : 5
      inputRefs.current[focusIndex].focus()
    }
  }

  const handleVerify = async (otpCode = otp.join("")) => {
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit OTP code")
      return
    }

    if (!email || !otpToken) {
      setError("Missing verification data. Please try logging in again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log('Verifying OTP for email:', email)
      // Direct API call - CSRF handled automatically
      const response = await api.post('/api/auth/verify-otp', {
        email,
        otp_code: otpCode,
        otp_token: otpToken
      })

      console.log('OTP verification response:', response.data)

      if (response.data.success) {
        // Store token and user data
        setUserToLocalStorage(response.data.data.user, response.data.data.token)
        
        // Show success message
        setError("")
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err) {
      console.error('OTP verification error:', err)
      const errorData = err.response?.data
      setError(errorData?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      setError("Email not found. Please try logging in again.")
      return
    }

    setResendLoading(true)
    setError("")

    try {
      // Direct API call - CSRF handled automatically
      const response = await api.post('/api/auth/resend-otp', { email })
      
      if (response.data.success) {
        setOtpToken(response.data.data.otp_token)
        setCountdown(1800)
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0].focus()
        setError("")
      }
    } catch (err) {
      const errorData = err.response?.data
      setError(errorData?.message || 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/login', {
      state: { email }
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">PayPal</div>
          <button
            onClick={handleBack}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 font-medium"
          >
            Back
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Verify your email</h1>
            <p className="text-gray-600">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              The code will expire in {formatTime(countdown)}
            </p>
          </div>

          {error && (
            <div className={`px-4 py-3 rounded-lg mb-6 ${
              error.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          {/* OTP Input Boxes */}
          <div className="mb-8">
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              onClick={() => handleVerify()}
              disabled={loading || otp.some(digit => digit === "")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          {/* Resend OTP Section */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Didn't receive the code?{" "}
              {countdown > 0 ? (
                <span className="text-gray-400">
                  Resend in {formatTime(countdown)}
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </p>
            
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Use a different email address
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Legal</a>
          <a href="#" className="hover:text-gray-900">Contact</a>
          <a href="#" className="hover:text-gray-900">Feedback</a>
        </div>
      </footer>
    </div>
  )
}