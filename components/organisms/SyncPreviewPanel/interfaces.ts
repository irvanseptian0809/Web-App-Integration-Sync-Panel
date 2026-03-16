import { SyncChange, User, Key } from "@/interface/types"

export interface SyncPreviewPanelProps {
  changes: SyncChange[]
  resolutions: Record<string, "local" | string>
  onResolveConflict?: (change: SyncChange, choice: "local" | string) => void
  showValidationErrors?: boolean
  getLocalValue: (change: SyncChange) => any
  integrationId: string
}
