"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Settings, LogOut, User } from "lucide-react"
import { useEffect, useState } from "react"

export function AdminSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        setUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/admin/login"
  }

  const menuItems = [
    {
      href: "/admin",
      label: "لوحة التحكم",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/vendors",
      label: "إدارة البائعين",
      icon: Users,
    },
    {
      href: "/admin/settings",
      label: "إعدادات المنصة",
      icon: Settings,
    },
  ]

  return (
    <div className="h-screen w-64 bg-[#1E3A5F] text-white flex flex-col fixed right-0 top-0">
      <div className="p-6 border-b border-[#2A4A6F]">
        <h2 className="text-xl font-bold">لوحة التحكم</h2>
        <p className="text-sm text-gray-300 mt-1">إدارة المنصة</p>
      </div>

      {/* User Info Section */}
      {user && (
        <div className="p-4 border-b border-[#2A4A6F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C17A3C] rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-right flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-300 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#C17A3C] text-white"
                  : "text-gray-300 hover:bg-[#2A4A6F] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#2A4A6F]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#2A4A6F] hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  )
}

