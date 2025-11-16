export default function SecurityFeatures() {
  const features = [
    {
      icon: "🔒",
      title: "Encryption",
      description: "Your financial information is encrypted and secure.",
      details: "We use industry-leading encryption to protect your data"
    },
    {
      icon: "🛡️",
      title: "Fraud Monitoring",
      description: "24/7 monitoring to detect and prevent suspicious activity.",
      details: "Real-time monitoring across all transactions"
    },
    {
      icon: "📱",
      title: "Two-Factor Authentication",
      description: "Extra security layer for your account access.",
      details: "Add an additional security step when signing in"
    },
    {
      icon: "💰",
      title: "Purchase Protection",
      description: "Get your money back if something goes wrong.",
      details: "Coverage for eligible purchases that don't arrive or match description"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-16">
          How we protect you
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <p className="text-sm text-gray-500">{feature.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}