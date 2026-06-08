/**
 * WebSocket React Hook
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  connectSocket,
  disconnectSocket,
  onNotification,
  offNotification,
  onCropReady,
  offCropReady,
  onAnimalProductReady,
  offAnimalProductReady,
  onFriendVisit,
  offFriendVisit,
  onCropStolen,
  offCropStolen,
} from '../services/socket';

interface UseWebSocketOptions {
  userId: string | number;
  onNotification?: (data: any) => void;
  onCropReady?: (data: any) => void;
  onAnimalProductReady?: (data: any) => void;
  onFriendVisit?: (data: any) => void;
  onCropStolen?: (data: any) => void;
  enabled?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const {
    userId,
    onNotification: handleNotification,
    onCropReady: handleCropReady,
    onAnimalProductReady: handleAnimalProductReady,
    onFriendVisit: handleFriendVisit,
    onCropStolen: handleCropStolen,
    enabled = true,
  } = options;

  const callbacksRef = useRef({
    onNotification: handleNotification,
    onCropReady: handleCropReady,
    onAnimalProductReady: handleAnimalProductReady,
    onFriendVisit: handleFriendVisit,
    onCropStolen: handleCropStolen,
  });

  useEffect(() => {
    callbacksRef.current = {
      onNotification: handleNotification,
      onCropReady: handleCropReady,
      onAnimalProductReady: handleAnimalProductReady,
      onFriendVisit: handleFriendVisit,
      onCropStolen: handleCropStolen,
    };
  }, [
    handleNotification,
    handleCropReady,
    handleAnimalProductReady,
    handleFriendVisit,
    handleCropStolen,
  ]);

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    const socket = connectSocket(String(userId));

    const notificationCallback = (data: any) => {
      callbacksRef.current.onNotification?.(data);
    };

    const cropReadyCallback = (data: any) => {
      callbacksRef.current.onCropReady?.(data);
    };

    const animalProductReadyCallback = (data: any) => {
      callbacksRef.current.onAnimalProductReady?.(data);
    };

    const friendVisitCallback = (data: any) => {
      callbacksRef.current.onFriendVisit?.(data);
    };

    const cropStolenCallback = (data: any) => {
      callbacksRef.current.onCropStolen?.(data);
    };

    onNotification(notificationCallback);
    onCropReady(cropReadyCallback);
    onAnimalProductReady(animalProductReadyCallback);
    onFriendVisit(friendVisitCallback);
    onCropStolen(cropStolenCallback);

    return () => {
      offNotification(notificationCallback);
      offCropReady(cropReadyCallback);
      offAnimalProductReady(animalProductReadyCallback);
      offFriendVisit(friendVisitCallback);
      offCropStolen(cropStolenCallback);
    };
  }, [userId, enabled]);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  return {
    disconnect,
    isConnected: () => {
      const socket = connectSocket(String(userId));
      return socket.connected;
    },
  };
};

export default useWebSocket;