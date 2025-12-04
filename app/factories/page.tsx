"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, ExternalLink, Factory } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

// نفس قائمة الفئات المستخدمة في صفحة المنتجات (بدون خيار "الكل")
const factoryCategories = [
  "المواد الكميائىة",
  "البناء والعقار",
  "المركبات وملحقاتها",
  "الزراعة",
  "الاضادة والمصابيح",
  "الاجهزة",
  "ملابس و أزياء",
  "معدات وخدمات تجارية",
  "مطاط بلاستيك واسفنج",
  "المنزل والحديقة",
  "الماعدن والتعدين",
  "معدات الخدمات التجارية",
]

// قائمة ثابتة للمواقع (المدن) المستخدمة في الفلاتر
const factoryLocations = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "جدة",
  "القصيم",
  "الدمام",
  "الخبر",
  "حائل",
  "تبوك",
  "الباحة",
  "جازان",
  "نجران",
  "ابها",
  "الجوف",
]

type FactoryType = {
  _id: string
  name: string
  location: string
  image?: string
  productsCount?: number
  category?: string
  contactEmail?: string
  contactPhone?: string
}

export default function FactoriesPage() {
  const router = useRouter()
  const [factories, setFactories] = useState<FactoryType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [locationSearch, setLocationSearch] = useState("")
  const [categorySearch, setCategorySearch] = useState("")

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE_URL}/api/factories`)
        const data = await res.json()

        if (!data.success) {
          throw new Error(data.message || "فشل في جلب المصانع")
        }

        setFactories(data.factories || [])
      } catch (err: any) {
        console.error("Error fetching factories", err)
        setError(err.message || "حدث خطأ أثناء جلب المصانع")
      } finally {
        setLoading(false)
      }
    }

    fetchFactories()
  }, [])

  const handleFactoryClick = (factoryName: string) => {
    // Navigate to products page with factory filter
    router.push(`/products?factory=${encodeURIComponent(factoryName)}`)
  }

  useEffect(() => {
    if (!loading && factories.length > 0) {
      console.log("factories from API", factories)
    }
  }, [loading, factories])

  const getImageSrc = (factory: FactoryType) => {
    if (!factory.image) return "/placeholder.svg"
    if (factory.image.startsWith("http")) return factory.image
    return `${API_BASE_URL}${factory.image}`
  }

  const allLocations = factoryLocations
  const allCategories = factoryCategories

  const filteredLocations = locationSearch
    ? allLocations.filter((loc) => loc.toLowerCase().includes(locationSearch.toLowerCase()))
    : allLocations

  const filteredCategories = categorySearch
    ? allCategories.filter((cat) => cat.toLowerCase().includes(categorySearch.toLowerCase()))
    : allCategories

  const matchesLocation = (factory: FactoryType) => {
    if (selectedLocations.length === 0) return true
    return selectedLocations.includes(factory.location)
  }

  const matchesCategory = (factory: FactoryType) => {
    if (selectedCategories.length === 0) return true
    return factory.category ? selectedCategories.includes(factory.category) : false
  }

  const visibleFactories = factories.filter((f) => matchesLocation(f) && matchesCategory(f))

  const hasActiveFilters = selectedCategories.length > 0 || selectedLocations.length > 0

  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <Header />

      <main className="relative">
        {/* خلفية ناعمة */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E8] via-[#F9E7CF]/60 to-[#F5F1E8] pointer-events-none" />

        <div className="container mx-auto px-4 py-10 relative z-10">
          {/* هيدر الصفحة */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F]">
                المصانع
              </h1>
            </div>

            {/* لمحة إحصائية بسيطة */}
            <div className="flex flex-col items-start md:items-end gap-2 text-xs md:text-sm">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 border border-[#E4D4BD] px-4 py-2 shadow-sm">
                <Factory className="w-4 h-4 text-[#C7A17A]" />
                <span className="text-gray-700">
                  عدد المصانع المسجلة:{" "}
                  <span className="font-semibold text-[#8C6239]">{factories.length}</span>
                </span>
              </div>
              {hasActiveFilters && (
                <span className="text-[11px] text-gray-500">
                  يتم عرض{" "}
                  <span className="font-semibold text-[#8C6239]">
                    {visibleFactories.length}
                  </span>{" "}
                  مصنع حسب الفلاتر المحددة
                </span>
              )}
            </div>
          </div>

          {/* حالات التحميل / الخطأ */}
          {loading && (
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-52 md:h-60 rounded-3xl bg-white/70 border border-[#E4D4BD] shadow-sm animate-pulse"
                />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="mb-8 text-center text-sm md:text-base text-red-700 bg-red-50 border border-red-100 rounded-2xl py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] gap-6 items-start">
            {/* شبكة المصانع */}
            <div>
              {!loading && !error && visibleFactories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-white/85 border border-[#E4D4BD]">
                  <Factory className="w-10 h-10 text-[#C7A17A] mb-3" />
                  <p className="text-sm md:text-base text-gray-700 mb-1">
                    لا توجد مصانع مطابقة للبحث الحالي.
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    جرّبي تعديل الفلاتر أو إعادة تعيينها لعرض كل المصانع.
                  </p>
                </div>
              )}

              {!loading && !error && visibleFactories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                  {visibleFactories.map((factory) => {
                    const imageSrc = getImageSrc(factory)

                    return (
                      <Card
                        key={factory._id}
                        className="flex flex-col h-full border border-[#E4D4BD] bg-white/95 shadow-sm rounded-2xl hover:border-[#1E3A5F] hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => handleFactoryClick(factory.name)}
                      >
                        {/* صورة / شعار المصنع */}
                        <div className="relative h-28 bg-gradient-to-l from-[#F6E7D6] via-white to-[#F6E7D6] flex items-center justify-center border-b border-[#F0E4D2]">
                          <div className="relative w-24 h-16">
                            <Image
                              src={imageSrc}
                              alt={factory.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          {factory.category && (
                            <div className="absolute bottom-2 left-2 rounded-full bg-white/90 border border-[#E4D4BD] px-2 py-0.5 text-[10px] text-[#8C6239] max-w-[60%] truncate">
                              {factory.category}
                            </div>
                          )}
                        </div>

                        {/* محتوى البطاقة */}
                        <CardContent className="flex flex-1 flex-col justify-between p-4 space-y-3">
                          <div className="space-y-2">
                            <h3 className="text-sm font-bold text-[#1E3A5F] leading-snug line-clamp-2">
                              {factory.name}
                            </h3>

                            <div className="space-y-1.5 text-[11px] text-gray-700">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#C7A17A]" />
                                <span className="truncate">{factory.location}</span>
                              </div>

                              {factory.contactPhone && (
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-[#C7A17A]" />
                                  <span className="truncate">{factory.contactPhone}</span>
                                </div>
                              )}

                              {factory.contactEmail && (
                                <div className="flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-[#C7A17A]" />
                                  <span className="truncate max-w-[200px]">
                                    {factory.contactEmail}
                                  </span>
                                </div>
                              )}

                              {factory.productsCount !== undefined && (
                                <p className="text-[11px] text-gray-600">
                                  منتجات متاحة:{" "}
                                  <span className="font-semibold text-[#8C6239]">
                                    {factory.productsCount}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          <Button className="mt-2 w-full rounded-xl bg-[#C7A17A] hover:bg-[#A66A30] text-xs font-semibold text-white py-2">
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                           تصفح المنتجات
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* لوحة الفلاتر اليمنى */}
            <aside className="space-y-4 rounded-2xl bg-white/95 border border-[#E4D4BD] p-4 h-fit shadow-sm">
              {/* فئة */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-[#1E3A5F]">الفئة</h2>
                  {selectedCategories.length > 0 && (
                    <span className="text-[10px] text-[#8C6239] bg-[#F6E7D6] px-2 py-0.5 rounded-full">
                      {selectedCategories.length} مختارة
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="ابحث عن فئة"
                    className="w-full rounded-lg border border-[#E4D4BD] bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#C7A17A]"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 text-xs pr-1">
                  {filteredCategories.length === 0 && (
                    <p className="text-gray-400 text-[11px]">لا توجد فئات متاحة بعد.</p>
                  )}
                  {filteredCategories.map((cat) => {
                    const checked = selectedCategories.includes(cat)
                    return (
                      <label
                        key={cat}
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-1 py-0.5 hover:bg-[#F8F1E7]"
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-[#C7A17A]"
                          checked={checked}
                          onChange={() => {
                            setSelectedCategories((prev) =>
                              checked ? prev.filter((c) => c !== cat) : [...prev, cat],
                            )
                          }}
                        />
                        <span className="truncate">{cat}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* الموقع */}
              <div className="pt-3 border-t border-[#F0E4D2]">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-[#1E3A5F]">الموقع</h2>
                  {selectedLocations.length > 0 && (
                    <span className="text-[10px] text-[#8C6239] bg-[#F6E7D6] px-2 py-0.5 rounded-full">
                      {selectedLocations.length} مختارة
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="ابحث عن موقع"
                    className="w-full rounded-lg border border-[#E4D4BD] bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#C7A17A]"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 text-xs pr-1">
                  {filteredLocations.length === 0 && (
                    <p className="text-gray-400 text-[11px]">لا توجد مواقع متاحة بعد.</p>
                  )}
                  {filteredLocations.map((loc) => {
                    const checked = selectedLocations.includes(loc)
                    return (
                      <label
                        key={loc}
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-1 py-0.5 hover:bg-[#F8F1E7]"
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-[#C7A17A]"
                          checked={checked}
                          onChange={() => {
                            setSelectedLocations((prev) =>
                              checked ? prev.filter((l) => l !== loc) : [...prev, loc],
                            )
                          }}
                        />
                        <span className="truncate">{loc}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* زر إعادة التعيين */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedLocations([])
                    setCategorySearch("")
                    setLocationSearch("")
                  }}
                  className="mt-1 w-full rounded-lg border border-[#E4D4BD] px-3 py-1.5 text-[11px] text-gray-700 hover:bg-[#F8F1E7]"
                >
                  إعادة تعيين الفلاتر
                </button>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}