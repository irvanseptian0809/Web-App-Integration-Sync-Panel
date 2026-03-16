import type { Meta, StoryObj } from "@storybook/react"
import { DoorForm } from "./DoorForm"

const meta: Meta<typeof DoorForm> = {
  title: "Organisms/DoorForm",
  component: DoorForm,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof DoorForm>

export const CreateMode: Story = {
  args: {
    onSubmit: (data) => console.log("Create door", data),
    onCancel: () => console.log("Cancel"),
  },
}

export const EditMode: Story = {
  args: {
    initialData: {
      id: "d123",
      name: "Front Gate",
      location: "Main Lobby",
      device_id: "HW-XYZ-9",
      status: "online",
      battery_level: 80,
    },
    onSubmit: (data) => console.log("Update door", data),
    onCancel: () => console.log("Cancel"),
  },
}
