'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from 'lucide-react'

export function ProductQuantityBarChart({ data }) {
  const chartRef = useRef(null)
  const rootRef = useRef(null)
  const [isAscending, setIsAscending] = useState(false)

  useLayoutEffect(() => {
    if (!chartRef.current) return

    // Dispose of the previous root if it exists
    if (rootRef.current) {
      rootRef.current.dispose()
    }

    // Create root element
    const root = am5.Root.new(chartRef.current)
    rootRef.current = root

    // Set themes
    root.setThemes([am5themes_Animated.new(root)])

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true
      })
    )

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "product",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    )

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    )

    // Create series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Quantity",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "quantity",
        categoryXField: "product",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{categoryX}: {valueY}"
        })
      })
    )

    // Process and sort data
    const processedData = Object.entries(
      data.reduce((acc, item) => {
        acc[item.product] = (acc[item.product] || 0) + item.quantity
        return acc
      }, {})
    )
      .map(([product, quantity]) => ({ product, quantity }))
      .sort((a, b) => 
        isAscending 
          ? a.quantity - b.quantity 
          : b.quantity - a.quantity
      )

    xAxis.data.setAll(processedData)
    series.data.setAll(processedData)

    // Customize x-axis labels
    xAxis.get("renderer").labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    })

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }))

    // Make stuff animate on load
    series.appear(1000)
    chart.appear(1000, 100)

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
      filePrefix: "product-quantity-barchart",
      dataSource: series.data.values,
      pdfOptions: {
        addURL: true,
        fontSize: 11,
        image: {
          transparentWhite: true
        }
      },
      numericFields: ["quantity"]
    })

    // Cleanup function
    return () => {
      if (rootRef.current) {
        rootRef.current.dispose()
      }
    }
  }, [data, isAscending]) // Added isAscending to dependencies

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAscending(!isAscending)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort {isAscending ? "Descending" : "Ascending"}
        </Button>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
    </div>
  )
}