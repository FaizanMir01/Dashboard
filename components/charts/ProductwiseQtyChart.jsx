'use client'

import React, { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting"

export function ProductwiseQtyChart({ data }) {
  const chartRef = useRef(null)
  const rootRef = useRef(null)

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
      am5percent.PieChart.new(root, {
        radius: am5.percent(90),
        innerRadius: am5.percent(50)
      })
    )

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Quantity",
        valueField: "quantity",
        categoryField: "product",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{category}: {value}"
        })
      })
    )

    // Set data
    const processedData = Object.entries(
      data.reduce((acc, item) => {
        acc[item.product] = (acc[item.product] || 0) + item.quantity
        return acc
      }, {})
    ).map(([product, quantity]) => ({ product, quantity }))

    series.data.setAll(processedData)

    // Add legend
    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.horizontalLayout
    }))

    legend.data.setAll(series.dataItems)

    // Play initial series animation
    series.appear(1000, 100)

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
      filePrefix: "productwise-quantities",
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
  }, [data])

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }}></div>
}