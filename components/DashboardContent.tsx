import React from 'react'
import { SaleData } from '@/types/SaleData'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import IndiaMap from './charts/IndiaMap'
import { TimewiseSalesChart } from './charts/TimewiseSalesChart'
import { ProductDiscountwiseChart } from './charts/ProductDiscountwiseChart'
import { ProductwiseQtyChart } from './charts/ProductwiseQtyChart'
import { ProductwiseDiscountChart } from './charts/ProductwiseDiscountChart'
import { GaugeChart } from './charts/GaugeChart'
import { calculateAverage } from '@/utils/calculations'
import { ProductQuantityBarChart } from './charts/ProductQtyBarChart'
import { MonthlyComparisonChart } from './charts/MonthlyComparisonChart'
interface DashboardContentProps {
  filteredData: SaleData[];
  selectedZones: string[];
}

export function DashboardContent({ filteredData, selectedZones }: DashboardContentProps) {
  const totalSales = filteredData.reduce((acc, item) => acc + item.amount, 0)
  const totalDiscount = filteredData.reduce((acc, item) => acc + item.discount, 0)
  const totalQuantity = filteredData.reduce((acc, item) => acc + item.quantity, 0)

  

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>India Map</CardTitle>
          </CardHeader>
          <CardContent>
            <IndiaMap data={filteredData} selectedZones={selectedZones} />
          </CardContent>
        </Card>
        <Card className='col-span-2'>
        <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Sales</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold">{totalSales.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted h-4 rounded-full">
                        <div className="bg-primary h-4 rounded-full" style={{ width: `${(totalSales / (totalSales * 1.5)) * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Discount</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold">{totalDiscount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted h-4 rounded-full">
                        <div className="bg-primary h-4 rounded-full" style={{ width: `${(totalDiscount / totalSales) * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold">{totalQuantity}</span>
                      </div>
                      <div className="w-full bg-muted h-4 rounded-full">
                        <div className="bg-primary h-4 rounded-full" style={{ width: `${(totalQuantity / (totalQuantity * 1.5)) * 100}%` }}></div>
                      </div>
                    </div>
                  </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Timewise Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <TimewiseSalesChart data={filteredData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Discountwise Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDiscountwiseChart data={filteredData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Productwise Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductwiseQtyChart data={filteredData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Productwise Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductwiseDiscountChart data={filteredData} />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <MonthlyComparisonChart data={filteredData} />
                </CardContent>
              </Card>
              <Card>
  <CardHeader>
    <CardTitle>Product Quantities</CardTitle>
  </CardHeader>
  <CardContent>
    <ProductQuantityBarChart data={filteredData} />
  </CardContent>
</Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Average</CardTitle>
          </CardHeader>
          <CardContent>
            <GaugeChart title="Sales Avg" value={calculateAverage(filteredData, 'amount')} max={Math.max(...filteredData.map(item => item.amount))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Discount Average</CardTitle>
          </CardHeader>
          <CardContent>
            <GaugeChart title="Discount Avg" value={calculateAverage(filteredData, 'discount')} max={Math.max(...filteredData.map(item => item.discount))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quantity Average</CardTitle>
          </CardHeader>
          <CardContent>
            <GaugeChart title="Quantity Avg" value={calculateAverage(filteredData, 'quantity')} max={Math.max(...filteredData.map(item => item.quantity))} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}