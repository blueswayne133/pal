export default function StatsSection() {
  const stats = [
    { number: "400M+", label: "Active Accounts" },
    { number: "200+", label: "Markets" },
    { number: "100+", label: "Currencies" },
    { number: "99.9%", label: "Uptime" }
  ]

  return (
    <section className="py-16 md:py-24 px-4 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}