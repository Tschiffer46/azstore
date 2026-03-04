import { useState, useEffect } from 'react'
import type { Product, ProductCategory } from '../types/product'
import { PRODUCT_CATEGORIES, STANDARD_SIZES } from '../types/product'

interface ProductModalProps {
  product: Product | null // null = add mode, non-null = edit mode
  onSave: (product: Product) => void
  onClose: () => void
}

function emptyProduct(): Omit<Product, 'id'> {
  return {
    name: '',
    description: '',
    category: 'T-shirts',
    brand: '',
    basePrice: 0,
    sizes: [],
    imageUrl: '',
    active: true,
  }
}

export default function ProductModal({ product, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(
    product ? { ...product } : emptyProduct(),
  )
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({})

  useEffect(() => {
    setForm(product ? { ...product } : emptyProduct())
    setErrors({})
  }, [product])

  function validate(): boolean {
    const newErrors: Partial<Record<keyof Product, string>> = {}
    if (!form.name.trim()) newErrors.name = 'Namn är obligatoriskt'
    if (!form.basePrice || form.basePrice <= 0)
      newErrors.basePrice = 'Pris måste vara större än 0'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const newId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `prod-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const saved: Product = {
      id: product?.id ?? newId,
      ...form,
    }
    onSave(saved)
  }

  function handleSizeToggle(size: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {product ? 'Redigera produkt' : 'Lägg till produkt'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Namn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="T.ex. Basic T-shirt"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beskrivning
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Kort produktbeskrivning"
            />
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value as ProductCategory }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Varumärke
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="T.ex. Clique"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grundpris (SEK) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={form.basePrice || ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, basePrice: Number(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="299"
            />
            {errors.basePrice && (
              <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bild-URL
            </label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storlekar
            </label>
            <div className="flex flex-wrap gap-2">
              {STANDARD_SIZES.map((size) => (
                <label key={size} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.active}
              onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                form.active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">
              {form.active ? 'Aktiv' : 'Inaktiv'}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Spara
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
