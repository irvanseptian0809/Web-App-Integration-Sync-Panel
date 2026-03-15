import { Check } from 'lucide-react';

import { Badge } from '@/components/atoms/Badge';
import { TypographyH3, TypographyMuted } from '@/components/atoms/Typography';
import { SyncChange } from '@/modules/integrations/types';
import { cn } from '@/utils/cn';
import { SyncPreviewPanelProps } from "./interfaces";

/** Group an array of SyncChange records by their field_name */
function groupByField(changes: SyncChange[]): Map<string, SyncChange[]> {
  const map = new Map<string, SyncChange[]>();
  for (const change of changes) {
    const existing = map.get(change.field_name) ?? [];
    map.set(change.field_name, [...existing, change]);
  }
  return map;
}

export function SyncPreviewPanel({ changes, onResolveConflict, resolutions, showValidationErrors }: SyncPreviewPanelProps) {
  if (changes.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
        <TypographyMuted>No changes to preview.</TypographyMuted>
      </div>
    );
  }

  const grouped = groupByField(changes);
  const fieldCount = grouped.size;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <TypographyH3 className="text-lg">Incoming Changes</TypographyH3>
          <TypographyMuted className="text-xs mt-1">Review exactly what will be updated during this sync.</TypographyMuted>
        </div>
        <Badge variant="outline">{fieldCount} field{fieldCount !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from(grouped.entries()).map(([fieldName, fieldChanges]) => {
          // All entries share the same field_name; the first one provides the local (current) value.
          const localValue = fieldChanges[0]?.current_value ?? 'None';
          // Only show remote options that:
          //   1. differ from the local current_value, AND
          //   2. have a non-null new_value (don't show if incoming is also None)
          const distinctRemotes = fieldChanges.filter(
            (c) => c.new_value !== c.current_value && c.new_value !== null && c.new_value !== ''
          );

          const chosenId = resolutions[fieldName]; // 'local' | changeId | undefined
          const isResolved = chosenId !== undefined;

          // If all remotes match local, skip this field entirely (nothing to resolve)
          if (distinctRemotes.length === 0) return null;


          return (
            <div
              key={fieldName}
              className="p-6 hover:bg-slate-50/30 transition-colors"
            >
              {/* Field header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {fieldName}
                </span>
                <Badge
                  variant={fieldChanges[0].change_type === 'UPDATE' ? 'warning' : 'default'}
                  className="!text-[10px] uppercase"
                >
                  {fieldChanges[0].change_type}
                </Badge>
                {isResolved && (
                  <Badge variant="success" className="!text-[10px] uppercase ml-auto">
                    Resolved
                  </Badge>
                )}
                {showValidationErrors && !isResolved && (
                  <span className="ml-auto text-xs text-red-500 font-medium">
                    Please select a resolution
                  </span>
                )}
              </div>

              {/* Options grid: Keep Local + all remote incoming options */}
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                {/* ── Keep Local option ── */}
                <button
                  type="button"
                  onClick={() => onResolveConflict && onResolveConflict(fieldChanges[0], 'local')}
                  disabled={!onResolveConflict}
                  className={cn(
                    "flex-1 min-w-[140px] text-left relative p-3 rounded-lg border-2 transition-all",
                    onResolveConflict ? "hover:border-slate-300 hover:bg-slate-100/50 cursor-pointer" : "cursor-default",
                    chosenId === 'local'
                      ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-600"
                      : "border-transparent bg-slate-50",
                    showValidationErrors && !isResolved && "border-red-300 bg-red-50/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Keep Local</div>
                    {chosenId === 'local' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div className={cn(
                    "font-medium break-all text-sm",
                    chosenId === 'local' ? "text-slate-900" : "text-slate-500 line-through opacity-70"
                  )}>
                    {localValue}
                  </div>
                </button>

                {/* ── Remote option(s) ── */}
                {distinctRemotes.map((change, idx) => {
                  const isChosen = chosenId === change.id;
                  return (
                    <button
                      key={change.id}
                      type="button"
                      onClick={() => onResolveConflict && onResolveConflict(change, change.id)}
                      disabled={!onResolveConflict}
                      className={cn(
                        "flex-1 min-w-[140px] text-left relative p-3 rounded-lg border-2 transition-all",
                        onResolveConflict ? "hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer" : "cursor-default",
                        isChosen
                          ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50/80 hover:border-blue-600"
                          : "border-transparent bg-slate-50",
                        showValidationErrors && !isResolved && "border-red-300 bg-red-50/30"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[10px] text-blue-500 uppercase font-bold tracking-wider">
                          Accept Incoming{distinctRemotes.length > 1 ? ` #${idx + 1}` : ''}

                        </div>
                        {isChosen && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <div className={cn(
                        "font-medium break-all text-sm px-1.5 py-0.5 -ml-1.5 rounded",
                        isChosen ? "text-blue-800 bg-blue-100/50" : "text-blue-700"
                      )}>
                        {change.new_value || 'None'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
