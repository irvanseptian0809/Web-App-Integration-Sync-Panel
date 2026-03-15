import { ResolutionHistoryEntry } from "@/interface/types"

export interface ResolutionHistoryTableProps {
  entries: ResolutionHistoryEntry[]
  /** How many rows per page (default: 5) */
  pageSize?: number
}
