export default function SecurityHero() {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
          Your security is our priority
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Advanced protection for your money and personal information
        </p>
      </div>
    </section>
  )
}