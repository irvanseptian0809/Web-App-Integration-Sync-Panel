import { create } from "zustand"
import { persist } from "zustand/middleware"

import { Integration, ResolutionHistoryEntry, SyncChange } from "@/interface/types"

interface SyncState {
  activeIntegration: Integration | null
  setActiveIntegration: (integration: Integration | null) => void

  // Dynamic User Integrations
  integrations: Integration[]
  addIntegration: (integration: Integration) => void
  removeIntegration: (integrationId: string) => void
  bumpIntegrationVersion: (integrationId: string) => void
  setIntegrationStatus: (integrationId: string, status: Integration["status"]) => void

  // Conflict resolution state keyed by integrationId
  pendingChanges: Record<string, SyncChange[]>
  setPendingChanges: (integrationId: string, changes: SyncChange[]) => void

  // Record of resolved fields (key: integrationId -> field_name -> 'local' | changeId)
  resolutions: Record<string, Record<string, "local" | string>>
  setResolution: (integrationId: string, fieldName: string, choice: "local" | string) => void

  clearResolutions: (integrationId: string) => void

  // Conflict resolution history keyed by integrationId
  conflictHistory: Record<string, ResolutionHistoryEntry[]>
  recordResolution: (entry: ResolutionHistoryEntry) => void
}

export const useIntegrationStore = create<SyncState>()(
  persist(
    (set) => ({
      activeIntegration: null,
      setActiveIntegration: (integration) => set({ activeIntegration: integration }),

      integrations: [
        {
          id: "int_1",
          name: "Salesforce CRM",
          provider: "salesforce",
          status: "synced",
          lastSyncTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          version: 42,
          logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
        },
        {
          id: "int_2",
          name: "HubSpot Marketing",
          provider: "hubspot",
          status: "conflict",
          lastSyncTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          version: 18,
          logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/HubSpot_Logo.png",
        },
        {
          id: "int_3",
          name: "Slack Notifications",
          provider: "slack",
          status: "error",
          lastSyncTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          version: 7,
          logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
        },
        {
          id: "int_4",
          name: "Stripe Billing",
          provider: "stripe",
          status: "syncing",
          lastSyncTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          version: 112,
          logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
        },
      ],
      addIntegration: (integration) =>
        set((state) => ({ integrations: [...state.integrations, integration] })),
      removeIntegration: (integrationId) =>
        set((state) => ({
          integrations: state.integrations.filter((i) => i.id !== integrationId),
        })),
      bumpIntegrationVersion: (integrationId) =>
        set((state) => ({
          integrations: state.integrations.map((i) =>
            i.id === integrationId
              ? { ...i, version: i.version + 1, lastSyncTime: new Date().toISOString() }
              : i,
          ),
        })),
      setIntegrationStatus: (integrationId, status) =>
        set((state) => ({
          integrations: state.integrations.map((i) =>
            i.id === integrationId ? { ...i, status } : i,
          ),
        })),

      pendingChanges: {},
      setPendingChanges: (integrationId, changes) =>
        set((state) => ({
          pendingChanges: { ...state.pendingChanges, [integrationId]: changes },
          resolutions: { ...state.resolutions, [integrationId]: {} },
        })),

      resolutions: {},
      setResolution: (integrationId, fieldName, choice) =>
        set((state) => ({
          resolutions: {
            ...state.resolutions,
            [integrationId]: {
              ...(state.resolutions[integrationId] || {}),
              [fieldName]: choice,
            },
          },
        })),

      clearResolutions: (integrationId) =>
        set((state) => {
          const newResolutions = { ...state.resolutions }
          delete newResolutions[integrationId]

          const newPendingChanges = { ...state.pendingChanges }
          delete newPendingChanges[integrationId]

          return {
            resolutions: newResolutions,
            pendingChanges: newPendingChanges,
          }
        }),

      conflictHistory: {},
      recordResolution: (entry) =>
        set((state) => ({
          conflictHistory: {
            ...state.conflictHistory,
            [entry.integrationId]: [entry, ...(state.conflictHistory[entry.integrationId] || [])],
          },
        })),
    }),
    {
      name: "portier-sync-storage", // unique name for localStorage key
    },
  ),
)
