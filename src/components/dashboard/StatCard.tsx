import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, trend }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-3">
        {trend === 'up' && <ArrowUp size={16} className="text-green-500 mr-1" />}
        {trend === 'down' && <ArrowDown size={16} className="text-red-500 mr-1" />}
        {trend === 'neutral' && <ArrowRight size={16} className="text-gray-500 mr-1" />}
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500' : 
          'text-gray-500'
        }`}>
          {change} {trend !== 'neutral' ? 'since last month' : 'no change'}
        </span>
      </div>
    </div>
  );
};

export default StatCard;