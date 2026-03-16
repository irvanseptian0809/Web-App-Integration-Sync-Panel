import type { Meta, StoryObj } from "@storybook/react"
import { DashboardLayout } from "./DashboardLayout"

const meta: Meta<typeof DashboardLayout> = {
  title: "Layouts/DashboardLayout",
  component: DashboardLayout,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DashboardLayout>

export const Default: Story = {
  args: {
    children: (
      <div className="p-8 bg-white border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
        <p>This is where the main application content goes.</p>
      </div>
    ),
  },
}
