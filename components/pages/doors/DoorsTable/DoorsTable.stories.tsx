import type { Meta, StoryObj } from "@storybook/react"
import { DoorsTable } from "./DoorsTable"
import { Door } from "@/interface/types"

const mockDoors: Door[] = [
  {
    id: "d1",
    name: "Front Gate",
    location: "External",
    device_id: "HW-001",
    status: "online",
    battery_level: 95,
    last_seen: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "d2",
    name: "Basement Access",
    location: "Level -1",
    device_id: "HW-002",
    status: "offline",
    battery_level: 15,
    last_seen: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
]

const meta: Meta<typeof DoorsTable> = {
  title: "Organisms/DoorsTable",
  component: DoorsTable,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof DoorsTable>

export const Default: Story = {
  args: {
    doors: mockDoors,
    onEdit: (door) => console.log("Edit door", door),
    onDelete: (id) => console.log("Delete door", id),
  },
}
