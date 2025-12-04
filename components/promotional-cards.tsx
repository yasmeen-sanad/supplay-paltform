const promos = [
  {
    id: 1,
    category: "أجهزة",
    title: "ثلاجات مختارة",
    discount: "خصم يصل إلى 40%",
    image: "/home-appliances-refrigerator.jpg",
    tint: "from-[#4A90C5] to-[#1E3A5F]",
  },
  {
    id: 2,
    category: "أسمنت",
    title: "CEMENT",
    discount: "خصم يصل إلى 25%",
    image: "/cement-bags-construction.jpg",
    tint: "from-[#E5C864] to-[#C7A17A]",
  },
  {
    id: 3,
    category: "المركبات ومعداتها",
    title: "شاومي",
    discount: "خصم يصل إلى 75%",
    image: "/modern-suv-vehicle.jpg",
    tint: "from-[#E8A885] to-[#C7743B]",
  },
]

export function PromotionalCards() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* خلفيات ناعمة */}
      <div className="pointer-events-none absolute -top-12 left-10 w-72 h-72  rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-10 w-80 h-80 bg-[#C7A17A]/25 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* الهيدر */}
        <div className="items-center mb-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F]">
              عروض وخصومات مميزة
            </h2>
            <p className="text-sm md:text-base text-gray-700 mt-1">
              اغتنم أفضل العروض على الأجهزة، مواد البناء، والمركبات ومعداتها
            </p>
          </div>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="
                relative h-64 
                rounded-3xl overflow-hidden 
                cursor-pointer
                bg-[#1E3A5F]
                shadow-[0_12px_30px_rgba(0,0,0,0.18)]
                hover:shadow-[0_18px_40px_rgba(0,0,0,0.25)]
                transform hover:-translate-y-2 hover:scale-[1.01]
                transition-all duration-400
                group
              "
            >
              {/* خلفية متدرجة حسب العرض */}
              <div
                className={`
                  absolute inset-0 
                  bg-gradient-to-br ${promo.tint}
                  opacity-80
                `}
              />
              {/* طبقة بيج خفيفة تضبط التون العام */}
              <div className="absolute inset-0 bg-[#F5F1E8]/15 mix-blend-screen" />

              {/* المحتوى */}
              <div className="relative z-10 h-full flex items-center justify-between px-6 md:px-7 lg:px-8">
                {/* النص */}
                <div className="flex-1 text-right text-white space-y-2">
                  <p className="text-xs md:text-sm font-medium bg-black/15 inline-flex px-3 py-1 rounded-full">
                    {promo.category}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    {promo.title}
                  </h3>
                  <p className="text-base md:text-lg font-semibold">
                    {promo.discount}
                  </p>
                  <p className="text-xs md:text-sm text-white/80 mt-1">
                    لفترة محدودة على مختارات من هذه الفئة.
                  </p>
                </div>

                {/* الصورة */}
                <div className="flex-1 flex justify-start h-full">
                  <div
                    className="
                      h-full w-full flex items-center justify-center
                    "
                  >
                    <img
                      src={promo.image || "/placeholder.svg"}
                      alt={promo.title}
                      className="
                        w-full h-full object-contain
                        transform translate-x-2 group-hover:translate-x-0 group-hover:scale-105
                        transition-transform duration-500
                      "
                    />
                  </div>
                </div>
              </div>

              {/* لمعة خفيفة من اليسار */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/25 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}