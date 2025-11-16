export default function IntegrationSection() {
  const integrations = [
    {
      name: "Shopify",
      logo: "🛍️",
      description: "Seamlessly integrate with your online store",
      category: "E-commerce"
    },
    {
      name: "WooCommerce",
      logo: "🛒",
      description: "WordPress e-commerce made easy",
      category: "E-commerce"
    },
    {
      name: "QuickBooks",
      logo: "📊",
      description: "Sync with your accounting software",
      category: "Finance"
    },
    {
      name: "Salesforce",
      logo: "☁️",
      description: "Connect with your CRM platform",
      category: "Business Tools"
    },
    {
      name: "Slack",
      logo: "💬",
      description: "Get payment notifications in Slack",
      category: "Communication"
    },
    {
      name: "Zapier",
      logo: "⚡",
      description: "Connect with 3000+ apps automatically",
      category: "Automation"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            Works with your favorite tools
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Integrate PayPal with the platforms you already use to streamline your workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition duration-300 group border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl group-hover:scale-110 transition duration-300">
                  {integration.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{integration.name}</h3>
                  <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-full">
                    {integration.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {integration.description}
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Connect
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold transition duration-300">
            View All Integrations
          </button>
        </div>
      </div>
    </section>
  )
}