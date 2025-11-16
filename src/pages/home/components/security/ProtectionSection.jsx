export default function ProtectionSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8">
              PayPal Buyer Protection
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Shop with confidence. If your eligible purchase doesn't arrive or match the seller's description, 
              we'll help you get your money back.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Coverage for items that don't arrive</span>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Protection for significantly not as described items</span>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Unauthorized transaction monitoring</span>
              </li>
            </ul>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition">
              Learn About Protection
            </button>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1563013544-824ae1c83d3f?w=600&h=500&fit=crop"
              alt="Security Protection"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}