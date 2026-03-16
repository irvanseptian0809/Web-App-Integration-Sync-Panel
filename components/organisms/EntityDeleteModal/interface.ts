export interface EntityDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  entityName: string
  entityType: string
  isDeleting?: boolean
}