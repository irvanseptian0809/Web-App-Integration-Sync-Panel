"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/atoms/Button"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { SyncPreviewPanel } from "@/components/organisms/SyncPreviewPanel"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"
import { useUserStore } from "@/stores/users/usersStore"
import { useKeyStore } from "@/stores/keys/keysStore"
import { useDoorStore } from "@/stores/doors/doorsStore"
import { User, Key, Door } from "@/interface/types"

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

  const users = useUserStore((state) => state.users)
  const updateUser = useUserStore((state) => state.updateUser)
  const keys = useKeyStore((state) => state.keys)
  const updateKey = useKeyStore((state) => state.updateKey)

  const doors = useDoorStore((state) => state.doors)
  const updateDoor = useDoorStore((state) => state.updateDoor)

  const addUser = useUserStore((state) => state.addUser)
  const removeUser = useUserStore((state) => state.removeUser)
  const addKey = useKeyStore((state) => state.addKey)
  const removeKey = useKeyStore((state) => state.removeKey)
  const addDoor = useDoorStore((state) => state.addDoor)
  const removeDoor = useDoorStore((state) => state.removeDoor)

  const [showValidation, setShowValidation] = useState(false)

  // Helper to find local entity for a specific change
  const findLocalEntity = (change: any) => {
    const [entityType, field] = change.field_name.split(".")
    const provider = integration.provider

    if (entityType === "user") {
      return users.find((u) => u.provider === provider && (u as any)[field] === change.current_value)
    }
    if (entityType === "key") {
      return keys.find((k) => k.provider === provider && (k as any)[field] === change.current_value)
    }
    if (entityType === "door") {
      return doors.find((d) => d.provider === provider && (d as any)[field] === change.current_value)
    }
    return null
  }

  const hasPendingChanges = pendingChanges.length > 0

  // Resolve check: Only changes that ACTUALLY differ from current store state need resolution
  const conflictChanges = pendingChanges.filter((c) => {
    if (c.change_type === "CREATE" || (c.change_type as string) === "ADD") return true // Adding always needs review
    if (c.change_type === "DELETE") return true // Deleting always needs review

    const localEntity = findLocalEntity(c)
    const [_, field] = c.field_name.split(".")
    const localValue = localEntity ? (localEntity as any)[field] : "None"

    return c.new_value !== localValue && c.new_value !== null && c.new_value !== ""
  })

  const conflictIds = conflictChanges.map((c) => c.id)

  const allResolved =
    !hasPendingChanges || conflictIds.every((id) => resolutions[id] !== undefined)

  const handleConfirmMerge = () => {
    if (conflictIds.length > 0 && !allResolved) {
      setShowValidation(true)
      return
    }

    const previousVersion = currentIntegration?.version ?? integration.version
    const nextVersion = previousVersion + 1

    const fieldHistory: any[] = []

    // Process each change individually for precise updates
    // For ADD, we need to group contiguous changes for the same entity
    // We'll track "pending additions" objects
    let pendingUser: any = null
    let pendingKey: any = null
    let pendingDoor: any = null

    pendingChanges.forEach((change) => {
      const choice = resolutions[change.id]
      const localEntity = findLocalEntity(change)
      const [entityType, field] = change.field_name.split(".")
      const isConflict = conflictIds.includes(change.id)
      const shouldApply = choice === change.id || (!isConflict && (change.change_type === "UPDATE" || change.change_type === "CREATE"))

      if (!shouldApply) return

      // --- HANDLE DELETE ---
      if (change.change_type === "DELETE" && localEntity && localEntity.id) {
        if (entityType === "user") removeUser(localEntity.id)
        if (entityType === "key") removeKey(localEntity.id)
        if (entityType === "door") removeDoor(localEntity.id)

        fieldHistory.push({
          fieldName: change.field_name,
          previousValue: (localEntity as any)[field] ?? null,
          resolvedValue: "REMOVED",
          choice,
        })
        return
      }

      // --- HANDLE ADD/CREATE ---
      if (change.change_type === "CREATE" || (change.change_type as string) === "ADD") {
        const newValue = change.new_value || change.current_value

        if (entityType === "user") {
          // If field already exists in pendingUser, it means we've started a new user record
          if (pendingUser && (field === "id" || pendingUser[field] !== undefined)) {
            addUser(pendingUser)
            pendingUser = null
          }
          if (!pendingUser) {
            pendingUser = {
              id: field === "id" ? newValue : uuidv4(),
              provider: integration.provider,
              status: "suspended",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
          pendingUser[field] = newValue
        }
        if (entityType === "key") {
          if (pendingKey && (field === "id" || pendingKey[field] !== undefined)) {
            addKey(pendingKey)
            pendingKey = null
          }
          if (!pendingKey) {
            pendingKey = {
              id: field === "id" ? newValue : uuidv4(),
              provider: integration.provider,
              status: "revoked",
              created_at: new Date().toISOString()
            }
          }
          pendingKey[field] = newValue
        }
        if (entityType === "door") {
          if (pendingDoor && (field === "id" || pendingDoor[field] !== undefined)) {
            addDoor(pendingDoor)
            pendingDoor = null
          }
          if (!pendingDoor) {
            pendingDoor = {
              id: field === "id" ? newValue : uuidv4(),
              provider: integration.provider,
              status: "offline",
              created_at: new Date().toISOString()
            }
          }
          pendingDoor[field] = newValue
        }

        if (isConflict) {
          fieldHistory.push({
            fieldName: change.field_name,
            previousValue: "None (New Entity)",
            resolvedValue: newValue,
            choice,
          })
        }
        return
      }

      // --- HANDLE UPDATE ---
      if (shouldApply && localEntity) {
        const newValue = change.new_value ?? null

        if (isConflict) {
          fieldHistory.push({
            fieldName: change.field_name,
            previousValue: (localEntity as any)[field] ?? null,
            resolvedValue: newValue,
            choice,
          })
        }

        const updatedEntity = { ...localEntity, [field]: newValue }
        if (entityType === "user") updateUser(updatedEntity as User)
        if (entityType === "key") updateKey(updatedEntity as Key)
        if (entityType === "door") updateDoor(updatedEntity as any)
      }
    })

    // Flush any remaining pending additions
    if (pendingUser) addUser(pendingUser)
    if (pendingKey) addKey(pendingKey)
    if (pendingDoor) addDoor(pendingDoor)

    // Only record resolution history if changes were merged
    if (fieldHistory.length > 0) {
      recordResolution({
        id: `res_${Date.now()}`,
        integrationId: integration.id,
        resolvedAt: new Date().toISOString(),
        previousVersion,
        resolvedVersion: nextVersion,
        fields: fieldHistory,
      })
    }

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
              setResolution(integration.id, change.id, choice)
              if (showValidation) setShowValidation(false)
            }}
            showValidationErrors={showValidation}
            getLocalValue={(c) => {
              const local = findLocalEntity(c)
              const [_, field] = c.field_name.split(".")
              return local ? (local as any)[field] : "None"
            }}
          />
        </div>
      </ModalWrapper>
    </>
  )
}
