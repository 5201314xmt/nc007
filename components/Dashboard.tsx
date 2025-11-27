import React, { useState } from 'react';
import { Activity, Server, ShieldAlert, ArrowUp, ArrowDown, RefreshCw, BarChart3 } from 'lucide-react';
import { mockVpsList, mockAccounts } from '../services/mockService';
import { StatsCard } from './StatsCard';
import { VpsStatus, QbStatus } from '../types';
import { ScpStatus } from './modules/ScpStatus';
import { QbStatusDisplay } from './modules/QbStatus';
import { VertexStatus } from './modules/VertexStatus';

export const Dashboard: React.FC = () => {
  const [vpsList, setVpsList] = useState(mockVpsList);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleQb = (vpsId: string) => {
    setVpsList(prev => prev.map(vps => {
      if (vps.id === vpsId) {
        const newStatus = vps.qbInstance.status === QbStatus.PAUSED ? QbStatus.ONLINE : QbStatus.PAUSED;
        return {
          ...vps,
          qbInstance: { ...vps.qbInstance, status: newStatus }
        };
      }
      return vps;
    }));
  };

  const toggleVertex = (vpsId: string) => {
    setVpsList(prev => prev.map(vps => {
      if (vps.id === vpsId) {
        return {
          ...vps,
          vertexDownloader: { ...vps.vertexDownloader, enabled: !vps.vertexDownloader.enabled }
        };
      }
      return vps;
    }));
  };

  const throttledCount = vpsList.filter(v => v.status === VpsStatus.THROTTLED).length;
  
  // Calculate total speeds (Simulated parsing for the mock data strings)
  const parseSpeed = (str: string) => parseFloat(str.split(' ')[0]) || 0;
  const totalUploadVal = vpsList.reduce((acc, v) => acc + parseSpeed(v.qbInstance.uploadSpeed), 0);
  const totalDownloadVal = vpsList.reduce((acc, v) => acc + parseSpeed(v.qbInstance.downloadSpeed), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">系统仪表盘</h1>
          <p className="text-slate-400">正在监控 {mockAccounts.length} 个 Netcup 账号下的 {vpsList.length} 个实例</p>
        </div>
        <button 
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all ${isRefreshing ? 'opacity-75 cursor-wait' : ''}`}
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? '同步中...' : '同步状态'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="VPS 总数" 
          value={vpsList.length} 
          icon={Server} 
        />
        <StatsCard 
          title="受限实例" 
          value={throttledCount} 
          icon={ShieldAlert} 
          trend={throttledCount > 0 ? "缓解措施激活中" : "所有系统正常"}
          trendColor={throttledCount > 0 ? "text-red-400" : "text-green-400"}
        />
        <StatsCard 
          title="活跃种子" 
          value={vpsList.reduce((acc, v) => acc + v.qbInstance.activeTorrents, 0)} 
          icon={Activity} 
        />
        <StatsCard 
          title="实时速率 (Up / Down)" 
          value={
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xl text-green-400">
                <ArrowUp size={20} />
                <span>{totalUploadVal.toFixed(1)} MB/s</span>
              </div>
              <div className="flex items-center gap-2 text-lg text-blue-400">
                <ArrowDown size={18} />
                <span>{totalDownloadVal.toFixed(1)} MB/s</span>
              </div>
            </div>
          } 
          icon={BarChart3} 
        />
      </div>

      {/* VPS List - Modularized */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200">实例详情</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {vpsList.map((vps) => (
            <div key={vps.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg hover:border-slate-600 transition-colors flex flex-col">
              
              {/* 1. SCP Status Module */}
              <ScpStatus 
                name={vps.name}
                ip={vps.ip}
                status={vps.status}
                lastChecked={vps.lastChecked}
              />

              {/* Card Body - Integration Modules */}
              <div className="p-4 space-y-4 flex-1">
                
                {/* 2. QB Status Module */}
                <QbStatusDisplay 
                  instance={vps.qbInstance} 
                  onToggle={() => toggleQb(vps.id)}
                />

                {/* 3. Vertex Status Module */}
                <VertexStatus 
                  downloader={vps.vertexDownloader}
                  onToggle={() => toggleVertex(vps.id)}
                />

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};