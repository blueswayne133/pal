import { Share2, Cookie, Ban, Download, Edit2 } from "lucide-react"

export default function DataPrivacySettings({ user }) {
  const handleDownloadData = async () => {
    // Implement data download functionality
    alert('Data download feature coming soon')
  }

  const handleManageCookies = () => {
    // Implement cookie management
    alert('Cookie management coming soon')
  }

  const handleBlockedContacts = () => {
    // Implement blocked contacts management
    alert('Blocked contacts management coming soon')
  }

  const handlePermissions = () => {
    // Implement permissions management
    alert('Permissions management coming soon')
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Data & Privacy</h2>

      {/* Manage Privacy Settings */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Manage your privacy settings</h3>

        <div className="space-y-4">
          {/* Permissions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Share2 className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">Permissions you've given</h4>
              <p className="text-sm text-gray-600">
                Keep track of the data and permissions you're sharing with the apps and sites you use.
              </p>
            </div>
            <button 
              onClick={handlePermissions}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage
            </button>
          </div>

          {/* Cookies */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Cookie className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">Manage your cookies</h4>
              <p className="text-sm text-gray-600">Control how we use cookies and manage your browsing experience.</p>
            </div>
            <button 
              onClick={handleManageCookies}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage
            </button>
          </div>

          {/* Blocked Contacts */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Ban className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">Blocked contacts</h4>
              <p className="text-sm text-gray-600">Review and edit the people you previously blocked.</p>
            </div>
            <button 
              onClick={handleBlockedContacts}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Manage Data */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Manage your data</h3>

        <div className="space-y-4">
          {/* Download Data */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Download className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">Download your data</h4>
              <p className="text-sm text-gray-600">
                Get a copy of your account data, such as personal and financial information, and activity.
              </p>
            </div>
            <button 
              onClick={handleDownloadData}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Download
            </button>
          </div>

          {/* Correct Data */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Edit2 className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">Correct your data</h4>
              <p className="text-sm text-gray-600">Change or update your personal or financial information.</p>
            </div>
            <span className="text-gray-400 font-medium">Use Account tab</span>
          </div>
        </div>
      </div>
    </div>
  )
}