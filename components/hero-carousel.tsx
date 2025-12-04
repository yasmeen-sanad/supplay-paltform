"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    title: "استورد منتجك السعودي بكل سهولة!",
    description:
      "من قلب السعودية إلى باب منزلك، نوفر لك منصة موثوقة بأفضل المصانع المنتجة لتلبية احتياجاتك بجودة عالية وسهولة لا مثيل لها",
    image: "/modern-warehouse-with-organized-inventory-shelves.jpg",
    button: "تصفح المنتجات الآن",
  },
  {
    id: 2,
    title: "جودة عالية وأسعار منافسة",
    description: "نضمن لك أفضل الأسعار مع جودة لا تضاهى من موردين معتمدين",
    image: "/construction-materials-warehouse.jpg",
    button: "اكتشف المزيد",
  },
  {
    id: 3,
    title: "توصيل سريع لجميع المناطق",
    description: "خدمة توصيل احترافية تصل إليك أينما كنت في المملكة",
    image: "/industrial-supply-chain-logistics.jpg",
    button: "ابدأ الآن",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-[#1E5A8E] to-[#1E5A8E]/80 z-10" />
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl mr-auto text-white text-right">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{slide.title}</h1>
                <p className="text-lg mb-8 leading-relaxed text-balance">{slide.description}</p>
                <Button className="bg-[#C17A3C] hover:bg-[#A86A2C] text-white px-8 py-6 text-lg">{slide.button}</Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white w-12 h-12 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white w-12 h-12 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-12 h-1 rounded transition-all ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
