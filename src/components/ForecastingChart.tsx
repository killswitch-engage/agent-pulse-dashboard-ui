
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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

  useEffect(() => {
    setData(generateForecastData());
    setAccuracy(95 + Math.random() * 5);
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${expanded ? 'col-span-full' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Demand Forecasting</h3>
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <ReferenceLine x="Dec 1" stroke="#ef4444" strokeDasharray="2 2" label="Today" />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Actual Demand"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              name="Forecasted Demand"
            />
            <Line
              type="monotone"
              dataKey="confidenceHigh"
              stroke="#e5e7eb"
              strokeWidth={1}
              dot={false}
              name="Confidence High"
            />
            <Line
              type="monotone"
              dataKey="confidenceLow"
              stroke="#e5e7eb"
              strokeWidth={1}
              dot={false}
              name="Confidence Low"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
