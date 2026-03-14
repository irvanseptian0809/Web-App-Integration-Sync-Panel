'use client';

import { useMutation } from '@tanstack/react-query';
import { RefreshCw, CheckCircle2, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { TypographyH3, TypographyMuted, TypographyP } from '@/components/atoms/Typography';
import { DataRow } from '@/components/molecules/DataRow';
import { StatusIndicator } from '@/components/molecules/StatusIndicator';
import { RemoveConfirmModal } from '@/components/organisms/RemoveConfirmModal';
import { SyncPreviewPanel } from '@/components/organisms/SyncPreviewPanel';
import { SyncDetailTemplate } from '@/components/templates/SyncDetailTemplate';
import { mockSyncHistory, mockLocalData } from '@/modules/integrations/mockData';
import { SyncChange, SyncEvent } from '@/modules/integrations/types';
import { syncApi } from '@/modules/sync/services/syncApi';
import { useSyncStore } from '@/modules/sync/store';
import { Database, Clock, CalendarSync, History } from 'lucide-react';



export default function IntegrationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const integrationId = rawId || '';

  const integrations = useSyncStore((state) => state.integrations);
  const integration = integrations.find((i) => i.id === integrationId);
  const history = mockSyncHistory[integrationId] || [];
  const localData = mockLocalData[integrationId] || [];

  const pendingChanges = useSyncStore((state) => state.pendingChanges[integrationId]) || [];
  const resolutions = useSyncStore((state) => state.resolutions[integrationId]) || {};
  
  const setPendingChanges = useSyncStore((state) => state.setPendingChanges);
  const setResolution = useSyncStore((state) => state.setResolution);
  const clearResolutions = useSyncStore((state) => state.clearResolutions);

  const [showValidation, setShowValidation] = useState(false);
  const [isSuccessMode, setIsSuccessMode] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const { mutate: handleSync, isPending, error } = useMutation({
    mutationFn: () => syncApi.fetchSyncData(integration?.provider || ''),
    onSuccess: (response) => {
      // Load changes from API into the Zustand store for preview & conflict resolution
      if (response?.data?.sync_approval?.changes) {
        setPendingChanges(integrationId, response.data.sync_approval.changes);
        setIsSuccessMode(false);
      }
    },
  });

  const handleConfirmMerge = () => {
    if (!allResolved) {
      setShowValidation(true);
      return;
    }
    // In a real app this would call an API like POST /api/v1/data/sync/confirm
    // For this test, we just simulate a successful merge process 
    clearResolutions(integrationId);
    setIsSuccessMode(true);
    
    // reset success mode after 3 seconds
    setTimeout(() => setIsSuccessMode(false), 3000);
  };

  if (!integration) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        Integration not found.
      </div>
    );
  }

  const hasPendingChanges = pendingChanges.length > 0;
  const allResolved = hasPendingChanges && pendingChanges.every(c => resolutions[c.field_name] !== undefined);

  const headerAction = (
    <div className="flex items-center gap-3">
      <Button 
        variant="outline"
        onClick={() => setIsRemoveModalOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent hover:border-red-200"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Remove
      </Button>
      
      <Button 
        onClick={() => handleSync()} 
        disabled={isPending || hasPendingChanges}
        className="shrink-0 bg-slate-900 border-slate-900 hover:bg-slate-800"
      >
        {isPending ? (
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4 mr-2" />
        )}
        Sync Now
      </Button>
    </div>
  );

  return (
    <SyncDetailTemplate integration={integration} action={headerAction}>
      
      {/* 3 Metric Grid Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <TypographyMuted className="flex items-center gap-2 mb-2"><Database className="w-4 h-4"/> Total Records</TypographyMuted>
          <div className="text-3xl font-bold text-slate-900">4,567</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <TypographyMuted className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4"/> Last Sync Duration</TypographyMuted>
          <div className="text-3xl font-bold text-slate-900">22s</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <TypographyMuted className="flex items-center gap-2 mb-2"><CalendarSync className="w-4 h-4"/> Last Synced</TypographyMuted>
          <div className="text-3xl font-bold text-slate-900">
             {integration.lastSyncTime ? new Date(integration.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) : '--:--'}
          </div>
          <TypographyMuted className="text-xs mt-1">
             {integration.lastSyncTime ? new Date(integration.lastSyncTime).toLocaleDateString() : 'Never'}
          </TypographyMuted>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Sync Summary & Local Data */}
        <div className="flex-1 space-y-8">

          {/* Figma Reference: Main Sync Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
             <TypographyH3 className="text-xl mb-6">Sync Summary</TypographyH3>
             
             <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 mb-8">
                <div className="flex justify-between items-center px-5 py-4 hover:bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-500">Integration Name</span>
                  <span className="text-sm font-semibold text-slate-900">{integration.name}</span>
                </div>
                <div className="flex justify-between items-center px-5 py-4 hover:bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-500">Current Status</span>
                  <StatusIndicator status={integration.status} />
                </div>
                <div className="flex justify-between items-center px-5 py-4 hover:bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-500">Current Version</span>
                  <span className="text-sm font-semibold text-slate-900">v{integration.version}</span>
                </div>
                <div className="flex justify-between items-center px-5 py-4 hover:bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-500">Last Sync</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {integration.lastSyncTime ? new Date(integration.lastSyncTime).toLocaleString() : 'Never'}
                  </span>
                </div>
             </div>

             {/* Mixed in user explicit request to render local data inside this summary segment */}
             <TypographyH3 className="text-lg mb-4">Current Local Data Snapshot</TypographyH3>
             <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
              {localData.length > 0 ? (
                localData.map((data: any, idx: number) => (
                  <DataRow key={idx} label={data.label} value={data.value} className="px-5 py-4 hover:bg-slate-50/50" />
                ))
              ) : (
                <div className="p-4 text-sm text-slate-500 text-center">No local data mapped.</div>
              )}
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             {error && (
              <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                Failed to trigger synchronization. Please check your connection or try again later.
              </div>
             )}
             {isSuccessMode && !hasPendingChanges && (
              <div className="p-4 mb-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5" />
                Synchronization and merge completed successfully!
              </div>
             )}

            {hasPendingChanges ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <SyncPreviewPanel
                   changes={pendingChanges}
                   resolutions={resolutions}
                   onResolveConflict={(change, choice) => {
                     setResolution(integrationId, change.field_name, choice);
                     if (showValidation) setShowValidation(false);
                   }}
                   showValidationErrors={showValidation}
                 />
                 
                 <div className="mt-4 flex items-center justify-end">
                   <Button 
                     size="lg" 
                     onClick={handleConfirmMerge}
                     disabled={!hasPendingChanges}
                     variant={allResolved ? 'default' : 'outline'}
                     className={allResolved ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                   >
                     {allResolved ? 'Confirm & Apply Merge' : 'Resolve all conflicts to Apply'}
                   </Button>
                 </div>
              </div>
             ) : (
                <div className="text-center py-6">
                   <TypographyMuted>There are no active conflicts to approve. Click "Sync Now" to fetch remote records.</TypographyMuted>
                </div>
             )}
          </div>
        </div>

        {/* Right Column: Historical Activity */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <TypographyH3 className="text-lg">Sync History</TypographyH3>
              <Button size="sm" variant="outline" className="hidden"><History className="w-4 h-4 mr-2" /> View Full</Button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {history.length > 0 ? history.map((event: SyncEvent) => (
                <div key={event.id} className="p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={event.status === 'SUCCESS' ? 'success' : event.status === 'CONFLICT' ? 'warning' : 'destructive'}>
                      {event.status}
                    </Badge>
                    <TypographyMuted className="text-xs">
                       {event.timestamp ? new Date(event.timestamp).toLocaleString() : ''}
                    </TypographyMuted>
                  </div>
                  <div>
                    <TypographyP className="!mt-2 font-medium text-slate-800 text-sm">
                      Version {event.version} updated
                    </TypographyP>
                    <TypographyMuted className="text-xs mt-0.5">
                      {event.changesCount} record(s) changed
                    </TypographyMuted>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center bg-slate-50/50">
                  <TypographyMuted>No past syncs detected.</TypographyMuted>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {integration && (
        <RemoveConfirmModal 
          integration={integration}
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          onSuccess={() => router.push('/')}
        />
      )}
    </SyncDetailTemplate>
  );
}
