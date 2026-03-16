"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"
import { useUserStore } from "@/stores/users/usersStore"
import { useDoorStore } from "@/stores/doors/doorsStore"
import { useKeyStore } from "@/stores/keys/keysStore"
import { cn } from "@/utils/cn"

import { RemoveConfirmModalProps } from "./interfaces"

export function RemoveConfirmModal({
  integration,
  isOpen,
  onClose,
  onSuccess,
}: RemoveConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const removeIntegration = useIntegrationStore((state) => state.removeIntegration)
  const removeUsersByProvider = useUserStore((state) => state.removeUsersByProvider)
  const removeDoorsByProvider = useDoorStore((state) => state.removeDoorsByProvider)
  const removeKeysByProvider = useKeyStore((state) => state.removeKeysByProvider)

  const handleConfirm = () => {
    setIsDeleting(true)

    setTimeout(() => {
      removeUsersByProvider(integration.provider)
      removeDoorsByProvider(integration.provider)
      removeKeysByProvider(integration.provider)
      removeIntegration(integration.id)
      setIsDeleting(false)
      setConfirmText("")
      onClose()
      if (onSuccess) onSuccess()
    }, 600)
  }

  const isConfirmDisabled = confirmText !== integration.provider || isDeleting
  const isError = confirmText.length > 0 && confirmText !== integration.provider

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
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Removing...
          </>
        ) : (
          "Yes, Remove Integration"
        )}
      </Button>
    </div>
  )

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Integration"
      description="Are you sure you want to proceed?"
      footer={footer}
    >
      <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Warning: Destructive Action</p>
          <p className="opacity-90">
            Removing the <strong>{integration.name}</strong> ({integration.provider}) integration
            will permanently delete its local synchronization history and configuration. Any pending
            changes will be discarded.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          To confirm, type <strong>{integration.provider}</strong> in the box below
        </label>
        <Input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={integration.provider}
          className={cn(
            "w-full transition-colors",
            isError && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isDeleting}
        />
        {isError && (
          <p className="mt-1.5 text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
            Does not match the required provider ID.
          </p>
        )}
      </div>
    </ModalWrapper>
  )
}
