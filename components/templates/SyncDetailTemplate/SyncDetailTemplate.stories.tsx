import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/atoms/Button"
import { SyncDetailTemplate } from "./SyncDetailTemplate"
import { Integration } from "@/interface/types"

const mockIntegration: Integration = {
  id: "1",
  name: "Salesforce",
  logo: "https://example.com/logo.png",
  status: "synced",
  version: 1,
  provider: "salesforce",
  lastSyncTime: new Date().toISOString(),
}

const meta: Meta<typeof SyncDetailTemplate> = {
  title: "Templates/SyncDetailTemplate",
  component: SyncDetailTemplate,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SyncDetailTemplate>

export const Default: Story = {
  args: {
    integration: mockIntegration,
    children: (
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Sync Configuration</h3>
        <p className="text-sm text-slate-600">Configure your data mapping here.</p>
      </div>
    ),
  },
}

export const WithAction: Story = {
  args: {
    integration: { ...mockIntegration, status: "conflict" },
    action: <Button size="sm">Resolve Conflicts</Button>,
    children: (
      <div className="grid gap-6">
        <div className="bg-white border rounded-lg p-6">Section 1</div>
        <div className="bg-white border rounded-lg p-6">Section 2</div>
      </div>
    ),
  },
}
