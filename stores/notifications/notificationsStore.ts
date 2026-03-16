import { create } from "zustand"
import { NotificationsState } from "./interface"

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
