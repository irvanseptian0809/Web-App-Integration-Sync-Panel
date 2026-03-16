import type { Meta, StoryObj } from "@storybook/react"
import { ConflictResolutionModal } from "./ConflictResolutionModal"
import { SyncChange } from "@/interface/types"

const sampleChange: SyncChange = {
  id: "chg_1",
  field_name: "email",
  change_type: "UPDATE",
  current_value: "alice@old.com",
  new_value: "alice@new.com",
}

const meta: Meta<typeof ConflictResolutionModal> = {
  title: "Organisms/ConflictResolutionModal",
  component: ConflictResolutionModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ConflictResolutionModal>

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    change: sampleChange,
    onResolve: () => {},
  },
}

export const LocalSelected: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    change: sampleChange,
    onResolve: () => {},
    currentResolution: "local",
  },
}

export const RemoteSelected: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    change: sampleChange,
    onResolve: () => {},
    currentResolution: "remote",
  },
}
