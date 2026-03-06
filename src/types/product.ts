export type ProductCategory =
  | 'T-shirts'
  | 'Pikéer'
  | 'Hoodies'
  | 'Jackor'
  | 'Byxor'
  | 'Accessoarer'

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'T-shirts',
  'Pikéer',
  'Hoodies',
  'Jackor',
  'Byxor',
  'Accessoarer',
]

export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'One Size'] as const

export type PrintPosition =
  | 'Framsida övre'
  | 'Framsida nedre'
  | 'Ryggsida övre'
  | 'Ryggsida nedre'
  | 'Vänster ärm'
  | 'Höger ärm'
  | 'Bröstficka'

export const PRINT_POSITIONS: PrintPosition[] = [
  'Framsida övre',
  'Framsida nedre',
  'Ryggsida övre',
  'Ryggsida nedre',
  'Vänster ärm',
  'Höger ärm',
  'Bröstficka',
]

export type PrintSize = 'Liten' | 'Stor'

export interface Print {
  id: string
  position: PrintPosition
  size: PrintSize
  text: string
}

export interface VolumeDiscount {
  minQuantity: number
  discountPercent: number
}

export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  brand: string
  basePrice: number
  sizes: string[]
  images: string[]
  clubIds: string[]
  volumeDiscounts: VolumeDiscount[]
  prints: Print[]
  active: boolean
}
