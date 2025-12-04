"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package,ShoppingCart, Users, Plus, Edit, Trash2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type SellerProduct = {
  _id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  unit: string
  supplier: string
  brand?: string
  color: string
  size: string
  feature1?: string
  feature2?: string
  feature3?: string
  shippingMethod?: "standard" | "express" | "same-day"
  shippingCost?: number
}

type SellerFactory = {
  _id: string
  name: string
  location: string
  category?: string
  image?: string
}

type SellerBrand = {
  name: string
  logo?: string
  city?: string
}

type SellerShippingMethod = "standard" | "express" | "same-day"

export default function SellerHomePage() {
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [factories, setFactories] = useState<SellerFactory[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingFactories, setLoadingFactories] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [productForm, setProductForm] = useState<Partial<SellerProduct>>({})
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [productImageFile, setProductImageFile] = useState<File | null>(null)
  const [factoryForm, setFactoryForm] = useState<Partial<SellerFactory>>({})
  const [editingFactoryId, setEditingFactoryId] = useState<string | null>(null)
  const [factoryImageFile, setFactoryImageFile] = useState<File | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [brand, setBrand] = useState<SellerBrand | null>(null)
  const [loadingBrand, setLoadingBrand] = useState(false)
  const [shippingMethod, setShippingMethod] = useState<SellerShippingMethod>("standard")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    void fetchMyProducts()
    void fetchMyFactories()
    void fetchMyBrand()
    void fetchMyProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const fetchMyProducts = async () => {
    try {
      setLoadingProducts(true)
      setError(null)
      const res = await fetch(`${API_BASE_URL}/api/products/me/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.message || "فشل في جلب المنتجات")
      }
      setProducts(data.products || [])
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء جلب المنتجات")
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchMyBrand = async () => {
    if (!token) return
    try {
      setLoadingBrand(true)
      const res = await fetch(`${API_BASE_URL}/api/brands/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "فشل في جلب بيانات العلامة التجارية")
      }
      setBrand({ name: data.brand.name, logo: data.brand.logo, city: data.brand.city })
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء جلب بيانات العلامة التجارية")
    } finally {
      setLoadingBrand(false)
    }
  }

  const fetchMyProfile = async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "فشل في جلب بيانات البائع")
      }
      if (data.user?.shippingMethod) {
        setShippingMethod(data.user.shippingMethod)
      }
    } catch (err: any) {
      // نكتفي بعرض الخطأ العام في الأعلى إن وجد
      console.error(err)
    }
  }

  const handleSaveBrand = async () => {
    if (!token || !brand) return
    try {
      setLoadingBrand(true)
      const res = await fetch(`${API_BASE_URL}/api/brands/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: brand.name, logo: brand.logo }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "فشل في حفظ بيانات العلامة التجارية")
      }

      setBrand({ name: data.brand.name, logo: data.brand.logo, city: data.brand.city })

      // Update localStorage user so header/brands page reflect new brand info
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          const updatedUser = { ...parsed, name: data.brand.name, logo: data.brand.logo, city: data.brand.city }
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      } catch {
        // ignore localStorage parse errors
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ بيانات العلامة التجارية")
    } finally {
      setLoadingBrand(false)
    }
  }

  const fetchMyFactories = async () => {
    try {
      setLoadingFactories(true)
      setError(null)
      const res = await fetch(`${API_BASE_URL}/api/factories/me/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.message || "فشل في جلب المصانع")
      }
      setFactories(data.factories || [])
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء جلب المصانع")
    } finally {
      setLoadingFactories(false)
    }
  }

  const handleSubmitProduct = async () => {
    if (!token) return
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'stock', 'supplier', 'color', 'size']
    const missingFields = requiredFields.filter(field => !productForm[field as keyof typeof productForm])
    
    if (missingFields.length > 0) {
      setError(`يرجى ملء جميع الحقول المطلوبة: ${missingFields.join(', ')}`)
      return
    }
    
    const method = editingProductId ? "PATCH" : "POST"
    const url = editingProductId
      ? `${API_BASE_URL}/api/products/${editingProductId}`
      : `${API_BASE_URL}/api/products`

    try {
      const formData = new FormData()
      // Always send all required fields
      formData.append("name", productForm.name || "")
      formData.append("description", productForm.description || "")
      formData.append("price", String(productForm.price || 0))
      formData.append("category", productForm.category || "")
      formData.append("stock", String(productForm.stock || 0))
      formData.append("supplier", productForm.supplier || "")
      formData.append("color", productForm.color || "")
      formData.append("size", productForm.size || "")
      
      // Optional fields
      if (productForm.brand) formData.append("brand", productForm.brand)
      if (productForm.feature1) formData.append("feature1", productForm.feature1)
      if (productForm.feature2) formData.append("feature2", productForm.feature2)
      if (productForm.feature3) formData.append("feature3", productForm.feature3)
      if (productForm.shippingMethod) formData.append("shippingMethod", productForm.shippingMethod)
      if (typeof productForm.shippingCost === "number") formData.append("shippingCost", String(productForm.shippingCost))
      if (productImageFile) formData.append("image", productImageFile)

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "فشل في حفظ المنتج")
      }
      setProductForm({})
      setEditingProductId(null)
      setProductImageFile(null)
      void fetchMyProducts()
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ المنتج")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "فشل في حذف المنتج")
      }
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حذف المنتج")
    }
  }

  const handleSubmitFactory = async () => {
    if (!token) return
    const method = editingFactoryId ? "PATCH" : "POST"
    const url = editingFactoryId
      ? `${API_BASE_URL}/api/factories/${editingFactoryId}`
      : `${API_BASE_URL}/api/factories`

    try {
      const formData = new FormData()
      if (factoryForm.name) formData.append("name", factoryForm.name)
      if (factoryForm.location) formData.append("location", factoryForm.location)
      if (factoryForm.category) formData.append("category", factoryForm.category)
      if (factoryImageFile) formData.append("image", factoryImageFile)

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "فشل في حفظ المصنع")
      }
      setFactoryForm({})
      setEditingFactoryId(null)
      setFactoryImageFile(null)
      void fetchMyFactories()
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ المصنع")
    }
  }

  const handleDeleteFactory = async (id: string) => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/factories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "فشل في حذف المصنع")
      }
      setFactories((prev) => prev.filter((f) => f._id !== id))
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حذف المصنع")
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-1">لوحة تحكم البائع</h1>
          <p className="text-gray-600">إدارة متجرك ومنتجاتك ومصانعك بكل سهولة</p>
          {!token && (
            <p className="text-sm text-red-600 mt-1">يجب تسجيل الدخول كبائع لإدارة المنتجات والمصانع.</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">عدد منتجاتك</p>
                  <p className="text-2xl font-bold text-[#C17A3C]">{products.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">عدد المصانع</p>
                  <p className="text-2xl font-bold">{factories.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الطلبات الجديدة</p>
                  <p className="text-2xl font-bold">—</p>
                  <p className="text-xs text-gray-500 mt-1">سيتم ربطها مستقبلاً بالطلبات</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">العملاء</p>
                  <p className="text-2xl font-bold">—</p>
                  <p className="text-xs text-gray-500 mt-1">إحصائيات قادمة قريباً</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r text-[#1E3A5F]">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  إضافة المنتجات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* المعلومات الأساسية */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <div className="w-2 h-2 bg-[#C17A3C] rounded-full"></div>
                    <h3 className="font-semibold text-gray-900">المعلومات الأساسية</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-sm mb-2 block font-medium">اسم المنتج *</Label>
                      <Input
                        value={productForm.name || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="مثال: أسمنت بورتلاندي"
                        className="h-11"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm mb-2 block font-medium">وصف المنتج *</Label>
                      <Input
                        value={productForm.description || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="وصف مختصر لخصائص واستخدام المنتج"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-medium">الفئة *</Label>
                      <select
                        value={productForm.category || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
                        className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C17A3C]"
                      >
                        <option value="">اختر فئة</option>
                        <option value="المواد الكميائىة">المواد الكميائىة</option>
                        <option value="البناء والعقار">البناء والعقار</option>
                        <option value="المركبات وملحقاتها">المركبات وملحقاتها</option>
                        <option value="الزراعة">الزراعة</option>
                        <option value="الاضادة والمصابيح">الاضادة والمصابيح</option>
                        <option value="الاجهزة">الاجهزة</option>
                        <option value="ملابس و أزياء">ملابس و أزياء</option>
                        <option value="معدات وخدمات تجارية">معدات وخدمات تجارية</option>
                        <option value="مطاط بلاستيك واسفنج">مطاط بلاستيك واسفنج</option>
                        <option value="المنزل والحديقة">المنزل والحديقة</option>
                        <option value="الماعدن والتعدين">الماعدن والتعدين</option>
                        <option value="معدات الخدمات التجارية">معدات الخدمات التجارية</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-medium">صورة المنتج</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setProductImageFile(file)
                        }}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* التسعير والمخزون */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <div className="w-2 h-2 bg-[#C17A3C] rounded-full"></div>
                    <h3 className="font-semibold text-[#1E3A5F]">التسعير والمخزون</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block font-medium">السعر (ر.س) *</Label>
                      <Input
                        type="number"
                        value={productForm.price ?? ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, price: Number(e.target.value) }))}
                        placeholder="0"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-medium">الكمية المتاحة *</Label>
                      <Input
                        type="number"
                        value={productForm.stock ?? ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                        placeholder="0"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* معلومات الشحن */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <div className="w-2 h-2 bg-[#C17A3C] rounded-full"></div>
                    <h3 className="font-semibold text-[#1E3A5F]">معلومات الشحن</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block font-medium">طريقة الشحن</Label>
                      <select
                        value={productForm.shippingMethod || ""}
                        onChange={(e) =>
                          setProductForm((f) => ({ ...f, shippingMethod: e.target.value as SellerShippingMethod }))
                        }
                        className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C17A3C]"
                      >
                        <option value="">اختر طريقة الشحن</option>
                        <option value="standard">شحن عادي (5-7 أيام)</option>
                        <option value="express">شحن سريع (2-3 أيام)</option>
                        <option value="same-day">توصيل في نفس اليوم</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-medium">تكلفة الشحن (ر.س)</Label>
                      <Input
                        type="number"
                        value={productForm.shippingCost ?? ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, shippingCost: Number(e.target.value) }))}
                        placeholder="50"
                        min="0"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* التفاصيل الإضافية */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <div className="w-2 h-2 bg-[#C17A3C] rounded-full"></div>
                    <h3 className="font-semibold text-[#1E3A5F]">التفاصيل الإضافية</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block font-medium">المصنع</Label>
                      <select
                        value={productForm.supplier || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, supplier: e.target.value }))}
                        className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C17A3C]"
                      >
                        <option value="">اختر المصنع</option>
                        {factories.map((factory) => (
                          <option key={factory._id} value={factory.name}>
                            {factory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-medium">اللون</Label>
                      <Input
                        value={productForm.color || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, color: e.target.value }))}
                        placeholder="مثال: أحمر، أزرق..."
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-medium">المقاس</Label>
                      <Input
                        value={productForm.size || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, size: e.target.value }))}
                        placeholder="مثال: 50 كجم، 2 متر..."
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* الميزات */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <div className="w-2 h-2 bg-[#C17A3C] rounded-full"></div>
                    <h3 className="font-semibold text-[#1E3A5F]">مميزات المنتج (اختياري)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block font-medium">ميزة 1</Label>
                      <Input
                        value={productForm.feature1 || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, feature1: e.target.value }))}
                        placeholder="مثال: مقاوم للرطوبة"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-medium">ميزة 2</Label>
                      <Input
                        value={productForm.feature2 || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, feature2: e.target.value }))}
                        placeholder="مثال: صديق للبيئة"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block font-medium">ميزة 3</Label>
                      <Input
                        value={productForm.feature3 || ""}
                        onChange={(e) => setProductForm((f) => ({ ...f, feature3: e.target.value }))}
                        placeholder="ميزة إضافية"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setProductForm({})
                      setEditingProductId(null)
                      setProductImageFile(null)
                    }}
                    className="px-6"
                  >
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#C17A3C] hover:bg-[#A66A30] px-8"
                    disabled={loadingProducts || !token}
                    onClick={handleSubmitProduct}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {editingProductId ? "تحديث المنتج" : "إضافة المنتج"}
                  </Button>
                </div>

                </CardContent>
            </Card>

            {/* قائمة المنتجات */}
            <Card className="shadow-md">
              <CardHeader className="text-[#1E3A5F]">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#1E3A5F]" />
                    قائمة المنتجات
                  </CardTitle>
                  {loadingProducts && <span className="text-sm text-gray-600">جاري التحميل...</span>}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">لا توجد منتجات مضافة بعد</p>
                    <p className="text-sm text-gray-400 mt-1">ابدأ بإضافة منتجك الأول</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{product.name}</p>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#C17A3C] rounded-full"></span>
                              {product.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              {product.price} ر.س
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              {product.stock} {product.unit}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 text-red-600 hover:bg-red-50 hover:border-red-300"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Brand info */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r text-[#1E3A5F]">
                <CardTitle>بيانات العلامة التجارية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm mb-2 block font-medium">اسم الشركة / العلامة</Label>
                    <Input
                      value={brand?.name || ""}
                      onChange={(e) => setBrand((b) => ({ ...(b || { name: "" }), name: e.target.value }))}
                      placeholder="مثال: شركة البناء الحديثة"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block font-medium">شعار العلامة (رفع صورة)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file || !token) return
                        try {
                          setLoadingBrand(true)
                          const formData = new FormData()
                          formData.append("logo", file)
                          const res = await fetch(`${API_BASE_URL}/api/brands/me/logo`, {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                          })
                          const data = await res.json()
                          if (!res.ok || !data.success) {
                            throw new Error(data.message || "فشل في رفع الشعار")
                          }
                          setBrand((b) => ({ ...(b || { name: data.brand.name }), logo: data.brand.logo, city: data.brand.city }))

                          // Update localStorage user with new logo
                          try {
                            const storedUser = localStorage.getItem("user")
                            if (storedUser) {
                              const parsed = JSON.parse(storedUser)
                              const updatedUser = { ...parsed, logo: data.brand.logo, city: data.brand.city }
                              localStorage.setItem("user", JSON.stringify(updatedUser))
                            }
                          } catch {
                            // ignore
                          }
                        } catch (err: any) {
                          setError(err.message || "حدث خطأ أثناء رفع الشعار")
                        } finally {
                          setLoadingBrand(false)
                        }
                      }}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2 pt-4 border-t">
                  <Button
                    className="bg-[#C17A3C] hover:bg-[#A66A30] px-6"
                    disabled={loadingBrand || !token}
                    onClick={async () => {
                      await handleSaveBrand()
                      if (!token) return
                      try {
                        await fetch(`${API_BASE_URL}/api/auth/me/shipping-method`, {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ shippingMethod }),
                        })
                      } catch (err: any) {
                        setError(err.message || "حدث خطأ أثناء حفظ طريقة الشحن")
                      }
                    }}
                  >
                    حفظ البيانات
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r text-[#1E3A5F]">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  إضافة المصانع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm mb-2 block font-medium">اسم المصنع *</Label>
                    <Input
                      value={factoryForm.name || ""}
                      onChange={(e) => setFactoryForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="مثال: مصنع مواد البناء الحديث"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block font-medium">الموقع *</Label>
                    <Input
                      value={factoryForm.location || ""}
                      onChange={(e) => setFactoryForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="الرياض، جدة..."
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block font-medium">الفئة</Label>
                    <Select
  value={factoryForm.category || ""}
  onValueChange={(value) => setFactoryForm((f) => ({ ...f, category: value }))}
  dir="rtl"
>
  <SelectTrigger className="h-11 w-full text-right ">
    <SelectValue placeholder="اختر فئة المصنع" />
  </SelectTrigger>

  <SelectContent dir="rtl" className="text-right">
    <SelectItem value="المواد الكميائىة">المواد الكميائىة</SelectItem>
    <SelectItem value="البناء والعقار">البناء والعقار</SelectItem>
    <SelectItem value="المركبات وملحقاتها">المركبات وملحقاتها</SelectItem>
    <SelectItem value="الزراعة">الزراعة</SelectItem>
    <SelectItem value="الاضادة والمصابيح">الاضادة والمصابيح</SelectItem>
    <SelectItem value="الاجهزة">الاجهزة</SelectItem>
    <SelectItem value="ملابس و أزياء">ملابس و أزياء</SelectItem>
    <SelectItem value="معدات وخدمات تجارية">معدات وخدمات تجارية</SelectItem>
    <SelectItem value="مطاط بلاستيك واسفنج">مطاط بلاستيك واسفنج</SelectItem>
    <SelectItem value="المنزل والحديقة">المنزل والحديقة</SelectItem>
    <SelectItem value="الماعدن والتعدين">الماعدن والتعدين</SelectItem>
    <SelectItem value="معدات الخدمات التجارية">معدات الخدمات التجارية</SelectItem>
  </SelectContent>
</Select>
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block font-medium">صورة المصنع</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setFactoryImageFile(file)
                      }}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFactoryForm({})
                      setEditingFactoryId(null)
                      setFactoryImageFile(null)
                    }}
                    className="px-6"
                  >
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[#C17A3C] hover:bg-[#A66A30] px-8"
                    disabled={loadingFactories || !token}
                    onClick={handleSubmitFactory}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {editingFactoryId ? "تحديث المصنع" : "إضافة المصنع"}
                  </Button>
                </div>

                <div className="border-t pt-4 mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">قائمة المصانع</p>
                    {loadingFactories && <span className="text-sm text-gray-600">جاري التحميل...</span>}
                  </div>
                  {factories.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">لا توجد مصانع مضافة بعد</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {factories.map((factory) => (
                        <div
                          key={factory._id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">{factory.name}</p>
                            <p className="text-xs text-gray-600">{factory.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 text-red-600 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeleteFactory(factory._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}