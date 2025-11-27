import React, { useState } from 'react';
import { Terminal, Search, Bot, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { mockLogs } from '../services/mockService';
import { analyzeSystemHealth } from '../services/geminiService';

export const Logs: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const filteredLogs = mockLogs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) || 
    log.source.toLowerCase().includes(filter.toLowerCase())
  );

  const getLogColor = (level: string) => {
    switch(level) {
      case 'ERROR': return 'text-red-400';
      case 'WARNING': return 'text-yellow-400';
      case 'SUCCESS': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const getLogIcon = (level: string) => {
    switch(level) {
      case 'ERROR': return <AlertTriangle size={14} />;
      case 'WARNING': return <AlertTriangle size={14} />;
      case 'SUCCESS': return <CheckCircle size={14} />;
      default: return <Info size={14} />;
    }
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzeSystemHealth(filteredLogs);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Terminal className="text-slate-400" />
            系统日志
          </h1>
          <p className="text-slate-400 text-sm">所有自动化操作的实时审计跟踪</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="搜索日志..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button 
            onClick={handleAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all disabled:opacity-50"
          >
            <Bot size={18} />
            {isAnalyzing ? '分析中...' : 'AI 洞察'}
          </button>
        </div>
      </div>

      {/* AI Analysis Result */}
      {analysisResult && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <Bot className="text-purple-400 mt-1" size={20} />
            <div>
              <h3 className="text-sm font-bold text-purple-200 mb-1">Gemini 分析</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{analysisResult}</p>
            </div>
          </div>
        </div>
      )}

      {/* Log Terminal */}
      <div className="flex-1 bg-black/40 rounded-xl border border-slate-700 backdrop-blur-sm overflow-hidden flex flex-col">
        <div className="bg-slate-800/50 p-2 border-b border-slate-700 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm scrollbar-hide">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 italic text-center py-8">未找到匹配的日志。</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded transition-colors group">
                <span className="text-slate-500 shrink-0 w-44">{new Date(log.timestamp).toLocaleString()}</span>
                <span className={`shrink-0 w-24 font-bold flex items-center gap-1.5 ${getLogColor(log.level)}`}>
                  {getLogIcon(log.level)}
                  {log.level}
                </span>
                <span className="shrink-0 w-20 text-slate-400">[{log.source}]</span>
                <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};