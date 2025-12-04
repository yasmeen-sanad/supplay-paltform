import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, FileText, Building2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-[#F5F1E8] text-[#1E3A5F] mt-20 border-t border-[#D8C2A6]">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-right">

          {/* تواصل */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#8C6239]">ابق على تواصل</h3>
            <p className="text-sm text-gray-600 mb-2">احصل على آخر تحديثاتنا</p>
            <p className="text-sm mb-2 hover:text-[#8C6239] transition-colors cursor-pointer">
              build@gmail.com
            </p>
            <p className="text-sm hover:text-[#8C6239] transition-colors cursor-pointer">
              0583974238
            </p>
          </div>
          {/* الدفع */}
          <div className="items-right">
            <h3 className="font-bold text-lg mb-4 text-[#8C6239]">طرق الدفع</h3>
            <div className="flex flex-col gap-2 items-right justify-right">
              {[
                { name: "فيزا", icon: CreditCard },
                { name: "ماستر", icon: CreditCard },
                { name: "مدى", icon: Wallet },
                { name: "فاتورة", icon: FileText },
                { name: "تحويل بنكي", icon: Building2 }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-xs px-3 rounded-lg"
                  >
                    <Icon className="w-3 h-3 text-[#8C6239]" />
                    {item.name}
                  </div>
                )
              })}
            </div>
          </div>

          {/* السياسات */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#8C6239]">السياسات والشروط</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "سياسة الخصوصية",
                "سياسة الاستبدال",
                "سياسة الإرجاع",
                "الشروط والأحكام (العملاء)",
                "الشروط والأحكام (الموردين)",
                "حقوق الملكية",
              ].map((item) => (
                <li key={item}>
                  <a className="hover:text-[#8C6239] transition-colors cursor-pointer">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#8C6239]">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {["المدونة", "من نحن", "المنتجات", "العروض", "الملفات", "المتابعات"].map((item) => (
                <li key={item}>
                  <a className="hover:text-[#8C6239] transition-colors cursor-pointer">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* السوشيال + الحقوق */}
        <div className="border-t border-[#E4D4BD] mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* السوشيال */}
            <div className="flex gap-2">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="icon"
                  className="
                    rounded-full 
                    bg-white/60 
                    border border-[#E6D8C4]
                    hover:bg-[#C7A17A]
                    hover:text-white
                    transition-all duration-300 hover:scale-110
                  "
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              © 2025 جميع الحقوق محفوظة.
            </p>

          </div>
        </div>
      </div>
    </footer>
  )
}