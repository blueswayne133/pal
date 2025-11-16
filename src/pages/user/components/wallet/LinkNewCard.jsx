export default function LinkNewCard() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 border-b border-gray-200">
      {/* Card Illustration */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-48 h-40">
          <svg
            viewBox="0 0 240 160"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="40" y="30" width="160" height="100" rx="12" fill="#87CEEB" opacity="0.3" />
            <rect x="50" y="35" width="140" height="90" rx="10" fill="#6BA3D9" />
            <rect x="60" y="45" width="16" height="20" rx="2" fill="#0052CC" />
            <circle cx="70" cy="55" r="2" fill="#FFD700" />
            <circle cx="70" cy="62" r="2" fill="#FFD700" />
            <path d="M 100 45 Q 120 35 140 50" stroke="#87CEEB" strokeWidth="4" />
            <circle cx="180" cy="70" r="22" fill="#4CAF50" />
            <line x1="173" y1="70" x2="187" y2="70" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="180" y1="63" x2="180" y2="77" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Link a new card</h2>
      <p className="text-gray-600 text-center max-w-md">
        Join the millions of customers who use PayPal to pay for everyday purchases any time, any day, anywhere.
      </p>

      <button className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors">
        Link a card
      </button>
    </div>
  )
}
