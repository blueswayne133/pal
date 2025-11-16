export default function WalletCards() {
  return (
    <div className="flex-1 px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Link a card option */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8H4V4h16m1 13H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Link a card</p>
          </div>

          {/* Selected Card Box */}
          <div className="border-2 border-blue-600 rounded-lg p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 8H4V4h16m1 13H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">PayPal balance</p>
                <p className="text-gray-600">$0.00 Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center gap-8">
          {/* PayPal balance display */}
          <div className="w-full border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-white border-2 border-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8H4V4h16m1 13H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2z" />
              </svg>
            </div>
            <p className="text-gray-900 font-medium mb-2">PayPal balance</p>
            <h2 className="text-5xl font-bold text-gray-900 mb-2">$0.00</h2>
            <p className="text-gray-600 mb-8">Available</p>

            <div className="flex flex-col gap-4 w-full">
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-center">
                Add a currency
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-center">
                Currency Calculator
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
