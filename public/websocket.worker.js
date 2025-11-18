let ws = null;
let reconnectTimeout = null;
let heartbeatInterval = null;

const WS_URL = 'wss://launch.meme/connection/websocket';
const RECONNECT_DELAY = 3000;
const HEARTBEAT_INTERVAL = 30000;

function connect() {
  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      self.postMessage({ type: 'CONNECTED' });
      
      const connectMsg = {
        connect: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcm9udCIsImlhdCI6MTc1MTkwMzI5Mn0.4ANk5jn-BaOq9K3rfZnoW3D-vvSTPMN2CeDFElKN0HY',
          name: 'js'
        },
        id: 1
      };
      ws.send(JSON.stringify(connectMsg));
      
      setTimeout(() => {
        ws.send(JSON.stringify({ subscribe: { channel: 'pumpfun-tokenUpdates' }, id: 2 }));
        ws.send(JSON.stringify({ subscribe: { channel: 'pumpfun-mintTokens' }, id: 3 }));
      }, 100);
      
      startHeartbeat();
    };

    ws.onmessage = (event) => {
      try {
        if (!event.data || typeof event.data !== 'string') return;
        
        const messages = event.data.trim().split('\n').filter(Boolean);
        
        messages.forEach(msg => {
          try {
            const data = JSON.parse(msg);
            
            if (data.push) {
              const channel = data.push.channel;
              const tokenData = data.push.pub?.data;
              
              if (channel === 'pumpfun-mintTokens') {
                self.postMessage({ type: 'NEW_TOKEN', payload: tokenData });
              } else if (channel === 'pumpfun-tokenUpdates') {
                if (tokenData?.token) {
                  self.postMessage({ 
                    type: 'TOKEN_UPDATE', 
                    payload: { mint: tokenData.token, data: tokenData }
                  });
                }
              }
            }
          } catch (e) {}
        });
      } catch (error) {}
    };

    ws.onerror = (error) => {
      self.postMessage({ type: 'ERROR', payload: { message: 'WebSocket error' } });
    };

    ws.onclose = () => {
      self.postMessage({ type: 'DISCONNECTED' });
      stopHeartbeat();
      
      reconnectTimeout = setTimeout(() => {
        connect();
      }, RECONNECT_DELAY);
    };
  } catch (error) {
    self.postMessage({ type: 'ERROR', payload: { message: 'Failed to connect' } });
  }
}

function disconnect() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  stopHeartbeat();
  if (ws) {
    ws.close();
    ws = null;
  }
}

function startHeartbeat() {
  heartbeatInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

self.onmessage = (event) => {
  const { type } = event.data;
  
  switch (type) {
    case 'CONNECT':
      connect();
      break;
    case 'DISCONNECT':
      disconnect();
      break;
  }
};
