export default function EveryoneSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-20">
          PayPal is for everyone who pays online.
        </h2>

        {/* Individual Card */}
        <div className="text-center mb-20">
          <div className="mb-8 flex justify-center">
            <svg
              className="w-16 h-16 md:w-20 md:h-20 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c2 2 2 4 2 6s-1 4-2 6-2 0-2 0c-1-2-2-4-2-6s1-4 2-6zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
              />
            </svg>
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">Individuals</h3>
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Find out why we have more than 200M active accounts worldwide.
          </p>
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition">
            Learn More
          </button>
        </div>

        {/* Second Buyers Section */}
        <div className="border-t pt-16 md:pt-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-12">
            PayPal connects buyers and sellers.
          </h2>
          <div className="flex justify-center gap-8 mb-12">
            <button className="pb-2 font-semibold text-lg border-b-2 border-gray-800 text-gray-800">For buyers</button>
            <button className="pb-2 font-semibold text-lg border-b-2 border-transparent text-gray-400">
              For sellers
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
