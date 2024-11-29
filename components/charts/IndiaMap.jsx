import React, { useLayoutEffect, useRef, useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import TamilNaduGeoJSON  from './tamil-nadu-districts.json';

const IndiaMap = ({ data, selectedZones }) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const polygonSeriesRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    // Dispose existing root if it exists
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
        geoJSON: TamilNaduGeoJSON,
        valueField: "value",
        calculateAggregates: true
      })
    );

    polygonSeriesRef.current = polygonSeries;

    // Process and set district data
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

    polygonSeries.set("heatRules", [{
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0xe0e7ff),
      max: am5.color(0x6774DC),
      key: "fill"
    }]);

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{Dist_Name}",
      interactive: true,
      fill: am5.color(0x66B6DC),
      strokeWidth: 0.5,
      stroke: am5.color(0xffffff)
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x4f5bbd)
    });

    // Enable exporting
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
  }, [selectedZones]);

  useEffect(() => {
    if (polygonSeriesRef.current) {
      polygonSeriesRef.current.mapPolygons.each((polygon) => {
        const properties = polygon.dataItem?.dataContext;
        const polygonId = properties?.id || properties?.Dist_Name;
        if (polygonId && selectedZones.includes(polygonId)) {
          polygon.set("fill", am5.color(0x4f5bbd)); // Highlight selected zones
        } else {
          polygon.set("fill", am5.color(0x66B6DC)); // Default color for unselected zones
        }
      });
    }
    console.log(selectedZones);
  }, [data, selectedZones]);

  return (
    <div className="w-full">
      <div ref={chartRef} className="h-[500px]" />
    </div>
  );
};

export default IndiaMap;