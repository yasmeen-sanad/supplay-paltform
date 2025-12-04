import { ChevronLeft } from "lucide-react"

const categories = [
  { name: "خشب", icon: "https://karajey.com/wp-content/uploads/2021/10/%D8%A7%D9%84%D8%B1%D9%82%D8%A7%D8%A6%D9%82.webp" },
  { name: "أسمنت", icon: "https://cdn.salla.sa/ePmPvd/6605389a-20e6-443f-b783-9e23e5e28307-1000x1000-VrCpq9t928zRLMNrQqL9AAMaqYyrWofnibES5vXL.png" },
  { name: "بلاط", icon: "https://cdn.salla.sa/lrzrx/aa4a694a-59fd-41c8-b280-b368ef1e2d86-1000x1000-ISGKDHH0uyboP0FCZJVngyPryJBAoaNrq9bqA1nr.jpg" },
  { name: "حديد", icon: "https://sa.mashroo3k.com/wp-content/uploads/2021/08/black-bar-stacked.jpg" },
  { name: "البناء والتجارة", icon: "https://blue-page-photo.s3.amazonaws.com/1746353172519images%20%2810%29.jpeg" },
  { name: "إضاءة و مصابيح", icon: "https://s.alicdn.com/@sc04/kf/HLB138p9gK3tHKVjSZSgq6x4QFXaI/Incandescent-Bulb-GLS-A19-A60-40W-60W-75W-100W-E27-Clear-Bulb-Factory-Supplied-Hot-Selling-Bulbs.jpg_300x300.jpg" },
  { name: "الزراعة", icon: "https://media.gemini.media/img/large/2022/9/19/2022_9_19_12_17_27_378.jpg" },
  { name: "الأجهزة", icon: "https://cdn.salla.sa/zvwwzA/ecbadd4e-b92f-45ed-b20a-1b71eb05672a-1000x666.66666666667-Goh3PXmpKRSxxbFuqZJkxYFoTLlVNeLMIW9n4qDC.jpg" },
  { name: "مركبات ومعداتها", icon: "https://images.netdirector.co.uk/gforces-auto/image/upload/w_343,h_257,dpr_2.0,q_auto,c_fill,f_auto,fl_lossy/auto-client/be946c04b732406e3b408afe64f3612a/mg_hs_website_product_image_mobile.jpg" },
]

export function CategoryGrid() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* خلفيات ناعمة */}
      <div className="pointer-events-none absolute -top-10 left-10 w-64 h-64 bg-[#D8C2A6]/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-0 w-72 h-72 bg-[#C7A17A]/25 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* الهيدر */}
        <div className="items-center justify-between mb-10">
          <div className="text-center">
            <p className="text-4xl text-center font-bold text-[#1E3A5F]">
              تسوّق حسب الفئة
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              اختر الفئة التي تناسب احتياج مشروعك وابدأ التصفّح مباشرة
            </p>
          </div>
        </div>

        {/* الشبكة */}
        <div className="grid grid-cols-3 md:grid-cols-6 xl:grid-cols-9 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.name}
              className="
                group
                bg-[#FDF8F1]
                border border-[#E4D4BD]
                rounded-2xl
                px-3 py-4 md:px-4 md:py-5
                flex flex-col items-center justify-center gap-3
                hover:-translate-y-1
                hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)]
                transition-all duration-300
                cursor-pointer
                text-center
              "
            >
              <div
                className="
                  w-14 h-14 md:w-16 md:h-16
                  rounded-2xl
                  bg-white/80
                  shadow-sm
                  flex items-center justify-center
                  overflow-hidden
                  group-hover:shadow-md
                  group-hover:scale-105
                  transition-all duration-300
                "
              >
                <img
                  src={category.icon || "/placeholder.svg"}
                  alt={category.name}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-[#1E3A5F] group-hover:text-[#8C6239] transition-colors">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* زر إظهار الكل للجوال */}
        <div className="mt-8 flex justify-center md:hidden">
          <button className="text-sm text-[#1E3A5F] hover:text-[#8C6239] flex items-center gap-1 transition-colors">
            إظهار جميع الفئات
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}