/** Shared layout tokens for /quote and /booking multi-step flows. */

export const FLOW_PAGE_SHELL = 'min-h-[calc(100vh-var(--site-header-height))] bg-[#f5f6f7]';

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
  'w-full px-4 py-3 bg-white border border-secondary-200 rounded-lg text-sm text-secondary placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors disabled:opacity-55';

export const FLOW_LABEL = 'block text-sm font-medium text-secondary mb-1.5';

export const FLOW_BACK_BUTTON =
  'inline-flex items-center justify-center gap-2 flex-1 py-3.5 text-sm font-semibold border border-secondary text-secondary bg-white hover:bg-secondary-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const FLOW_CONTINUE_BUTTON =
  'inline-flex items-center justify-center gap-2 flex-[2] py-3.5 text-sm font-semibold bg-secondary text-white hover:bg-secondary-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

/** Utility / legal / contact pages */
export const UTILITY_PAGE_SHELL = 'min-h-screen bg-white';

export const UTILITY_PAGE_CONTENT = 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14';

export const UTILITY_FORM_CARD =
  'bg-[#f3f3f3] rounded-3xl border border-secondary-100/60 p-6 md:p-10 shadow-sm';

export const UTILITY_INPUT =
  'w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all duration-200';

export const UTILITY_LABEL = 'block text-xs font-semibold text-secondary-500 mb-1.5';

export const UTILITY_PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold bg-secondary text-white hover:bg-secondary-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const UTILITY_SECONDARY_BUTTON =
  'inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold border border-secondary-200 text-secondary hover:bg-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
