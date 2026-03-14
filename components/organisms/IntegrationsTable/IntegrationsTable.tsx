'use client';

import { useMutation } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { StatusIndicator } from '@/components/molecules/StatusIndicator';
import { RemoveConfirmModal } from '@/components/organisms/RemoveConfirmModal';
import { ReviewChangesModal } from '@/components/organisms/ReviewChangesModal';
import { Integration } from '@/modules/integrations/types';
import { syncApi } from '@/modules/sync/services/syncApi';
import { useSyncStore } from '@/modules/sync/store';
import { useNotificationStore } from '@/stores/notificationStore';
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { IntegrationsTableProps } from "./interfaces";

export function IntegrationsTable({ integrations }: IntegrationsTableProps) {
  const pendingChangesMap = useSyncStore((state) => state.pendingChanges);
  const setPendingChanges = useSyncStore((state) => state.setPendingChanges);
  const showNotification = useNotificationStore((state) => state.showNotification);
  
  const [reviewModalOpenFor, setReviewModalOpenFor] = useState<Integration | null>(null);
  const [removeModalOpenFor, setRemoveModalOpenFor] = useState<Integration | null>(null);

  const { mutate: handleSync, isPending: isSyncingProvider, variables: currentSyncing } = useMutation({
    mutationFn: async ({ id, provider }: { id: string; provider: string }) => {
      const resp = await syncApi.fetchSyncData(provider);
      return { id, changes: resp?.data?.sync_approval?.changes || [] };
    },
    onSuccess: ({ id, changes }) => {
      if (changes.length > 0) {
        setPendingChanges(id, changes);
      }
    },
    onError: (err: any) => {
      showNotification({
        type: 'error',
        title: 'Sync Request Failed',
        message: err.message || 'Failed to fetch the latest sync data from the provider.',
        code: err.code || 'ERR_SYNC_FAIL'
      });
    }
  });

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Integration</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Sync</th>
              <th className="px-6 py-4 font-medium">Version</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {integrations.map((integration) => (
              <tr key={integration.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
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
                  <div className="flex items-center justify-end gap-2">
                    {/* Active Sync Button - For synced or error statuses */}
                    {(integration.status === 'synced' || integration.status === 'error') && !pendingChangesMap[integration.id]?.length && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSync({ id: integration.id, provider: integration.provider })}
                        disabled={isSyncingProvider}
                      >
                        {(isSyncingProvider && currentSyncing?.id === integration.id) ? (
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

                    {/* Always visible Manage button */}
                    <Link href={`/integrations/${integration.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        Manage <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    
                    {/* Remove Integration Button */}
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
            ))}
            {integrations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
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
          onClose={() => setRemoveModalOpenFor(null)} 
        />
      )}
    </div>
  );
}
