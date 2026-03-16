import type { Meta, StoryObj } from "@storybook/react"
import { KeysTable } from "./KeysTable"
import { Key } from "@/interface/types"

const mockKeys: Key[] = [
  {
    id: "k1-987-abc",
    user_id: "u1",
    door_id: "d1",
    key_type: "Physical",
    access_start: new Date().toISOString(),
    access_end: new Date(Date.now() + 86400000 * 365).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "k2-123-def",
    user_id: "u2",
    door_id: "d2",
    key_type: "Digital",
    access_start: new Date().toISOString(),
    access_end: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: "revoked",
    created_at: new Date().toISOString(),
  },
]

const meta: Meta<typeof KeysTable> = {
  title: "Organisms/KeysTable",
  component: KeysTable,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof KeysTable>

export const Default: Story = {
  args: {
    keysList: mockKeys,
    onEdit: (key) => console.log("Edit key", key),
    onDelete: (id) => console.log("Delete key", id),
  },
}
