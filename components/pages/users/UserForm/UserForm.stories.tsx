import type { Meta, StoryObj } from "@storybook/react"
import { UserForm } from "./UserForm"

const meta: Meta<typeof UserForm> = {
  title: "Organisms/UserForm",
  component: UserForm,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof UserForm>

export const CreateMode: Story = {
  args: {
    onSubmit: (data) => console.log("Create user", data),
    onCancel: () => console.log("Cancel"),
  },
}

export const EditMode: Story = {
  args: {
    initialData: {
      id: "u123",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
    },
    onSubmit: (data) => console.log("Update user", data),
    onCancel: () => console.log("Cancel"),
  },
}
