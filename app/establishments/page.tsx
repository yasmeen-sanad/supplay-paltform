import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Wrench, HardHat, Package, Phone } from "lucide-react"

const establishments = [
  {
    id: 1,
    name: "شركة النقل السريع",
    type: "خدمات الشحن والنقل",
    icon: Truck,
    description: "نوفر خدمات نقل مواد البناء لجميع مناطق المملكة بسرعة وأمان",
    services: ["شحن داخلي", "شحن دولي", "تتبع الشحنات", "تأمين على البضائع"],
    phone: "+966 50 123 4567",
  },
  {
    id: 2,
    name: "ورش الصيانة المتقدمة",
    type: "صيانة وتركيب",
    icon: Wrench,
    description: "فريق متخصص في تركيب وصيانة جميع أنواع معدات البناء",
    services: ["تركيب", "صيانة دورية", "إصلاح عاجل", "استشارات فنية"],
    phone: "+966 50 234 5678",
  },
  {
    id: 3,
    name: "مقاولون محترفون",
    type: "خدمات المقاولات",
    icon: HardHat,
    description: "مقاولون معتمدون لتنفيذ مشاريع البناء والتشييد",
    services: ["بناء وتشييد", "تشطيبات", "ترميمات", "إدارة مشاريع"],
    phone: "+966 50 345 6789",
  },
  {
    id: 4,
    name: "مستودعات التخزين الآمن",
    type: "خدمات التخزين",
    icon: Package,
    description: "مستودعات حديثة لتخزين مواد البناء في بيئة آمنة ومناسبة",
    services: ["تخزين قصير الأجل", "تخزين طويل الأجل", "إدارة المخزون", "أنظمة أمان متطورة"],
    phone: "+966 50 456 7890",
  },
]

export default function EstablishmentsPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* العنوان */}
        <div className="mb-6 flex">
          <div className="text-right" />
          <h1 className="text-3xl text-right font-bold text-[#1E3A5F]">المنشآت المساندة</h1>
        </div>

        {/* شبكة المنشآت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {establishments.map((establishment) => {
            const Icon = establishment.icon
            return (
              <Card
                key={establishment.id}
                className="flex flex-col h-full border border-[#E4D4BD] bg-white/95 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                {/* أيقونة المنشأة */}
                <CardHeader className="pb-3 border-b border-[#F0E4D2]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-l from-[#F6E7D6] via-white to-[#F6E7D6] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#C17A3C]" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-bold text-[#1E3A5F] truncate">
                        {establishment.name}
                      </CardTitle>
                      <p className="text-[11px] text-[#C17A3C] truncate">{establishment.type}</p>
                    </div>
                  </div>
                </CardHeader>

                {/* المحتوى */}
                <CardContent className="flex flex-1 flex-col justify-between p-4 space-y-3 text-sm">
                  <p className="text-gray-600 text-[12px] leading-relaxed line-clamp-3">
                    {establishment.description}
                  </p>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-[12px] text-[#1E3A5F]">الخدمات المقدمة:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {establishment.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded-full bg-[#F8F1E7] text-[11px] text-gray-700 border border-[#E4D4BD]"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#F0E4D2]">
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
