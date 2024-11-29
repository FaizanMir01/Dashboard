'use client'

import React, { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting"

export function TimewiseSalesChart({ data }) {
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
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX"
      })
    )

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "hour", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
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
      am5xy.LineSeries.new(root, {
        name: "Sales",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "amount",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "${valueY}"
        })
      })
    )

    // Set data
    const processedData = data.map(item => ({
      date: new Date(`${item.saleDate} ${item.saleTime}`).getTime(),
      amount: item.amount
    })).sort((a, b) => a.date - b.date)

    series.data.setAll(processedData)

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}))

    // Make stuff animate on load
    series.appear(1000)
    chart.appear(1000, 100)

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
      filePrefix: "timewise-sales",
      dataSource: series.data.values,
      pdfOptions: {
        addURL: true,
        fontSize: 11,
        image: {
          transparentWhite: true
        }
      },
      numericFields: ["amount"],
      dateFields: ["date"]
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