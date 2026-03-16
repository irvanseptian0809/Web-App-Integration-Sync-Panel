import type { Meta, StoryObj } from "@storybook/react"
import { UsersTable } from "./UsersTable"
import { User } from "@/interface/types"

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    role: "Admin",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 098 765 432",
    role: "Editor",
    status: "suspended",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const meta: Meta<typeof UsersTable> = {
  title: "Organisms/UsersTable",
  component: UsersTable,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof UsersTable>

export const Default: Story = {
  args: {
    users: mockUsers,
    onEdit: (user) => console.log("Edit user", user),
    onDelete: (id) => console.log("Delete user", id),
  },
}

export const Empty: Story = {
  args: {
    users: [],
    onEdit: () => {},
    onDelete: () => {},
  },
}
