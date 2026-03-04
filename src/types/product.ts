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

export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  brand: string
  basePrice: number
  sizes: string[]
  imageUrl: string
  active: boolean
}
