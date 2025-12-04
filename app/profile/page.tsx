"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Package, MapPin, Settings, LogOut, Edit, Phone, Mail, Calendar, ShoppingBag, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type ProfileUser = {
  name?: string
  email?: string
  phone?: string
  address?: string
  role?: "customer" | "seller" | "admin"
  createdAt?: string
}

type ProfileOrder = {
  _id: string
  totalAmount: number
  createdAt: string
  status?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<ProfileOrder[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (!token && !storedUser) {
          setLoading(false)
          return
        }

        // Try calling backend for freshest data if we have a token
        if (token) {
          // Fetch user profile
          const resMe = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const dataMe = await resMe.json()

          if (resMe.ok && dataMe.success && dataMe.user) {
            setUser(dataMe.user)
          }

          // Fetch user orders
          const resOrders = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const dataOrders = await resOrders.json()

          if (resOrders.ok && dataOrders.success && Array.isArray(dataOrders.orders)) {
            setOrders(dataOrders.orders)
          }
        }

        // Fallback to localStorage user if API fails
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser)
            setUser(parsed)
          } catch {
            setUser(null)
          }
        }
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء جلب بيانات الحساب")
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditForm({
      name: "",
      email: "",
      phone: ""
    })
  }

  const handleSaveEdit = async () => {
    setUpdateLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        setIsEditing(false)
      } else {
        setError(data.message || "فشل تحديث الملف الشخصي")
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحديث الملف الشخصي")
    } finally {
      setUpdateLoading(false)
    }
  }

  const displayName = user?.name || "العميل"
  const displayEmail = user?.email || "—"
  const displayPhone = user?.phone || "—"
  
  // Format join date from user data
  const displayJoinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : "غير متوفر"
  
  
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-white" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">الملف الشخصي</h1>
            <p className="text-gray-600">إدارة معلوماتك الشخصية وطلباتك</p>
            {loading && <p className="text-sm text-gray-500 mt-2">جاري التحميل...</p>}
            {error && !loading && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-md sticky top-4">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#C17A3C] to-[#D4A574] rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{displayName}</h2>
                    <p className="text-sm text-gray-600 mb-4">{displayEmail}</p>
                    
                    <div className="w-full space-y-2 mb-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-[#C17A3C]/30 hover:bg-[#C17A3C]/5"
                        onClick={handleEditClick}
                      >
                        <Edit className="w-4 h-4 ml-2" />
                        تعديل الملف الشخصي
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 ml-2" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Info */}
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#C17A3C]" />
                      {isEditing ? "تعديل معلومات الحساب" : "معلومات الحساب"}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={updateLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 ml-1" />
                          {updateLoading ? "جاري الحفظ..." : "حفظ"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={updateLoading}
                        >
                          <X className="w-4 h-4 ml-1" />
                          إلغاء
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">الاسم الكامل</label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="أدخل الاسم الكامل"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">البريد الإلكتروني</label>
                        <Input
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="أدخل البريد الإلكتروني"
                          className="text-right"
                          type="email"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">رقم الجوال</label>
                        <Input
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="أدخل رقم الجوال"
                          className="text-right"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">الاسم الكامل</label>
                          <p className="font-semibold text-gray-900">{displayName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">رقم الجوال</label>
                          <p className="font-semibold text-gray-900">{displayPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">البريد الإلكتروني</label>
                          <p className="font-semibold text-gray-900 break-all">{displayEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">تاريخ الانضمام</label>
                          <p className="font-semibold text-gray-900">{displayJoinDate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Orders */}
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShoppingBag className="w-5 h-5 text-[#C17A3C]" />
                      الطلبات الأخيرة
                    </CardTitle>
                    <span className="text-sm text-gray-600">
                      {orders.length} {orders.length === 1 ? 'طلب' : 'طلبات'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-2">لا توجد طلبات حتى الآن</p>
                      <p className="text-sm text-gray-400">ابدأ بتصفح المنتجات وإضافتها إلى السلة</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => {
                        const created = new Date(order.createdAt)
                        const formattedDate = created.toLocaleDateString("ar-SA")
                        const statusLabel = order.status || "قيد المعالجة"

                        return (
                          <div
                            key={order._id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-[#C17A3C] hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-[#C17A3C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Package className="w-5 h-5 text-[#C17A3C]" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">طلب #{order._id.slice(-8)}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    <Calendar className="w-3 h-3 inline ml-1" />
                                    {formattedDate}
                                  </p>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                {statusLabel}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t">
                              <p className="text-lg font-bold text-[#C17A3C]">{order.totalAmount} ر.س</p>
                              <Button variant="outline" size="sm" className="hover:bg-[#C17A3C] hover:text-white">
                                تفاصيل الطلب
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}