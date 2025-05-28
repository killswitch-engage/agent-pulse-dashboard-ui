
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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

  useEffect(() => {
    setData(generatePricingData());
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${expanded ? 'col-span-full' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pricing Analytics</h3>
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
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="avgPrice"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Average Price ($)"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                name="Predicted Price ($)"
              />
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="avgPrice"
                stroke="#3b82f6"
                fill="url(#colorPrice)"
                fillOpacity={0.6}
                name="Average Price ($)"
              />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
