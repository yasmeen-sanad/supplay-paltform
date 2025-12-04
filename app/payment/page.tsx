 "use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, Landmark, Shield } from "lucide-react"

type CheckoutItem = {
  _id: string
  name: string
  price: number
  quantity: number
}

type CheckoutSummary = {
  items: CheckoutItem[]
  subtotal: number
  shippingCost: number
  tax: number
  grandTotal: number
}

export default function PaymentPage() {
  const [summary, setSummary] = useState<CheckoutSummary | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = window.localStorage.getItem("checkoutSummary")
      if (!stored) return
      const parsed = JSON.parse(stored) as CheckoutSummary
      setSummary(parsed)
    } catch {
      // ignore parse errors
    }
  }, [])

  const subtotal = summary?.subtotal ?? 0
  const shippingCost = summary?.shippingCost ?? 0
  const tax = summary?.tax ?? 0
  const grandTotal = summary?.grandTotal ?? subtotal + shippingCost + tax

  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">إتمام الدفع</h1>
          <p className="text-sm text-gray-600 mb-8">
            راجع تفاصيل المبلغ ثم اختر طريقة الدفع المناسبة لإكمال طلبك.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>اختر طريقة الدفع</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:border-[#C7A17A] cursor-pointer">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 text-[#C7A17A]" />
                        <div>
                          <p className="font-semibold">بطاقة ائتمان / مدى</p>
                          <p className="text-xs text-gray-500">فيزا، ماستر كارد، مدى</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:border-[#C7A17A] cursor-pointer">
                      <RadioGroupItem value="apple-pay" id="apple-pay" />
                      <Label htmlFor="apple-pay" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="w-5 h-5 text-[#C7A17A]" />
                        <div>
                          <p className="font-semibold">Apple Pay</p>
                          <p className="text-xs text-gray-500">الدفع السريع والآمن</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {paymentMethod === "credit-card" && (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات البطاقة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="card-name">الاسم على البطاقة</Label>
                    <Input id="card-name" placeholder="أحمد محمد" />
                  </div>
                  <div>
                    <Label htmlFor="card-number">رقم البطاقة</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" type="password" />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">
                      معلومات الدفع الخاصة بك محمية بتشفير SSL ومعايير أمان PCI DSS
                    </p>
                  </div>
                </CardContent>
              </Card>
              )}

            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span className="font-semibold">{subtotal} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">الشحن</span>
                      <span className="font-semibold">{shippingCost} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">الضريبة (15%)</span>
                      <span className="font-semibold">{tax} ر.س</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-bold">الإجمالي</span>
                      <span className="font-bold text-xl text-[#C7A17A]">{grandTotal} ر.س</span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#C7A17A] hover:bg-[#A66A30] h-12 text-lg">إتمام الدفع</Button>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">بإتمام الطلب، أنت توافق على</p>
                    <a href="#" className="text-xs text-[#C7A17A] hover:underline">
                      الشروط والأحكام
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
