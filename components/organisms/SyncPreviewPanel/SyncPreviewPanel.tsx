import { Check } from "lucide-react"

import { Badge } from "@/components/atoms/Badge"
import { TypographyH3, TypographyMuted } from "@/components/atoms/Typography"
import { cn } from "@/utils/cn"

import { SyncPreviewPanelProps } from "./interfaces"

export function SyncPreviewPanel(props: SyncPreviewPanelProps) {
  const { changes, onResolveConflict, resolutions, showValidationErrors, getLocalValue } = props
  if (changes.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
        <TypographyMuted>No changes to preview.</TypographyMuted>
      </div>
    )
  }

  const conflicts = changes.filter((c) => {
    const localValue = getLocalValue(c)
    return c.new_value !== localValue && c.new_value !== null && c.new_value !== ""
  })

  const fieldCount = conflicts.length

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <TypographyH3 className="text-lg">Incoming Changes</TypographyH3>
          <TypographyMuted className="text-xs mt-1">
            Review exactly what will be updated during this sync.
          </TypographyMuted>
        </div>
        <Badge variant="outline">
          {fieldCount} field{fieldCount !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="divide-y divide-slate-100">
        {changes.map((change) => {
          const localValue = getLocalValue(change)

          // Show all conflicts (divergence from local)
          // Also show CREATE/ADD as they always represent a "change" compared to baseline sync
          // If update but local is missing, it's also a creation flow
          const isCreate = change.change_type === "CREATE" || (change.change_type as string) === "ADD" || (change.change_type === "UPDATE" && (localValue === "None" || localValue === null))

          const isConflict =
            isCreate ||
            change.change_type === "DELETE" ||
            (change.change_type === "UPDATE" && change.new_value !== localValue && change.new_value !== null && change.new_value !== "")

          if (!isConflict) return null

          const chosenId = resolutions[change.id]
          const isResolved = chosenId !== undefined

          // Customize labels based on change type
          const localLabel = isCreate ? "None (New Entity)" : (localValue ?? "None")
          const remoteLabel = change.change_type === "DELETE" ? "REMOVED" : (change.new_value || "None")

          return (
            <div key={change.id} className="p-6 hover:bg-slate-50/30 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {change.field_name}
                </span>
                <Badge
                  variant={
                    change.change_type === "DELETE" ? "destructive" :
                      isCreate ? "default" : "warning"
                  }
                  className="!text-[10px] uppercase"
                >
                  {change.change_type}
                </Badge>
                {isResolved && (
                  <Badge variant="success" className="!text-[10px] uppercase ml-auto">
                    Resolved
                  </Badge>
                )}
                {showValidationErrors && !isResolved && (
                  <span className="ml-auto text-xs text-red-500 font-medium">
                    Please select a resolution
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                {/* ── Keep Local option ── */}
                <button
                  type="button"
                  onClick={() => onResolveConflict && onResolveConflict(change, "local")}
                  disabled={!onResolveConflict}
                  className={cn(
                    "flex-1 min-w-[200px] text-left relative p-3 rounded-lg border-2 transition-all",
                    onResolveConflict
                      ? "hover:border-slate-300 hover:bg-slate-100/50 cursor-pointer"
                      : "cursor-default",
                    chosenId === "local"
                      ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-600"
                      : "border-transparent bg-slate-50",
                    showValidationErrors && !isResolved && "border-red-300 bg-red-50/30",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Keep Local {!isCreate ? `(${change.current_value})` : ""}
                    </div>
                    {chosenId === "local" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div
                    className={cn(
                      "font-medium break-all text-sm",
                      chosenId === "local"
                        ? "text-slate-900"
                        : "text-slate-500 line-through opacity-70",
                    )}
                  >
                    {localLabel}
                  </div>
                </button>

                {/* ── Remote option ── */}
                <button
                  type="button"
                  onClick={() => onResolveConflict && onResolveConflict(change, change.id)}
                  disabled={!onResolveConflict}
                  className={cn(
                    "flex-1 min-w-[200px] text-left relative p-3 rounded-lg border-2 transition-all",
                    onResolveConflict
                      ? "hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer"
                      : "cursor-default",
                    chosenId === change.id
                      ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-600"
                      : "border-transparent bg-slate-50",
                    showValidationErrors && !isResolved && "border-red-300 bg-red-50/30",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] text-blue-500 uppercase font-bold tracking-wider">
                      {change.change_type === "DELETE" ? "Accept Removal" : "Accept Incoming"}
                    </div>
                    {chosenId === change.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div
                    className={cn(
                      "font-medium break-all text-sm px-1.5 py-0.5 -ml-1.5 rounded",
                      chosenId === change.id
                        ? (change.change_type === "DELETE" ? "text-red-800 bg-red-100/50" : "text-blue-800 bg-blue-100/50")
                        : (change.change_type === "DELETE" ? "text-red-700" : "text-blue-700"),
                    )}
                  >
                    {remoteLabel}
                  </div>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
