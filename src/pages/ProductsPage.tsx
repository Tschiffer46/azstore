import { useState } from 'react'
import type { Product } from '../types/product'
import { PRODUCT_CATEGORIES } from '../types/product'
import productsData from '../data/products.json'
import ProductModal from '../components/ProductModal'

const initialProducts = productsData as Product[]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [modalProduct, setModalProduct] = useState<Product | null | undefined>(undefined)
  // undefined = closed, null = add mode, Product = edit mode

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  function handleSave(saved: Product) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === saved.id)
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved]
    })
    setModalProduct(undefined)
  }

  function handleDelete(id: string) {
    if (!window.confirm('Är du säker?')) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Produktkatalog</h1>
        <button
          onClick={() => setModalProduct(null)}
          className="px-4 py-2 text-sm font-medium text-black bg-[#4BC8D8] rounded-md hover:bg-[#3ab5c4] transition-colors"
        >
          + Lägg till produkt
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök på namn eller varumärke..."
          className="flex-1 bg-[#0A0A0A] border border-[#1A1A1A] rounded-md px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#4BC8D8]"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4BC8D8]"
        >
          <option value="">Alla kategorier</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#1A1A1A]">
        <table className="min-w-full divide-y divide-[#1A1A1A] text-sm">
          <thead className="bg-[#111111]">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-[#A0A0A0]">Namn</th>
              <th className="px-4 py-3 text-left font-medium text-[#A0A0A0]">Varumärke</th>
              <th className="px-4 py-3 text-left font-medium text-[#A0A0A0]">Kategori</th>
              <th className="px-4 py-3 text-left font-medium text-[#A0A0A0]">Pris</th>
              <th className="px-4 py-3 text-left font-medium text-[#A0A0A0]">Storlekar</th>
              <th className="px-4 py-3 text-left font-medium text-[#A0A0A0]">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#A0A0A0]">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A] bg-[#0A0A0A]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#555]">
                  Inga produkter hittades.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-[#111111] cursor-pointer transition-colors"
                  onClick={() => setModalProduct(product)}
                >
                  <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                  <td className="px-4 py-3 text-[#A0A0A0]">{product.brand}</td>
                  <td className="px-4 py-3 text-[#A0A0A0]">{product.category}</td>
                  <td className="px-4 py-3 text-[#A0A0A0]">{product.basePrice} kr</td>
                  <td className="px-4 py-3 text-[#A0A0A0]">
                    {product.sizes.length} storlekar
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.active
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-red-900/40 text-red-400'
                      }`}
                    >
                      {product.active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                    >
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#555] mt-2">{filtered.length} produkter visas</p>

      {/* Modal */}
      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onSave={handleSave}
          onClose={() => setModalProduct(undefined)}
        />
      )}
    </div>
  )
}
