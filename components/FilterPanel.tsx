import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MultiSelect } from './MultiSelect'
import { SaleData } from '@/types/SaleData'

interface FilterPanelProps {
  fromDate: string
  setFromDate: (date: string) => void
  toDate: string
  setToDate: (date: string) => void
  selectedProducts: string[]
  setSelectedProducts: (products: string[]) => void
  selectedZones: string[]
  setSelectedZones: (zones: string[]) => void
  handleFilter: () => void
  data: SaleData[]
}

// Helper function to format date from yyyy-mm-dd to dd-mm-yyyy
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  return `${day}-${month}-${year}`
}

// Helper function to parse date from dd-mm-yyyy to yyyy-mm-dd
const parseDateFromInput = (dateString: string): string => {
  if (!dateString) return ''
  const [day, month, year] = dateString.split('-')
  return `${year}-${month}-${day}`
}

export function FilterPanel({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedProducts,
  setSelectedProducts,
  selectedZones,
  setSelectedZones,
  handleFilter,
  data
}: FilterPanelProps) {
  const products = Array.from(new Set(data.map(item => item.product)))
  const zones = Array.from(new Set(data.map(item => item.subzone)))

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateForInput(e.target.value)
    setFromDate(formattedDate)
  }

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateForInput(e.target.value)
    setToDate(formattedDate)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fromDate" className="text-sm font-medium">From Date</label>
          <Input
            id="fromDate"
            type="date"
            value={parseDateFromInput(fromDate)}
            onChange={handleFromDateChange}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="toDate" className="text-sm font-medium">To Date</label>
          <Input
            id="toDate"
            type="date"
            value={parseDateFromInput(toDate)}
            onChange={handleToDateChange}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="products" className="text-sm font-medium">Products</label>
          <MultiSelect
            id="products"
            options={products}
            selected={selectedProducts}
            setSelected={setSelectedProducts}
            placeholder="Select products..."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="zones" className="text-sm font-medium">Zones</label>
          <MultiSelect
            id="zones"
            options={zones}
            selected={selectedZones}
            setSelected={setSelectedZones}
            placeholder="Select zones..."
          />
        </div>
        <Button className="w-full" onClick={handleFilter}>Apply Filters</Button>
      </CardContent>
    </Card>
  )
}