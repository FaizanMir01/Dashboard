'use client'

import React, { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting"

interface SaleData {
  paymentId: number
  outletId: number
  saleDate: string
  saleTime: string
  product: string
  sku: string
  quantity: number
  unitPrice: number
  amount: number
  discount: number
  subzone: string
}

export function MonthlyComparisonChart({ data }: { data: SaleData[] }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<am5.Root | null>(null)

  useLayoutEffect(() => {
    if (!chartRef.current) return

    // Dispose of the previous root if it exists
    if (rootRef.current) {
      rootRef.current.dispose()
    }

    // Create root element
    const root = am5.Root.new(chartRef.current)
    rootRef.current = root

    // Create custom theme
    const myTheme = am5.Theme.new(root)
    myTheme.rule("Grid", ["x"]).setAll({
      strokeOpacity: 0.05
    })

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ])

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        maxTooltipDistance: 0
      })
    )

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "month", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    )

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    )

    // Process data to group by product and month
    const processedData = new Map<string, Map<string, number>>()
    const allMonths = new Set<string>()
    
    data.forEach(sale => {
      const date = new Date(sale.saleDate.split('-').reverse().join('-'))
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format
      const product = sale.product

      if (!processedData.has(product)) {
        processedData.set(product, new Map())
      }

      const productData = processedData.get(product)!
      productData.set(monthKey, (productData.get(monthKey) || 0) + sale.amount)
      allMonths.add(monthKey)
    })

    // Create series for each product
    processedData.forEach((productData, product) => {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: product,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{name}: ${valueY}"
          })
        })
      )

      // Convert product data to series data
      const seriesData = Array.from(allMonths).map(month => ({
        date: new Date(month).getTime(),
        value: productData.get(month) || 0
      })).sort((a, b) => a.date - b.date)

      series.data.setAll(seriesData)
      series.appear()
    })

    // Add legend
    const legend = chart.rightAxesContainer.children.push(
      am5.Legend.new(root, {
        width: 200,
        paddingLeft: 15,
        height: am5.percent(100)
      })
    )

    // Add hover effect to legend
    legend.itemContainers.template.events.on("pointerover", function(e) {
      const itemContainer = e.target
      const series = itemContainer.dataItem?.dataContext as am5xy.LineSeries

      chart.series.each(function(chartSeries) {
        if (chartSeries !== series) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 0.15,
            stroke: am5.color(0x000000)
          })
        } else {
          chartSeries.strokes.template.setAll({
            strokeWidth: 3
          })
        }
      })
    })

    legend.itemContainers.template.events.on("pointerout", function() {
      chart.series.each(function(chartSeries) {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: chartSeries.get("fill")
        })
      })
    })

    // Configure legend layout
    legend.itemContainers.template.set("width", am5.p100)
    legend.valueLabels.template.setAll({
      width: am5.p100,
      textAlign: "right"
    })
    legend.data.setAll(chart.series.values)

    // Add cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }))
    cursor.lineY.set("visible", false)

    // Add scrollbars
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }))

    // Add export menu
    const exportingMenu = am5exporting.ExportingMenu.new(root, {
      container: chart.container,
      pos: "top-right",
      menuItems: [
        {
          label: "Export",
          menu: [
            { type: "png", label: "Image (PNG)" },
            { type: "jpg", label: "Image (JPG)" },
            { type: "csv", label: "Data (CSV)" },
            { type: "xlsx", label: "Data (XLSX)" },
            { type: "pdf", label: "Document (PDF)" },
          ]
        }
      ]
    })

    // Configure exporting
    const exporting = am5exporting.Exporting.new(root, {
      menu: exportingMenu,
      filePrefix: "monthly-product-sales",
      dataSource: chart.series.values.map(series => series.data.values),
      pdfOptions: {
        addURL: true,
        fontSize: 11,
        image: {
          transparentWhite: true
        }
      }
    })

    // Make chart appear
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data])

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>
}