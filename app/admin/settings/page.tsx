"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

import {
  Save,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

type PlatformSettings = {
  _id?: string
  platformName: string
  platformLogo?: string
}

export default function PlatformSettingsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: "منصة المورد المتكاملة",
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const hasLogo = useMemo(() => Boolean(logoPreview), [logoPreview])

  useEffect(() => {
    const checkAuth = () => {
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

      fetchSettings()
    }

    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (data?.success) {
        setSettings(data.settings)
        if (data.settings?.platformLogo) {
          setLogoPreview(`${API_BASE_URL}${data.settings.platformLogo}`)
        } else {
          setLogoPreview(null)
        }
        setLogoFile(null)
      } else {
        setError(data?.message || "فشل في جلب الإعدادات")
      }
    } catch (err) {
      console.error("Error fetching settings:", err)
      setError("فشل في جلب الإعدادات")
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoFile(file)
    setSuccess(null)
    setError(null)

    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setSuccess(null)
    setError(null)
    setSettings((prev) => ({ ...prev, platformLogo: "" }))
  }

  const handleClearName = () => {
    setSuccess(null)
    setError(null)
    setSettings((prev) => ({ ...prev, platformName: "" }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      // Basic validation
      if (!settings.platformName?.trim()) {
        setError("اسم المنصة مطلوب")
        return
      }

      const formData = new FormData()
      formData.append("platformName", settings.platformName.trim())

      // Logo removal vs new logo upload
      if (settings.platformLogo === "" && !logoFile) {
        formData.append("removeLogo", "true")
      } else if (logoFile) {
        formData.append("logo", logoFile)
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (data?.success) {
        setSuccess("تم حفظ الإعدادات بنجاح")
        setSettings(data.settings)

        if (data.settings?.platformLogo) {
          setLogoPreview(`${API_BASE_URL}${data.settings.platformLogo}`)
        } else {
          setLogoPreview(null)
        }

        setLogoFile(null)
      } else {
        setError(data?.message || "فشل في حفظ الإعدادات")
      }
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("حدث خطأ أثناء حفظ الإعدادات")
    } finally {
      setSaving(false)
    }
  }

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
            <h1 className="text-2xl font-bold text-[#1E3A5F]">إعدادات المنصة</h1>
            <p className="text-gray-600 mt-1">تحكم في الاسم والشعار الظاهرين للمستخدمين.</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-3 mb-6">
          {error && (
            <Alert className="border-red-200 bg-red-50 rounded-2xl">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-700">تعذر الحفظ</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 rounded-2xl">
              <CheckCircle2 className="h-4 w-4 text-green-700" />
              <AlertTitle className="text-green-800">تم بنجاح</AlertTitle>
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings card */}
          <Card className="lg:col-span-2 rounded-2xl shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#1E3A5F]">الإعدادات العامة</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Platform Name */}
              <div className="space-y-2">
                <Label htmlFor="platformName" className="text-gray-800">
                  اسم المنصة
                </Label>

                <div className="flex gap-2">
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        platformName: e.target.value,
                      }))
                    }
                    placeholder="مثال: منصة المورد المتكاملة"
                    className="flex-1 rounded-xl"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleClearName}
                    className="shrink-0 rounded-xl"
                    title="مسح الاسم"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-gray-500">
                  يظهر هذا الاسم في الهيدر وصفحات الموقع العامة.
                </p>
              </div>

              <Separator />

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label htmlFor="platformLogo" className="text-gray-800">
                  شعار المنصة
                </Label>

                <Input
                  id="platformLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="rounded-xl"
                />

                <p className="text-xs text-gray-500">
                  يفضّل PNG بخلفية شفافة. سيتم عرض الشعار في الهيدر.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Logo preview card */}
          <Card className="lg:col-span-1 rounded-2xl shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#1E3A5F] flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                معاينة الشعار
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-center min-h-[180px]">
                {hasLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview!}
                    alt="Platform Logo Preview"
                    className="max-h-40 w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="mx-auto mb-2 w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-sm">لا يوجد شعار</p>
                    <p className="text-xs mt-1">ارفعي شعار لعرضه هنا</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl flex-1"
                  onClick={fetchSettings}
                  disabled={saving}
                >
                  تحديث
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleRemoveLogo}
                  disabled={saving || (!logoPreview && settings.platformLogo !== "")}
                  title="حذف الشعار"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-[#C17A3C] hover:bg-[#A66A30] rounded-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}