import { Integration } from "@/interface/types"

export interface RemoveConfirmModalProps {
  integration: Integration
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export interface BulkRemoveConfirmModalProps {
  integrations: Integration[]
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}
