import { Lock, Users, Shield, LogIn } from "lucide-react"

export default function SecuritySettings({ user }) {
  const handleUpdatePassword = () => {
    // Implement password update functionality
    alert('Password update feature coming soon')
  }

  const handleManagePasskeys = () => {
    // Implement passkeys management
    alert('Passkeys management coming soon')
  }

  const handleSetup2FA = () => {
    // Implement 2FA setup
    alert('2-step verification setup coming soon')
  }

  const handleAutoLogin = () => {
    // Implement auto login management
    alert('Auto login management coming soon')
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 mx-auto text-blue-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Security</h2>
      </div>

      <div className="space-y-4">
        {/* Password */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Password</h3>
              <p className="text-sm text-gray-600">Create or update your password.</p>
            </div>
          </div>
          <button 
            onClick={handleUpdatePassword}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Update
          </button>
        </div>

        {/* Passkeys */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Passkeys</h3>
              <p className="text-sm text-gray-600">Seamlessly log in using your fingerprint, face, or PIN.</p>
            </div>
          </div>
          <button 
            onClick={handleManagePasskeys}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Manage
          </button>
        </div>

        {/* 2-step Verification */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">2-step verification</h3>
              <p className="text-sm text-gray-600">Protect your account with an extra layer of security.</p>
            </div>
          </div>
          <button 
            onClick={handleSetup2FA}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Set Up
          </button>
        </div>

        {/* Auto login */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <LogIn className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Auto login</h3>
              <p className="text-sm text-gray-600">
                Checkout faster without having to log in every time. Manage auto login on your devices.
              </p>
            </div>
          </div>
          <button 
            onClick={handleAutoLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}