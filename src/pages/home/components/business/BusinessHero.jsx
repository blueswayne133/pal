export default function BusinessHero() {
  return (
    <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
          Grow your business with PayPal
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Accept payments, send invoices, and manage your finances—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition">
            Open a Business Account
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  )
}