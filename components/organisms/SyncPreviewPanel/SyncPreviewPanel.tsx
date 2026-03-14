import { ArrowRight, Check } from 'lucide-react';

import { Badge } from '@/components/atoms/Badge';
import { TypographyH3, TypographyMuted } from '@/components/atoms/Typography';
import { cn } from '@/utils/cn';
import { SyncPreviewPanelProps } from "./interfaces";

export function SyncPreviewPanel({ changes, onResolveConflict, resolutions, showValidationErrors }: SyncPreviewPanelProps) {
  if (changes.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
        <TypographyMuted>No changes to preview.</TypographyMuted>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <TypographyH3 className="text-lg">Incoming Changes</TypographyH3>
          <TypographyMuted className="text-xs mt-1">Review exactly what will be updated during this sync.</TypographyMuted>
        </div>
        <Badge variant="outline">{changes.length} updates</Badge>
      </div>
      <div className="divide-y divide-slate-100">
        {changes.map((change) => {
          const isResolved = resolutions[change.field_name] !== undefined;
          
          return (
            <div key={change.id} className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {change.field_name}
                  </span>
                  <Badge variant={change.change_type === 'UPDATE' ? 'warning' : 'default'} className="!text-[10px] uppercase">
                    {change.change_type}
                  </Badge>
                  {isResolved && (
                    <Badge variant="success" className="!text-[10px] uppercase ml-auto sm:ml-2">
                      Resolved: {resolutions[change.field_name]}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-sm mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 overflow-x-auto">
                  <button 
                    type="button"
                    onClick={() => onResolveConflict && onResolveConflict(change, 'local')}
                    disabled={!onResolveConflict}
                    className={cn(
                      "flex-1 min-w-[150px] text-left relative p-3 rounded-lg border-2 transition-all",
                      onResolveConflict ? "hover:border-slate-300 hover:bg-slate-100/50 cursor-pointer" : "cursor-default",
                      resolutions[change.field_name] === 'local' 
                        ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-600" 
                        : "border-transparent bg-slate-50",
                      showValidationErrors && !resolutions[change.field_name] && "border-red-300 bg-red-50/30 hover:bg-red-50/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Keep Local</div>
                      {resolutions[change.field_name] === 'local' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className={cn(
                      "font-medium break-all", 
                      resolutions[change.field_name] === 'local' ? "text-slate-900" : "text-slate-700 opacity-70 line-through"
                    )}>
                      {change.current_value || 'None'}
                    </div>
                  </button>
                  
                  <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
                  
                  <button 
                    type="button"
                    onClick={() => onResolveConflict && onResolveConflict(change, 'remote')}
                    disabled={!onResolveConflict}
                    className={cn(
                      "flex-1 min-w-[150px] text-left relative p-3 rounded-lg border-2 transition-all",
                      onResolveConflict ? "hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer" : "cursor-default",
                      resolutions[change.field_name] === 'remote' 
                        ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-600" 
                        : "border-transparent bg-slate-50",
                      showValidationErrors && !resolutions[change.field_name] && "border-red-300 bg-red-50/30 hover:bg-red-50/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] text-blue-500 uppercase font-bold tracking-wider">Accept Incoming</div>
                      {resolutions[change.field_name] === 'remote' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className={cn(
                      "font-medium break-all px-1.5 py-0.5 -ml-1.5 rounded",
                      resolutions[change.field_name] === 'remote' ? "text-blue-800 bg-blue-100/50" : "text-blue-700 bg-transparent"
                    )}>
                      {change.new_value || 'None'}
                    </div>
                  </button>
                </div>
                
                {showValidationErrors && !isResolved && (
                  <div className="mt-2 text-xs text-red-500 font-medium">
                    Please select a resolution to proceed.
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
