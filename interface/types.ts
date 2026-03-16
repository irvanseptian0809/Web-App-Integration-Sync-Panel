export type SyncStatus = "synced" | "syncing" | "conflict" | "error"

export interface Integration {
  id: string
  name: string
  provider: string
  status: SyncStatus
  lastSyncTime: string | null
  version: number
  logo: string
}

export interface SyncEvent {
  id: string
  integrationId: string
  timestamp: string
  status: "SUCCESS" | "CONFLICT" | "FAILED"
  version: number
  changesCount: number
}

export interface SyncChange {
  id: string
  field_name: string
  change_type: "UPDATE" | "CREATE" | "DELETE"
  current_value: string | null
  new_value: string | null
}

export interface SyncApprovalOptions {
  application_name: string
  changes: SyncChange[]
}

export interface SyncResponse {
  code: string
  message: string
  data: {
    sync_approval: SyncApprovalOptions
    metadata: any
  }
}

export interface ResolutionHistoryEntry {
  id: string
  integrationId: string
  resolvedAt: string
  previousVersion: number
  resolvedVersion: number
  fields: Array<{
    fieldName: string
    previousValue: string | null
    resolvedValue: string | null
    choice: "local" | string
  }>
}

export type UserStatus = "active" | "suspended"

export interface User {
  id?: string
  name?: string
  provider?: string
  email?: string
  phone?: string
  role?: string
  status?: UserStatus
  created_at: string
  updated_at: string
}

export type DoorStatus = "online" | "offline"

export interface Door {
  id?: string
  name: string
  location: string
  device_id: string
  status: DoorStatus
  battery_level: number
  last_seen: string
  created_at: string
  provider?: string
}

export type KeyStatus = "active" | "revoked"

export interface Key {
  id?: string
  user_id: string
  door_id: string
  key_type: string
  access_start: string
  access_end: string
  status: KeyStatus
  created_at: string
  provider?: string
}
