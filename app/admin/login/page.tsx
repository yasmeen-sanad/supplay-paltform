"use client"

import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

export default function AdminLoginPage() {
  const searchParams = useSearchParams()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("تم إنشاء حساب المشرف بنجاح! يمكنك الآن تسجيل الدخول")
    }
  }, [searchParams])

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

      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || "فشل تسجيل الدخول")
      }

      // Check if user is admin
      if (data.user?.role !== "admin") {
        throw new Error("ليس لديك صلاحية للوصول إلى لوحة التحكم")
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      window.location.href = "/admin"
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F1E8] flex items-center justify-center">
      <main className="w-full max-w-md px-4 py-10">
        <div className="bg-[#FFFDF9] rounded-[32px] px-7 py-9 md:px-9 md:py-16 border border-[#F0E1CF]">
            <div className="text-center mb-7">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-1">تسجيل دخول المشرف</h1>
              <p className="text-xs md:text-sm text-gray-600">
                ادخل بياناتك للوصول إلى لوحة التحكم
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ادخل البريد الإلكتروني أو رقم الجوال"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C17A3C]">
                  <Lock className="w-5 h-5" />
                </span>
              </div>
            </div>

            {success && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs md:text-sm text-green-600 text-center">{success}</p>
              </div>
            )}
            {error && <p className="mb-3 text-xs md:text-sm text-red-600 text-center">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#C7A17A] hover:bg-[#A66A30] text-white text-sm font-semibold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
              <Link href="/admin/register" className="text-[#8C6239] font-semibold hover:underline">
                إنشاء حساب مشرف جديد
              </Link>
            </div>

            <div className="mt-2 text-center text-xs md:text-sm text-gray-600">
              <Link href="/" className="text-gray-500 hover:text-[#8C6239] hover:underline">
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </div>
      </main>
    </div>
  )
}

