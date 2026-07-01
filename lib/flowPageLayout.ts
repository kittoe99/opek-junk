/** Shared layout tokens for /quote and /booking multi-step flows. */

export const FLOW_PAGE_SHELL = 'min-h-screen bg-white';

/** Breathing room below the fixed site header (main uses --site-header-height). */
export const FLOW_PAGE_HERO =
  'pt-4 pb-6 md:pt-6 md:pb-8 mx-auto px-4 sm:px-6 lg:px-8';

export const FLOW_PAGE_CONTENT = 'mx-auto px-4 sm:px-6 lg:px-8 pb-8';

/** Clears the full fixed header when scrolling to a step anchor. */
export const FLOW_STEP_ANCHOR = 'scroll-mt-[var(--site-header-height)]';

export function flowPageMaxWidth(wide: boolean): string {
  return wide ? 'max-w-5xl' : 'max-w-2xl';
}

export function scrollToFlowStep(el: HTMLElement | null): void {
  if (!el) return;
  setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}
