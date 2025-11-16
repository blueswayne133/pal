import Header from "./components/Header"
import Footer from "./components/Footer"
import BusinessHero from "./components/business/BusinessHero"
import BusinessSolutions from "./components/business/BusinessSolutions"
import BusinessFeatures from "./components/business/BusinessFeatures"
import BusinessTestimonials from "./components/business/BusinessTestimonials"

export default function BusinessPage() {
  return (
    <div className="w-full">
      <Header />
      <BusinessHero />
      <BusinessSolutions />
      <BusinessFeatures />
      <BusinessTestimonials />
      <Footer />
    </div>
  )
}