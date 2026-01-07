"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { AdminSidebar } from "@/components/admin-sidebar"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Eye,
  Check,
  X,
  Loader2,
  Filter,
  Users,
  Package,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type VendorStatus = "pending" | "approved" | "rejected"
type FilterStatus = "all" | VendorStatus

type Vendor = {
  _id: string
  name: string
  email: string
  logo?: string
  vendorStatus: VendorStatus
  productCount: number
  customerCount: number
  createdAt: string
  phone?: string
  address?: string
  city?: string
}

export default function VendorsManagementPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null) // approve/reject loading per row/modal

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

    // initial fetch
    fetchVendors(statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  // ✅ Refetch when filter changes
  useEffect(() => {
    fetchVendors(statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const buildVendorsUrl = (filter: FilterStatus) => {
    if (filter === "all") return `${API_BASE_URL}/api/admin/vendors`
    return `${API_BASE_URL}/api/admin/vendors?status=${filter}`
  }

  const normalizeLogoUrl = (logo?: string) => {
    if (!logo) return "/placeholder-logo.png"
    if (logo.startsWith("http://") || logo.startsWith("https://")) return logo
    if (logo.startsWith("/")) return `${API_BASE_URL}${logo}`
    return `${API_BASE_URL}/${logo}`
  }

  const fetchVendors = async (filter: FilterStatus) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      const url = buildVendorsUrl(filter)

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.message || "فشل في جلب البائعين")
        setVendors([])
        return
      }

      if (data?.success) {
        setVendors(data.vendors || [])
      } else {
        setError(data?.message || "فشل في جلب البائعين")
        setVendors([])
      }
    } catch (err) {
      console.error("Error fetching vendors:", err)
      setError("حدث خطأ أثناء جلب البائعين")
      setVendors([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (vendorId: string) => {
    try {
      setActionLoadingId(vendorId)
      setError(null)
      setSuccess(null)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/vendors/${vendorId}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        setError(data?.message || "تعذر اعتماد البائع")
        return
      }

      setSuccess("تم اعتماد البائع بنجاح")
      await fetchVendors(statusFilter)

      // update selected vendor if open
      setSelectedVendor((prev) =>
        prev && prev._id === vendorId ? { ...prev, vendorStatus: "approved" } : prev
      )
    } catch (err) {
      console.error("Error approving vendor:", err)
      setError("حدث خطأ أثناء اعتماد البائع")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (vendorId: string) => {
    try {
      setActionLoadingId(vendorId)
      setError(null)
      setSuccess(null)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/vendors/${vendorId}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        setError(data?.message || "تعذر رفض البائع")
        return
      }

      setSuccess("تم رفض البائع")
      await fetchVendors(statusFilter)

      setSelectedVendor((prev) =>
        prev && prev._id === vendorId ? { ...prev, vendorStatus: "rejected" } : prev
      )
    } catch (err) {
      console.error("Error rejecting vendor:", err)
      setError("حدث خطأ أثناء رفض البائع")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleViewDetails = async (vendorId: string) => {
    try {
      setError(null)
      setSuccess(null)
      setActionLoadingId(vendorId)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        setError(data?.message || "تعذر جلب تفاصيل البائع")
        return
      }

      setSelectedVendor(data.vendor)
      setIsDetailsOpen(true)
    } catch (err) {
      console.error("Error fetching vendor details:", err)
      setError("حدث خطأ أثناء جلب تفاصيل البائع")
    } finally {
      setActionLoadingId(null)
    }
  }

  const getStatusBadge = (status: VendorStatus) => {
    const variants: Record<VendorStatus, "default" | "secondary" | "destructive" | "outline"> =
      {
        pending: "secondary",
        approved: "default",
        rejected: "destructive",
      }

    const labels: Record<VendorStatus, string> = {
      pending: "قيد الانتظار",
      approved: "معتمد",
      rejected: "مرفوض",
    }

    return (
      <Badge
        variant={variants[status]}
        className={
          status === "approved"
            ? "bg-emerald-600 text-white hover:bg-emerald-600"
            : undefined
        }
      >
        {labels[status]}
      </Badge>
    )
  }

  const stats = useMemo(() => {
    const pending = vendors.filter((v) => v.vendorStatus === "pending").length
    const approved = vendors.filter((v) => v.vendorStatus === "approved").length
    const rejected = vendors.filter((v) => v.vendorStatus === "rejected").length
    return { total: vendors.length, pending, approved, rejected }
  }, [vendors])

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
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">إدارة البائعين</h1>
            <p className="text-gray-600 mt-1">عرض وإدارة جميع البائعين في المنصة.</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-3 mb-6">
          {error && (
            <Alert className="border-red-200 bg-red-50 rounded-2xl">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-700">خطأ</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 rounded-2xl">
              <CheckCircle2 className="h-4 w-4 text-green-700" />
              <AlertTitle className="text-green-800">تم</AlertTitle>
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
        </div>

       {/* Filters + Summary (Professional) */}
<div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Summary Cards */}
  <Card className="lg:col-span-2 rounded-2xl shadow-sm border-gray-200">
    <CardHeader className="pb-3">
      <CardTitle className="text-[#1E3A5F]">ملخص</CardTitle>
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-600">الإجمالي</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{stats.total}</p>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-600">قيد الانتظار</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{stats.pending}</p>
        </div>

        {/* Approved */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-600">معتمد</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{stats.approved}</p>
        </div>

        {/* Rejected */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-600">مرفوض</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{stats.rejected}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Filter Card */}
  <Card className="rounded-2xl shadow-sm border-gray-200">
    <CardHeader className="pb-3">
      <CardTitle className="text-[#1E3A5F]">تصفية البائعين</CardTitle>
    </CardHeader>

    <CardContent>
      <div className="rounded-2xl border border-gray-200 bg-white p-2 flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "ghost"}
          size="sm"
          className="rounded-xl"
          onClick={() => setStatusFilter("all")}
        >
          الكل
          <span className="mr-2 inline-flex items-center justify-center rounded-full bg-black/5 px-2 py-0.5 text-xs tabular-nums">
            {stats.total}
          </span>
        </Button>

        <Button
          variant={statusFilter === "pending" ? "default" : "ghost"}
          size="sm"
          className="rounded-xl"
          onClick={() => setStatusFilter("pending")}
        >
          قيد الانتظار
          <span className="mr-2 inline-flex items-center justify-center rounded-full bg-black/5 px-2 py-0.5 text-xs tabular-nums">
            {stats.pending}
          </span>
        </Button>

        <Button
          variant={statusFilter === "approved" ? "default" : "ghost"}
          size="sm"
          className="rounded-xl"
          onClick={() => setStatusFilter("approved")}
        >
          معتمد
          <span className="mr-2 inline-flex items-center justify-center rounded-full bg-black/5 px-2 py-0.5 text-xs tabular-nums">
            {stats.approved}
          </span>
        </Button>

        <Button
          variant={statusFilter === "rejected" ? "default" : "ghost"}
          size="sm"
          className="rounded-xl"
          onClick={() => setStatusFilter("rejected")}
        >
          مرفوض
          <span className="mr-2 inline-flex items-center justify-center rounded-full bg-black/5 px-2 py-0.5 text-xs tabular-nums">
            {stats.rejected}
          </span>
        </Button>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        اختاري الحالة لعرض البائعين حسب وضع الطلب.
      </p>
    </CardContent>
  </Card>
</div>

        {/* Table */}
        <Card className="rounded-2xl shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#1E3A5F]">قائمة البائعين</CardTitle>
          </CardHeader>

          <CardContent>
            {vendors.length === 0 ? (
              <div className="text-center py-14 text-gray-600">
                لا توجد بائعين ضمن هذا الفلتر.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="text-right p-4 font-semibold">الشعار</th>
                      <th className="text-right p-4 font-semibold">اسم الشركة</th>
                      <th className="text-right p-4 font-semibold">الحالة</th>
                      <th className="text-right p-4 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <Package className="w-4 h-4" /> المنتجات
                        </span>
                      </th>
                      <th className="text-right p-4 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <Users className="w-4 h-4" /> العملاء
                        </span>
                      </th>
                      <th className="text-right p-4 font-semibold">تاريخ التسجيل</th>
                      <th className="text-right p-4 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {vendors.map((vendor) => {
                      const isRowBusy = actionLoadingId === vendor._id
                      return (
                        <tr
                          key={vendor._id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={normalizeLogoUrl(vendor.logo)}
                              alt={vendor.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-white"
                            />
                          </td>

                          <td className="p-4 font-medium text-gray-900">{vendor.name}</td>

                          <td className="p-4">{getStatusBadge(vendor.vendorStatus)}</td>

                          <td className="p-4">{vendor.productCount}</td>

                          <td className="p-4">{vendor.customerCount}</td>

                          <td className="p-4 text-gray-600">
                            {new Date(vendor.createdAt).toLocaleDateString("en-US")}
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                onClick={() => handleViewDetails(vendor._id)}
                                disabled={isRowBusy}
                              >
                                {isRowBusy ? (
                                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                ) : (
                                  <Eye className="w-4 h-4 ml-2" />
                                )}
                                تفاصيل
                              </Button>

                              {vendor.vendorStatus === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => handleApprove(vendor._id)}
                                    disabled={isRowBusy}
                                  >
                                    {isRowBusy ? (
                                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    ) : (
                                      <Check className="w-4 h-4 ml-2" />
                                    )}
                                    موافقة
                                  </Button>

                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="rounded-xl"
                                    onClick={() => handleReject(vendor._id)}
                                    disabled={isRowBusy}
                                  >
                                    {isRowBusy ? (
                                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    ) : (
                                      <X className="w-4 h-4 ml-2" />
                                    )}
                                    رفض
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl rounded-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-[#1E3A5F]">تفاصيل البائع</DialogTitle>
              <DialogDescription>معلومات تفصيلية عن البائع.</DialogDescription>
            </DialogHeader>

            {selectedVendor && (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={normalizeLogoUrl(selectedVendor.logo)}
                    alt={selectedVendor.name}
                    className="w-24 h-24 rounded-2xl object-cover border border-gray-200 bg-white"
                  />

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedVendor.name}</h3>
                    <p className="text-gray-600">{selectedVendor.email}</p>
                    <div className="pt-1">{getStatusBadge(selectedVendor.vendorStatus)}</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-xs text-gray-600">عدد المنتجات</p>
                    <p className="text-lg font-semibold mt-1">{selectedVendor.productCount}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-xs text-gray-600">عدد العملاء</p>
                    <p className="text-lg font-semibold mt-1">{selectedVendor.customerCount}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-xs text-gray-600">تاريخ التسجيل</p>
                    <p className="text-lg font-semibold mt-1">
                      {new Date(selectedVendor.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>

                  {selectedVendor.phone && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs text-gray-600">رقم الجوال</p>
                      <p className="text-lg font-semibold mt-1">{selectedVendor.phone}</p>
                    </div>
                  )}

                  {(selectedVendor.address || selectedVendor.city) && (
                    <div className="sm:col-span-2 rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs text-gray-600">العنوان</p>
                      <p className="text-base font-semibold mt-1">
                        {[selectedVendor.address, selectedVendor.city].filter(Boolean).join(" - ")}
                      </p>
                    </div>
                  )}
                </div>

                {selectedVendor.vendorStatus === "pending" && (
                  <div className="flex gap-2 pt-3">
                    <Button
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                      onClick={async () => {
                        await handleApprove(selectedVendor._id)
                        setIsDetailsOpen(false)
                      }}
                      disabled={actionLoadingId === selectedVendor._id}
                    >
                      {actionLoadingId === selectedVendor._id ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 ml-2" />
                      )}
                      موافقة
                    </Button>

                    <Button
                      variant="destructive"
                      className="rounded-xl"
                      onClick={async () => {
                        await handleReject(selectedVendor._id)
                        setIsDetailsOpen(false)
                      }}
                      disabled={actionLoadingId === selectedVendor._id}
                    >
                      {actionLoadingId === selectedVendor._id ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <X className="w-4 h-4 ml-2" />
                      )}
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}