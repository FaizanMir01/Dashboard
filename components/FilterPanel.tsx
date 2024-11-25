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
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>
  selectedZones: string[]
  setSelectedZones: React.Dispatch<React.SetStateAction<string[]>>
  selectedDistrict: string | null
  setSelectedDistrict: React.Dispatch<React.SetStateAction<string | null>>
  handleFilter: () => void
  data: SaleData[]
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
  selectedDistrict,
  setSelectedDistrict,
  handleFilter,
  data
}: FilterPanelProps) {
  
  const products = Array.from(new Set(data.map(item => item.product)))
  const zones = Array.from(new Set(data.map(item => item.subzone)))

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value)
  }

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value)
  }

  return (
    <Card className='h-[600px]'>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fromDate" className="text-sm font-medium">From Date</label>
          <Input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="toDate" className="text-sm font-medium">To Date</label>
          <Input
            id="toDate"
            type="date"
            value={toDate}
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