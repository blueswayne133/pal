export default function SecurityTips() {
  const tips = [
    {
      title: "Strong Passwords",
      description: "Use unique, complex passwords for your accounts",
      icon: "🔑"
    },
    {
      title: "Monitor Activity",
      description: "Regularly check your account for unusual activity",
      icon: "👀"
    },
    {
      title: "Update Regularly",
      description: "Keep your apps and devices up to date",
      icon: "🔄"
    },
    {
      title: "Verify Emails",
      description: "Check sender addresses before clicking links",
      icon: "✉️"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-16">
          Security tips for you
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-4">{tip.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{tip.title}</h3>
              <p className="text-gray-600 text-sm">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}