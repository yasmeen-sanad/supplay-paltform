"use client"

import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { Header } from "@/components/header"
import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!identifier || !password) {
      setError("الرجاء إدخال البريد الإلكتروني أو رقم الجوال وكلمة المرور")
      return
    }
    
    try {
      setLoading(true)
      setError(null)

      const body: { email?: string; phone?: string; password: string } = {
        password,
      }

      if (identifier.includes("@")) {
        body.email = identifier
      } else {
        body.phone = identifier
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || "فشل تسجيل الدخول")
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      const role = data.user?.role

      if (role === "seller") {
        window.location.href = "/seller"
      } else {
        window.location.href = "/profile"
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F1E8] bg-fixed">
      <Header />
      <main className="relative flex items-center justify-center px-4 py-10">
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-[#FFFDF9] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.10)] px-7 py-9 md:px-9 md:py-16 border border-[#F0E1CF]">
            {/* Badge + عنوان */}
            <div className="text-center mb-7">
             
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-1">مرحباً بك</h1>
              <p className="text-xs md:text-sm text-gray-600">
                ادخل بياناتك لتسجيل الدخول إلى حسابك في المنصّة
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex rounded-2xl bg-[#F4EEE4] p-1 text-sm font-semibold">
                <div className="flex-1">
                  <button
                    className="w-full py-2 rounded-2xl bg-white text-[#8C6239] shadow-sm border border-[#E5D2BC]"
                    disabled
                  >
                    تسجيل دخول
                  </button>
                </div>
                <Link
                  href="/signup"
                  className="flex-1 text-center py-2 rounded-2xl text-gray-500 hover:text-[#8C6239] transition-colors"
                >
                  إنشاء حساب
                </Link>
              </div>
            </div>

            {/* Method choice */}
            <div className="flex items-center justify-center gap-6 mb-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="email"
                  name="loginMethod"
                  defaultChecked
                  className="accent-[#C17A3C]"
                />
                <label htmlFor="email">البريد الإلكتروني</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" id="phone" name="loginMethod" className="accent-[#C17A3C]" />
                <label htmlFor="phone">رقم الجوال</label>
              </div>
            </div>

            {/* Email / phone field */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ادخل البريد الإلكتروني أو رقم الجوال"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C17A3C]">
                  <Mail className="w-5 h-5" />
                </span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="ادخل رمز المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C17A3C]">
                  <Lock className="w-5 h-5" />
                </span>
              </div>
            </div>

            {error && <p className="mb-3 text-xs md:text-sm text-red-600 text-center">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#C7A17A] hover:bg-[#A66A30] text-white text-sm font-semibold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "جاري تسجيل الدخول..." : "إرسال"}
            </button>

            <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <Link href="/signup" className="text-[#8C6239] font-semibold hover:underline">
                أنشئ حساباً جديداً 
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
