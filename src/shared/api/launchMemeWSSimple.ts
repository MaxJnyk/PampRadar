// WebSocket for launch.meme using Centrifuge protocol
export type WebSocketCallback<T = any> = (data: T) => void;
export type UpdateCallback = (mint: string, data: any) => void;
export type NewTokenCallback = (data: any) => void;

class SimpleLaunchMemeWS {
  private ws: WebSocket | null = null;
  private updateCallbacks: UpdateCallback[] = [];
  private newTokenCallbacks: NewTokenCallback[] = [];
  private reconnectTimer: any = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      
      this.ws = new WebSocket('wss://launch.meme/connection/websocket');

      this.ws.onopen = () => {
        
        const connectMsg = {
          connect: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcm9udCIsImlhdCI6MTc1MTkwMzI5Mn0.4ANk5jn-BaOq9K3rfZnoW3D-vvSTPMN2CeDFElKN0HY',
            name: 'js'
          },
          id: 1
        };
        this.ws?.send(JSON.stringify(connectMsg));
        
        setTimeout(() => {
          const subscribeMsg1 = {
            subscribe: { channel: 'pumpfun-tokenUpdates' },
            id: 2
          };
          this.ws?.send(JSON.stringify(subscribeMsg1));
          
          const subscribeMsg2 = {
            subscribe: { channel: 'pumpfun-mintTokens' },
            id: 3
          };
          this.ws?.send(JSON.stringify(subscribeMsg2));
        }, 100);
      };

      this.ws.onmessage = (event) => {
        try {
          // Пропускаем пустые или невалидные сообщения
          if (!event.data || typeof event.data !== 'string') return;
          
          const data = JSON.parse(event.data);
          
          // ДЕТАЛЬНОЕ ЛОГИРОВАНИЕ ВСЕХ ДАННЫХ
          if (data.push) {
            const channel = data.push.channel;
            const tokenData = data.push.pub?.data;
            
            // Разделяем обработку по каналам
            if (channel === 'pumpfun-mintTokens') {
              // Новый токен
              this.newTokenCallbacks.forEach((cb: NewTokenCallback) => cb(tokenData));
            } else if (channel === 'pumpfun-tokenUpdates') {
              // Обновление существующего токена
              this.updateCallbacks.forEach((cb: UpdateCallback) => {
                if (tokenData?.token) {
                  cb(tokenData.token, tokenData);
                }
              });
            }
          }
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        this.reconnectTimer = setTimeout(() => this.connect(), 5000);
      };

    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }

  subscribeTokenUpdates(callback: UpdateCallback): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) this.updateCallbacks.splice(index, 1);
    };
  }

  subscribeNewTokens(callback: NewTokenCallback): () => void {
    this.newTokenCallbacks.push(callback);
    return () => {
      const index = this.newTokenCallbacks.indexOf(callback);
      if (index > -1) this.newTokenCallbacks.splice(index, 1);
    };
  }

  // Старый метод для обратной совместимости
  subscribeAllTrades(callback: WebSocketCallback): () => void {
    return this.subscribeTokenUpdates(callback);
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.updateCallbacks = [];
    this.newTokenCallbacks = [];
  }
}

export const launchMemeWS = new SimpleLaunchMemeWS();
