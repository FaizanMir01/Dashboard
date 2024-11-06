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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">From Date</label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">To Date</label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Products</label>
          <MultiSelect
            options={products}
            selected={selectedProducts}
            setSelected={setSelectedProducts}
            placeholder="Select products..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Zones</label>
          <MultiSelect
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