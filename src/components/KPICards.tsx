
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Target } from 'lucide-react';

const generateMockKPIs = () => {
  return [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Agents',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Avg. Hourly Rate',
      value: '$24.50',
      change: '-2.1%',
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Forecast Accuracy',
      value: '98.5%',
      change: '+1.2%',
      trend: 'up',
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];
};

export const KPICards = () => {
  const kpis = generateMockKPIs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover-scale"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{kpi.value}</p>
              <div className="flex items-center mt-2">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ml-1 ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
            </div>
            <div className={`${kpi.bgColor} p-3 rounded-lg`}>
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
