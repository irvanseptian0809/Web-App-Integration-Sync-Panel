import { Integration, ResolutionHistoryEntry, SyncChange } from "@/interface/types"

export interface IntegrationState {
  activeIntegration: Integration | null
  setActiveIntegration: (integration: Integration | null) => void
  integrations: Integration[]
  addIntegration: (integration: Integration) => void
  removeIntegration: (integrationId: string) => void
  bumpIntegrationVersion: (integrationId: string) => void
  setIntegrationStatus: (integrationId: string, status: Integration["status"]) => void
  pendingChanges: Record<string, SyncChange[]>
  setPendingChanges: (integrationId: string, changes: SyncChange[]) => void
  updatePendingChanges: (integrationId: string, localValue: string) => void
  resolutions: Record<string, Record<string, "local" | string>>
  setResolution: (integrationId: string, fieldName: string, choice: "local" | string) => void
  clearResolutions: (integrationId: string) => void
  conflictHistory: Record<string, ResolutionHistoryEntry[]>
  recordResolution: (entry: ResolutionHistoryEntry) => void
}