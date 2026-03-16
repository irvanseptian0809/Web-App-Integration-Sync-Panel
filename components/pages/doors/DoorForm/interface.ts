import { Door } from "@/interface/types"

export interface DoorFormProps {
  initialData?: Partial<Door>
  onSubmit: (data: Partial<Door>) => void
  onCancel: () => void
  isSubmitting?: boolean
}