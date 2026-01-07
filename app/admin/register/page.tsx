"use client"

import Link from "next/link"
import { Mail, Lock, User, Shield } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

export default function AdminRegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [adminSecretCode, setAdminSecretCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword || !adminSecretCode) {
      setError("الرجاء ملء جميع الحقول")
      return
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين")
      return
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      return
    }
    
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE_URL}/api/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          adminSecretCode,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        // Handle specific error cases
        if (res.status === 403) {
          throw new Error("رمز المشرف السري غير صحيح. يرجى التحقق من الرمز والمحاولة مرة أخرى.")
        }
        if (res.status === 409) {
          const existingEmail = data.existingAdminEmail;
          const message = existingEmail 
            ? `تم إنشاء حساب المشرف مسبقاً بالبريد: ${existingEmail}. يرجى تسجيل الدخول بدلاً من ذلك.`
            : "تم إنشاء حساب المشرف مسبقاً. يرجى تسجيل الدخول بدلاً من ذلك.";
          throw new Error(message)
        }
        throw new Error(data.message || "فشل إنشاء حساب المشرف")
      }

      // Registration successful, redirect to login
      router.push("/admin/login?registered=true")
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F1E8] flex items-center justify-center">
      <main className="w-full max-w-md px-4 py-10">
        <div className="bg-[#FFFDF9] rounded-[32px] px-7 py-9 md:px-9 md:py-16 border border-[#F0E1CF]">
            <div className="text-center mb-7">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-1">إنشاء حساب المشرف</h1>
              <p className="text-xs md:text-sm text-gray-600">
                أدخل بياناتك ورمز المشرف السري لإنشاء حساب جديد
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C17A3C]">
                  <User className="w-5 h-5" />
                </span>
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C17A3C]">
                  <Lock className="w-5 h-5" />
                </span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C17A3C]">
                  <Lock className="w-5 h-5" />
                </span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="رمز المشرف السري"
                  value={adminSecretCode}
                  onChange={(e) => setAdminSecretCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#C17A3C]/70 focus:border-[#C17A3C]"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C17A3C]">
                  <Shield className="w-5 h-5" />
                </span>
              </div>
            </div>

            {error && <p className="mb-3 text-xs md:text-sm text-red-600 text-center">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#C7A17A] hover:bg-[#A66A30] text-white text-sm font-semibold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب المشرف"}
            </button>

            <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
              <Link href="/admin/login" className="text-[#8C6239] font-semibold hover:underline">
                لديك حساب بالفعل؟ تسجيل الدخول
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

