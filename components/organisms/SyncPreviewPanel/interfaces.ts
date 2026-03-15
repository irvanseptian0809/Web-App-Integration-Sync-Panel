import { SyncChange } from "@/interface/types"

export interface SyncPreviewPanelProps {
  changes: SyncChange[]
  /** Called when user picks a resolution. choice is 'local' or the SyncChange id of the chosen remote entry */
  onResolveConflict?: (change: SyncChange, choice: "local" | string) => void
  /** Maps field_name -> 'local' | changeId */
  resolutions: Record<string, "local" | string>
  showValidationErrors?: boolean
}
