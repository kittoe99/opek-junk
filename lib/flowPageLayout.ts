/** Shared layout tokens for /quote and /booking multi-step flows — dark homepage theme. */

export const FLOW_PAGE_SHELL =
  'home-dark min-h-[calc(100vh-var(--site-header-height))] bg-[var(--bg)] text-[var(--text)]';

export const FLOW_PAGE_COLUMN = 'max-w-lg mx-auto w-full px-4 sm:px-6';

export const FLOW_PAGE_CONTENT = `${FLOW_PAGE_COLUMN} pb-28 pt-6 md:pt-8`;

export const FLOW_PAGE_HERO = 'max-w-lg mx-auto px-4 sm:px-6 pb-4 md:pb-6 text-center';

export const FLOW_STEP_ANCHOR = 'scroll-mt-[var(--site-header-height)]';

export function flowPageMaxWidth(wide: boolean): string {
  return wide ? 'max-w-5xl mx-auto w-full px-4 sm:px-6 pb-28 pt-6 md:pt-8' : FLOW_PAGE_CONTENT;
}

export function scrollToFlowStep(el: HTMLElement | null): void {
  if (!el) return;
  setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

export const FLOW_INPUT =
  'w-full px-4 py-3 rounded-xl text-sm transition-all disabled:opacity-55';

export const FLOW_LABEL = 'block text-sm font-medium text-[var(--text)] mb-1.5';

export const FLOW_BACK_BUTTON =
  'inline-flex items-center justify-center gap-2 flex-1 py-3.5 text-sm font-semibold border border-white/15 text-[var(--text)] bg-transparent hover:bg-white/[0.06] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const FLOW_CONTINUE_BUTTON =
  'inline-flex items-center justify-center gap-2 flex-[2] py-3.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_-6px_rgba(255,0,110,0.55)]';

/** Marketing hero CTAs — brand pink primary */
export const HERO_PRIMARY_CTA =
  'bg-brand text-white hover:bg-brand-600 transition-colors duration-200';

export const HERO_ACCENT_CTA =
  'bg-brand text-white hover:bg-brand-600 transition-colors duration-200';

export const HERO_OUTLINE_CTA =
  'border border-white/15 text-[var(--text)] bg-transparent hover:border-brand/40 hover:bg-white/[0.04] transition-colors duration-200';

/** Utility / legal / contact pages — dark homepage theme */
export const UTILITY_PAGE_SHELL = 'home-dark min-h-screen bg-[var(--bg)] text-[var(--text)]';

export const UTILITY_PAGE_CONTENT = 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14';

export const UTILITY_FORM_CARD =
  'bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-6 md:p-10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]';

export const UTILITY_INPUT =
  'w-full px-4 py-3 rounded-xl text-sm transition-all duration-200';

export const UTILITY_LABEL = 'block text-xs font-semibold text-[var(--text-muted)] mb-1.5';

export const UTILITY_PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_-6px_rgba(255,0,110,0.55)]';

export const UTILITY_SECONDARY_BUTTON =
  'inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold border border-white/15 text-[var(--text)] hover:bg-white/[0.06] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
