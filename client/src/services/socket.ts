import { io, Socket } from 'socket.io-client';
import { store } from '../store/store';
import {
  updatePostRealtime,
  addPostRealtime,
  removePostRealtime,
  updateLikeRealtime,
  addCommentRealtime,
  removeCommentRealtime,
} from '../store/slices/postSlice';
import { addNotification } from '../store/slices/uiSlice';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) return;

    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      upgrade: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
      store.dispatch(addNotification({
        type: 'success',
        message: 'Connected to real-time updates'
      }));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      store.dispatch(addNotification({
        type: 'warning',
        message: 'Disconnected from real-time updates'
      }));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        store.dispatch(addNotification({
          type: 'error',
          message: 'Failed to connect to real-time updates'
        }));
      }
    });

    // Post events
    this.socket.on('postCreated', (post) => {
      store.dispatch(addPostRealtime(post));
      store.dispatch(addNotification({
        type: 'info',
        message: `New post: "${post.title}" by ${post.author.name}`
      }));
    });

    this.socket.on('postUpdated', (post) => {
      store.dispatch(updatePostRealtime(post));
    });

    this.socket.on('postDeleted', ({ id }) => {
      store.dispatch(removePostRealtime(id));
    });

    this.socket.on('postLiked', (data) => {
      store.dispatch(updateLikeRealtime(data));
    });

    this.socket.on('commentAdded', (data) => {
      // Only process if it's not from the current user to avoid double counting
      const currentUser = store.getState().auth.user;
      if (currentUser && data.actionUserId !== currentUser._id) {
        store.dispatch(addCommentRealtime(data));
        store.dispatch(addNotification({
          type: 'info',
          message: `New comment by ${data.comment.user.name}`
        }));
      }
    });

    this.socket.on('commentDeleted', (data) => {
      // Only process if it's not from the current user to avoid double counting
      const currentUser = store.getState().auth.user;
      if (currentUser && data.actionUserId !== currentUser._id) {
        store.dispatch(removeCommentRealtime(data));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinPost(postId: string) {
    if (this.socket) {
      this.socket.emit('joinPost', postId);
    }
  }

  leavePost(postId: string) {
    if (this.socket) {
      this.socket.emit('leavePost', postId);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();