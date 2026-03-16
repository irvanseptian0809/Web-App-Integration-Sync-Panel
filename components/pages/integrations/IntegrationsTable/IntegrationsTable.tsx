import Link from "next/link"
import React, { useCallback, useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { ChevronRight, AlertCircle, CheckSquare, RefreshCw, Trash2 } from "lucide-react"

import { Button } from "@/components/atoms/Button"
import { StatusIndicator } from "@/components/molecules/StatusIndicator"
import { RemoveConfirmModal } from "@/components/organisms/RemoveConfirmModal"
import { BulkRemoveConfirmModal } from "@/components/organisms/RemoveConfirmModal/BulkRemoveConfirmModal"
import { ReviewChangesModal } from "@/components/organisms/ReviewChangesModal"
import { Integration } from "@/interface/types"
import { syncApi } from "@/services/syncApi"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"
import { useNotificationsStore } from "@/stores/notifications/notificationsStore"
import { useUserStore } from "@/stores/users/usersStore"
import { useDoorStore } from "@/stores/doors/doorsStore"
import { useKeyStore } from "@/stores/keys/keysStore"
import { Column, DataTable } from "@/components/molecules/DataTable"

import { IntegrationsTableProps } from "./interfaces"

export function IntegrationsTable({ integrations }: IntegrationsTableProps) {
  const pendingChangesMap = useIntegrationStore((state) => state.pendingChanges)
  const setPendingChanges = useIntegrationStore((state) => state.setPendingChanges)
  const setIntegrationStatus = useIntegrationStore((state) => state.setIntegrationStatus)
  const removeIntegration = useIntegrationStore((state) => state.removeIntegration)
  const removeUsersByProvider = useUserStore((state) => state.removeUsersByProvider)
  const removeDoorsByProvider = useDoorStore((state) => state.removeDoorsByProvider)
  const removeKeysByProvider = useKeyStore((state) => state.removeKeysByProvider)
  const showNotification = useNotificationsStore((state) => state.showNotification)

  const [reviewModalOpenFor, setReviewModalOpenFor] = useState<Integration | null>(null)
  const [removeModalOpenFor, setRemoveModalOpenFor] = useState<Integration | null>(null)
  const [isBulkRemoveOpen, setIsBulkRemoveOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const bulkSyncCountRef = useRef<number>(0)

  const syncableIntegrations = integrations.filter(
    (i) => (i.status === "synced" || i.status === "error") && !pendingChangesMap[i.id]?.length,
  )

  const allSyncableSelected =
    syncableIntegrations.length > 0 && syncableIntegrations.every((i) => selectedIds.has(i.id))

  const toggleSelectAll = useCallback(() => {
    if (allSyncableSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(syncableIntegrations.map((i) => i.id)))
    }
  }, [allSyncableSelected, syncableIntegrations])

  const toggleRow = useCallback((id: string, syncable: boolean) => {
    if (!syncable) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const {
    mutate: handleSync,
    isPending: isSyncingProvider,
    variables: currentSyncing,
  } = useMutation({
    mutationFn: async ({ integration }: { integration: Integration }) => {
      const resp = await syncApi.fetchSyncData(integration.provider)
      return { integration, changes: resp?.data?.sync_approval?.changes || [] }
    },
    onMutate: ({ integration }) => {
      setIntegrationStatus(integration.id, "syncing")
    },
    onSuccess: ({ integration, changes }) => {
      if (changes.length > 0) {
        setPendingChanges(integration.id, changes)
        setIntegrationStatus(integration.id, "conflict")
        if (bulkSyncCountRef.current <= 1) {
          setReviewModalOpenFor(integration)
        }
      } else {
        setIntegrationStatus(integration.id, "synced")
      }
      setSelectedIds((prev) => {
        const n = new Set(prev)
        n.delete(integration.id)
        return n
      })
    },
    onError: (err: any, { integration }) => {
      setIntegrationStatus(integration.id, "error")
      setSelectedIds((prev) => {
        const n = new Set(prev)
        n.delete(integration.id)
        return n
      })
      showNotification({
        type: "error",
        title: "Sync Request Failed",
        message: err.message || "Failed to fetch the latest sync data from the provider.",
        code: err.code || "ERR_SYNC_FAIL",
      })
    },
  })

  const handleBulkSync = useCallback(() => {
    const toSync = integrations.filter((i) => selectedIds.has(i.id))
    if (toSync.length === 0) return
    bulkSyncCountRef.current = toSync.length
    setSelectedIds(new Set())
    toSync.forEach((integration) => handleSync({ integration }))
  }, [integrations, selectedIds, handleSync])

  const handleBulkRemove = useCallback(() => {
    setIsBulkRemoveOpen(true)
  }, [])

  const handleConfirmBulkRemove = useCallback(() => {
    const toRemove = integrations.filter((i) => selectedIds.has(i.id))
    if (toRemove.length === 0) {
      setIsBulkRemoveOpen(false)
      return
    }

    toRemove.forEach((integration) => {
      removeUsersByProvider(integration.provider)
      removeDoorsByProvider(integration.provider)
      removeKeysByProvider(integration.provider)
      removeIntegration(integration.id)
    })

    setSelectedIds(new Set())
    setIsBulkRemoveOpen(false)
    showNotification({
      type: "success",
      title: "Integrations Removed",
      message: `Successfully removed ${toRemove.length} integrations and their associated data.`,
    })
  }, [integrations, selectedIds, removeUsersByProvider, removeDoorsByProvider, removeKeysByProvider, removeIntegration, showNotification])

  const columns: Column<Integration>[] = [
    {
      header: (
        <input
          type="checkbox"
          checked={allSyncableSelected}
          disabled={syncableIntegrations.length === 0}
          onChange={toggleSelectAll}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Select all syncable integrations"
        />
      ),
      accessor: "select",
      headerClassName: "pl-6 pr-2 py-4 w-10",
      className: "pl-6 pr-2 py-4",
      render: (integration) => {
        const isSyncable = (integration.status === "synced" || integration.status === "error") && !pendingChangesMap[integration.id]?.length
        return (
          <input
            type="checkbox"
            checked={selectedIds.has(integration.id)}
            disabled={!isSyncable}
            onChange={() => toggleRow(integration.id, isSyncable)}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
          />
        )
      },
    },
    {
      header: "Integration",
      accessor: "name",
      className: "px-4 py-4",
      render: (integration) => (
        <div className="flex items-center gap-3">
          <img
            src={integration.logo}
            alt={`${integration.name} logo`}
            className="w-8 h-8 object-contain rounded-md bg-white p-1 border border-slate-100"
          />
          <div>
            <div className="font-semibold text-slate-900">{integration.name}</div>
            <div className="text-xs text-slate-500">{integration.provider}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (integration) => (
        <StatusIndicator
          status={pendingChangesMap[integration.id]?.length > 0 ? "conflict" : integration.status}
        />
      ),
    },
    {
      header: "Last Sync",
      accessor: "lastSyncTime",
      render: (integration) => (
        <span className="text-slate-600">
          {integration.lastSyncTime
            ? new Date(integration.lastSyncTime).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
            : "Never"}
        </span>
      ),
    },
    {
      header: "Version",
      accessor: "version",
      render: (integration) => <span className="text-slate-600">v{integration.version}</span>,
    },
    {
      header: "Action",
      accessor: "actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (integration) => {
        const isSyncable = (integration.status === "synced" || integration.status === "error") && !pendingChangesMap[integration.id]?.length
        const isSyncingThis = isSyncingProvider && currentSyncing?.integration.id === integration.id

        return (
          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            {isSyncable && (
              <Button variant="outline" size="sm" onClick={() => handleSync({ integration })} disabled={isSyncingProvider}>
                {isSyncingThis ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Syncing...</> : <><RefreshCw className="w-4 h-4 mr-2" /> Sync</>}
              </Button>
            )}
            {integration.status === "syncing" && (
              <Button variant="outline" size="sm" disabled>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Syncing...
              </Button>
            )}
            {(integration.status === "conflict" || pendingChangesMap[integration.id]?.length > 0) && (
              <Button variant="default" size="sm" className="bg-amber-500 hover:bg-amber-600 border-amber-500 text-white" onClick={() => setReviewModalOpenFor(integration)}>
                <AlertCircle className="w-4 h-4 mr-2" /> Resolve Conflict
              </Button>
            )}
            <Link href={`/integrations/${integration.id}`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                Manage <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setRemoveModalOpenFor(integration)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 ml-2" title="Remove Integration">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const selectedCount = selectedIds.size

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {selectedCount > 0 && (
        <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-slate-200 bg-blue-50/60 animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span>{selectedCount} integration{selectedCount > 1 ? "s" : ""} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} className="text-slate-500 hover:text-slate-700">Clear selection</Button>
            <Button size="sm" variant="destructive" onClick={handleBulkRemove} className="mr-2"><Trash2 className="w-4 h-4 mr-2" /> Remove {selectedCount}</Button>
            <Button size="sm" onClick={handleBulkSync} disabled={isSyncingProvider} className="bg-slate-900 hover:bg-slate-800 text-white"><RefreshCw className={`w-4 h-4 mr-2 ${isSyncingProvider ? "animate-spin" : ""}`} /> Sync {selectedCount} selected</Button>
          </div>
        </div>
      )}

      <DataTable
        data={integrations}
        columns={columns}
        onRowClick={(i) => {
          const isSyncable = (i.status === "synced" || i.status === "error") && !pendingChangesMap[i.id]?.length
          toggleRow(i.id, isSyncable)
        }}
        rowClassName={(i) => selectedIds.has(i.id) ? "bg-blue-50/40 hover:bg-blue-50/60" : ""}
        emptyMessage="No integrations found."
        tableClassName="w-full text-sm text-left"
        className="border-none shadow-none rounded-none"
      />

      {reviewModalOpenFor && (
        <ReviewChangesModal
          integration={reviewModalOpenFor}
          isOpen={!!reviewModalOpenFor}
          onClose={() => setReviewModalOpenFor(null)}
        />
      )}

      {removeModalOpenFor && (
        <RemoveConfirmModal
          integration={removeModalOpenFor}
          isOpen={!!removeModalOpenFor}
          onClose={() => {
            setSelectedIds((prev) => {
              const n = new Set(prev)
              n.delete(removeModalOpenFor.id)
              return n
            })
            setRemoveModalOpenFor(null)
          }}
        />
      )}

      {isBulkRemoveOpen && (
        <BulkRemoveConfirmModal
          integrations={integrations.filter((i) => selectedIds.has(i.id))}
          isOpen={isBulkRemoveOpen}
          onClose={() => setIsBulkRemoveOpen(false)}
          onConfirm={handleConfirmBulkRemove}
        />
      )}
    </div>
  )
}
