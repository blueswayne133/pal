import { useNavigate } from "react-router-dom"

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section
      className="relative w-full h-96 md:h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1920&h=1080&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center px-4 md:px-8 max-w-2xl">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
          The simpler, safer way to pay online.
        </h1>
        <button 
          onClick={() => navigate("/signup")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-semibold text-lg mb-6 transition"
        >
          Sign Up for Free
        </button>
        <p className="text-white text-sm md:text-base">
          Own a business?{" "}
          <button 
            onClick={() => navigate("/business")}
            className="underline hover:text-gray-200 transition"
          >
            Open a Business account.
          </button>
        </p>
      </div>
    </section>
  )
}