import { useState, useEffect } from 'react'
import type { Product, ProductCategory, Print, PrintPosition, PrintSize, VolumeDiscount } from '../types/product'
import { PRODUCT_CATEGORIES, STANDARD_SIZES, PRINT_POSITIONS } from '../types/product'
import clubsData from '../data/clubs.json'

interface Club {
  id: string
  name: string
}

const ALL_CLUBS: Club[] = clubsData as Club[]
const MAX_IMAGES = 5
const MAX_PRINTS = 4
const MIN_PRINTS = 2

interface ProductModalProps {
  product: Product | null // null = add mode, non-null = edit mode
  onSave: (product: Product) => void
  onClose: () => void
}

function emptyPrint(): Print {
  return {
    id: `print-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    position: 'Framsida övre',
    size: 'Stor',
    text: '',
  }
}

function emptyProduct(): Omit<Product, 'id'> {
  return {
    name: '',
    description: '',
    category: 'T-shirts',
    brand: '',
    basePrice: 0,
    sizes: [],
    images: [''],
    clubIds: [],
    volumeDiscounts: [],
    prints: [emptyPrint(), emptyPrint()],
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
      images: form.images.filter((url) => url.trim() !== ''),
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

  // ── Images ────────────────────────────────────────────────────────────────
  function handleImageChange(index: number, value: string) {
    setForm((prev) => {
      const updated = [...prev.images]
      updated[index] = value
      return { ...prev, images: updated }
    })
  }

  function addImage() {
    if (form.images.length >= MAX_IMAGES) return
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }))
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // ── Clubs ─────────────────────────────────────────────────────────────────
  function handleClubToggle(clubId: string) {
    setForm((prev) => ({
      ...prev,
      clubIds: prev.clubIds.includes(clubId)
        ? prev.clubIds.filter((id) => id !== clubId)
        : [...prev.clubIds, clubId],
    }))
  }

  // ── Volume discounts ──────────────────────────────────────────────────────
  function addDiscount() {
    setForm((prev) => ({
      ...prev,
      volumeDiscounts: [...prev.volumeDiscounts, { minQuantity: 10, discountPercent: 5 }],
    }))
  }

  function removeDiscount(index: number) {
    setForm((prev) => ({
      ...prev,
      volumeDiscounts: prev.volumeDiscounts.filter((_, i) => i !== index),
    }))
  }

  function handleDiscountChange(index: number, field: keyof VolumeDiscount, value: number) {
    setForm((prev) => {
      const updated = [...prev.volumeDiscounts]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, volumeDiscounts: updated }
    })
  }

  // ── Prints ────────────────────────────────────────────────────────────────
  function addPrint() {
    if (form.prints.length >= MAX_PRINTS) return
    setForm((prev) => ({ ...prev, prints: [...prev.prints, emptyPrint()] }))
  }

  function removePrint(index: number) {
    if (form.prints.length <= MIN_PRINTS) return
    setForm((prev) => ({
      ...prev,
      prints: prev.prints.filter((_, i) => i !== index),
    }))
  }

  function handlePrintChange(index: number, field: keyof Omit<Print, 'id'>, value: string) {
    setForm((prev) => {
      const updated = [...prev.prints]
      updated[index] = { ...updated[index], [field]: value } as Print
      return { ...prev, prints: updated }
    })
  }

  const inputCls =
    'w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-md px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#4BC8D8]'
  const sectionCls = 'border-t border-[#1A1A1A] pt-4'
  const sectionLabel = 'block text-sm font-semibold text-[#A0A0A0] mb-2'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#111111] border border-[#1A1A1A] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <h2 className="text-lg font-semibold text-white">
            {product ? 'Redigera produkt' : 'Lägg till produkt'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1">
              Namn <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className={inputCls}
              placeholder="T.ex. Basic T-shirt"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1">
              Beskrivning
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              className={inputCls}
              placeholder="Kort produktbeskrivning"
            />
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1">
                Kategori
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value as ProductCategory }))
                }
                className={inputCls}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1">
                Varumärke
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                className={inputCls}
                placeholder="T.ex. Clique"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1">
              Grundpris (SEK) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={form.basePrice || ''}
              onChange={(e) =>
                setForm((p) => ({ ...p, basePrice: Number(e.target.value) }))
              }
              className={inputCls}
              placeholder="299"
            />
            {errors.basePrice && (
              <p className="text-red-400 text-xs mt-1">{errors.basePrice}</p>
            )}
          </div>

          {/* Images (up to 5) */}
          <div className={sectionCls}>
            <label className={sectionLabel}>
              Produktbilder (max {MAX_IMAGES})
            </label>
            <div className="space-y-2">
              {form.images.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-[#555] w-4 shrink-0">{i + 1}</span>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    className={inputCls}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    disabled={form.images.length <= 1}
                    className="text-red-400 hover:text-red-300 disabled:text-[#333] text-lg leading-none shrink-0 transition-colors"
                    aria-label="Ta bort bild"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {form.images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={addImage}
                className="mt-2 text-sm text-[#4BC8D8] hover:text-[#3ab5c4] transition-colors"
              >
                + Lägg till bild
              </button>
            )}
          </div>

          {/* Sizes */}
          <div className={sectionCls}>
            <label className={sectionLabel}>Storlekar</label>
            <div className="flex flex-wrap gap-2">
              {STANDARD_SIZES.map((size) => (
                <label key={size} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    className="rounded border-[#1A1A1A] bg-[#0A0A0A] accent-[#4BC8D8]"
                  />
                  <span className="text-sm text-[#A0A0A0]">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Club assignment */}
          <div className={sectionCls}>
            <label className={sectionLabel}>Tilldelade klubbar</label>
            <div className="flex flex-wrap gap-3">
              {ALL_CLUBS.map((club) => (
                <label key={club.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.clubIds.includes(club.id)}
                    onChange={() => handleClubToggle(club.id)}
                    className="rounded border-[#1A1A1A] bg-[#0A0A0A] accent-[#4BC8D8]"
                  />
                  <span className="text-sm text-[#A0A0A0]">{club.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Volume discounts */}
          <div className={sectionCls}>
            <label className={sectionLabel}>Volymrabatter</label>
            {form.volumeDiscounts.length === 0 && (
              <p className="text-xs text-[#555] mb-2">Inga rabatter tillagda.</p>
            )}
            <div className="space-y-2">
              {form.volumeDiscounts.map((discount, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="block text-xs text-[#555] mb-1">Min. antal</label>
                    <input
                      type="number"
                      min={1}
                      value={discount.minQuantity}
                      onChange={(e) =>
                        handleDiscountChange(i, 'minQuantity', Number(e.target.value))
                      }
                      className={inputCls}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[#555] mb-1">Rabatt (%)</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={discount.discountPercent}
                      onChange={(e) =>
                        handleDiscountChange(i, 'discountPercent', Number(e.target.value))
                      }
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDiscount(i)}
                    className="text-red-400 hover:text-red-300 text-lg leading-none mt-5 shrink-0 transition-colors"
                    aria-label="Ta bort rabatt"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDiscount}
              className="mt-2 text-sm text-[#4BC8D8] hover:text-[#3ab5c4] transition-colors"
            >
              + Lägg till rabattnivå
            </button>
          </div>

          {/* Prints */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-2">
              <label className={`${sectionLabel} mb-0`}>
                Tryck ({MIN_PRINTS}–{MAX_PRINTS} st)
              </label>
              {form.prints.length < MAX_PRINTS && (
                <button
                  type="button"
                  onClick={addPrint}
                  className="text-sm text-[#4BC8D8] hover:text-[#3ab5c4] transition-colors"
                >
                  + Lägg till tryck
                </button>
              )}
            </div>
            <div className="space-y-3">
              {form.prints.map((print, i) => (
                <div
                  key={print.id}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-md p-3 space-y-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#4BC8D8]">Tryck {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removePrint(i)}
                      disabled={form.prints.length <= MIN_PRINTS}
                      className="text-red-400 hover:text-red-300 disabled:text-[#333] text-xs transition-colors"
                    >
                      Ta bort
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-[#555] mb-1">Placering</label>
                      <select
                        value={print.position}
                        onChange={(e) =>
                          handlePrintChange(i, 'position', e.target.value as PrintPosition)
                        }
                        className={inputCls}
                      >
                        {PRINT_POSITIONS.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#555] mb-1">Storlek</label>
                      <select
                        value={print.size}
                        onChange={(e) =>
                          handlePrintChange(i, 'size', e.target.value as PrintSize)
                        }
                        className={inputCls}
                      >
                        <option value="Liten">Liten</option>
                        <option value="Stor">Stor</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-1">Text / Motiv</label>
                    <input
                      type="text"
                      value={print.text}
                      onChange={(e) => handlePrintChange(i, 'text', e.target.value)}
                      className={inputCls}
                      placeholder="T.ex. Klubbnamn, Spelarnummer..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active toggle */}
          <div className={`${sectionCls} flex items-center gap-3`}>
            <button
              type="button"
              role="switch"
              aria-checked={form.active}
              onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4BC8D8] ${
                form.active ? 'bg-[#4BC8D8]' : 'bg-[#333]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-[#A0A0A0]">
              {form.active ? 'Aktiv' : 'Inaktiv'}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-[#1A1A1A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#A0A0A0] bg-transparent border border-[#1A1A1A] rounded-md hover:border-[#4BC8D8] hover:text-white transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-[#4BC8D8] rounded-md hover:bg-[#3ab5c4] transition-colors"
            >
              Spara
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
