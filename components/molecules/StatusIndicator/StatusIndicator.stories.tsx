import type { Meta, StoryObj } from "@storybook/react"
import { StatusIndicator } from "./StatusIndicator"

const meta: Meta<typeof StatusIndicator> = {
  title: "Molecules/StatusIndicator",
  component: StatusIndicator,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["synced", "syncing", "conflict", "error"],
    },
  },
}

export default meta
type Story = StoryObj<typeof StatusIndicator>

export const Synced: Story = {
  args: { status: "synced" },
}

export const Syncing: Story = {
  args: { status: "syncing" },
}

export const Conflict: Story = {
  args: { status: "conflict" },
}

export const Error: Story = {
  args: { status: "error" },
}

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <StatusIndicator status="synced" />
      <StatusIndicator status="syncing" />
      <StatusIndicator status="conflict" />
      <StatusIndicator status="error" />
    </div>
  ),
}
