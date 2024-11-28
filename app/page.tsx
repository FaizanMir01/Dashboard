'use client'

import React, { useState, useEffect } from 'react'
import { SaleData } from '@/types/SaleData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardContent } from '@/components/DashboardContent'
import { ReportContent } from '@/components/ReportContent'
import { FilterPanel } from '@/components/FilterPanel'
import { useFilteredData } from '@/hooks/useFilteredData'
import salesData from '@/data/sales_data.json'

export default function Dashboard() {
  const [data, setData] = useState<SaleData[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const { 
    filteredData, 
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
    handleDistrictClick
  } = useFilteredData(data)

  useEffect(() => {
    setData(salesData as SaleData[])
  }, [])

  return (
    <div className="px-2 py-4">
      <h1 className="text-3xl font-bold mb-8">Sales Dashboard</h1>
      <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-8">
            <DashboardContent 
              filteredData={filteredData} 
              selectedZones={selectedZones}
              selectedDistrict={selectedDistrict}
              onDistrictClick={handleDistrictClick}
              filterPanel={
                <FilterPanel
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  toDate={toDate}
                  setToDate={setToDate}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  selectedZones={selectedZones}
                  setSelectedZones={setSelectedZones}
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                  handleFilter={handleFilter}
                  data={data}
                />
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="report">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <ReportContent filteredData={filteredData} />
            </div>
            <div className="lg:col-span-1">
              <FilterPanel
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                selectedZones={selectedZones}
                setSelectedZones={setSelectedZones}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                handleFilter={handleFilter}
                data={data}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}