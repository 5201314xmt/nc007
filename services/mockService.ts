import { VpsEntity, VpsStatus, QbStatus, SystemLog, NetcupAccount, TrafficHistory } from '../types';

// Generators for mock data
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to generate 30 days of mock traffic
const generateHistory = (): TrafficHistory[] => {
  const history: TrafficHistory[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    // Format: YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    history.push({
      date: dateStr,
      upload: Math.floor(Math.random() * 500) + 100, // 100-600 GB
      download: Math.floor(Math.random() * 100) + 20, // 20-120 GB
    });
  }
  return history;
};

export const mockAccounts: NetcupAccount[] = [
  { id: 'acc_1', loginName: 'netcup_主账号', vpsCount: 2, status: 'active' },
  { id: 'acc_2', loginName: 'netcup_备用', vpsCount: 1, status: 'active' },
];

export const mockVpsList: VpsEntity[] = [
  {
    id: 'vps_1',
    accountId: 'acc_1',
    name: 'RS 1000 G9',
    ip: '192.168.1.101',
    status: VpsStatus.HEALTHY,
    lastChecked: new Date().toISOString(),
    qbInstance: {
      url: '192.168.1.101:9090',
      status: QbStatus.ONLINE,
      activeTorrents: 45,
      downloadSpeed: '5.2 MB/s',
      uploadSpeed: '85.2 MB/s',
      dailyUpload: '1.2 TB',
      dailyDownload: '45 GB',
      history: generateHistory(),
    },
    vertexDownloader: {
      id: '0dac5b3c',
      alias: '灵车小盘-4-volex4',
      enabled: true,
    },
  },
  {
    id: 'vps_2',
    accountId: 'acc_1',
    name: 'RS 2000 G9',
    ip: '192.168.1.102',
    status: VpsStatus.THROTTLED,
    lastChecked: new Date(Date.now() - 300000).toISOString(),
    qbInstance: {
      url: '192.168.1.102:9090',
      status: QbStatus.PAUSED,
      activeTorrents: 120,
      downloadSpeed: '0 B/s',
      uploadSpeed: '0 B/s',
      dailyUpload: '850 GB',
      dailyDownload: '120 GB',
      history: generateHistory(),
    },
    vertexDownloader: {
      id: '1e2f3g4h',
      alias: 'RS2000-刷流专用',
      enabled: false,
    },
  },
  {
    id: 'vps_3',
    accountId: 'acc_2',
    name: 'VPS 500 G8',
    ip: '192.168.1.201',
    status: VpsStatus.HEALTHY,
    lastChecked: new Date().toISOString(),
    qbInstance: {
      url: '192.168.1.201:9090',
      status: QbStatus.ONLINE,
      activeTorrents: 12,
      downloadSpeed: '12.4 MB/s',
      uploadSpeed: '45.8 MB/s',
      dailyUpload: '450 GB',
      dailyDownload: '210 GB',
      history: generateHistory(),
    },
    vertexDownloader: {
      id: '9i8u7y6t',
      alias: 'VPS500-保种',
      enabled: true,
    },
  },
];

export const mockLogs: SystemLog[] = [
  {
    id: generateId(),
    level: 'INFO',
    message: '系统初始化完成。监控已启动。',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'SYSTEM',
  },
  {
    id: generateId(),
    level: 'WARNING',
    message: '检测到 VPS [192.168.1.102] 被限速。正在启动缓解措施。',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    source: 'SCP',
  },
  {
    id: generateId(),
    level: 'SUCCESS',
    message: '已暂停 [192.168.1.102] 上的 qBittorrent。',
    timestamp: new Date(Date.now() - 1799000).toISOString(),
    source: 'QB',
  },
  {
    id: generateId(),
    level: 'SUCCESS',
    message: '已禁用 Vertex 下载器 ID 1e2f3g4h (RS2000-刷流专用)。',
    timestamp: new Date(Date.now() - 1798000).toISOString(),
    source: 'VERTEX',
  },
];

export const getVpsStatusColor = (status: VpsStatus) => {
  switch (status) {
    case VpsStatus.HEALTHY:
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case VpsStatus.THROTTLED:
      return 'text-red-400 bg-red-400/10 border-red-400/20 animate-pulse';
    case VpsStatus.UNKNOWN:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};