export type SyncStatus = 'synced' | 'syncing' | 'conflict' | 'error';

export interface Integration {
  id: string;
  name: string;
  provider: 'salesforce' | 'hubspot' | 'stripe' | 'slack' | 'zendesk' | 'intercom';
  status: SyncStatus;
  lastSyncTime: string | null;
  version: number;
  logo: string;
}

export interface SyncEvent {
  id: string;
  integrationId: string;
  timestamp: string;
  status: 'SUCCESS' | 'CONFLICT' | 'FAILED';
  version: number;
  changesCount: number;
}

export interface SyncChange {
  id: string;
  field_name: string;
  change_type: 'UPDATE' | 'CREATE' | 'DELETE';
  current_value: string | null;
  new_value: string | null;
}

export interface SyncApprovalOptions {
  application_name: string;
  changes: SyncChange[];
}

export interface SyncResponse {
  code: string;
  message: string;
  data: {
    sync_approval: SyncApprovalOptions;
    metadata: any;
  };
}

export interface ResolutionHistoryEntry {
  id: string;
  integrationId: string;
  resolvedAt: string;
  previousVersion: number;
  resolvedVersion: number;
  fields: Array<{
    fieldName: string;
    previousValue: string | null;
    resolvedValue: string | null;
    choice: 'local' | string;
  }>;
}
