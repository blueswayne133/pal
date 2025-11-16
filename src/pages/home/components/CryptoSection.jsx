export default function CryptoSection() {
  const cryptoFeatures = [
    {
      icon: "🔐",
      title: "Secure Storage",
      description: "Industry-leading security for your cryptocurrency holdings"
    },
    {
      icon: "💱",
      title: "Easy Trading",
      description: "Buy, sell, and hold multiple cryptocurrencies"
    },
    {
      icon: "🛒",
      title: "Shop with Crypto",
      description: "Use your crypto to pay at millions of merchants"
    },
    {
      icon: "📊",
      title: "Real-time Charts",
      description: "Track prices and manage your portfolio"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm font-medium">New Feature</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              Buy, sell, and hold cryptocurrency
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Explore the world of crypto with PayPal. Buy, sell, and hold Bitcoin, Ethereum, 
              and other cryptocurrencies with the security you trust.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {cryptoFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-2xl mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-blue-200 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-semibold transition">
                Explore Crypto
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-purple-900 text-white px-8 py-3 rounded-full font-semibold transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Popular Cryptocurrencies</h3>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Bitcoin", symbol: "BTC", price: "$45,231.50", change: "+2.3%", icon: "₿" },
                  { name: "Ethereum", symbol: "ETH", price: "$3,245.80", change: "+1.8%", icon: "Ξ" },
                  { name: "Litecoin", symbol: "LTC", price: "$78.45", change: "+0.5%", icon: "Ł" },
                  { name: "Bitcoin Cash", symbol: "BCH", price: "$285.90", change: "-0.2%", icon: "Ƀ" }
                ].map((crypto, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
                        {crypto.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{crypto.name}</div>
                        <div className="text-blue-200 text-sm">{crypto.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{crypto.price}</div>
                      <div className={`text-sm ${crypto.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
}