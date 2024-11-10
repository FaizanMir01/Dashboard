import { useState, useEffect, useCallback } from 'react'
import { SaleData } from '@/types/SaleData'

// Helper function to parse dates in dd-mm-yyyy format
function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function useFilteredData(data: SaleData[]) {
  const [filteredData, setFilteredData] = useState<SaleData[]>(data)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedZones, setSelectedZones] = useState<string[]>([])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const handleFilter = useCallback(() => {
    let filtered = data

    if (fromDate || toDate) {
      filtered = filtered.filter(item => {
        const saleDate = parseDate(item.saleDate)
        saleDate.setHours(0, 0, 0, 0) // Normalize sale date to start of day

        if (fromDate && toDate) {
          const from = parseDate(fromDate)
          from.setHours(0, 0, 0, 0)
          const to = parseDate(toDate)
          to.setHours(23, 59, 59, 999) // Set to end of day
          return saleDate >= from && saleDate <= to
        } else if (fromDate) {
          const from = parseDate(fromDate)
          from.setHours(0, 0, 0, 0)
          return saleDate >= from
        } else if (toDate) {
          const to = parseDate(toDate)
          to.setHours(23, 59, 59, 999) // Set to end of day
          return saleDate <= to
        }
        return true
      })
    }

    if (selectedProducts.length > 0) {
      filtered = filtered.filter(item => selectedProducts.includes(item.product))
    }

    if (selectedZones.length > 0) {
      filtered = filtered.filter(item => selectedZones.includes(item.subzone))
    }

    setFilteredData(filtered)
  }, [data, fromDate, toDate, selectedProducts, selectedZones])

  return {
    filteredData,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedProducts,
    setSelectedProducts,
    selectedZones,
    setSelectedZones,
    handleFilter
  }
}