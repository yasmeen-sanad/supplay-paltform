"use client"

import * as React from "react"
import { Home, Factory, Tag, Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: User, label: "الملف الشخصي", href: "/profile" },
  { icon: Home, label: "الرئيسية", href: "/" },
  { icon: Factory, label: "المصانع", href: "/factories" },
  { icon: Tag, label: "العلامات التجارية", href: "/brands" },
  { icon: Building2, label: "المنشآت المساندة", href: "/establishments" },
]

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sr-only">فتح القائمة</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-0 bg-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">القائمة</h2>
          </div>
          <nav className="flex-1 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-2 py-6 px-4 text-gray-600 hover:text-[#C17A3C] hover:bg-gray-50 transition-colors",
                    isActive && "text-[#C17A3C] bg-gray-50",
                  )}
                >
                  <Icon className="h-8 w-8" />
                  <span className="text-sm font-medium text-center">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
