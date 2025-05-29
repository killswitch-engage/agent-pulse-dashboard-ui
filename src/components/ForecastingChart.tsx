
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const generateForecastData = () => {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return days.map((day, index) => {
    const baseValue = 1000;
    const trend = Math.sin(index * 0.2) * 200;
    const noise = (Math.random() - 0.5) * 100;
    const actual = index < 15 ? baseValue + trend + noise : null;
    const forecast = baseValue + trend + (Math.random() - 0.5) * 50;
    const confidence = 0.85 + Math.random() * 0.1;

    return {
      day,
      actual,
      forecast: Math.round(forecast),
      confidenceHigh: Math.round(forecast * 1.1),
      confidenceLow: Math.round(forecast * 0.9),
      confidence: Math.round(confidence * 100),
    };
  });
};

interface ForecastingChartProps {
  expanded?: boolean;
}

export const ForecastingChart: React.FC<ForecastingChartProps> = ({ expanded = false }) => {
  const [data, setData] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState(98.5);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setData(generateForecastData());
    setAccuracy(95 + Math.random() * 5);
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = expanded ? 900 : 600;
    const height = expanded ? 350 : 220;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.bottom - margin.top;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.day))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.actual || 0, d.forecast, d.confidenceHigh)) || 0])
      .range([innerHeight, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Grid lines
    g.selectAll(".grid-line")
      .data(yScale.ticks())
      .enter().append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", "#f0f0f0")
      .attr("stroke-dasharray", "3,3");

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .attr("color", "#666")
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .attr("color", "#666");

    // Reference line for "today"
    const todayIndex = 15;
    if (todayIndex < data.length) {
      g.append("line")
        .attr("x1", (xScale(data[todayIndex].day) || 0) + xScale.bandwidth() / 2)
        .attr("x2", (xScale(data[todayIndex].day) || 0) + xScale.bandwidth() / 2)
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#ef4444")
        .attr("stroke-dasharray", "2,2");

      g.append("text")
        .attr("x", (xScale(data[todayIndex].day) || 0) + xScale.bandwidth() / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .attr("fill", "#ef4444")
        .attr("font-size", "12px")
        .text("Today");
    }

    // Confidence area
    const confidenceArea = d3.area<any>()
      .x(d => (xScale(d.day) || 0) + xScale.bandwidth() / 2)
      .y0(d => yScale(d.confidenceLow))
      .y1(d => yScale(d.confidenceHigh))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "#e5e7eb")
      .attr("fill-opacity", 0.3)
      .attr("d", confidenceArea);

    // Actual demand line (only for past data)
    const actualData = data.filter(d => d.actual !== null);
    if (actualData.length > 0) {
      const actualLine = d3.line<any>()
        .x(d => (xScale(d.day) || 0) + xScale.bandwidth() / 2)
        .y(d => yScale(d.actual))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(actualData)
        .attr("fill", "none")
        .attr("stroke", "#10b981")
        .attr("stroke-width", 3)
        .attr("d", actualLine);

      // Dots for actual data
      g.selectAll(".dot-actual")
        .data(actualData)
        .enter().append("circle")
        .attr("class", "dot-actual")
        .attr("cx", d => (xScale(d.day) || 0) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.actual))
        .attr("r", 4)
        .attr("fill", "#10b981");
    }

    // Forecast line
    const forecastLine = d3.line<any>()
      .x(d => (xScale(d.day) || 0) + xScale.bandwidth() / 2)
      .y(d => yScale(d.forecast))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("d", forecastLine);

    // Dots for forecast data
    g.selectAll(".dot-forecast")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot-forecast")
      .attr("cx", d => (xScale(d.day) || 0) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.forecast))
      .attr("r", 3)
      .attr("fill", "#3b82f6");

  }, [data, expanded]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${expanded ? 'col-span-full' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Demand Forecasting (D3.js)</h3>
          <p className="text-sm text-gray-500">30-day agent demand prediction with confidence intervals</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">
              {accuracy.toFixed(1)}% Accuracy
            </span>
          </div>
          {expanded && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>High demand period detected</span>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Peak Demand</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">1,340</p>
            <p className="text-sm text-blue-600">Expected on Dec 15</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">Avg. Confidence</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">92%</p>
            <p className="text-sm text-green-600">Last 30 days</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-900">Capacity Alert</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-1">3</p>
            <p className="text-sm text-purple-600">Days over capacity</p>
          </div>
        </div>
      )}

      <div className={`${expanded ? 'h-96' : 'h-64'}`}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${expanded ? 900 : 600} ${expanded ? 350 : 220}`}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
};
