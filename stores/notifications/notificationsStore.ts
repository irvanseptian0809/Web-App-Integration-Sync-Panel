import { create } from "zustand"

export type NotificationsType = "success" | "error" | "info" | "warning"

export interface NotificationsState {
  isOpen: boolean
  type: NotificationsType
  title: string
  message: string
  code?: string
  showNotification: (params: {
    type: NotificationsType
    title: string
    message: string
    code?: string
  }) => void
  hideNotification: () => void
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  isOpen: false,
  type: "info",
  title: "",
  message: "",
  code: undefined,
  showNotification: ({ type, title, message, code }) =>
    set({ isOpen: true, type, title, message, code }),
  hideNotification: () => set({ isOpen: false }),
}))
