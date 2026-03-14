import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationState {
  isOpen: boolean;
  type: NotificationType;
  title: string;
  message: string;
  code?: string;
  showNotification: (params: { type: NotificationType; title: string; message: string; code?: string }) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  type: 'info',
  title: '',
  message: '',
  code: undefined,
  showNotification: ({ type, title, message, code }) => 
    set({ isOpen: true, type, title, message, code }),
  hideNotification: () => 
    set({ isOpen: false }),
}));
