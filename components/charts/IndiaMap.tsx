import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import tamilNaduGeoJson from './tamil-nadu-districts.json';

const IndiaMap = ({ data }) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    if (rootRef.current) {
      rootRef.current.dispose();
    }

    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
        wheelY: "zoom"
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: tamilNaduGeoJson,
        valueField: "value",
        calculateAggregates: true
      })
    );

    const districtData = data.reduce((acc, item) => {
      acc[item.subzone] = (acc[item.subzone] || 0) + item.amount;
      return acc;
    }, {});

    polygonSeries.data.setAll(
      Object.entries(districtData).map(([district, amount]) => ({
        id: district,
        value: amount
      }))
    );

    // Adjust heat map color scheme to use #6774DC as the primary color
    polygonSeries.set("heatRules", [{
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0xe0e7ff), // Lightened version for low values
      max: am5.color(0x6774DC), // Primary color for high values
      key: "fill"
    }]);

/*     const heatLegend = chart.children.push(
      am5.HeatLegend.new(root, {
        orientation: "vertical",
        startColor: am5.color(0xe0e7ff), // Lightened version for low values
        endColor: am5.color(0x6774DC), // Primary color for high values
        startText: "Low",
        endText: "High",
        stepCount: 5
      })
    );

    polygonSeries.mapPolygons.template.events.on("pointerover", function (ev) {
      if (ev.target.dataItem) {
        heatLegend.set("value", ev.target.dataItem.get("value"));
      }
    }); */

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    // Set base color and hover color
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{Dist_Name}",
      interactive: true,
      fill: am5.color(0x66B6DC), // Lightened base color
      strokeWidth: 0.5,
      stroke: am5.color(0xffffff)
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x4f5bbd) // Darker version on hover
    });

    const exporting = am5exporting.Exporting.new(root, {
      filePrefix: "tamil-nadu-sales-map",
      dataSource: polygonSeries.data.values,
      menu: am5exporting.ExportingMenu.new(root, {})
    });

    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, [data]);

  return (
    <div className="w-full">
      <div ref={chartRef} className="h-[600px]" />
    </div>
  );
};

export default IndiaMap;
