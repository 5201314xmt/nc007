import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings as SettingsIcon, ScrollText, Server, BarChart2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
        isActive 
          ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-400' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Server className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Netcup 哨兵</h1>
        </div>

        <nav className="flex-1 px-4 py-6">
          <NavItem to="/" icon={LayoutDashboard} label="仪表盘" />
          <NavItem to="/traffic" icon={BarChart2} label="流量统计" />
          <NavItem to="/logs" icon={ScrollText} label="系统日志" />
          <NavItem to="/settings" icon={SettingsIcon} label="配置管理" />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 font-mono">v1.2.0-stable</p>
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                系统在线
              </p>
           </div>
        </div>
      </aside>

      {/* Mobile Header (Visible on small screens) */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 border-b border-slate-800 z-50 p-4 flex items-center justify-between">
         <span className="font-bold text-white">Netcup 哨兵</span>
         {/* Simple menu trigger placeholder */}
         <div className="w-8 h-8 bg-slate-800 rounded"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
};