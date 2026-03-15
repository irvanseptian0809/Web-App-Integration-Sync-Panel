import { apiClient } from "@/lib/api/client"
import { SyncResponse } from "@/interface/types"

export const syncApi = {
  fetchSyncData: async (provider: string): Promise<SyncResponse> => {
    return apiClient.get<SyncResponse>(
      `https://portier-takehometest.onrender.com/api/v1/data/sync?application_id=${provider}`,
    )
  },
}
