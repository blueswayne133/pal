// PhoneVerificationModal.jsx
import { useState, useEffect } from 'react'
import api from '../../../../utils/api'


export default function PhoneVerificationModal({ onClose, onVerified }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) return

    setLoading(true)
    try {
      const response = await api.post('/user/phone/verify', { otp: otpString })
      
      if (response.data.success) {
        onVerified()
      }
    } catch (error) {
      console.error('Verification failed:', error)
      alert(error.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    try {
      const response = await api.post('/user/phone/resend-otp')
      
      if (response.data.success) {
        setCountdown(60) // 60 seconds countdown
        alert('OTP resent successfully')
      }
    } catch (error) {
      console.error('Resend failed:', error)
      alert(error.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-2">Verify Phone Number</h3>
        <p className="text-gray-600 text-sm mb-6">
          Enter the 6-digit code sent to your phone number.
        </p>
        
        <div className="space-y-6">
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={resendLoading || countdown > 0}
              className="text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}