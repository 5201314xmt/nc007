import React, { useState, useMemo } from 'react';
import { Search, Calendar, Download, Upload, Filter } from 'lucide-react';
import { mockVpsList } from '../services/mockService';
import { StatsCard } from './StatsCard';

export const TrafficStats: React.FC = () => {
  // Calculate default dates
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(formatDate(thirtyDaysAgo));
  const [endDate, setEndDate] = useState(formatDate(today));

  // Flatten and Aggregate Data
  const filteredData = useMemo(() => {
    const flatData: Array<{
      id: string; // unique key
      date: string;
      vpsName: string;
      ip: string;
      alias: string;
      upload: number;
      download: number;
    }> = [];

    mockVpsList.forEach(vps => {
      vps.qbInstance.history.forEach(day => {
        flatData.push({
          id: `${vps.id}-${day.date}`,
          date: day.date,
          vpsName: vps.name,
          ip: vps.ip,
          alias: vps.vertexDownloader.alias,
          upload: day.upload,
          download: day.download,
        });
      });
    });

    return flatData.filter(item => {
      // Date Filter
      if (item.date < startDate || item.date > endDate) return false;

      // Search Filter (IP or Alias or VPS Name)
      const term = searchTerm.toLowerCase();
      if (term && 
          !item.ip.includes(term) && 
          !item.alias.toLowerCase().includes(term) && 
          !item.vpsName.toLowerCase().includes(term)) {
        return false;
      }

      return true;
    }).sort((a, b) => b.date.localeCompare(a.date)); // Sort by date desc
  }, [searchTerm, startDate, endDate]);

  const totalUpload = filteredData.reduce((acc, curr) => acc + curr.upload, 0);
  const totalDownload = filteredData.reduce((acc, curr) => acc + curr.download, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">流量统计</h1>
        <p className="text-slate-400">查看各实例历史上传下载数据 (最近 30 天)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard 
          title="筛选范围内总上传" 
          value={`${(totalUpload / 1024).toFixed(2)} TB`} 
          icon={Upload}
          trend={`${totalUpload.toLocaleString()} GB`}
          trendColor="text-green-400"
        />
        <StatsCard 
          title="筛选范围内总下载" 
          value={`${(totalDownload / 1024).toFixed(2)} TB`} 
          icon={Download}
          trend={`${totalDownload.toLocaleString()} GB`}
          trendColor="text-blue-400"
        />
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs text-slate-400 flex items-center gap-1"><Search size={12}/> 搜索 (IP / 别名 / VPS名)</label>
          <input 
            type="text" 
            placeholder="输入关键词..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="w-full md:w-auto space-y-1">
          <label className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={12}/> 开始日期</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="w-full md:w-auto space-y-1">
           <label className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={12}/> 结束日期</label>
           <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">日期</th>
                <th className="p-4 font-semibold">VPS 名称 / IP</th>
                <th className="p-4 font-semibold">Vertex 别名</th>
                <th className="p-4 font-semibold text-right text-green-400">上传 (GB)</th>
                <th className="p-4 font-semibold text-right text-blue-400">下载 (GB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-mono text-slate-300">{row.date}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{row.vpsName}</div>
                      <div className="text-xs text-slate-500 font-mono">{row.ip}</div>
                    </td>
                    <td className="p-4 text-slate-300">
                      {row.alias}
                    </td>
                    <td className="p-4 text-right font-mono font-medium text-green-400 bg-green-400/5">
                      {row.upload}
                    </td>
                    <td className="p-4 text-right font-mono font-medium text-blue-400 bg-blue-400/5">
                      {row.download}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    没有找到符合条件的数据记录
                  </td>
                </tr>
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot className="bg-slate-900/80 border-t border-slate-700 font-bold">
                 <tr>
                    <td colSpan={3} className="p-4 text-right text-slate-300">本页合计:</td>
                    <td className="p-4 text-right text-green-400">{totalUpload.toLocaleString()}</td>
                    <td className="p-4 text-right text-blue-400">{totalDownload.toLocaleString()}</td>
                 </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};