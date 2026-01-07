"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { AdminSidebar } from "@/components/admin-sidebar"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Users, Package, Loader2, AlertTriangle, Clock3, BadgeCheck } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type Vendor = {
  _id: string
  vendorStatus: "pending" | "approved" | "rejected"
  productCount?: number
}

export default function AdminDashboard() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingVendors: 0,
    approvedVendors: 0,
    totalProducts: 0,
  })

  // ✅ Auth check once
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (!token || !userStr) {
      router.push("/admin/login")
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role !== "admin") {
        router.push("/admin/login")
        return
      }
    } catch {
      router.push("/admin/login")
      return
    }

    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      const [vendorsRes, pendingRes, approvedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/vendors`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/vendors?status=pending`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/vendors?status=approved`, { headers }),
      ])

      const [vendorsData, pendingData, approvedData] = await Promise.all([
        vendorsRes.json(),
        pendingRes.json(),
        approvedRes.json(),
      ])

      if (!vendorsRes.ok || !pendingRes.ok || !approvedRes.ok) {
        const msg =
          vendorsData?.message ||
          pendingData?.message ||
          approvedData?.message ||
          "فشل في جلب الإحصائيات"
        setError(msg)
        return
      }

      if (!vendorsData?.success) {
        setError(vendorsData?.message || "فشل في جلب الإحصائيات")
        return
      }

      const allVendors: Vendor[] = vendorsData.vendors || []
      const pendingVendors: Vendor[] = pendingData.vendors || []
      const approvedVendors: Vendor[] = approvedData.vendors || []

      const totalProducts =
        approvedVendors.reduce((sum, v) => sum + (v.productCount || 0), 0) || 0

      setStats({
        totalVendors: allVendors.length,          // ✅ correct
        pendingVendors: pendingVendors.length,
        approvedVendors: approvedVendors.length,
        totalProducts,
      })
    } catch (err) {
      console.error("Error fetching stats:", err)
      setError("حدث خطأ أثناء جلب الإحصائيات")
    } finally {
      setLoading(false)
    }
  }

  const cards = useMemo(
    () => [
      {
        title: "إجمالي البائعين",
        value: stats.totalVendors,
        icon: Users,
        valueClass: "text-gray-900",
      },
      {
        title: "قيد الانتظار",
        value: stats.pendingVendors,
        icon: Clock3,
        valueClass: "text-orange-600",
      },
      {
        title: "المعتمدون",
        value: stats.approvedVendors,
        icon: BadgeCheck,
        valueClass: "text-emerald-600",
      },
      {
        title: "إجمالي المنتجات",
        value: stats.totalProducts,
        icon: Package,
        valueClass: "text-gray-900",
      },
    ],
    [stats]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <AdminSidebar />
      <main className="mr-64 p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">لوحة التحكم</h1>
            <p className="text-gray-600 mt-1">نظرة عامة على المنصة</p>
          </div>

          <button
            onClick={fetchStats}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            تحديث
          </button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert className="border-red-200 bg-red-50 rounded-2xl">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-700">تعذر تحميل الإحصائيات</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => {
            const Icon = c.icon
            return (
              <Card key={c.title} className="rounded-2xl shadow-sm border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    {c.title}
                  </CardTitle>
                  <div className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className={`text-3xl font-bold tabular-nums ${c.valueClass}`}>
                    {c.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">آخر تحديث: الآن</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}