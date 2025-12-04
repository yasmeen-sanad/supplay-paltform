"use client"

import Link from "next/link"
import { User, Store } from "lucide-react"
import { Header } from "@/components/header"

export default function SignupPage() {
  return (
   <div className="min-h-screen w-full bg-[#F5F1E8]">
      <Header />
      <main className="relative flex items-center justify-center px-4 py-10">
        {/* خلفية ناعمة */}

        <div className="relative z-10 w-full max-w-md ">
          <div className="bg-[#FFFDF9] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.10)] px-7 py-9 md:px-9 md:py-16  border border-[#F0E1CF]">
            {/* Badge + عنوان */}
            <div className="text-center mb-9">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-1">
                إنشاء حساب
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                اختر نوع الحساب الأنسب لطبيعة نشاطك
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex rounded-2xl bg-[#F4EEE4] p-1 text-sm font-semibold">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 rounded-2xl text-gray-500 hover:text-[#8C6239] transition-colors"
                >
                  تسجيل دخول
                </Link>
                <div className="flex-1">
                  <button
                    className="w-full py-2 rounded-2xl bg-white text-[#8C6239] shadow-sm border border-[#E5D2BC]"
                    disabled
                  >
                    إنشاء حساب
                  </button>
                </div>
              </div>
            </div>

            {/* خيارات نوع الحساب */}
            <div className="space-y-4">
              <Link
                href="/signup/buyer"
                className="group flex items-center justify-between w-full rounded-2xl border border-[#E5D2BC] bg-white py-4.5 px-5 hover:border-[#C7A17A] hover:bg-[#FFF7EC] hover:shadow-md transition-all"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1E3A5F]">
                    التسجيل كمشتري
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    مناسب لتجار التجزئة، شركات المقاولات، ومشتري مواد البناء
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#F7E5CF] flex items-center justify-center text-[#C17A3C] group-hover:bg-[#C7A17A] group-hover:text-white transition-all">
                  <User className="w-5 h-5" />
                </div>
              </Link>

              <Link
                href="/signup/seller"
                className="group flex items-center justify-between w-full rounded-2xl border border-[#E5D2BC] bg-white py-4.5 px-5 hover:border-[#C7A17A] hover:bg-[#FFF7EC] hover:shadow-md transition-all"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1E3A5F]">
                    التسجيل كبائع
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    مثالي للموردين، المصانع، وأصحاب المتاجر والمتاجر الإلكترونية
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#F7E5CF] flex items-center justify-center text-[#C17A3C] group-hover:bg-[#C7A17A] group-hover:text-white transition-all">
                  <Store className="w-5 h-5" />
                </div>
              </Link>
            </div>

            {/* رابط تحت */}
            <div className="mt-6 text-center text-xs md:text-sm text-gray-600">
              لديك حساب مسبقاً؟{" "}
              <Link href="/login" className="text-[#8C6239] font-semibold hover:underline">
                سجّل الدخول هنا
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}