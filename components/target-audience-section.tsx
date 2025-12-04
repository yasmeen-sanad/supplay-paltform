"use client"

import { HardHat, Factory, Building2, Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

const audiences = [
  {
    title: "الشركات والمؤسسات",
    description: "حلول متكاملة للشركات والمشاريع الإنشائية.",
    icon: HardHat,
    color: "from-[#C7A17A] to-[#B38E69]",
  },
  {
    title: "الموردون والبائعون",
    description: "شراكات مباشرة مع المصانع والموردين في قطاع مواد البناء.",
    icon: Factory,
    color: "from-[#1E3A5F] to-[#2A4473]",
  },
  {
    title: "الأفراد الباحثون عن منتجات متخصصة",
    description: "شراء سريع بدون تعقيد من مكان واحد",
    icon: Home,
    color: "from-[#8C6239] to-[#C7A17A]",
  },
]

export function TargetAudienceSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById("target-audience-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="target-audience-section"
      className="py-20  relative overflow-hidden"
    >
      {/* خلفيات ناعمة */}
      <div className="pointer-events-none absolute -top-10 right-10 w-72 h-72 bg-[#D8C2A6]/35 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-0 w-80 h-80 bg-[#C7A17A]/25 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* الهيدر */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-3">
            الفئة المستهدفة
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            منصّة البناء المتكاملة تخدم مختلف أطراف قطاع البناء والتشييد، من المقاول إلى المطوّر العقاري.
          </p>
        </div>

        {/* الكروت */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-5xl mx-auto">
          {audiences.map((audience, index) => {
            const Icon = audience.icon
            const delays = ["", "delay-150", "delay-300", "delay-500"]

            return (
              <Card
                key={index}
                className={`
                  border border-[#E4D4BD]
                  bg-[#FDF8F1]/90
                  backdrop-blur-sm
                  shadow-[0_10px_25px_rgba(0,0,0,0.06)]
                  hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]
                  rounded-3xl
                  overflow-hidden
                  group
                  cursor-pointer
                  transform
                  transition-all
                  duration-500
                  hover:-translate-y-3
                  ${isVisible ? `opacity-100 translate-y-0 ${delays[index]}` : "opacity-0 translate-y-4"}
                `}
              >
                <CardContent className="p-8 text-center space-y-5">
                  <div className="flex justify-center">
                    <div
                      className={`
                        w-20 h-20
                        bg-gradient-to-br 
                        flex items-center justify-center
                        transform
                        transition-all
                        duration-500
                        group-hover:scale-110 group-hover:rotate-3
                      `}
                    >
                      <Icon className="w-11 h-11 text-[#C3A17A] drop-shadow-md" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#1E3A5F] group-hover:text-[#8C6239] transition-colors">
                    {audience.title}
                  </h3>

                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {audience.description}
                  </p>

                  <div className="flex justify-center pt-2">
                    <span className="w-12 h-1 rounded-full bg-[#C7A17A]/60 group-hover:bg-[#8C6239] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}