'use client';

import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { ModalWrapper } from '@/components/molecules/ModalWrapper';
import { SyncPreviewPanel } from '@/components/organisms/SyncPreviewPanel';
import { useSyncStore } from '@/modules/sync/store';
import { ReviewChangesModalProps } from "./interfaces";

export function ReviewChangesModal({ integration, isOpen, onClose }: ReviewChangesModalProps) {
  const pendingChanges = useSyncStore((state) => state.pendingChanges[integration.id]) || [];
  const resolutions = useSyncStore((state) => state.resolutions[integration.id]) || {};
  const setResolution = useSyncStore((state) => state.setResolution);
  const clearResolutions = useSyncStore((state) => state.clearResolutions);

  const [showValidation, setShowValidation] = useState(false);

  const hasPendingChanges = pendingChanges.length > 0;
  const allResolved = hasPendingChanges && pendingChanges.every(c => resolutions[c.field_name] !== undefined);

  const handleConfirmMerge = () => {
    if (!allResolved) {
      setShowValidation(true);
      return;
    }
    // Simulate successful merge process
    clearResolutions(integration.id);
    onClose();
  };

  const footer = (
    <div className="flex items-center gap-3 w-full justify-end">
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button 
        onClick={handleConfirmMerge}
        disabled={!hasPendingChanges}
        variant={allResolved ? 'default' : 'outline'}
        className={allResolved ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600' : ''}
      >
        {allResolved ? 'Confirm & Apply Merge' : 'Resolve all conflicts to Apply'}
      </Button>
    </div>
  );

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        title={`Review Incoming Changes: ${integration.name}`}
        description="Review and resolve conflicts from the latest sync before they are merged."
        footer={footer}
      >
        <div className="mt-4 overflow-y-auto max-h-[60vh] -mx-6 px-6">
          <SyncPreviewPanel
            changes={pendingChanges}
            resolutions={resolutions}
            onResolveConflict={(change, choice) => {
              setResolution(integration.id, change.field_name, choice);
              if (showValidation) setShowValidation(false);
            }}
            showValidationErrors={showValidation}
          />
        </div>
      </ModalWrapper>
    </>
  );
}
