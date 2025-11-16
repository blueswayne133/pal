export default function SellerToolsSettings({ user }) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Seller Tools</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Seller Account</h3>
          <p className="text-gray-600">Tools and settings for business accounts</p>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Set Up Business Profile
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            View Seller Dashboard
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Business Preferences</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Business Name</span>
            <span className="font-medium">Not set</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Tax ID</span>
            <span className="font-medium">Not provided</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Business Address</span>
            <span className="font-medium">Not set</span>
          </div>
        </div>
      </div>
    </div>
  )
}