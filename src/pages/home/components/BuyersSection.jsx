"use client"

import { useState } from "react"

export default function BuyersSection() {
  const [activeTab, setActiveTab] = useState("buyers")

  const steps = [
    {
      number: 1,
      title: "Sign up",
      description: "Sign up with just an email address and password.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=600&fit=crop",
    },
    {
      number: 2,
      title: "Add Payment",
      description: "Securely add your cards.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1c83d3f?w=500&h=600&fit=crop",
    },
    {
      number: 3,
      title: "Checkout",
      description: "Use the PayPal button to check out with just an email address and password.",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=600&fit=crop",
    },
  ]

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-4">
          PayPal connects buyers and sellers.
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-12 md:mb-16">
          <button
            onClick={() => setActiveTab("buyers")}
            className={`pb-2 font-semibold text-lg border-b-2 transition ${
              activeTab === "buyers" ? "text-gray-800 border-gray-800" : "text-gray-400 border-transparent"
            }`}
          >
            For buyers
          </button>
          <button
            onClick={() => setActiveTab("sellers")}
            className={`pb-2 font-semibold text-lg border-b-2 transition ${
              activeTab === "sellers" ? "text-gray-800 border-gray-800" : "text-gray-400 border-transparent"
            }`}
          >
            For sellers
          </button>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Image */}
              <div className="mb-8 w-full h-48 md:h-56 bg-white rounded-lg shadow-lg flex items-center justify-center">
                <img
                  src={step.image || "/placeholder.svg"}
                  alt={`Step ${step.number}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Step Info */}
              <div className="flex gap-4 text-left">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-gray-300 text-gray-600 font-semibold">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learn More Button */}
        <div className="flex justify-center">
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
