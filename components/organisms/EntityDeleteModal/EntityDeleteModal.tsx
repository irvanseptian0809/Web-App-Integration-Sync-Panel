import React from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/atoms/Button"
import { TypographyP } from "@/components/atoms/Typography"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { EntityDeleteModalProps } from "./interface"

export function EntityDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  entityType,
  isDeleting,
}: EntityDeleteModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${entityType}`}
      description={`This action cannot be undone.`}
      className="max-w-md"
      footer={
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <TypographyP className="text-slate-600">
          Are you sure you want to delete <strong>{entityName}</strong>? This will permanently
          remove this {entityType.toLowerCase()} from the system.
        </TypographyP>
      </div>
    </ModalWrapper>
  )
}
