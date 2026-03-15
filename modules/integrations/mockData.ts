import { SyncEvent } from "../../interface/types"

// The base integrations are now actively maintained in the Zustand global store: @/modules/sync/store.ts

export const mockSyncHistory: Record<string, SyncEvent[]> = {
  int_2: [
    {
      id: "event_101",
      integrationId: "int_2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "CONFLICT",
      version: 18,
      changesCount: 2,
    },
    {
      id: "event_100",
      integrationId: "int_2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: "SUCCESS",
      version: 17,
      changesCount: 5,
    },
  ],
  int_1: [
    {
      id: "event_201",
      integrationId: "int_1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: "SUCCESS",
      version: 42,
      changesCount: 1,
    },
  ],
}

export const mockLocalData: Record<string, { label: string; value: string; subValue?: string }[]> =
  {
    int_1: [
      { label: "Local Accounts", value: "1,245 mapped records" },
      { label: "Local Contacts", value: "4,892 mapped records" },
      { label: "Local API Quota", value: "15,000 requests/day" },
    ],
    int_2: [
      { label: "Local Contacts", value: "3,421 mapped records" },
      { label: "Active Webhooks", value: "12 endpoints mapped" },
    ],
    int_3: [
      { label: "Workspace Channels", value: "4 active bindings" },
      { label: "Connected Users", value: "235 local users" },
    ],
    int_4: [
      { label: "Local Customers", value: "890 mapped records" },
      { label: "Active Subscriptions", value: "450 records" },
    ],
  }
