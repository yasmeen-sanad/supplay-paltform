import { useState, useEffect } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

export interface PlatformSettings {
  _id?: string
  platformName: string
  platformLogo?: string
}

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: "منصة المورد المتكاملة",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            setSettings(data.settings)
          }
        }
      } catch (error) {
        console.error("Error fetching platform settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading }
}
