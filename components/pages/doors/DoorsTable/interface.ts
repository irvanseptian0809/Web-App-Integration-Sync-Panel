import { Door } from "@/interface/types"

export interface DoorsTableProps {
  doors: Door[]
  onEdit: (door: Door) => void
  onDelete: (doorId: string) => void
  selectedIds?: Set<string>
  onToggleRow?: (id: string) => void
  onToggleAll?: () => void
}