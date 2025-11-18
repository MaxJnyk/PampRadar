class WebSocketWorkerManager {
  private worker: Worker | null = null;
  private updateCallbacks: Set<(mint: string, data: any) => void> = new Set();
  private newTokenCallbacks: Set<(data: any) => void> = new Set();
  private newTokensBuffer: any[] = [];
  private flushTimer: any = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.worker = new Worker('/websocket.worker.js');

      this.worker.onmessage = (event) => {
        const { type, payload } = event.data;

        if (type === 'TOKEN_UPDATE') {
          this.updateCallbacks.forEach(cb => cb(payload.mint, payload.data));
        } else if (type === 'NEW_TOKEN') {
          this.newTokensBuffer.push(payload);
          
          if (!this.flushTimer) {
            this.flushTimer = setTimeout(() => {
              this.flushNewTokens();
            }, 50);
          }
        }
      };

      this.worker.onerror = () => {};

      setTimeout(() => {
        this.connect();
      }, 500);
    } catch (error) {}
  }

  private flushNewTokens() {
    if (this.newTokensBuffer.length > 0) {
      console.log(`[Manager] Flushing ${this.newTokensBuffer.length} new tokens`);
      const tokens = [...this.newTokensBuffer];
      this.newTokensBuffer = [];
      this.flushTimer = null;
      
      tokens.forEach(token => {
        this.newTokenCallbacks.forEach(cb => cb(token));
      });
    }
  }

  connect() {
    this.worker?.postMessage({ type: 'CONNECT' });
  }

  disconnect() {
    this.worker?.postMessage({ type: 'DISCONNECT' });
  }

  subscribe(
    onUpdate: (mint: string, data: any) => void,
    onNewToken: (data: any) => void
  ) {
    this.updateCallbacks.add(onUpdate);
    this.newTokenCallbacks.add(onNewToken);

    return () => {
      this.updateCallbacks.delete(onUpdate);
      this.newTokenCallbacks.delete(onNewToken);
    };
  }
}

export const websocketWorker = new WebSocketWorkerManager();
