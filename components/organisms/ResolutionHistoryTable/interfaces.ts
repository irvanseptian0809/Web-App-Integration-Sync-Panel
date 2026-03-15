import { ResolutionHistoryEntry } from "@/modules/integrations/types";

export interface ResolutionHistoryTableProps {
  entries: ResolutionHistoryEntry[];
  /** How many rows per page (default: 5) */
  pageSize?: number;
}
