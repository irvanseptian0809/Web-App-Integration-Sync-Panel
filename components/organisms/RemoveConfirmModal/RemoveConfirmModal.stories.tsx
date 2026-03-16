import type { Meta, StoryObj } from "@storybook/react"
import { RemoveConfirmModal } from "./RemoveConfirmModal"
import { Integration } from "@/interface/types"

const mockIntegration: Integration = {
  id: "1",
  name: "Salesforce CRM",
  provider: "salesforce",
  status: "synced",
  lastSyncTime: "2026-03-15T10:00:00Z",
  version: 1,
  logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
}

const meta: Meta<typeof RemoveConfirmModal> = {
  title: "Organisms/RemoveConfirmModal",
  component: RemoveConfirmModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof RemoveConfirmModal>

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    integration: mockIntegration,
  },
}
