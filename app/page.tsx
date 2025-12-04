import { Header } from "@/components/header"
import HeroSection from "@/components/hero-section";
import { CategoryGrid } from "@/components/category-grid"
import { ServicesSection } from "@/components/services-section"
import { TargetAudienceSection } from "@/components/target-audience-section"
import { PromotionalCards } from "@/components/promotional-cards"
import { UsesSection } from "@/components/uses-section"

import { Footer } from "@/components/footer"


export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <CategoryGrid />
        <UsesSection />
        <TargetAudienceSection />
        <PromotionalCards />
      </main>
      <Footer />
    </div>
  )
}
