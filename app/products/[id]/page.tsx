"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Package, Truck, MapPin, Award, Info, ChevronRight, CheckCircle } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type Product = {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  brand?: string
  stock?: number
  unit?: string
  supplier?: string
  color?: string
  size?: string
  feature1?: string
  feature2?: string
  feature3?: string
  shippingMethod?: "standard" | "express" | "same-day"
  shippingCost?: number
  seller?: {
    _id: string
    name: string
    email?: string
    phone?: string
  }
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get current user for user-specific cart
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`)
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || "فشل في جلب بيانات المنتج")
        }

        setProduct(data.product)
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء جلب بيانات المنتج")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return
    const maxQuantity = product.stock || 999
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)))
  }

  const imageSrc = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${API_BASE_URL}${product.image}`
    : "/placeholder.svg"

  const featureItems = product
    ? ([
        product.color ? `اللون: ${product.color}` : null,
        product.size ? `المقاس: ${product.size}` : null,
        product.feature1 || null,
        product.feature2 || null,
        product.feature3 || null,
      ].filter(Boolean) as string[])
    : []

  const getShippingLabel = (method?: string) => {
    switch (method) {
      case "standard":
        return "شحن عادي (5-7 أيام)"
      case "express":
        return "شحن سريع (2-3 أيام)"
      case "same-day":
        return "توصيل في نفس اليوم"
      default:
        return "شحن عادي"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-white" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => router.push("/")} className="hover:text-[#C17A3C] transition-colors">
            الرئيسية
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => router.back()} className="hover:text-[#C17A3C] transition-colors">
            المنتجات
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C17A3C] font-medium">{product?.name}</span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#C17A3C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل بيانات المنتج...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && product && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {/* Image Section */}
            <div className="lg:col-span-2">
              <div className="relative bg-white rounded-xl overflow-hidden shadow-md">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:col-span-3 space-y-5">
              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-xs text-[#C17A3C] bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {product.brand}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Info */}
              {typeof product.stock === "number" && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">المخزون المتوفر:</span>
                  <span className="font-bold text-green-600">{product.stock} {product.unit || "قطعة"}</span>
                </div>
              )}

              {/* Features */}
              {featureItems.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">مميزات المنتج</h3>
                  <ul className="space-y-2">
                    {featureItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-[#C17A3C] mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                {product.supplier && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">المصنع</p>
                        <p className="text-sm font-semibold text-gray-900">{product.supplier}</p>
                      </div>
                    </div>
                  </div>
                )}

                {product.shippingMethod && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">الشحن</p>
                        <p className="text-xs font-semibold text-gray-900">
                          {getShippingLabel(product.shippingMethod)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Info */}
              {product.seller && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">معلومات البائع</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">البائع:</span>
                      <span className="font-medium text-gray-900">{product.seller.name}</span>
                    </div>
                    {product.seller.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">الهاتف:</span>
                        <span className="font-medium text-gray-900">{product.seller.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price & Add to Cart Section - Last */}
              <div className="bg-gradient-to-r from-[#C17A3C]/5 to-[#D4A574]/5 border-2 border-[#C17A3C]/30 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">السعر</p>
                    <p className="text-3xl font-bold text-[#C17A3C]">{product.price} ر.س</p>
                    {product.unit && (
                      <p className="text-xs text-gray-500 mt-0.5">لكل {product.unit}</p>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">الكمية:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        if (val > 0) {
                          setQuantity(val)
                        }
                      }}
                      className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#C17A3C] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full bg-[#C17A3C] hover:bg-[#A66A30] text-white h-12 font-semibold rounded-lg"
                  onClick={() => {
                    if (!product) return
                    
                    // Check if user is authenticated
                    const token = localStorage.getItem("token")
                    if (!token || !user) {
                      alert("يجب تسجيل الدخول أولاً لإضافة منتجات إلى السلة")
                      router.push("/login")
                      return
                    }
                    
                    try {
                      // Use user-specific cart key
                      const userCartKey = `cart_${user.id || user._id}`
                      const existing = typeof window !== "undefined"
                        ? window.localStorage.getItem(userCartKey)
                        : null
                      const parsed: {
                        _id: string
                        name: string
                        price: number
                        quantity: number
                        sellerName?: string
                        sellerEmail?: string
                        sellerPhone?: string
                        sellerShippingMethod?: "standard" | "express" | "same-day"
                        shippingCost?: number
                        image?: string
                      }[] = existing ? JSON.parse(existing) : []
                      const index = parsed.findIndex((item) => item._id === product._id)
                      if (index >= 0) {
                        parsed[index].quantity += quantity
                      } else {
                        parsed.push({
                          _id: product._id,
                          name: product.name,
                          price: product.price,
                          quantity: quantity,
                          sellerName: product.seller?.name,
                          sellerEmail: product.seller?.email,
                          sellerPhone: product.seller?.phone,
                          sellerShippingMethod: product.shippingMethod,
                          shippingCost: product.shippingCost,
                          image: imageSrc,
                        })
                      }
                      if (typeof window !== "undefined") {
                        window.localStorage.setItem(userCartKey, JSON.stringify(parsed))
                      }
                      router.push("/shipping")
                    } catch {
                      // ignore parse errors
                    }
                  }}
                >
                  <ShoppingCart className="ml-2 h-5 w-5" />
                  أضف للسلة واستكمل الطلب
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}