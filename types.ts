export enum VpsStatus {
  HEALTHY = 'HEALTHY',
  THROTTLED = 'THROTTLED',
  UNKNOWN = 'UNKNOWN',
}

export enum QbStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PAUSED = 'PAUSED',
}

export interface NetcupAccount {
  id: string;
  loginName: string;
  vpsCount: number;
  status: 'active' | 'error';
}

export interface VertexDownloader {
  id: string;      // Changed to string (e.g., "0dac5b3c")
  alias: string;   // Changed to alias (e.g., "灵车小盘-4-volex4")
  enabled: boolean;
}

export interface TrafficHistory {
  date: string;
  upload: number;   // GB
  download: number; // GB
}

export interface QbInstance {
  url: string;
  status: QbStatus;
  activeTorrents: number;
  downloadSpeed: string; // e.g., "45.2 MB/s"
  uploadSpeed: string;   // e.g., "102.5 MB/s"
  dailyUpload: string;   // e.g., "1.5 TB"
  dailyDownload: string; // e.g., "50 GB"
  history: TrafficHistory[]; // Last 7 days history
}

export interface VpsEntity {
  id: string;
  accountId: string;
  name: string;
  ip: string;
  status: VpsStatus;
  lastChecked: string;
  qbInstance: QbInstance;
  vertexDownloader: VertexDownloader;
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
  timestamp: string;
  source: 'SCP' | 'QB' | 'VERTEX' | 'SYSTEM';
}

export interface AppConfig {
  checkInterval: number;
  qbDefaultUsername: string;
  vertexConfigPath: string;
  throttleAction: 'pause' | 'delete';
  telegramBotToken?: string;
  telegramChatId?: string;
}