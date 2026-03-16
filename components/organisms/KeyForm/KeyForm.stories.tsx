import type { Meta, StoryObj } from "@storybook/react"
import { KeyForm } from "./KeyForm"

const meta: Meta<typeof KeyForm> = {
  title: "Organisms/KeyForm",
  component: KeyForm,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof KeyForm>

export const CreateMode: Story = {
  args: {
    onSubmit: (data) => console.log("Issue key", data),
    onCancel: () => console.log("Cancel"),
  },
}

export const EditMode: Story = {
  args: {
    initialData: {
      id: "k123",
      user_id: "u1",
      door_id: "d1",
      key_type: "Guest Pass",
      status: "active",
      access_start: "2026-03-16",
      access_end: "2026-03-17",
    },
    onSubmit: (data) => console.log("Update key", data),
    onCancel: () => console.log("Cancel"),
  },
}
