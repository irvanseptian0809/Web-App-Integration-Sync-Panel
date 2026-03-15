import { Integration } from "@/interface/types"

export interface ReviewChangesModalProps {
  integration: Integration
  isOpen: boolean
  onClose: () => void
}
