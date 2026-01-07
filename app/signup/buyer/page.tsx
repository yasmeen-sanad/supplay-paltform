"use client"

import Link from "next/link"
import { Mail, ShieldCheck, User, Phone } from "lucide-react"
import { Header } from "@/components/header"
import { useState } from "react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { buyerRegisterSchema, BuyerRegisterFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

const steps = [
  " البريد الإلكتروني",
  "كلمة المرور",
  "معلومات العميل",
]

export default function BuyerSignupWizard() {
  const [step, setStep] = useState(1)

  const [country, setCountry] = useState("")

  const { form, handleSubmit, isSubmitting } = useFormValidation({
    schema: buyerRegisterSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    },
    onSubmit: async (data: BuyerRegisterFormData) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email,
          password: data.password,
          phone: data.phone,
          address: data.address,
          role: "customer",
        }),
      })

      const responseData = await res.json()
      if (!responseData.success) {
        throw new Error(responseData.message || "فشل إنشاء الحساب")
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", responseData.token)
        localStorage.setItem("user", JSON.stringify(responseData.user))
      }

      window.location.href = "/"
    },
  })

  const next = async () => {
    if (step === 1) {
      const ok = await form.trigger("email")
      if (!ok) return
    }
    if (step === 2) {
      const ok = await form.trigger(["password", "confirmPassword"])
      if (!ok) return
    }
    if (step === 3) {
      const ok = await form.trigger(["firstName", "lastName", "phone", "address"])
      if (!ok) return
    }
    setStep((s) => Math.min(3, s + 1))
  }

  const prev = () => setStep((s) => Math.max(1, s - 1))

  return (
    <div className="min-h-screen w-full bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main className="relative flex items-center justify-center px-4 py-10">
        <div className="relative z-10 w-full max-w-xl">
          <div className="bg-[#FFFDF9] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.10)] px-7 py-9 md:px-9 md:py-10 border border-[#F0E1CF]">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-1">إنشاء حساب</h1>
              <p className="text-sm text-gray-600">التسجيل كمشتري</p>
            </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-6 mb-8 text-xs md:text-sm">
            {steps.map((label, index) => {
              const current = index + 1
              const isActive = current === step
              return (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      isActive
                        ? "bg-[#C7A17A] border-[#C7A17A] text-white"
                        : current < step
                        ? "bg-[#FFF3E0] border-[#C7A17A] text-[#8C6239]"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                    }`}
                  >
                    {current}
                  </div>
                  <span
                    className={`whitespace-nowrap ${
                      isActive ? "text-[#8C6239] font-semibold" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Step content */}
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
              {(form.formState.errors as any)?.root?.message && (
                <p className="text-xs md:text-sm text-red-600 text-center">
                  {(form.formState.errors as any).root.message}
                </p>
              )}

              {step === 1 && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-semibold text-right text-gray-800 mb-1">
                        البريد الإلكتروني
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="ادخل البريد الإلكتروني"
                            className="pr-11 text-right"
                            {...field}
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C7A17A]">
                            <Mail className="w-5 h-5" />
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-semibold text-right text-gray-800 mb-1">
                          كلمة المرور
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="كلمة المرور"
                            className="text-right"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-semibold text-right text-gray-800 mb-1">
                          تأكيد كلمة المرور
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="تأكيد كلمة المرور"
                            className="text-right"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-800 text-right mb-1">معلومات العميل</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="الاسم الأول"
                              className="text-right"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="الاسم الأخير"
                              className="text-right"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="tel"
                              placeholder="رقم الجوال"
                              className="pr-11 text-right"
                              {...field}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C17A3C]">
                              <Phone className="w-5 h-5" />
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 px-4 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                  >
                    <option value="">الدولة</option>
                    <option value="saudi">السعودية</option>
                    <option value="uae">الامارات</option>
                    <option value="kuwait">الكويت</option>
                  </select>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="العنوان"
                            className="text-right"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  onClick={step === 1 ? undefined : prev}
                  className={`px-5 py-2.5 bg-[#C7A17A] hover:bg-[#A66A30] rounded-2xl text-sm font-semibold border transition-colors ${
                    step === 1
                      ? " border-gray-200 text-white cursor-default"
                      : " border-gray-300 text-white hover:bg-gray-50"
                  }`}
                >
                  رجوع
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={next}
                    className="flex-1 py-3 rounded-2xl bg-[#C7A17A] hover:bg-[#A66A30] text-white text-sm font-semibold shadow-md transition-colors"
                  >
                    التالي
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-2xl bg-[#C17A3C] hover:bg-[#A66A30] text-white text-sm font-semibold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <p className="mt-4 text-center text-xs md:text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-[#8C6239] font-semibold hover:underline">
              تسجيل دخول
            </Link>
          </p>
        </div>
      </div>
      </main>
    </div>
  )
}
