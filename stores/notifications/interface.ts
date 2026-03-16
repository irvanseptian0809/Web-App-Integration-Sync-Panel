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