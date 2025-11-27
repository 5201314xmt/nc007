import React, { useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, Bell, Github, Command } from 'lucide-react';

export const Settings: React.FC = () => {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const togglePassword = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">配置管理</h1>
        <p className="text-slate-400">管理 Netcup 账号、API 凭证和自动化规则。</p>
      </div>

      {/* SCP Accounts */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-100">Netcup SCP 账号</h2>
          <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium">
            <Plus size={16} /> 添加账号
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-900/50 rounded-lg">
              <div className="md:col-span-5 space-y-1">
                <label className="text-xs text-slate-400">客户号 / 登录名</label>
                <input 
                  type="text" 
                  defaultValue={i === 1 ? "123456" : "987654"}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-6 space-y-1 relative">
                <label className="text-xs text-slate-400">API 密码</label>
                <div className="relative">
                  <input 
                    type={showPassword[`acc_${i}`] ? "text" : "password"}
                    defaultValue="super_secret_password"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none pr-10"
                  />
                  <button 
                    onClick={() => togglePassword(`acc_${i}`)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword[`acc_${i}`] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="md:col-span-1 flex justify-center pb-2">
                <button className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notification Settings (Telegram) */}
      <section className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex items-center gap-2">
          <Bell className="text-yellow-400" size={20} />
          <h2 className="text-lg font-semibold text-slate-100">通知设置 (Telegram)</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Bot Token</label>
            <input 
              type="text" 
              placeholder="123456789:ABCdef..." 
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500">从 @BotFather 获取的机器人令牌。</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Chat ID</label>
            <input 
              type="text" 
              placeholder="-100123456789"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500">接收通知的用户或群组 ID。</p>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 bg-slate-900/30 p-3 rounded">
            <input type="checkbox" id="notify-enabled" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600" defaultChecked />
            <label htmlFor="notify-enabled" className="text-sm text-slate-300 select-none">启用限速状态变更通知</label>
          </div>
        </div>
      </section>

      {/* Automation Rules */}
      <section className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">自动化逻辑</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">监控间隔 (秒)</label>
            <input 
              type="number" 
              defaultValue={300}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500">轮询 Netcup SCP 状态的频率。</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">限速处理策略</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none">
              <option value="pause">暂停种子 (推荐)</option>
              <option value="delete">删除种子</option>
              <option value="cap">限速至 100KB/s</option>
            </select>
            <p className="text-xs text-slate-500">检测到限速时执行的操作。</p>
          </div>
        </div>
      </section>

      {/* Integration Config */}
      <section className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">集成配置</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* QB */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wide">qBittorrent 全局默认设置</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-xs text-slate-400">默认用户名</label>
                 <input type="text" defaultValue="admin" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200" />
               </div>
               <div className="space-y-1">
                 <label className="text-xs text-slate-400">默认密码</label>
                 <input type="password" defaultValue="adminadmin" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200" />
               </div>
             </div>
          </div>

          <div className="border-t border-slate-700 pt-6 space-y-4">
             <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wide">Vertex 配置</h3>
             <div className="space-y-1">
                 <label className="text-xs text-slate-400">配置文件路径 (主机)</label>
                 <input type="text" defaultValue="/opt/vertex/config/config.json" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 font-mono" />
             </div>
          </div>
        </div>
      </section>

      {/* Deployment & About */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2">
          <Github className="text-slate-100" size={20} />
          <h2 className="text-lg font-semibold text-slate-100">关于与一键部署</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
             <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
               <Command size={14} /> 快速安装
             </h3>
             <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-green-400 border border-slate-700 select-all">
                git clone https://github.com/5201314xmt/ncqb.git<br/>
                cd ncqb<br/>
                npm install<br/>
                npm run build
             </div>
             <p className="text-xs text-slate-500">拉取源码并安装依赖后，即可开始构建。</p>
          </div>

          <div className="space-y-3">
             <h3 className="text-sm font-bold text-slate-300">自定义前端端口</h3>
             <p className="text-sm text-slate-400">
               默认情况下，应用运行在 3000 端口。您可以通过设置环境变量来修改端口。
             </p>
             <div className="bg-black/50 p-3 rounded-lg font-mono text-sm text-blue-300 border border-slate-700">
                # Linux / MacOS<br/>
                PORT=8080 npm start<br/>
                <br/>
                # Windows (CMD)<br/>
                set PORT=8080 && npm start
             </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold shadow-lg shadow-green-600/20 transition-all">
          <Save size={20} /> 保存配置
        </button>
      </div>
    </div>
  );
};