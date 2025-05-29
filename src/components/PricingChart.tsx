
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const generatePricingData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => ({
    month,
    avgPrice: 20 + Math.random() * 10 + Math.sin(index * 0.5) * 3,
    predicted: 22 + Math.random() * 8 + Math.sin(index * 0.4) * 2,
    volume: 800 + Math.random() * 400 + Math.cos(index * 0.3) * 100,
  }));
};

interface PricingChartProps {
  expanded?: boolean;
}

export const PricingChart: React.FC<PricingChartProps> = ({ expanded = false }) => {
  const [data, setData] = useState<any[]>([]);
  const [viewType, setViewType] = useState<'line' | 'area'>('line');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setData(generatePricingData());
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = expanded ? 800 : 400;
    const height = expanded ? 350 : 220;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.bottom - margin.top;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.avgPrice, d.predicted)) || 0])
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
      .attr("color", "#666");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .attr("color", "#666");

    if (viewType === 'line') {
      // Line for average price
      const line1 = d3.line<any>()
        .x(d => (xScale(d.month) || 0) + xScale.bandwidth() / 2)
        .y(d => yScale(d.avgPrice))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 3)
        .attr("d", line1);

      // Line for predicted price
      const line2 = d3.line<any>()
        .x(d => (xScale(d.month) || 0) + xScale.bandwidth() / 2)
        .y(d => yScale(d.predicted))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#10b981")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", line2);

      // Dots for average price
      g.selectAll(".dot-avg")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot-avg")
        .attr("cx", d => (xScale(d.month) || 0) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.avgPrice))
        .attr("r", 4)
        .attr("fill", "#3b82f6");

      // Dots for predicted price
      g.selectAll(".dot-pred")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot-pred")
        .attr("cx", d => (xScale(d.month) || 0) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.predicted))
        .attr("r", 3)
        .attr("fill", "#10b981");
    } else {
      // Area chart
      const area = d3.area<any>()
        .x(d => (xScale(d.month) || 0) + xScale.bandwidth() / 2)
        .y0(innerHeight)
        .y1(d => yScale(d.avgPrice))
        .curve(d3.curveMonotoneX);

      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "areaGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", 0).attr("y2", innerHeight);

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#3b82f6")
        .attr("stop-opacity", 0.8);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#3b82f6")
        .attr("stop-opacity", 0.1);

      g.append("path")
        .datum(data)
        .attr("fill", "url(#areaGradient)")
        .attr("d", area);
    }

  }, [data, viewType, expanded]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${expanded ? 'col-span-full' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pricing Analytics (D3.js)</h3>
          <p className="text-sm text-gray-500">Average hourly rates and volume trends</p>
        </div>
        {expanded && (
          <div className="flex space-x-2">
            <button
              onClick={() => setViewType('line')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewType === 'line'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setViewType('area')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewType === 'area'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Area Chart
            </button>
          </div>
        )}
      </div>

      <div className={`${expanded ? 'h-96' : 'h-64'}`}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${expanded ? 800 : 400} ${expanded ? 350 : 220}`}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
};
