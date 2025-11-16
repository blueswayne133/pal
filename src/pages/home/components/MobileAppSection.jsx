export default function MobileAppSection() {
  const features = [
    {
      icon: "👆",
      title: "One Touch Payments",
      description: "Check out faster without entering your password"
    },
    {
      icon: "📲",
      title: "Send Money Instantly",
      description: "Split bills or send money to friends and family"
    },
    {
      icon: "💎",
      title: "Deals & Rewards",
      description: "Get exclusive cashback and shopping deals"
    },
    {
      icon: "🛡️",
      title: "Security Alerts",
      description: "Instant notifications for account activity"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* Mock Phone */}
            <div className="relative mx-auto max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[3rem] transform rotate-6 scale-105 opacity-20"></div>
              <div className="relative bg-black rounded-[2.5rem] p-4 border-[12px] border-gray-800 shadow-2xl">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl z-10"></div>
                
                {/* Screen content */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2rem] h-96 overflow-hidden relative">
                  {/* App header */}
                  <div className="bg-white/10 backdrop-blur-sm p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                        <span className="font-bold">PayPal</span>
                      </div>
                      <div className="text-sm">$1,245.80</div>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {["Send", "Request", "Pay", "More"].map((action, index) => (
                      <button key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white text-sm font-medium hover:bg-white/30 transition">
                        {action}
                      </button>
                    ))}
                  </div>
                  
                  {/* Recent transactions */}
                  <div className="bg-white/10 backdrop-blur-sm m-4 rounded-2xl p-4">
                    <h4 className="text-white font-semibold mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {[
                        { name: "Amazon", amount: "-$45.99", time: "2 min ago", type: "payment" },
                        { name: "John Doe", amount: "+$25.00", time: "1 hour ago", type: "received" },
                        { name: "Netflix", amount: "-$15.99", time: "2 days ago", type: "payment" }
                      ].map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.type === 'payment' ? 'bg-red-400' : 'bg-green-400'
                            }`}>
                              {transaction.type === 'payment' ? '↑' : '↓'}
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">{transaction.name}</div>
                              <div className="text-white/60 text-xs">{transaction.time}</div>
                            </div>
                          </div>
                          <div className={`font-semibold ${
                            transaction.type === 'payment' ? 'text-red-300' : 'text-green-300'
                          }`}>
                            {transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              PayPal in your pocket
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Manage your money, send payments, and discover deals—all from your mobile device. 
              The PayPal app puts financial freedom at your fingertips.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.924 17.315c-.057.174-.193.332-.348.367-.156.035-.34-.054-.484-.216-.144-.163-.207-.38-.15-.554.057-.174.193-.332.348-.367.156-.035.34.054.484.216.144.163.207.38.15.554zm-1.663 1.823c-.143.165-.342.255-.552.255-.079 0-.159-.012-.237-.037-.311-.103-.498-.41-.498-.741 0-.242.113-.469.307-.613.143-.165.342-.255.552-.255.079 0 .159.012.237.037.311.103.498.41.498.741 0 .242-.113.469-.307.613zm-2.172-1.823c-.057.174-.193.332-.348.367-.156.035-.34-.054-.484-.216-.144-.163-.207-.38-.15-.554.057-.174.193-.332.348-.367.156-.035.34.054.484.216.144.163.207.38.15.554zm-1.663 1.823c-.143.165-.342.255-.552.255-.079 0-.159-.012-.237-.037-.311-.103-.498-.41-.498-.741 0-.242.113-.469.307-.613.143-.165.342-.255.552-.255.079 0 .159.012.237.037.311.103.498.41.498.741 0 .242-.113.469-.307.613z"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                Google Play
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}