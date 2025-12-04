"use client"

import { Package, Store, Filter, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"

const services = [
  {
    title: "سوق إلكتروني",
    description:
      "تصفح آلاف المنتجات في مكان واحد: خشب، أسمنت، حديد، بلاط، إضاءة، أدوات بناء وغيرها. واجهة سهلة للوصول إلى الفئات وجميع المنتجات بكل وضوح وسرعة.",
    icon: Package,
    gradient: "from-blue-500 via-blue-600 to-cyan-500",
    shadowColor: "shadow-blue-500/30",
  },
  {
    title: "منصة للموردين والمصانع",
    description:
      "مساحة مخصصة للموردين لعرض منتجاتهم مباشرة. الموردون والمصانع يمكنهم إضافة موادهم، عروضهم، وخصوماتهم للوصول للعملاء بسهولة.",
    icon: Store,
    gradient: "from-emerald-500 via-emerald-600 to-teal-500",
    shadowColor: "shadow-emerald-500/30",
  },
  {
    title: "فلترة وتصنيف ذكي",
    description:
      "ابحث بسرعة حسب الفئة، العلامة التجارية، أو نطاق السعر. نظام الفلترة يساعدك توصل للمنتج المناسب خلال ثوانٍ بدل البحث الطويل.",
    icon: Filter,
    gradient: "from-purple-500 via-purple-600 to-pink-500",
    shadowColor: "shadow-purple-500/30",
  },
  {
    title: "خيارات دفع متعددة وشراء فوري",
    description:
      "ادفع بكل راحة عبر: فيزا، ماستركارد، مدى، Apple Pay، والتحويل البنكي. مع سلة مشتريات وحساب مستخدم لتجربة تسوّق كاملة عبر الإنترنت.",
    icon: CreditCard,
    gradient: "from-amber-500 via-amber-600 to-orange-500",
    shadowColor: "shadow-amber-500/30",
  },
]

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // ظهور السيكشن
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    const section = document.getElementById("services-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  // حركة كل كارد لوحده
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible])


  return (
    <>
      <style>{`
        .card-active {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .card-default {
          transform: translateY(0) scale(1);
          opacity: 0.95;
        }
        .transition-smooth {
          transition: all 0.5s ease;
        }
      `}</style>

      <section id="services-section" className="py-24 ">
        <div className="container mx-auto px-4">

          {/* header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold">
              <span className="bg-gradient-to-l from-[#0F2647] via-[#1E3A5F] to-[#2A4473] bg-clip-text text-transparent">
                خدماتنا
              </span>
            </h2>
          </div>

          {/* grid of 4 cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              const isActive = index === activeIndex

              return (
                <div
                  key={index}
                  className={`
                     bg-[#FDF8F1]/90 p-8 rounded-3xl border shadow-xl relative overflow-hidden
                    transition-smooth
                    ${isActive ? "card-active" : "card-default"}
                  `}
                >
                  {/* icon */}
                  <div
                    className={`w-20 h-20 flex items-center justify-center mb-6 `}
                  >
                    <Icon className="w-10 h-10 text-[#C3A17A]" />
                  </div>

                  {/* title */}
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-4 text-right">
                    {service.title}
                  </h3>

                  {/* desc */}
                  <p className="text-gray-600 text-right leading-relaxed">
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}