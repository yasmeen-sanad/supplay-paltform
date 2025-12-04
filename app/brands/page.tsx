"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type BrandUser = {
  _id: string
  name: string
  email?: string
  city?: string
  logo?: string
}

export default function BrandsPage() {
  const router = useRouter()
  const [brands, setBrands] = useState<BrandUser[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE_URL}/api/brands`)
        const data = await res.json()

        if (!data.success) {
          throw new Error(data.message || "فشل في جلب العلامات التجارية")
        }

        setBrands(data.brands || [])
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء جلب العلامات التجارية")
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const handleBrandClick = (brandName: string) => {
    // Navigate to products page with brand filter
    router.push(`/products?brand=${encodeURIComponent(brandName)}`)
  }
  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex">
          <div className="text-right" />
          <h1 className="text-3xl text-right font-bold text-[#1E3A5F]">العلامات التجارية</h1>
        </div>

        {loading && <p className="mb-4 text-sm text-gray-600">جاري تحميل العلامات التجارية...</p>}
        {error && !loading && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
          {brands.map((brand) => {
            const logoSrc = brand.logo?.startsWith("/uploads")
              ? `${API_BASE_URL}${brand.logo}`
              : brand.logo || "/placeholder.svg"

            return (
              <Card
                key={brand._id}
                className="flex items-center justify-center aspect-square border border-[#E4D4BD] bg-white rounded-2xl hover:border-[#1E3A5F] hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleBrandClick(brand.name)}
              >
                <CardContent className="flex items-center justify-center p-4 w-full h-full">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={logoSrc}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
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
