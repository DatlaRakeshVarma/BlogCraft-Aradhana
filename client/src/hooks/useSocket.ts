import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { socketService } from '../services/socket';

export const useSocket = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  return {
    isConnected: socketService.isConnected(),
    joinPost: socketService.joinPost.bind(socketService),
    leavePost: socketService.leavePost.bind(socketService),
  };
};