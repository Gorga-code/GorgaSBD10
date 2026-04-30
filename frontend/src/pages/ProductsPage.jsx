import { useState, useEffect } from 'react'
import { fetchProducts } from '../services/api'

const getImageUrl = (name) => {
  const safeName = String(name || '').trim().toLowerCase()
  return `/api/public/${safeName}.png`
}

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts()
        setProducts(response.data?.payload || [])
      } catch (err) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">Loading products...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center text-red-600">{error}</div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Product catalog</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Latest deals & essentials</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Browse all products with a clean responsive card layout designed for modern e-commerce.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <img
              src={getImageUrl(product.name)}
              alt={product.name}
              className="h-60 w-full rounded-3xl object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Product'
              }}
            />
            <div className="mt-5 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Electronics</p>
              <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
              <p className="text-slate-600">High-quality {product.name.toLowerCase()} for your needs.</p>
              <div className="flex items-center justify-between pt-4">
                <span className="text-lg font-semibold text-slate-900">Rp {product.price.toLocaleString()}</span>
                <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default ProductsPage

