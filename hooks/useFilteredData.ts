import { useState, useEffect } from 'react'
import { SaleData } from '@/types/SaleData'

export function useFilteredData(data: SaleData[]) {
  const [filteredData, setFilteredData] = useState<SaleData[]>(data)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedZones, setSelectedZones] = useState<string[]>([])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const handleFilter = () => {
    let filtered = data

    if (fromDate) {
      filtered = filtered.filter(item => new Date(item.saleDate) >= new Date(fromDate))
    }

    if (toDate) {
      filtered = filtered.filter(item => new Date(item.saleDate) <= new Date(toDate))
    }

    if (selectedProducts.length > 0) {
      filtered = filtered.filter(item => selectedProducts.includes(item.product))
    }

    if (selectedZones.length > 0) {
      filtered = filtered.filter(item => selectedZones.includes(item.subzone))
    }

    setFilteredData(filtered)
  }

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