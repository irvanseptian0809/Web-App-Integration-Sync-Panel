import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "@/components/atoms/Badge"
import { DataRow } from "./DataRow"

const meta: Meta<typeof DataRow> = {
  title: "Molecules/DataRow",
  component: DataRow,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DataRow>

export const Default: Story = {
  args: {
    label: "Provider",
    value: "Salesforce",
  },
}

export const WithSubValue: Story = {
  args: {
    label: "Last Sync",
    value: "Mar 15, 2026, 11:00 AM",
    subValue: "Verified 2 minutes ago",
  },
}

export const WithNodeValue: Story = {
  render: () => (
    <DataRow
      label="Status"
      value={<Badge variant="success">Synced</Badge>}
    />
  ),
}

export const LongContent: Story = {
  args: {
    label: "API Endpoint",
    value: "https://api.salesforce.com/services/data/v60.0/sobjects/Account/describe",
    subValue: "Production endpoint",
  },
}
