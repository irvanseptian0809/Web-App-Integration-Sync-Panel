import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/atoms/Button';
import { TypographyH3, TypographyMuted } from '@/components/atoms/Typography';
import { cn } from '@/utils/cn';
import { ModalWrapperProps } from "./interfaces";

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300">
      <div
        ref={modalRef}
        className={cn(
          "relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <TypographyH3 className="text-xl">{title}</TypographyH3>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 -mr-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
          {description && <TypographyMuted>{description}</TypographyMuted>}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
        
        {footer && (
          <div className="flex items-center justify-end p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
