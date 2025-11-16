export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-gray-200">
          <div className="font-bold text-2xl text-gray-900">PayPal</div>
          <div className="flex gap-8">
            <a href="#help" className="text-gray-600 hover:text-gray-900 transition-colors">
              Help
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact Us
            </a>
            <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">
              Security
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div className="py-8 border-b border-gray-200">
          <p className="text-gray-600 text-sm mb-4">©1999-2025 PayPal, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Privacy
            </a>
            <a href="#cookies" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Cookies
            </a>
            <a href="#legal" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Legal
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8">
          <p className="text-gray-600 text-xs leading-relaxed">
            PayPal Pte. Ltd. is licensed by the Monetary Authority of Singapore as a Major Payment Institution under the
            Payment Services Act 2019.
          </p>
        </div>
      </div>
    </footer>
  )
}
