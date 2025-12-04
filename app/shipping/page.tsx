"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Trash2, Minus, Plus } from "lucide-react"
import Image from "next/image"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type ShippingOrderItem = {
  product?: string
  quantity?: number
}

type ShippingOrder = {
  _id: string
  totalAmount: number
  products?: ShippingOrderItem[]
}

type CartItem = {
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
}

export default function ShippingPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<ShippingOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [user, setUser] = useState<any>(null)

  const stepsMeta: { id: 1 | 2 | 3 | 4; title: string; subtitle: string }[] = [
    { id: 1, title: "المنتجات", subtitle: "مراجعة سلة المشتريات" },
    { id: 2, title: "بيانات العميل", subtitle: "معلومات التوصيل" },
    { id: 3, title: "طريقة الشحن", subtitle: "يحددها البائع لكل منتج" },
    { id: 4, title: "الإجمالي والدفع", subtitle: "مراجعة المبلغ والدفع" },
  ]

  useEffect(() => {
    // Check if user is authenticated first
    const token = localStorage.getItem("token")
    if (!token) {
      // Clear cart if not authenticated
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart")
      }
      setCartItems([])
      setLoading(false)
      return
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (res.ok && data.success && data.user) {
          setUser(data.user)
          
          // Load cart items for this specific user
          const userCartKey = `cart_${data.user.id || data.user._id}`
          if (typeof window !== "undefined") {
            try {
              const stored = window.localStorage.getItem(userCartKey)
              if (stored) {
                const parsed = JSON.parse(stored) as CartItem[]
                if (Array.isArray(parsed)) {
                  setCartItems(parsed)
                }
              }
            } catch {
              // Clear corrupted cart data
              window.localStorage.removeItem(userCartKey)
              setCartItems([])
            }
          }
        } else {
          // Invalid token, clear everything
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          if (typeof window !== "undefined") {
            localStorage.removeItem("cart")
          }
          setCartItems([])
        }
      } catch (err) {
        console.error("Error fetching user:", err)
        // Clear cart on authentication error
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart")
        }
        setCartItems([])
      }
    }

    fetchUser()

    // Only fetch orders if authenticated
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || "فشل في جلب الطلبات")
        }

        setOrders(data.orders || [])
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء جلب الطلبات")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const latestOrder = orders[0]

  // Cart calculations for user-specific cart
  const cartTotalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalAmount = cartTotalAmount
  
  const cartDisplayProducts = cartItems.map((item) => ({
    label: item.name,
    quantity: item.quantity,
    sellerName: item.sellerName,
    sellerEmail: item.sellerEmail,
    sellerPhone: item.sellerPhone,
    shippingMethod: item.sellerShippingMethod,
  }))

  // Only use cart items, never fall back to order items
  const usingCart = true // Always use cart for user isolation
  const displayProducts = cartDisplayProducts

  const productsCount = displayProducts.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const productsLabel = productsCount > 0 ? `المنتجات (${productsCount})` : "المنتجات"
  
  // Calculate shipping cost from cart items (each product has its own shipping cost)
  const totalShippingCost = usingCart
    ? cartItems.reduce((sum, item) => sum + (item.shippingCost || 50), 0)
    : 50
  
  const shippingCost = totalShippingCost
  const tax = Math.round(totalAmount * 0.15)
  const grandTotal = totalAmount + shippingCost + tax

  const updateCart = (items: CartItem[]) => {
    setCartItems(items)
    if (typeof window !== "undefined" && user) {
      const userCartKey = `cart_${user.id || user._id}`
      window.localStorage.setItem(userCartKey, JSON.stringify(items))
    }
  }

  const handleChangeQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item._id === productId ? { ...item, quantity: Math.max(0, (item.quantity || 0) + delta) } : item,
        )
        .filter((item) => item.quantity > 0)
      if (typeof window !== "undefined" && user) {
        const userCartKey = `cart_${user.id || user._id}`
        window.localStorage.setItem(userCartKey, JSON.stringify(updated))
      }
      return updated
    })
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item._id !== productId)
      if (typeof window !== "undefined" && user) {
        const userCartKey = `cart_${user.id || user._id}`
        window.localStorage.setItem(userCartKey, JSON.stringify(updated))
      }
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-1 mb-4">
            <h1 className="text-3xl font-bold text-[#1E3A5F]">إتمام طلب الشحن</h1>
            <p className="text-sm text-gray-600">
              خطوة {step} من 4: {stepsMeta.find((s) => s.id === step)?.subtitle}
            </p>
          </div>
          {loading && <p className="text-sm text-gray-600 mb-4">جاري تحميل بيانات الطلب...</p>}
          {error && !loading && <p className="text-sm text-red-600 mb-4">{error}</p>}

          {/* خطوات المعالج (Wizard) */}
          <div className="mb-8">
              <div className="relative flex items-center">
                <div className="absolute inset-x-4 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-l from-[#E4D4BD] via-[#FDF8F1] to-[#E4D4BD]" />
              <div className="relative z-10 flex w-full justify-between text-xs md:text-sm text-gray-600">
                {stepsMeta.map((s, index) => {
                  const isActive = step === s.id
                  const isCompleted = step > s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className="flex flex-col items-center gap-1 flex-1 group"
                      disabled={s.id > step}
                      onClick={() => {
                        // Only allow navigation to completed steps or current step
                        if (s.id <= step) {
                          setStep(s.id)
                        }
                      }}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm transition-colors border ${
                          isActive
                            ? "bg-[#C7A17A] text-white border-[#C7A17A]"
                            : isCompleted
                              ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                              : "bg-white border-[#E0D2BF] text-gray-700 group-disabled:opacity-70"
                        }`}
                      >
                        {s.id}
                      </div>
                      <span className={`font-medium ${isActive ? "text-[#1E3A5F]" : ""}`}>{s.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* STEP 1 & 4: منتجات السلة / ملخص الطلب */}
            {(step === 1 || step === 4) && (
              <Card className="max-w-3xl mx-auto border-[#E4D4BD]/80 rounded-2xl">
                <CardHeader>
                  <CardTitle>{step === 1 ? "منتجات السلة" : "ملخص الطلب"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="pb-3 border-b">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-600">{productsLabel}</span>
                        <span className="font-semibold">{totalAmount} ر.س</span>
                      </div>
                      {usingCart ? (
                        <div className="space-y-3">
                          {cartItems.length === 0 ? (
                            <p className="text-xs text-gray-500">لا توجد منتجات في السلة حالياً.</p>
                          ) : (
                            cartItems.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center gap-3 p-2 rounded-lg border bg-white/60"
                              >
                                <div className="relative w-14 h-14 overflow-hidden rounded-md bg-gray-100 shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                                    {item.name}
                                  </p>
                                  {item.sellerName && (
                                    <p className="text-[11px] text-gray-500">
                                      البائع: {item.sellerName}
                                      {item.sellerPhone && ` • ${String(item.sellerPhone)}`}
                                    </p>
                                  )}
                                  {item.sellerShippingMethod && (
                                    <p className="text-[11px] text-gray-500">
                                      طريقة الشحن:{" "}
                                      {item.sellerShippingMethod === "express"
                                        ? "شحن سريع"
                                        : item.sellerShippingMethod === "same-day"
                                          ? "توصيل في نفس اليوم"
                                          : "شحن عادي"}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <p className="text-xs font-semibold text-[#8C6239]">
                                    {item.price * item.quantity} ر.س
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => handleChangeQuantity(item._id, -1)}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-xs w-6 text-center">{item.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => handleChangeQuantity(item._id, 1)}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleRemoveItem(item._id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 space-y-1">
                          {displayProducts.length === 0 ? (
                            <p>لا توجد تفاصيل منتجات متاحة لهذا الطلب.</p>
                          ) : (
                            displayProducts.map((item, index) => (
                              <div key={index} className="space-y-0.5">
                                <p>
                                  • {item.label} {item.quantity ? `(${item.quantity})` : ""}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {step === 4 && (
                      <>
                        <div className="flex justify-between text-sm text-[#1E3A5F]">
                          <span className="text-gray-600">الشحن</span>
                          <span className="font-semibold">{shippingCost} ر.س</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#1E3A5F]">
                          <span className="text-gray-600">الضريبة (15%)</span>
                          <span className="font-semibold">{tax} ر.س</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-bold">الإجمالي</span>
                          <span className="font-bold text-xl text-[#8C6239]">{grandTotal} ر.س</span>
                        </div>
                      </>
                    )}
                  </div>

                  {step === 4 && (
                    <Button
                      className="w-full bg-[#C7A17A] hover:bg-[#A66A30] h-12 text-lg"
                      onClick={() => {
                        try {
                          if (typeof window !== "undefined") {
                            const payload = {
                              items: cartItems,
                              subtotal: totalAmount,
                              shippingCost,
                              tax,
                              grandTotal,
                            }
                            window.localStorage.setItem("checkoutSummary", JSON.stringify(payload))
                          }
                        } catch {
                          // ignore storage errors
                        }
                        router.push("/payment")
                      }}
                    >
                      متابعة الدفع
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* STEP 2: بيانات العميل */}
            {step === 2 && (
              <Card className="max-w-3xl mx-auto border-[#E4D4BD]/80 bg-white rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-[#1E3A5F]">بيانات التوصيل</CardTitle>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    أدخل بيانات التواصل والعنوان بدقة لضمان وصول الشحنة إلى المكان الصحيح.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact info */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#8C6239]">معلومات التواصل</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="first-name" className="text-xs md:text-sm text-gray-700">
                          الاسم الأول
                        </Label>
                        <Input 
                          id="first-name" 
                          placeholder="أحمد" 
                          defaultValue={user?.name?.split(' ')[0] || ""}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="last-name" className="text-xs md:text-sm text-gray-700">
                          الاسم الأخير
                        </Label>
                        <Input 
                          id="last-name" 
                          placeholder="محمد" 
                          defaultValue={user?.name?.split(' ').slice(1).join(' ') || ""}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs md:text-sm text-gray-700">
                        رقم الجوال
                      </Label>
                      <Input 
                        id="phone" 
                        placeholder="+966 5X XXX XXXX" 
                        defaultValue={user?.phone || ""}
                        dir="ltr" 
                      />
                    </div>
                  </div>

                  <div className="h-px bg-[#E4D4BD]/70" />

                  {/* Address info */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#8C6239]">عنوان التوصيل</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-xs md:text-sm text-gray-700">
                          المدينة
                        </Label>
                        <Input id="city" placeholder="الرياض" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="district" className="text-xs md:text-sm text-gray-700">
                          الحي
                        </Label>
                        <Input id="district" placeholder="النرجس" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-xs md:text-sm text-gray-700">
                        العنوان التفصيلي
                      </Label>
                      <Input id="address" placeholder="اسم الشارع، رقم المبنى، معلم قريب" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="postal" className="text-xs md:text-sm text-gray-700">
                          الرمز البريدي
                        </Label>
                        <Input id="postal" placeholder="12345" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-xs md:text-sm text-gray-700">
                          ملاحظات إضافية (اختياري)
                        </Label>
                        <Input id="notes" placeholder="مثال: بجانب المسجد، الدور الثاني" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 3: معلومات الشحن */}
            {step === 3 && (
              <Card className="max-w-3xl mx-auto border-[#E4D4BD]/80 bg-white rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-[#1E3A5F]">طرق الشحن</CardTitle>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    طريقة الشحن لكل منتج يحددها البائع. في حال وجود أكثر من منتج من بائعين مختلفين، قد يتم شحن كل منتج بشكل منفصل.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {usingCart && cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => {
                        const shippingMethodLabel =
                          item.sellerShippingMethod === "express"
                            ? "شحن سريع (2-3 أيام عمل)"
                            : item.sellerShippingMethod === "same-day"
                              ? "توصيل في نفس اليوم"
                              : item.sellerShippingMethod === "standard"
                                ? "شحن عادي (5-7 أيام عمل)"
                                : "غير محدد"
                        
                        // Use the actual shipping cost set by the seller, or default to 50
                        const itemShippingCost = item.shippingCost || 50

                        return (
                          <div
                            key={item._id}
                            className="p-4 rounded-xl border border-[#E4D4BD]/60 bg-[#FDF8F1]/50 space-y-2"
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative w-16 h-16 overflow-hidden rounded-lg bg-gray-100 shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-semibold text-[#1E3A5F]">{item.name}</p>
                                {item.sellerName && (
                                  <p className="text-xs text-gray-600">
                                    البائع: <span className="font-medium">{item.sellerName}</span>
                                  </p>
                                )}
                                <div className="flex items-center gap-2 pt-1">
                                  <div className="px-3 py-1 rounded-full bg-[#C7A17A]/10 border border-[#C7A17A]/30">
                                    <p className="text-xs font-medium text-[#8C6239]">
                                      {shippingMethodLabel}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    تكلفة الشحن: <span className="font-semibold text-[#8C6239]">{itemShippingCost} ر.س</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">لا توجد منتجات في السلة حالياً.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            </div>

          {/* أزرار التنقل بين خطوات المعالج */}
          <div className="mt-8 flex justify-between">
            <Button className="bg-[#C7A17A] hover:bg-[#A66A30] text-white"
              variant="outline"
              disabled={step === 1}
              onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev))}
            >
              الرجوع
            </Button>
            {step < 4 && (
                <Button
                  className="bg-[#C7A17A] hover:bg-[#A66A30]"
                disabled={step === 1 && cartItems.length === 0}
                onClick={() => setStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev))}
              >
                التالي
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
