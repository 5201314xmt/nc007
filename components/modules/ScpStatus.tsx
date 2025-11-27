import React from 'react';
import { VpsStatus } from '../../types';
import { getVpsStatusColor } from '../../services/mockService';

interface ScpStatusProps {
  name: string;
  ip: string;
  status: VpsStatus;
  lastChecked: string;
}

const statusMap: Record<string, string> = {
  [VpsStatus.HEALTHY]: '健康',
  [VpsStatus.THROTTLED]: '受限',
  [VpsStatus.UNKNOWN]: '未知',
};

export const ScpStatus: React.FC<ScpStatusProps> = ({ name, ip, status, lastChecked }) => {
  return (
    <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${status === VpsStatus.HEALTHY ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
        <div>
          <h3 className="font-bold text-slate-100 text-lg">{name}</h3>
          <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
            {ip} 
            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
            上次检查: {new Date(lastChecked).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className={`px-3 py-1 rounded text-xs font-bold border ${getVpsStatusColor(status)}`}>
        {statusMap[status]}
      </div>
    </div>
  );
};