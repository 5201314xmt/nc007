import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Play, Pause, BarChart2, Activity } from 'lucide-react';
import { QbInstance, QbStatus } from '../../types';

interface QbStatusProps {
  instance: QbInstance;
  onToggle: () => void;
}

const qbStatusMap: Record<string, string> = {
  [QbStatus.ONLINE]: '在线',
  [QbStatus.OFFLINE]: '离线',
  [QbStatus.PAUSED]: '已暂停',
};

export const QbStatusDisplay: React.FC<QbStatusProps> = ({ instance, onToggle }) => {
  const [showHistory, setShowHistory] = useState(false);

  // We only show the last 7 days in the mini-chart
  const recentHistory = instance.history.slice(-7);

  // Simple calculation for bar heights
  const maxTraffic = Math.max(...recentHistory.map(h => Math.max(h.upload, h.download)), 1);
  
  return (
    <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/50 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">qBittorrent</span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          instance.status === QbStatus.ONLINE ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
        }`}>
          {qbStatusMap[instance.status]}
        </span>
      </div>

      {/* Real-time Speed Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase">
            <ArrowUp size={10} className="text-green-500" /> 上传速度
          </div>
          <div className="text-sm font-mono text-green-400 font-bold">{instance.uploadSpeed}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase">
            <ArrowDown size={10} className="text-blue-500" /> 下载速度
          </div>
          <div className="text-sm font-mono text-blue-400 font-bold">{instance.downloadSpeed}</div>
        </div>
      </div>

      {/* Daily Stats */}
      <div>
        <div className="text-[10px] text-slate-500 mb-1">今日跑量 (上 / 下)</div>
        <div className="flex justify-between text-xs font-mono text-slate-300 bg-slate-900/50 px-2 py-1.5 rounded border border-slate-800">
            <span>{instance.dailyUpload}</span>
            <span className="text-slate-700">|</span>
            <span>{instance.dailyDownload}</span>
        </div>
      </div>

      {/* Action & Toggle History */}
      <div className="flex gap-2">
        <button 
          onClick={onToggle}
          className="flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
        >
          {instance.status === QbStatus.PAUSED ? <Play size={14} /> : <Pause size={14} />}
          {instance.status === QbStatus.PAUSED ? "恢复" : "暂停"}
        </button>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center justify-center w-8 rounded transition-colors ${showHistory ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
          title="查看历史数据"
        >
          <BarChart2 size={14} />
        </button>
      </div>

      {/* Historical Data Chart (Collapsible) */}
      {showHistory && (
        <div className="pt-2 border-t border-slate-800 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="text-[10px] text-slate-500 mb-2 flex items-center gap-1">
            <Activity size={10} /> 最近 7 天上传/下载统计 (GB)
          </div>
          <div className="flex justify-between items-end h-24 gap-1">
            {recentHistory.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 flex-1 group relative">
                <div className="w-full flex flex-col-reverse items-center gap-[1px] h-full justify-end">
                   {/* Upload Bar */}
                   <div 
                      className="w-full bg-green-500/80 hover:bg-green-400 transition-colors rounded-sm min-h-[2px]"
                      style={{ height: `${(day.upload / maxTraffic) * 100}%` }}
                   ></div>
                   {/* Download Bar */}
                   <div 
                      className="w-full bg-blue-500/50 hover:bg-blue-400 transition-colors rounded-sm min-h-[2px]"
                      style={{ height: `${(day.download / maxTraffic) * 100}%` }}
                   ></div>
                </div>
                {/* Parse YYYY-MM-DD to show MM-DD */}
                <span className="text-[9px] text-slate-500 font-mono">
                  {day.date.slice(5)}
                </span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 w-max pointer-events-none">
                  <div className="bg-slate-900 text-[10px] text-slate-200 p-1.5 rounded border border-slate-700 shadow-xl">
                    <div className="font-bold border-b border-slate-700 mb-1 pb-0.5 text-center">{day.date}</div>
                    <div className="text-green-400">↑ {day.upload} GB</div>
                    <div className="text-blue-400">↓ {day.download} GB</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};