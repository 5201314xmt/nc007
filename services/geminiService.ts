import { GoogleGenAI } from "@google/genai";
import { SystemLog } from "../types";

const API_KEY = process.env.API_KEY || ''; // In a real app, ensure this is set

export const analyzeSystemHealth = async (logs: SystemLog[]): Promise<string> => {
  if (!API_KEY) {
    return "API 密钥缺失。请配置环境变量。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Prepare log data for the model
    const logSummary = logs.slice(0, 50).map(l => `[${l.timestamp}] [${l.level}] ${l.source}: ${l.message}`).join('\n');
    
    const prompt = `
      你是一个 Netcup VPS 监控系统的管理员 AI 助手。
      分析以下最近的系统日志并提供简明的健康摘要。
      重点关注任何关键操作（如限速缓解）并建议是否需要人工干预。
      请用中文回答，保持在 100 字以内。

      日志:
      ${logSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "未生成分析结果。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "日志分析失败。请检查控制台了解详情。";
  }
};