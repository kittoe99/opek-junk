/** Shared layout tokens for /quote and /booking multi-step flows — homepage light theme. */

export const FLOW_PAGE_SHELL =
  'site-page home-light interior-home site-flow min-h-screen text-[var(--text)]';

export const FLOW_PAGE_COLUMN = 'max-w-lg mx-auto w-full px-4 sm:px-6';

export const FLOW_PAGE_CONTENT = `${FLOW_PAGE_COLUMN} site-flow-content pb-28`;

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

export const FLOW_INPUT = 'opek-field flow-input w-full px-4 py-3';

export const FLOW_LABEL = 'field-label';

export const FLOW_BACK_BUTTON =
  'flow-btn flow-btn-back inline-flex items-center justify-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed';

export const FLOW_CONTINUE_BUTTON =
  'flow-btn flow-btn-primary inline-flex items-center justify-center gap-2 flex-[2] disabled:opacity-50 disabled:cursor-not-allowed';

/** Marketing hero CTAs — homepage purple primary */
export const HERO_PRIMARY_CTA =
  'ui-button';

export const HERO_ACCENT_CTA =
  'ui-button';

export const HERO_OUTLINE_CTA =
  'ui-button ui-button--secondary';

/** Utility / legal / contact pages — homepage light theme */
export const UTILITY_PAGE_SHELL = 'site-page home-light interior-home site-utility min-h-screen text-[var(--text)]';

export const UTILITY_PAGE_CONTENT = 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14';

/** Standalone utility forms (contact, track order, in-home estimate) */
export const UTILITY_FORM_WRAP =
  'max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12';

/** Shared bordered form container; geometry is defined alongside the button system. */
export const UTILITY_FORM_CARD = 'soft-card';

export const UTILITY_INPUT = 'opek-field w-full px-4 py-3';

export const UTILITY_LABEL = 'field-label';

export const UTILITY_PRIMARY_BUTTON =
  'ui-button w-full';

export const UTILITY_SECONDARY_BUTTON =
  'ui-button ui-button--secondary w-full';
