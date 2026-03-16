import type { Meta, StoryObj } from "@storybook/react"
import { Notification } from "./Notification"

// We use a decorator to override the Zustand store for Storybook

const meta: Meta<typeof Notification> = {
  title: "Molecules/Notification",
  component: Notification,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      // Dynamically override the store state via the args
      return <Story />
    },
  ],
}

export default meta
type Story = StoryObj<typeof Notification>

// Each story mocks the store by intercepting zustand at module level in Storybook
// Since we can't easily mock zustand in Storybook without extra plugins, we
// render the component with a custom setup creating a real notification first.

// We use a wrapper component that initialises the store then renders Notification
function NotificationDemo({
  type,
  title,
  message,
  code,
}: {
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  code?: string
}) {
  const { showNotification, isOpen } = useNotificationStore()
  
  React.useEffect(() => {
    showNotification({ type, title, message, code })
  }, [type, title, message, code, showNotification])

  if (!isOpen) return <div className="p-8 text-slate-400 italic">Waiting for notification state...</div>
  
  return <Notification />
}

import { useNotificationStore } from "@/stores/notificationStore"

import React from "react"

export const Success: Story = {
  render: () => (
    <NotificationDemo
      type="success"
      title="Integration Synced"
      message="Salesforce data was merged successfully."
    />
  ),
}

export const Error: Story = {
  render: () => (
    <NotificationDemo
      type="error"
      title="Sync Failed"
      message="Could not connect to the integration provider."
      code="ERR_CONNECTION_REFUSED"
    />
  ),
}

export const Info: Story = {
  render: () => (
    <NotificationDemo
      type="info"
      title="Sync Scheduled"
      message="The next sync is scheduled for 2:00 PM."
    />
  ),
}

export const Warning: Story = {
  render: () => (
    <NotificationDemo
      type="warning"
      title="Conflict Detected"
      message="3 fields require manual resolution before merging."
    />
  ),
}
