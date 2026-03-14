import { apiClient } from '@/lib/api/client';
import { SyncResponse } from '@/modules/integrations/types';

export const syncApi = {
  fetchSyncData: async (provider: string): Promise<SyncResponse> => {
    return apiClient.get<SyncResponse>(`https://portier-takehometest.onrender.com/api/v1/data/sync?application_id=${provider}`);
  },
};
