import { SaleData } from '@/types/SaleData'

export function calculateAverage(data: SaleData[], field: keyof SaleData): number {
  if (data.length === 0) return 0
  const sum = data.reduce((acc, item) => acc + Number(item[field]), 0)
  return Number((sum / data.length).toFixed(2))
}