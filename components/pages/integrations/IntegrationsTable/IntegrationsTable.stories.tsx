import type { Meta, StoryObj } from "@storybook/react"
import { IntegrationsTable } from "./IntegrationsTable"
import { Integration } from "@/interface/types"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Salesforce",
    provider: "salesforce",
    status: "synced",
    lastSyncTime: "2026-03-15T10:00:00Z",
    version: 1,
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
  },
  {
    id: "2",
    name: "Hubspot",
    provider: "hubspot",
    status: "conflict",
    lastSyncTime: "2026-03-15T11:00:00Z",
    version: 1,
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/HubSpot_Logo.svg",
  },
  {
    id: "3",
    name: "Slack",
    provider: "slack",
    status: "syncing",
    lastSyncTime: "2026-03-15T12:00:00Z",
    version: 1,
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
  },
]

const meta: Meta<typeof IntegrationsTable> = {
  title: "Organisms/IntegrationsTable",
  component: IntegrationsTable,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof IntegrationsTable>

export const Default: Story = {
  args: {
    integrations: mockIntegrations,
  },
}

export const Empty: Story = {
  args: {
    integrations: [],
  },
}
