import { SyncChange } from "@/modules/integrations/types";

export interface SyncPreviewPanelProps {
    changes: SyncChange[];
    onResolveConflict?: (change: SyncChange, choice: 'local' | 'remote') => void;
    resolutions: Record<string, 'local' | 'remote'>;
    showValidationErrors?: boolean;
}
