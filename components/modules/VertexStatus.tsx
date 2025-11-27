import React from 'react';
import { Power } from 'lucide-react';
import { VertexDownloader } from '../../types';

interface VertexStatusProps {
  downloader: VertexDownloader;
  onToggle: () => void;
}

export const VertexStatus: React.FC<VertexStatusProps> = ({ downloader, onToggle }) => {
  return (
    <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/50">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Vertex Downloader</span>
          <span className="text-sm text-slate-200 font-medium truncate max-w-[150px]" title={downloader.alias}>
            {downloader.alias}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">ID: {downloader.id}</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          downloader.enabled 
            ? 'text-green-400 bg-green-400/10 border-green-400/20' 
            : 'text-red-400 bg-red-400/10 border-red-400/20'
        }`}>
          {downloader.enabled ? '已启用' : '已禁用'}
        </div>
      </div>
      
      <button 
        onClick={onToggle}
        className={`w-full flex justify-center items-center gap-2 py-1.5 rounded text-xs font-medium transition-colors ${
          downloader.enabled 
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
            : 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
        }`}
      >
        <Power size={14} />
        {downloader.enabled ? '强制禁用' : '启用下载器'}
      </button>
    </div>
  );
};