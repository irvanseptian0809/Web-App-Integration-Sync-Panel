import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react"

import { Badge } from "@/components/atoms/Badge"

import { StatusIndicatorProps } from "./interfaces"

export function StatusIndicator({ status }: StatusIndicatorProps) {
  switch (status) {
    case "synced":
      return (
        <Badge variant="success" className="flex items-center gap-1.5 w-fit">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Synced</span>
        </Badge>
      )
    case "syncing":
      return (
        <Badge variant="outline" className="flex items-center gap-1.5 w-fit bg-slate-100">
          <Clock className="w-3.5 h-3.5 animate-spin text-slate-500" />
          <span className="text-slate-600">Syncing...</span>
        </Badge>
      )
    case "conflict":
      return (
        <Badge variant="warning" className="flex items-center gap-1.5 w-fit">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Review Needed</span>
        </Badge>
      )
    case "error":
      return (
        <Badge variant="destructive" className="flex items-center gap-1.5 w-fit">
          <XCircle className="w-3.5 h-3.5" />
          <span>Failed</span>
        </Badge>
      )
    default:
      return <Badge variant="default">Unknown</Badge>
  }
}
