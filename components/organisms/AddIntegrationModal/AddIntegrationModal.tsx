'use client';

import { useMutation } from '@tanstack/react-query';
import { Loader2, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { TypographyMuted } from '@/components/atoms/Typography';
import { ModalWrapper } from '@/components/molecules/ModalWrapper';
import { Integration } from '@/modules/integrations/types';
import { syncApi } from '@/modules/sync/services/syncApi';
import { useSyncStore } from '@/modules/sync/store';
import { useNotificationStore } from '@/stores/notificationStore';
import { AddIntegrationModalProps } from "./interfaces";

const SUPPORTED_PROVIDERS = ['salesforce', 'hubspot', 'stripe', 'slack', 'zendesk', 'intercom'];

export function AddIntegrationModal({ isOpen, onClose }: AddIntegrationModalProps) {
  const [provider, setProvider] = useState('salesforce');
  const [errorLocal, setErrorLocal] = useState('');
  
  const addIntegration = useSyncStore((state) => state.addIntegration);
  const integrations = useSyncStore((state) => state.integrations);
  const showNotification = useNotificationStore((state) => state.showNotification);

  const { mutate: handleAdd, isPending } = useMutation({
    mutationFn: async () => {
      // 1. Check if provider is already installed
      if (integrations.some(i => i.provider === provider)) {
        throw new Error(`You already have a ${provider} integration connected.`);
      }
      
      // 2. Fetch remote data safely to verify connection
      await syncApi.fetchSyncData(provider);
      return provider;
    },
    onSuccess: (connectedProvider) => {
      // 3. Create a fresh synthetic integration (since real API only returns sync changes)
      const newIntegration: Integration = {
        id: `int_${Date.now()}`,
        name: `${connectedProvider.charAt(0).toUpperCase() + connectedProvider.slice(1)} Connection`,
        provider: connectedProvider as any,
        status: 'synced', // Starts fully synced as requested
        lastSyncTime: new Date().toISOString(),
        version: 1,
        logo: `https://api.dicebear.com/7.x/icons/svg?seed=${connectedProvider}`,
      };
      
      addIntegration(newIntegration);
      setProvider('salesforce');
      setErrorLocal('');
      onClose();
    },
    onError: (err: any) => {
      setErrorLocal(err.message || 'Failed to connect integration.');
      showNotification({
        type: 'error',
        title: 'Connection Failed',
        message: err.message || 'Could not establish a connection to the integration provider.',
        code: err.code || 'ERR_CONNECTION_REFUSED'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal('');
    handleAdd();
  };

  const footer = (
    <div className="flex items-center gap-3 w-full justify-end">
      <Button variant="ghost" type="button" onClick={onClose} disabled={isPending}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        form="add-integration-form"
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</>
        ) : (
          <><PlusCircle className="w-4 h-4 mr-2" /> Connect Integration</>
        )}
      </Button>
    </div>
  );

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Connect New Integration"
      description="Select a supported provider to sync data with Portier."
      footer={footer}
    >
      <form id="add-integration-form" onSubmit={handleSubmit} className="mt-4 space-y-4">
        {errorLocal && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
            {errorLocal}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Application Provider (application_id)
          </label>
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            disabled={isPending}
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all capitalize"
          >
            {SUPPORTED_PROVIDERS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <TypographyMuted className="mt-2 text-xs">
            Connecting will immediately fetch structural data from the provider to establish a 'synced' baseline.
          </TypographyMuted>
        </div>
      </form>
    </ModalWrapper>
  );
}
