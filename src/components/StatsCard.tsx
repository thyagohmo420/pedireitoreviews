import React, { useEffect, useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { animateCounter } from '../utils/helpers';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  delay = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      animateCounter(0, value, 1500, setDisplayValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-1`}>
            {displayValue.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color === 'text-purple-600' ? 'from-purple-50 to-purple-100' : 'from-gray-50 to-gray-100'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};