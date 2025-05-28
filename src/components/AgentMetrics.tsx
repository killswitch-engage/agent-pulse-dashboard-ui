
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Clock, Star, DollarSign } from 'lucide-react';

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

  useEffect(() => {
    setData(generateAgentData());
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Agent Metrics</h3>
          <p className="text-sm text-gray-500">Availability and performance by skill set</p>
        </div>
        <Users className="h-5 w-5 text-gray-400" />
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="skill" 
              stroke="#666" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="available" fill="#3b82f6" name="Available" radius={[4, 4, 0, 0]} />
            <Bar dataKey="scheduled" fill="#10b981" name="Scheduled" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
