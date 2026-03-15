import { SyncChange } from "@/interface/types"

export interface ConflictResolutionModalProps {
  isOpen: boolean
  onClose: () => void
  change: SyncChange | null
  onResolve: (fieldName: string, choice: "local" | "remote") => void
  currentResolution?: "local" | "remote"
}
