import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleReviewPanelProps {
  title: string;
  summary?: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export const CollapsibleReviewPanel: React.FC<CollapsibleReviewPanelProps> = ({
  title,
  summary,
  icon,
  defaultExpanded = false,
  children,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)]/[0.03] rounded-2xl shadow-none overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--surface)]/[0.04] transition-colors"
        aria-expanded={expanded}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider">
            {title}
          </span>
          {!expanded && summary && (
            <span className="block text-xs font-semibold text-[var(--text-muted)] mt-0.5 truncate">
              {summary}
            </span>
          )}
        </span>
        <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand">
          {expanded ? 'Hide' : 'Show'}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-[var(--border)] animate-fade-in">
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  );
};
