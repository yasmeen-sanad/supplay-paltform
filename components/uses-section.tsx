"use client"

import { ClipboardList, MousePointerClick, MessageCircle, Handshake } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "تسجيل",
    description: " يتم التسجيل في المنصة عن طريق إنشاء حساب جديد كبائع او مشتري.",
    icon: ClipboardList,
  },
  {
    id: 2,
    title: "تصفح",
    description: "تصفح المنتجات وعروض الأسعار بسهولة.",
    icon: MousePointerClick,
  },
  {
    id: 3,
    title: "تواصل",
    description: "التواصل الفعّال مع شبكة كبيرة من الموردين والمصانع.",
    icon: MessageCircle,
  },
  {
    id: 4,
    title: "تنفيذ الصفقة",
    description: "سهولة عقد الصفقات التجارية بنجاح.",
    icon: Handshake,
  },
]

export function UsesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* الهيدر */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-2">
            الاستخدام
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            خطوات سهلة وموثوقة
          </p>
        </div>

        {/* الخط المتعرج في الخلفية */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-10">
            <div className="h-[2px] w-full border-t-2 border-dashed border-[#C7A17A]" />
          </div>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className="relative bg-white rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-[#E4D4BD] px-6 py-8 flex flex-col items-center text-center"
              >
                {/* الأيقونة */}
                <div className="w-16 h-16 rounded-2xl bg-[#C7A17A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-[#C7A17A]" />
                </div>

                {/* العنوان */}
                <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">
                  {step.title}
                </h3>

                {/* الوصف */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* رقم الخطوة */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                  <div className="w-10 h-8 rounded-xl bg-[#C7A17A] text-white text-sm font-bold flex items-center justify-center shadow-md">
                    {step.id}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
