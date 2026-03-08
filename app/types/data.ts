export type ItemData = {
  item_hash: string
  item_image: string
  item_name: string
  item_stock: number
  item_price: number
  restock_time_min?: number
  restock_at?: number
}
export interface CalculatePayload {
  item_list: CartItem[]
  member_code?: string
}

export interface CartItem extends Omit<ItemData, 'item_image' | 'item_stock'> {
  quantity: number
  discounted_price?: number
  total_price?: number
}

export interface OrderItemBreakdown {
  item_hash: string
  item_name: string
  quantity: number
  unit_price: number
  pairs: number // how many discounted pairs
  remainder: number // unpaired items at full price
  pair_total: number // total after discount for pairs
  remainder_total: number
  total: number
}

export interface OrderSummary {
  breakdown: OrderItemBreakdown[]
  subtotal: number // before member discount
  member_discount: number // 0 if no member_code
  grand_total: number // after member discount
}
