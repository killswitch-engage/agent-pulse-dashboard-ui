
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { KPICards } from '../components/KPICards';
import { PricingChart } from '../components/PricingChart';
import { ForecastingChart } from '../components/ForecastingChart';
import { SchedulingCalendar } from '../components/SchedulingCalendar';
import { AgentMetrics } from '../components/AgentMetrics';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'pricing', label: 'Pricing Analytics' },
              { id: 'forecasting', label: 'Forecasting' },
              { id: 'scheduling', label: 'Scheduling' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <KPICards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PricingChart />
              <AgentMetrics />
            </div>
            <ForecastingChart />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="animate-fade-in">
            <PricingChart expanded />
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="animate-fade-in">
            <ForecastingChart expanded />
          </div>
        )}

        {activeTab === 'scheduling' && (
          <div className="animate-fade-in">
            <SchedulingCalendar />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
