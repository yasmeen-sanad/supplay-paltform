"use client"

import { Search, Home, Factory, Tags, Building2, User, Boxes, Menu, X, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type AuthUser = {
  name?: string
  role?: "customer" | "seller" | "admin"
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)

  const handleSignOut = () => {
    // Clear all authentication data
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    
    // Clear user-specific cart data
    const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const userCartKey = `cart_${parsed.id || parsed._id}`
        localStorage.removeItem(userCartKey)
      } catch {
        // Ignore parsing errors
      }
    }
    
    // Clear any old cart data
    localStorage.removeItem("cart")
    
    setAuthUser(null)
    window.location.href = "/"
  }

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null
      if (!raw) return
      const parsed = JSON.parse(raw)
      setAuthUser(parsed)
    } catch {
      setAuthUser(null)
    }
  }, [])

  return (
    <header className="bg-gradient-to-r from-[#F5F1E8]/95 via-white/95 to-[#F5F1E8]/95 backdrop-blur-xl border-b border-[#C7A17A]/30 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* ========== اليسار (المنيو للجوال) ========== */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-[#C7A17A]/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#1E3A5F]" />
              ) : (
                <Menu className="h-6 w-6 text-[#1E3A5F]" />
              )}
            </button>
          </div>

          {/* ========== وسط الهيدر (القائمة + أيقونات) ========== */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">

            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all duration-300 group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>الرئيسية</span>
            </Link>

            <Link 
              href="/products" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all duration-300 group"
            >
              <Boxes className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>المنتجات</span>
            </Link>

            <Link 
              href="/factories" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all duration-300 group"
            >
              <Factory className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>المصانع</span>
            </Link>

            <Link 
              href="/brands" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all duration-300 group"
            >
              <Tags className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>العلامات التجارية</span>
            </Link>

            <Link 
              href="/establishments" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all duration-300 group"
            >
              <Building2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>المنشآت المساندة</span>
            </Link>
          </nav>

          {/* ========== يمين الهيدر (البحث + الحساب) ========== */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="relative hidden md:block group">
              <input
                type="text"
                placeholder="ابحث هنا..."
                className="
                  w-72 px-5 py-2.5 pr-12 rounded-2xl border-2
                  bg-white/80 backdrop-blur-sm text-right
                  border-[#C7A17A]/30
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#C7A17A]
                  focus:border-[#C7A17A]
                  focus:bg-white
                  hover:shadow-md
                  transition-all duration-300
                  placeholder:text-gray-400
                "
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C7A17A] group-hover:scale-110 transition-transform">
                <Search className="h-5 w-5" />
              </div>
            </div>

            {/* حساب المستخدم / تسجيل الدخول */}
            {authUser ? (
              authUser.role === "seller" ? (
                <div className="flex items-center gap-3">
                  <Link href="/seller">
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-l from-[#C7A17A] to-[#B38E69] text-white hover:from-[#B38E69] hover:to-[#A07D5E] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                      <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline font-medium">لوحة البائع</span>
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[#C7A17A]/30 text-[#C7A17A] bg-[#C7A17A]/10 hover:bg-[#C7A17A]/20 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-sm font-medium">تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-l from-[#C7A17A] to-[#B38E69] text-white hover:from-[#B38E69] hover:to-[#A07D5E] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                      <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline font-medium">الملف الشخصي</span>
                    </button>
                  </Link>
                  <Link href="/shipping">
                    <button className="hidden md:flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-[#C7A17A]/60 text-[#8C6239] bg-white hover:bg-[#F5E9D9] shadow-sm hover:shadow-md transition-all duration-300">
                      <span className="text-xs font-medium">عرض السلة</span>
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              )
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-l from-[#C7A17A] to-[#B38E69] text-white hover:from-[#B38E69] hover:to-[#A07D5E] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline font-medium">تسجيل الدخول</span>
                </button>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#C7A17A]/20 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>الرئيسية</span>
            </Link>

            <Link 
              href="/products" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Boxes className="h-5 w-5" />
              <span>المنتجات</span>
            </Link>

            <Link 
              href="/factories" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Factory className="h-5 w-5" />
              <span>المصانع</span>
            </Link>

            <Link 
              href="/brands" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Tags className="h-5 w-5" />
              <span>العلامات التجارية</span>
            </Link>

            <Link 
              href="/establishments" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-l hover:from-[#C7A17A]/20 hover:to-[#B38E69]/10 text-[#1E3A5F] hover:text-[#C7A17A] transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Building2 className="h-5 w-5" />
              <span>المنشآت المساندة</span>
            </Link>

            {authUser ? (
              authUser.role === "seller" ? (
                <>
                  <Link
                    href="/seller"
                    className="flex items-center gap-2 px-2 py-2 rounded-xl bg-gradient-to-l from-[#C7A17A] to-[#B38E69] text-white hover:from-[#B38E69] hover:to-[#A07D5E]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>لوحة البائع</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-300 text-red-600 bg-white hover:bg-red-50 transition-all"
                  >
                    <span className="text-sm font-medium">تسجيل الخروج</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-2 py-2 rounded-xl bg-gradient-to-l from-[#C7A17A] to-[#B38E69] text-white hover:from-[#B38E69] hover:to-[#A07D5E] transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-w-5" />
                    <span>الملف الشخصي</span>
                  </Link>
                  <Link
                    href="/shipping"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#C7A17A]/60 text-[#8C6239] bg-white hover:bg-[#F5E9D9] transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium">الشحن</span>
                  </Link>
                </>
              )
            ) : null}

            {/* Mobile Search */}
            <div className="relative mt-2 md:hidden">
              <input
                type="text"
                placeholder="ابحث هنا..."
                className="
                  w-full px-5 py-3 pr-12 rounded-xl border-2
                  bg-white text-right
                  border-[#C7A17A]/30
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#C7A17A]
                  focus:border-[#C7A17A]
                  shadow-sm
                  placeholder:text-gray-400
                "
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#C7A17A]" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}