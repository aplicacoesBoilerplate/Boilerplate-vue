// Services
import http from './axios'
import type { WppConnectStartSession } from '@/models/wppConnectModels/wppConnectModel'

export const wppConnectionServices = {
  async getStatusWppConnect(): Promise<boolean> {
    try {
      const { data } = await http.get('/whatsapp/status')
      return data
    } catch (error) {
      throw error
    }
  },

  async startSessionWppConnect(): Promise<WppConnectStartSession> {
    try {
      const { data } = await http.get('/whatsapp/qrcode')
      return data
    } catch (error) {
      throw error
    }
  }
}
