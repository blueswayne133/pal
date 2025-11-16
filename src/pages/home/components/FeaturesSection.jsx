export default function FeaturesSection() {
  return (
    <section className="bg-gradient-to-b from-blue-700 to-blue-900 text-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-16">
          Join 200M active PayPal accounts worldwide.
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Feature 1 */}
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">Safer and protected</h3>
            <p className="text-gray-100 text-base md:text-lg mb-6 leading-relaxed">
              Shop with peace of mind. We don't share your full financial information with sellers. And PayPal Buyer
              Protection covers your eligible purchases if they don't show up or match their description.
            </p>
            <a href="#" className="text-blue-200 hover:text-white font-semibold underline">
              More about security
            </a>
          </div>

          {/* Feature 2 */}
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">Mostly free, always upfront</h3>
            <p className="text-gray-100 text-base md:text-lg mb-6 leading-relaxed">
              It's free to open a PayPal account and buy something using PayPal unless it involves a currency
              conversion.
            </p>
            <a href="#" className="text-blue-200 hover:text-white font-semibold underline">
              More about fees
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
