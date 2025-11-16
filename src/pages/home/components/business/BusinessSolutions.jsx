export default function BusinessSolutions() {
  const solutions = [
    {
      icon: "💳",
      title: "Accept Payments",
      description: "Get paid online and in person with PayPal solutions.",
      features: ["Online payments", "In-person payments", "Mobile payments"]
    },
    {
      icon: "📊",
      title: "Manage Cash Flow",
      description: "Track sales, send invoices, and access working capital.",
      features: ["Business analytics", "Invoice tools", "Working capital"]
    },
    {
      icon: "🌍",
      title: "Go Global",
      description: "Sell internationally with currency conversion and fraud protection.",
      features: ["Global payments", "Currency conversion", "Fraud protection"]
    }
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-16">
          Business solutions that work for you
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">{solution.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">{solution.title}</h3>
              <p className="text-gray-600 mb-6">{solution.description}</p>
              <ul className="space-y-2">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}