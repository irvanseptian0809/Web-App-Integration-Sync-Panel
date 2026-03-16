import type { Meta, StoryObj } from "@storybook/react"
import { ResolutionHistoryTable } from "./ResolutionHistoryTable"
import { ResolutionHistoryEntry } from "@/interface/types"

const mockEntries: ResolutionHistoryEntry[] = [
  {
    id: "h1",
    integrationId: "1",
    resolvedAt: "2026-03-15T12:00:00Z",
    previousVersion: 1,
    resolvedVersion: 2,
    fields: [
      {
        fieldName: "email",
        previousValue: "alice@old.com",
        resolvedValue: "alice@new.com",
        choice: "remote",
      },
      {
        fieldName: "name",
        previousValue: "Alice Johnson",
        resolvedValue: "Alice Johnson",
        choice: "local",
      },
    ],
  },
  {
    id: "h2",
    integrationId: "1",
    resolvedAt: "2026-03-14T10:00:00Z",
    previousVersion: 0,
    resolvedVersion: 1,
    fields: [
      {
        fieldName: "avatar",
        previousValue: null,
        resolvedValue: "https://example.com/avatar.jpg",
        choice: "remote",
      },
    ],
  },
]

const meta: Meta<typeof ResolutionHistoryTable> = {
  title: "Organisms/ResolutionHistoryTable",
  component: ResolutionHistoryTable,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ResolutionHistoryTable>

export const Default: Story = {
  args: {
    entries: mockEntries,
  },
}

export const Empty: Story = {
  args: {
    entries: [],
  },
}
