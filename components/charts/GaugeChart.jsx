'use client'

import React, { useLayoutEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting"

export function GaugeChart({ title, value, max }) {
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
        startAngle: 180,
        endAngle: 360,
        layout: root.verticalLayout,
        innerRadius: am5.percent(80)
      })
    )

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        startAngle: 180,
        endAngle: 360
      })
    )

    series.states.create("hidden", {
      startAngle: 180,
      endAngle: 180
    })

    series.slices.template.setAll({
      cornerRadius: 5
    })

    series.labels.template.setAll({
      forceHidden: true
    })

    series.ticks.template.setAll({
      forceHidden: true
    })

    // Set colors
    series.get("colors")?.set("colors", [
      am5.color(0x2196F3),
      am5.color(0xEEEEEE)
    ])

    // Add value label
    const valueLabel = chart.seriesContainer.children.push(
      am5.Label.new(root, {
        textAlign: "center",
        centerY: am5.percent(50),
        centerX: am5.percent(50),
        text: value.toFixed(1),
        fontSize: 24,
        fontWeight: "bold",
        fill: am5.color(0x2196F3)
      })
    )

    // Set data
    series.data.setAll([
      {
        category: "Main",
        value: value
      },
      {
        category: "Rest",
        value: max - value
      }
    ])

    // Add title
    chart.children.unshift(
      am5.Label.new(root, {
        text: title,
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 10
      })
    )

    // Create export button
    const exportButton = am5.Button.new(root, {
      paddingTop: 5,
      paddingRight: 5,
      marginRight: 5,
      icon: am5.Graphics.new(root, {
        width: 20,
        height: 20,
        fill: am5.color(0x000000),
        svgPath: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
      })
    })

    chart.children.push(exportButton)

    // Configure exporting
    const exporting = am5exporting.Exporting.new(root, {
      filePrefix: "gauge-chart",
      dataSource: series.data.values,
      pdfOptions: {
        addURL: true,
        fontSize: 11
      }
    })

    // Add export click handler
    exportButton.events.on("click", () => {
      exporting.export("png")
    })

    // Animate chart and series
    series.appear(1000, 100)
    chart.appear(1000, 100)

    // Cleanup function
    return () => {
      if (rootRef.current) {
        rootRef.current.dispose()
      }
    }

  }, [title, value, max])

  return <div ref={chartRef} style={{ width: '100%', height: '200px' }}></div>
}