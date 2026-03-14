'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { ModalWrapper } from '@/components/molecules/ModalWrapper';
import { useSyncStore } from '@/modules/sync/store';
import { RemoveConfirmModalProps } from "./interfaces";

export function RemoveConfirmModal({ integration, isOpen, onClose, onSuccess }: RemoveConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const removeIntegration = useSyncStore((state) => state.removeIntegration);

  const handleConfirm = () => {
    setIsDeleting(true);
    
    // Simulate API deletion delay for UX
    setTimeout(() => {
      removeIntegration(integration.id);
      setIsDeleting(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 600);
  };

  const footer = (
    <div className="flex items-center gap-3 w-full justify-end">
      <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
        Cancel
      </Button>
      <Button 
        onClick={handleConfirm}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500"
      >
        {isDeleting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Removing...</>
        ) : (
          'Yes, Remove Integration'
        )}
      </Button>
    </div>
  );

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Integration"
      description="Are you sure you want to proceed?"
      footer={footer}
    >
      <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Warning: Destructive Action</p>
          <p className="opacity-90">
            Removing the <strong>{integration.name}</strong> integration will permanently delete its local synchronization history and configuration. Any pending changes will be discarded.
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
}
