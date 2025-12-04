"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ShieldCheck, Building2, Phone } from "lucide-react"
import { Header } from "@/components/header"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

const steps = [
  "البريد الإلكتروني",
  "كلمة المرور",
  "معلومات المتجر",
]

export default function SellerSignupWizard() {
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [storeName, setStoreName] = useState("")
  const [commercialRegister, setCommercialRegister] = useState("")
  const [phone, setPhone] = useState("")
  const [storeAddress, setStoreAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const next = () => setStep((s) => Math.min(3, s + 1))
  const prev = () => setStep((s) => Math.max(1, s - 1))

  const handleSubmit = async () => {
    if (!email || !password || !storeName) {
      setError("الرجاء إدخال البريد الإلكتروني، اسم المتجر وكلمة المرور")
      return
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: storeName,
          email,
          password,
          phone,
          address: storeAddress,
          role: "seller",
        }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || "فشل إنشاء الحساب")
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      window.location.href = "/"
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main className="relative flex items-center justify-center px-4 py-10">
        <div className="relative z-10 w-full max-w-xl">
          <div className="bg-[#FFFDF9] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.10)] px-7 py-9 md:px-9 md:py-10 border border-[#F0E1CF]">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-1">إنشاء حساب</h1>
              <p className="text-sm text-gray-600">التسجيل كبائع</p>
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
          <div className="space-y-5 mb-8">
            {step === 1 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-right text-gray-800 mb-1">
                  البريد الإلكتروني للمؤسسة
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ادخل البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/70 focus:border-[#C7A17A]"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C7A17A]">
                    <Mail className="w-5 h-5" />
                  </span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-right text-gray-800 mb-1">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 px-4 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/70 focus:border-[#C7A17A]"
                />
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 px-4 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/70 focus:border-[#C7A17A]"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-800 text-right mb-1">معلومات المتجر</h2>
                <input
                  type="text"
                  placeholder="اسم المتجر / المؤسسة"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 px-4 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="رقم السجل التجاري"
                    value={commercialRegister}
                    onChange={(e) => setCommercialRegister(e.target.value)}
                    className="rounded-2xl border border-gray-200 bg-white py-3 px-4 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/70 focus:border-[#C7A17A]"
                  />
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="رقم الجوال"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C7A17A]/70 focus:border-[#C7A17A]"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C7A17A]">
                      <Phone className="w-5 h-5" />
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="عنوان المتجر"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 px-4 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
              </div>
            )}
          </div>

          {error && <p className="mb-3 text-xs md:text-sm text-red-600 text-center">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={step === 1 ? undefined : prev}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-colors ${
                step === 1
                  ? "border-gray-200 text-gray-400 cursor-default"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              رجوع
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="flex-1 py-3 rounded-2xl bg-[#C7A17A] hover:bg-[#A66A30] text-white text-sm font-semibold shadow-md transition-colors"
              >
                التالي
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-[#C17A3C] hover:bg-[#A66A30] text_white text-sm font-semibold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>
            )}
          </div>

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
