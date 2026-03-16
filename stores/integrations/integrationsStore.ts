import { create } from "zustand"
import { persist } from "zustand/middleware"

import { IntegrationState } from "./interface"

export const useIntegrationStore = create<IntegrationState>()(
  persist(
    (set) => ({
      activeIntegration: null,
      setActiveIntegration: (integration) => set({ activeIntegration: integration }),

      integrations: [],
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
