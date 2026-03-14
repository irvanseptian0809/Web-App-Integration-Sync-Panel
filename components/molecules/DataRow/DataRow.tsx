
import { TypographyMuted } from '@/components/atoms/Typography';
import { cn } from '@/utils/cn';
import { DataRowProps } from "./interfaces";

export function DataRow({ label, value, subValue, className }: DataRowProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 last:border-0 gap-1 sm:gap-4', className)}>
      <div className="w-full sm:w-1/3 text-sm font-medium text-slate-700">
        {label}
      </div>
      <div className="flex-1 text-sm text-slate-900 font-semibold breakdown-words">
        {value}
        {subValue && <TypographyMuted className="mt-0.5">{subValue}</TypographyMuted>}
      </div>
    </div>
  );
}
