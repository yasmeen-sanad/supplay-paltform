// app/products/ProductsClient.tsx
"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type Product = {
  _id: string
  name: string
  price: number
  image?: string
  category: string
  brand?: string
  color?: string
  size?: string
  factory?: { _id: string; name: string } | string
  supplier?: string
}

const categories = [
  "الكل",
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

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [activeCategory, setActiveCategory] = useState<string>("الكل")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [brandFilter, setBrandFilter] = useState<string>("")
  const [colorFilter, setColorFilter] = useState<string>("")
  const [sizeFilter, setSizeFilter] = useState<string>("")
  const [factoryFilter, setFactoryFilter] = useState<string>("")

  // Handle URL parameters on component mount
  useEffect(() => {
    const brand = searchParams.get("brand")
    if (brand) {
      setBrandFilter(decodeURIComponent(brand))
    }
    const factory = searchParams.get("factory")
    if (factory) {
      setFactoryFilter(decodeURIComponent(factory))
    }
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE_URL}/api/products`)
        const data = await res.json()

        if (!data.success) {
          throw new Error(data.message || "فشل في جلب المنتجات")
        }

        setProducts(data.products || [])
      } catch (err: any) {
        console.error("Error fetching products", err)
        setError(err.message || "حدث خطأ أثناء جلب المنتجات")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    if (activeCategory !== "الكل" && product.category !== activeCategory) return false

    const min = minPrice ? Number(minPrice) : undefined
    const max = maxPrice ? Number(maxPrice) : undefined

    if (min !== undefined && product.price < min) return false
    if (max !== undefined && product.price > max) return false

    if (brandFilter && product.brand !== brandFilter) return false
    if (colorFilter && product.color !== colorFilter) return false
    if (sizeFilter && product.size !== sizeFilter) return false
    if (factoryFilter) {
      const factoryName =
        typeof product.factory === "string" ? product.factory : product.factory?.name
      if (factoryName !== factoryFilter) return false
    }

    return true
  })

  const resetFilters = () => {
    setActiveCategory("الكل")
    setMinPrice("")
    setMaxPrice("")
    setBrandFilter("")
    setColorFilter("")
    setSizeFilter("")
    setFactoryFilter("")
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F]">استكشف منتجات مواد البناء</h1>
          </div>
          <p className="text-sm text-gray-600">
            عدد المنتجات المعروضة:{" "}
            <span className="font-semibold text-[#8C6239]">{filteredProducts.length}</span>
          </p>
        </div>

        {/* حالة التحميل / الخطأ */}
        {loading && (
          <div className="mb-6 text-center text-sm text-gray-600">جاري تحميل المنتجات...</div>
        )}
        {error && !loading && (
          <div className="mb-6 text-center text-sm text-red-600">{error}</div>
        )}

        {/* Filters Card */}
        <Card className="mb-8 border border-[#E4D4BD] bg-[#FDF8F1]/90">
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 items-end">
              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-xs md:text-sm font-medium text-gray-700">الفئة</label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="rounded-2xl border border-[#E0D2BF] bg-white py-2.5 px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/80 focus:border-[#C7A17A]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div className="flex flex-col gap-1">
                <label className="text-xs md:text-sm font-medium text-gray-700">
                  السعر (من - إلى)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="من"
                    className="w-full rounded-2xl border border-[#E0D2BF] bg-white py-2.5 px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/80 focus:border-[#C7A17A]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="إلى"
                    className="w-full rounded-2xl border border-[#E0D2BF] bg-white py-2.5 px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/80 focus:border-[#C7A17A]"
                  />
                </div>
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-1">
                <label className="text-xs md:text-sm font-medium text-gray-700">
                  العلامة التجارية
                </label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="rounded-2xl border border-[#E0D2BF] bg-white py-2.5 px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/80 focus:border-[#C7A17A]"
                >
                  <option value="">الكل</option>
                  {[...new Set(products.map((p) => p.brand).filter(Boolean))].map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color / Size */}
              <div className="flex gap-2">
                {/* اللون */}
                <div className="flex flex-col w-full">
                  <label className="text-xs md:text-sm font-medium text-gray-700 text-right">
                    اللون
                  </label>
                  <select
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                    className="w-full rounded-2xl border border-[#E0D2BF] bg-white py-2.5 px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/80 focus:border-[#C7A17A]"
                  >
                    <option value="">اللون</option>
                    {[...new Set(products.map((p) => p.color).filter(Boolean))].map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* المقاس */}
                <div className="flex flex-col w-full">
                  <label className="text-xs md:text-sm font-medium text-gray-700 text-right">
                    المقاس
                  </label>
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    className="w-full rounded-2xl border border-[#E0D2BF] bg-white py-2.5 px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/80 focus:border-[#C7A17A]"
                  >
                    <option value="">المقاس</option>
                    {[...new Set(products.map((p) => p.size).filter(Boolean))].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm md:text-base text-gray-700">
              لا توجد منتجات مطابقة للفلاتر الحالية.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="border-[#C7A17A] text-[#8C6239] hover:bg-[#C7A17A] hover:text-white"
            >
              إعادة ضبط الفلاتر
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const imageSrc = product.image
                  ? product.image.startsWith("http")
                    ? product.image
                    : `${API_BASE_URL}${product.image}`
                  : "/placeholder.svg"

                return (
                  <Link key={product._id} href={`/products/${product._id}`} className="group block">
                    <Card className="border border-[#E4D4BD] bg-[#FDF8F1]/90 rounded-2xl">
                      <CardContent className="p-4">
                        <div className="relative mb-4 overflow-hidden rounded-xl bg-white">
                          <Image
                            src={imageSrc}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute top-2 right-2 rounded-full bg-[#C7A17A] px-3 py-1 text-[10px] font-medium text-white shadow-sm">
                            {product.category}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-[#1E3A5F] line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 justify-between text-[11px] text-gray-600">
                            {product.brand && (
                              <span className="px-2 py-0.5 rounded-full bg-white/80 border border-[#E4D4BD]">
                                {product.brand}
                              </span>
                            )}
                            {product.color && (
                              <span className="px-2 py-0.5 rounded-full bg:white/80 border border-[#E4D4BD]">
                                اللون: {product.color}
                              </span>
                            )}
                            {product.size && (
                              <span className="px-2 py-0.5 rounded-full bg:white/80 border border-[#E4D4BD]">
                                {product.size}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-base md:text-lg font-bold text-[#8C6239]">
                            {product.price} ر.س
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {filteredProducts.length > 8 && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#C7A17A] text-[#8C6239] hover:bg-[#C7A17A] hover:text-white"
                >
                  عرض المزيد
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}