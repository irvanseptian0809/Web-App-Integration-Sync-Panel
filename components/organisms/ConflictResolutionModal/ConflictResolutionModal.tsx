import { Check } from "lucide-react"

import { Button } from "@/components/atoms/Button"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { cn } from "@/utils/cn"

import { ConflictResolutionModalProps } from "./interfaces"

export function ConflictResolutionModal({
  isOpen,
  onClose,
  change,
  onResolve,
  currentResolution,
}: ConflictResolutionModalProps) {
  if (!change) return null

  const handleResolve = (choice: "local" | "remote") => {
    onResolve(change.field_name, choice)
    onClose()
  }

  const footer = (
    <div className="flex items-center gap-3 w-full justify-end">
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
    </div>
  )

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Resolve Conflict"
      description={`Choose which value to keep for ${change.field_name}.`}
      footer={footer}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* Local Option */}
        <button
          onClick={() => handleResolve("local")}
          className={cn(
            "flex flex-col text-left p-5 rounded-xl border-2 transition-all hover:border-slate-300 hover:bg-slate-50 group",
            currentResolution === "local"
              ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-600"
              : "border-slate-100 bg-white",
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Keep Local
            </span>
            {currentResolution === "local" && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
          </div>
          <div className="text-2xl font-semibold text-slate-800 break-all">
            {change.current_value}
          </div>
          <div className="mt-4 text-xs text-slate-500 group-hover:text-slate-700">
            Retain your current system data.
          </div>
        </button>

        {/* Remote Option */}
        <button
          onClick={() => handleResolve("remote")}
          className={cn(
            "flex flex-col text-left p-5 rounded-xl border-2 transition-all hover:border-blue-300 hover:bg-blue-50/30 group",
            currentResolution === "remote"
              ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-600"
              : "border-slate-100 bg-white",
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
              Accept Incoming
            </span>
            {currentResolution === "remote" && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
          </div>
          <div className="text-2xl font-semibold text-blue-700 break-all">{change.new_value}</div>
          <div className="mt-4 text-xs text-slate-500 group-hover:text-slate-700">
            Overwrite with data from the remote provider.
          </div>
        </button>
      </div>
    </ModalWrapper>
  )
}
