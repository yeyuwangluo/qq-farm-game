import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

let socket: Socket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

export const connectSocket = (userId: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(WS_URL, {
    auth: {
      userId,
      token: localStorage.getItem('token'),
    },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('WebSocket disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('WebSocket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('WebSocket reconnection attempt:', attemptNumber);
  });

  socket.on('reconnect_failed', () => {
    console.error('WebSocket reconnection failed');
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

export const onNotification = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('notification', callback);
  }
};

export const offNotification = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.off('notification', callback);
  }
};

export const onCropReady = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('crop_ready', callback);
  }
};

export const offCropReady = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.off('crop_ready', callback);
  }
};

export const onAnimalProductReady = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('animal_product_ready', callback);
  }
};

export const offAnimalProductReady = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.off('animal_product_ready', callback);
  }
};

export const onFriendVisit = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('friend_visit', callback);
  }
};

export const offFriendVisit = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.off('friend_visit', callback);
  }
};

export const onCropStolen = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('crop_stolen', callback);
  }
};

export const offCropStolen = (callback: (data: any) => void): void => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.off('crop_stolen', callback);
  }
};