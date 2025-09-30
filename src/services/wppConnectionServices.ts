// Services
import type { WppConnectStartSession } from '@/models/wppConnectModels/wppConnectModel'
import { useSnackbarStore } from '@/stores/SnackbarStore'
import http from './axios'

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
    },

    async logoutSession(): Promise<void> {
        try {
            const { data } = await http.post('/whatsapp/logout')
            useSnackbarStore().showSnackbar(data)
        } catch (error) {
            throw error
        }
    },
}
