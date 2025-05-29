
import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { Users, Clock, Star } from 'lucide-react';

// Register Chart.js components
Chart.register(...registerables);

const generateAgentData = () => {
  const skills = ['Customer Service', 'Technical Support', 'Sales', 'Data Entry', 'Quality Assurance'];
  return skills.map(skill => ({
    skill,
    available: Math.floor(Math.random() * 200) + 50,
    scheduled: Math.floor(Math.random() * 180) + 40,
    avgRating: 3.5 + Math.random() * 1.5,
    avgRate: 18 + Math.random() * 12,
  }));
};

export const AgentMetrics = () => {
  const [data, setData] = useState<any[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    setData(generateAgentData());
  }, []);

  useEffect(() => {
    if (!data.length || !chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.map(d => d.skill),
        datasets: [
          {
            label: 'Available',
            data: data.map(d => d.available),
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Scheduled',
            data: data.map(d => d.scheduled),
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            backgroundColor: 'white',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            titleColor: '#374151',
            bodyColor: '#374151',
            cornerRadius: 8,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }
        },
        scales: {
          x: {
            grid: {
              color: '#f0f0f0',
            },
            ticks: {
              color: '#666',
              maxRotation: 45,
            }
          },
          y: {
            grid: {
              color: '#f0f0f0',
            },
            ticks: {
              color: '#666',
            }
          }
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Agent Metrics (Chart.js)</h3>
          <p className="text-sm text-gray-500">Availability and performance by skill set</p>
        </div>
        <Users className="h-5 w-5 text-gray-400" />
      </div>

      <div className="h-64 mb-6">
        <canvas ref={chartRef} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Avg. Utilization</p>
            <p className="text-lg font-bold text-blue-600">78.5%</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Star className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Avg. Rating</p>
            <p className="text-lg font-bold text-yellow-600">4.2/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};
