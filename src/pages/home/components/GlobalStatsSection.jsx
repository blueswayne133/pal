export default function GlobalStatsSection() {
  const stats = [
    {
      icon: "🌍",
      value: "200+",
      label: "Countries & Regions",
      description: "Serving customers worldwide"
    },
    {
      icon: "💼",
      value: "30M+",
      label: "Businesses",
      description: "Trusted by companies of all sizes"
    },
    {
      icon: "💸",
      value: "$1.3T+",
      label: "Annual Payment Volume",
      description: "Processed through our platform"
    },
    {
      icon: "📱",
      value: "4.8★",
      label: "App Store Rating",
      description: "Rated by millions of users"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            Trusted Worldwide
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Join millions of users and businesses who rely on PayPal for their financial needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {stat.label}
              </h3>
              <p className="text-gray-600 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex flex-wrap justify-center gap-6 max-w-2xl">
            {["Fortune 500", "Startups", "Non-Profits", "Freelancers", "Enterprises"].map((type, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-medium text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}