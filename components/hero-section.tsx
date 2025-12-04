"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Check if user is logged in
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

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    
    // Clear user-specific cart data
    if (user) {
      const userCartKey = `cart_${user.id || user._id}`
      localStorage.removeItem(userCartKey)
    }
    
    // Clear any old cart data
    localStorage.removeItem("cart")
    
    window.location.href = "/"
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>

      <section className="relative min-h-[650px] overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 " />
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#C7A17A]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-50 rounded-full blur-2xl bg-[#00A86B]/5" />

        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Right side - Text with animations */}
            <div
              className={`text-right space-y-8 lg:order-2 transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h1
                className={`text-5xl lg:text-7xl text-center font-bold leading-tight transition-all duration-800 delay-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <span className="bg-gradient-to-l from-[#0F2647] via-[#1E3A5F] to-[#2A4473] bg-clip-text text-transparent">
 منصة المورد المتكاملة
</span>
              </h1>

              <p
                className={`text-xl lg:text-2xl text-gray-600 text-center leading-relaxed max-w-2xl mx-auto font-light transition-all duration-800 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                حلّك الأول لشراء وتوريد المواد بجودة عالية وأسعار تنافسية
              </p>

              <div
                className={`flex gap-4 justify-center transition-all duration-800 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <Link href="/products">
                <button
                  className="bg-gradient-to-l from-[#C7A17A] to-[#B38E69] hover:from-[#B38E69] hover:to-[#A07D5E] text-white px-8 py-2 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10">استعرض المنتجات</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-l border border-[#C7A17A] text-[#C7A17A] px-8 py-2 text-lg rounded-2xl transition-all duration-300 hover:text-[#C7A17A] hover:scale-105"
                  >
                    تسجيل الخروج
                  </button>
                ) : (
                  <Link href="/signup">
                    <button
                      className="bg-gradient-to-l border border-[#C7A17A] text-[#C7A17A] px-8 py-2 text-lg rounded-2xl transition-all duration-300 hover:text-[#C7A17A] hover:scale-105"
                    >
                      سجل الآن
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Left side - Animated images */}
            <div className="relative h-[450px] lg:h-[550px] lg:order-1">
              <div className="absolute top-0 right-0 w-[45%] h-[55%] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent z-10" />
                <img 
                  src="https://saudipedia.com/saudipedia/uploads/images/2024/12/09/165653.jpg" 
                  alt="Construction Site" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-[20%] left-[5%] w-[42%] h-[52%] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 z-10 animate-float-reverse">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-transparent z-10" />
                <img 
                  src="https://www.logos3pl.com/wp-content/uploads/2022/01/what-is-a-public-warehouse-logos-logistics-blog-1024x576.jpg" 
                  alt="Warehouse" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute bottom-[8%] right-[18%] w-[38%] h-[48%] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-float-slow">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent z-10" />
                <img 
                  src="https://hasien.com/wp-content/uploads/2025/07/%D9%85%D9%88%D8%A7%D8%AF-%D8%A8%D9%86%D8%A7%D8%A1-%D8%B9%D8%A7%D9%84%D9%8A%D8%A9-%D8%A7%D9%84%D8%AC%D9%88%D8%AF%D8%A9.jpg" 
                  alt="Building Materials" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}