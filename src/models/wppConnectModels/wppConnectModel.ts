// Modelo para receber a resposta da API ao dar start em uma sessão
export interface WppConnectStartSession {
  status: string;
  qrcode: string;
  urlcode: string;
  version: string;
}
