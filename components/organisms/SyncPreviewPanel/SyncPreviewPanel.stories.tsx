import type { Meta, StoryObj } from "@storybook/react"
import { SyncPreviewPanel } from "./SyncPreviewPanel"
import { SyncChange } from "@/interface/types"

const mockChanges: SyncChange[] = [
  { id: "1", field_name: "email", change_type: "UPDATE", current_value: "old@example.com", new_value: "new@example.com" },
  { id: "2", field_name: "phone", change_type: "UPDATE", current_value: "+12345", new_value: "+54321" },
]

const meta: Meta<typeof SyncPreviewPanel> = {
  title: "Organisms/SyncPreviewPanel",
  component: SyncPreviewPanel,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SyncPreviewPanel>

export const Default: Story = {
  args: {
    changes: mockChanges,
    resolutions: {},
    onResolveConflict: (change, choice) => console.log(`Resolved ${change.field_name} as ${choice}`),
  },
}

export const PartiallyResolved: Story = {
  args: {
    changes: mockChanges,
    resolutions: { email: "1" },
    onResolveConflict: (change, choice) => console.log(`Resolved ${change.field_name} as ${choice}`),
  },
}

export const ValidationErrors: Story = {
  args: {
    changes: mockChanges,
    resolutions: {},
    showValidationErrors: true,
  },
}

export const Empty: Story = {
  args: {
    changes: [],
    resolutions: {},
  },
}
