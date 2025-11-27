import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  trend?: string;
  trendColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, trendColor }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg relative overflow-hidden">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <div className="text-3xl font-bold text-slate-100">{value}</div>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trendColor}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-slate-700/50 rounded-lg text-blue-400">
          <Icon size={24} />
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 text-slate-700/20 z-0">
        <Icon size={100} />
      </div>
    </div>
  );
};