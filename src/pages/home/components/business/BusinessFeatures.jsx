export default function BusinessFeatures() {
  const features = [
    {
      title: "Fast Checkout",
      description: "Reduce cart abandonment with our one-touch checkout.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=400&fit=crop"
    },
    {
      title: "Fraud Protection",
      description: "Advanced security to protect your business and customers.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1c83d3f?w=500&h=400&fit=crop"
    },
    {
      title: "Mobile Ready",
      description: "Accept payments anywhere with our mobile solutions.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=400&fit=crop"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-16">
          Built for modern commerce
        </h2>
        
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
              <div className="flex-1">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-lg mb-6">{feature.description}</p>
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition flex items-center">
                  Learn more
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}