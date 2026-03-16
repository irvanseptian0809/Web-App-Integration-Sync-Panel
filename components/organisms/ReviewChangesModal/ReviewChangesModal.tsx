"use client"

import { useState } from "react"

import { Button } from "@/components/atoms/Button"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { SyncPreviewPanel } from "@/components/organisms/SyncPreviewPanel"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"

import { ReviewChangesModalProps } from "./interfaces"

export function ReviewChangesModal({ integration, isOpen, onClose }: ReviewChangesModalProps) {
  const pendingChanges = useIntegrationStore((state) => state.pendingChanges[integration.id]) || []
  const resolutions = useIntegrationStore((state) => state.resolutions[integration.id]) || {}
  const integrations = useIntegrationStore((state) => state.integrations)
  const currentIntegration = integrations.find((i) => i.id === integration.id)
  const setResolution = useIntegrationStore((state) => state.setResolution)
  const clearResolutions = useIntegrationStore((state) => state.clearResolutions)
  const bumpIntegrationVersion = useIntegrationStore((state) => state.bumpIntegrationVersion)
  const setIntegrationStatus = useIntegrationStore((state) => state.setIntegrationStatus)
  const recordResolution = useIntegrationStore((state) => state.recordResolution)

  const [showValidation, setShowValidation] = useState(false)

  const hasPendingChanges = pendingChanges.length > 0
  console.log("Pending changes:", pendingChanges)
  // Resolve check: every UNIQUE field name must have a resolution
  const uniqueFieldNames = Array.from(new Set(pendingChanges.map((c) => c.field_name)))

  const allResolved =
    hasPendingChanges && uniqueFieldNames.every((fn) => resolutions[fn] !== undefined)

  const handleConfirmMerge = () => {
    if (!allResolved) {
      setShowValidation(true)
      return
    }

    const previousVersion = currentIntegration?.version ?? integration.version
    const nextVersion = previousVersion + 1

    // Build per-field history records — only for accepted incoming
    const fields = uniqueFieldNames
      .map((fieldName) => {
        const choice = resolutions[fieldName] // 'local' | changeId
        const matchingChange = pendingChanges.find(
          (c) => c.field_name === fieldName && c.id === choice,
        )
        const localChange = pendingChanges.find((c) => c.field_name === fieldName)

        return {
          fieldName,
          previousValue: localChange?.current_value ?? null,
          resolvedValue: matchingChange?.new_value ?? null,
          choice,
        }
      })
      .filter((f) => f.choice !== "local") // skip kept-local fields

    // Only record if at least 1 incoming change was accepted
    if (fields.length > 0) {
      recordResolution({
        id: `res_${Date.now()}`,
        integrationId: integration.id,
        resolvedAt: new Date().toISOString(),
        previousVersion,
        resolvedVersion: nextVersion,
        fields,
      })
    }

    // Simulate successful merge process
    clearResolutions(integration.id)
    bumpIntegrationVersion(integration.id)
    setIntegrationStatus(integration.id, "synced")
    onClose()
  }

  const footer = (
    <div className="flex items-center gap-3 w-full justify-end">
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button
        onClick={handleConfirmMerge}
        variant={allResolved ? "default" : "outline"}
        className={
          allResolved ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""
        }
      >
        Confirm & Apply Merge
      </Button>
    </div>
  )

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        title={`Review Incoming Changes: ${integration.name}`}
        description="Review and resolve conflicts from the latest sync before they are merged."
        footer={footer}
      >
        <div className="mt-4 overflow-y-auto max-h-[60vh] -mx-6 px-6">
          <SyncPreviewPanel
            changes={pendingChanges}
            resolutions={resolutions}
            onResolveConflict={(change, choice) => {
              setResolution(integration.id, change.field_name, choice)
              if (showValidation) setShowValidation(false)
            }}
            showValidationErrors={showValidation}
          />
        </div>
      </ModalWrapper>
    </>
  )
}
