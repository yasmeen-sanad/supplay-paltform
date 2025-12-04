// app/products/page.tsx
import { Suspense } from "react"
import ProductsClient from "./ProductsClient"

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-600">جاري تحميل المنتجات...</div>}>
      <ProductsClient />
    </Suspense>
  )
}