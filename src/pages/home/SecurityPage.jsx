import Header from "./components/Header"
import Footer from "./components/Footer"
import SecurityHero from "./components/security/SecurityHero"
import SecurityFeatures from "./components/security/SecurityFeatures"
import ProtectionSection from "./components/security/ProtectionSection"
import SecurityTips from "./components/security/SecurityTips"

export default function SecurityPage() {
  return (
    <div className="w-full">
      <Header />
      <SecurityHero />
      <SecurityFeatures />
      <ProtectionSection />
      <SecurityTips />
      <Footer />
    </div>
  )
}