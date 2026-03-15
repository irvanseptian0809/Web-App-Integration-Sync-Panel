'use client';

import { useMutation } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback, useRef } from 'react';

import { Button } from '@/components/atoms/Button';
import { StatusIndicator } from '@/components/molecules/StatusIndicator';
import { RemoveConfirmModal } from '@/components/organisms/RemoveConfirmModal';
import { ReviewChangesModal } from '@/components/organisms/ReviewChangesModal';
import { Integration } from '@/modules/integrations/types';
import { syncApi } from '@/modules/sync/services/syncApi';
import { useSyncStore } from '@/modules/sync/store';
import { useNotificationStore } from '@/stores/notificationStore';
import { AlertCircle, RefreshCw, Trash2, CheckSquare } from 'lucide-react';
import { IntegrationsTableProps } from "./interfaces";

export function IntegrationsTable({ integrations }: IntegrationsTableProps) {
  const pendingChangesMap = useSyncStore((state) => state.pendingChanges);
  const setPendingChanges = useSyncStore((state) => state.setPendingChanges);
  const setIntegrationStatus = useSyncStore((state) => state.setIntegrationStatus);
  const showNotification = useNotificationStore((state) => state.showNotification);
  
  const [reviewModalOpenFor, setReviewModalOpenFor] = useState<Integration | null>(null);
  const [removeModalOpenFor, setRemoveModalOpenFor] = useState<Integration | null>(null);

  // ── Checkbox selection state ──────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Tracks how many integrations are running in the current bulk sync batch
  const bulkSyncCountRef = useRef<number>(0);

  const syncableIntegrations = integrations.filter(
    (i) => (i.status === 'synced' || i.status === 'error') && !pendingChangesMap[i.id]?.length
  );

  const allSyncableSelected =
    syncableIntegrations.length > 0 &&
    syncableIntegrations.every((i) => selectedIds.has(i.id));

  const toggleSelectAll = useCallback(() => {
    if (allSyncableSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(syncableIntegrations.map((i) => i.id)));
    }
  }, [allSyncableSelected, syncableIntegrations]);

  const toggleRow = useCallback((id: string, syncable: boolean) => {
    if (!syncable) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ── Single sync mutation ──────────────────────────────────────────────────
  const { mutate: handleSync, isPending: isSyncingProvider, variables: currentSyncing } = useMutation({
    mutationFn: async ({ integration }: { integration: Integration }) => {
      const resp = await syncApi.fetchSyncData(integration.provider);
      return { integration, changes: resp?.data?.sync_approval?.changes || [] };
    },
    onMutate: ({ integration }) => {
      setIntegrationStatus(integration.id, 'syncing');
    },
    onSuccess: ({ integration, changes }) => {
      if (changes.length > 0) {
        setPendingChanges(integration.id, changes);
        setIntegrationStatus(integration.id, 'conflict');
        // Only auto-open modal for single syncs, not bulk
        if (bulkSyncCountRef.current <= 1) {
          setReviewModalOpenFor(integration);
        }
      } else {
        setIntegrationStatus(integration.id, 'synced');
      }
      // Remove from selection once synced/resulted in conflict
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(integration.id); return n; });
    },
    onError: (err: any, { integration }) => {
      setIntegrationStatus(integration.id, 'error');
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(integration.id); return n; });
      showNotification({
        type: 'error',
        title: 'Sync Request Failed',
        message: err.message || 'Failed to fetch the latest sync data from the provider.',
        code: err.code || 'ERR_SYNC_FAIL'
      });
    }
  });

  // ── Bulk sync: fire one-by-one for each selected integration ─────────────
  const [bulkSyncQueue, setBulkSyncQueue] = useState<string[]>([]);
  const isBulkSyncing = bulkSyncQueue.length > 0;

  const handleBulkSync = useCallback(() => {
    const toSync = integrations.filter((i) => selectedIds.has(i.id));
    if (toSync.length === 0) return;
    // Record how many we're syncing so onSuccess knows if it's a bulk op
    bulkSyncCountRef.current = toSync.length;
    // Clear selection immediately
    setSelectedIds(new Set());
    // Fire them all — useMutation will queue/batch them
    toSync.forEach((integration) => handleSync({ integration }));
  }, [integrations, selectedIds, handleSync]);

  const selectedCount = selectedIds.size;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* ── Bulk action toolbar (appears when ≥1 row selected) ── */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-slate-200 bg-blue-50/60 animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span>{selectedCount} integration{selectedCount > 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
              className="text-slate-500 hover:text-slate-700"
            >
              Clear selection
            </Button>
            <Button
              size="sm"
              onClick={handleBulkSync}
              disabled={isSyncingProvider}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncingProvider ? 'animate-spin' : ''}`} />
              Sync {selectedCount} selected
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              {/* Select-All checkbox */}
              <th className="pl-6 pr-2 py-4 w-10">
                <input
                  type="checkbox"
                  checked={allSyncableSelected}
                  disabled={syncableIntegrations.length === 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Select all syncable integrations"
                />
              </th>
              <th className="px-4 py-4 font-medium">Integration</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Sync</th>
              <th className="px-6 py-4 font-medium">Version</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {integrations.map((integration) => {
              const isSyncable = (integration.status === 'synced' || integration.status === 'error') && !pendingChangesMap[integration.id]?.length;
              const isSelected = selectedIds.has(integration.id);
              const isSyncingThis = isSyncingProvider && currentSyncing?.integration.id === integration.id;

              return (
                <tr
                  key={integration.id}
                  onClick={() => toggleRow(integration.id, isSyncable)}
                  className={`transition-colors group ${
                    isSyncable ? 'cursor-pointer' : ''
                  } ${
                    isSelected ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Row checkbox */}
                  <td className="pl-6 pr-2 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isSyncable}
                      onChange={() => toggleRow(integration.id, isSyncable)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer focus:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <StatusIndicator status={pendingChangesMap[integration.id]?.length > 0 ? 'conflict' : integration.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {integration.lastSyncTime 
                      ? new Date(integration.lastSyncTime).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }) 
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    v{integration.version}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Active Sync Button */}
                      {isSyncable && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSync({ integration })}
                          disabled={isSyncingProvider}
                        >
                          {isSyncingThis ? (
                             <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                          ) : (
                             <><RefreshCw className="w-4 h-4 mr-2" /> Sync</>
                          )}
                        </Button>
                      )}

                      {/* Disabled Syncing Button */}
                      {integration.status === 'syncing' && (
                        <Button variant="outline" size="sm" disabled>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Syncing...
                        </Button>
                      )}

                      {/* Resolve Conflict Button */}
                      {(integration.status === 'conflict' || pendingChangesMap[integration.id]?.length > 0) && (
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 border-amber-500 text-white"
                          onClick={() => setReviewModalOpenFor(integration)}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Resolve Conflict
                        </Button>
                      )}

                      {/* Manage button */}
                      <Link href={`/integrations/${integration.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          Manage <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                      
                      {/* Remove Button */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setRemoveModalOpenFor(integration)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 ml-2"
                        title="Remove Integration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {integrations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No integrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
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
            // Clear the deleted integration from selection on close
            setSelectedIds((prev) => { const n = new Set(prev); n.delete(removeModalOpenFor.id); return n; });
            setRemoveModalOpenFor(null);
          }}
        />
      )}
    </div>
  );
}
