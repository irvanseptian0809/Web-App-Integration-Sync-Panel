import { Key } from "@/interface/types"

export interface KeysTableProps {
  keysList: Key[]
  onEdit: (key: Key) => void
  onDelete: (keyId: string) => void
}