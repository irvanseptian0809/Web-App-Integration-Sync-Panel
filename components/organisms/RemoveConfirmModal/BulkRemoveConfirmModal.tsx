"use client"

import { AlertTriangle, Loader2, Info } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { cn } from "@/utils/cn"

import { BulkRemoveConfirmModalProps } from "./interfaces"

export function BulkRemoveConfirmModal({
  integrations,
  isOpen,
  onClose,
  onConfirm,
}: BulkRemoveConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const handleConfirm = () => {
    setIsDeleting(true)

    setTimeout(() => {
      onConfirm()
      setIsDeleting(false)
      setConfirmText("")
    }, 600)
  }

  const isConfirmDisabled = confirmText !== "DELETE" || isDeleting
  const isError = confirmText.length > 0 && confirmText !== "DELETE"

  const footer = (
    <div className="flex items-center gap-3 w-full justify-end">
      <Button
        variant="ghost"
        type="button"
        onClick={() => {
          setConfirmText("")
          onClose()
        }}
        disabled={isDeleting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={isConfirmDisabled}
        className="bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500 disabled:bg-red-300 disabled:border-red-300 disabled:text-white"
      >
        {isDeleting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Removing {integrations.length}...
          </>
        ) : (
          `Yes, Remove ${integrations.length} Integrations`
        )}
      </Button>
    </div>
  )

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Remove Integrations"
      description={`You are about to remove ${integrations.length} integrations.`}
      footer={footer}
    >
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Warning: Destructive Action</p>
            <p className="opacity-90">
              Bulk removing these integrations will permanently delete all associated users, doors, and keys for each provider. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <Info className="w-3.5 h-3.5" />
            Integrations to be removed:
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
            {integrations.map((i) => (
              <div key={i.id} className="flex items-center gap-2 text-sm text-slate-700 bg-white p-2 rounded border border-slate-100 shadow-sm">
                <img src={i.logo} alt="" className="w-5 h-5 object-contain" />
                <span className="font-medium">{i.name}</span>
                <span className="text-xs text-slate-400">({i.provider})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            To confirm mass deletion, type <strong>DELETE</strong> in the box below
          </label>
          <Input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className={cn(
              "w-full transition-colors",
              isError && "border-red-500 focus-visible:ring-red-500",
            )}
            disabled={isDeleting}
          />
          {isError && (
            <p className="mt-1.5 text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
              Please type DELETE exactly to confirm.
            </p>
          )}
        </div>
      </div>
    </ModalWrapper>
  )
}
