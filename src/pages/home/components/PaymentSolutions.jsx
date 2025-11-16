"use client"

import { useState } from "react"

export default function PaymentSolutions() {
  const [activeSolution, setActiveSolution] = useState(0)

  const solutions = [
    {
      title: "Online Payments",
      description: "Accept payments on your website or app with our secure checkout.",
      features: ["One-touch checkout", "Multiple payment methods", "Mobile optimized"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      icon: "🛒"
    },
    {
      title: "In-Person Payments",
      description: "Take payments anywhere with our mobile solutions and hardware.",
      features: ["QR code payments", "Card readers", "Contactless payments"],
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=600&h=400&fit=crop",
      icon: "📱"
    },
    {
      title: "Invoice & Billing",
      description: "Create professional invoices and manage recurring billing.",
      features: ["Automated invoicing", "Recurring billing", "Payment tracking"],
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
      icon: "🧾"
    },
    {
      title: "International Payments",
      description: "Send and receive money across borders with competitive rates.",
      features: ["25+ currencies", "Low conversion fees", "Fast transfers"],
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop",
      icon: "🌐"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            Complete Payment Solutions
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Everything you need to accept payments, manage your business, and grow
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Solution Selector */}
          <div className="lg:w-1/3">
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSolution(index)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                    activeSolution === index
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{solution.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{solution.title}</h3>
                      <p className={`text-sm ${
                        activeSolution === index ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Solution Details */}
          <div className="lg:w-2/3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <img
                    src={solutions[activeSolution].image}
                    alt={solutions[activeSolution].title}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {solutions[activeSolution].title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {solutions[activeSolution].description}
                  </p>
                  <ul className="space-y-3">
                    {solutions[activeSolution].features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}