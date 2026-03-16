import { Key } from "@/interface/types"

export interface KeyFormProps {
  initialData?: Partial<Key>
  onSubmit: (data: Partial<Key>) => void
  onCancel: () => void
  isSubmitting?: boolean
}