import type { ActiveTabType } from '@/lib/store/useStore';

/**
 * Canonical URL for each app tab.
 * Single source of truth for the Navbar (URL sync) and HomePageClient
 * (deep-link restore), so the address bar and the rendered view can
 * never drift apart.
 */
export const TAB_ROUTES: Record<ActiveTabType, string> = {
  map: '/',
  pin_game: '/harita-testi',
  duel: '/duello',
  quiz_test: '/soru-bankasi',
  flashcards: '/ezber',
  stats: '/istatistikler',
  ai_tutor: '/ai-ogretmen',
};

const PATH_TO_TAB: Record<string, ActiveTabType> = Object.entries(
  TAB_ROUTES
).reduce(
  (acc, [tab, path]) => {
    acc[path] = tab as ActiveTabType;
    return acc;
  },
  {} as Record<string, ActiveTabType>
);

/** Normalises a pathname (trailing slash, query, hash) to a known tab. */
export function tabFromPathname(pathname: string): ActiveTabType | null {
  if (!pathname) return null;
  const clean = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  return PATH_TO_TAB[clean] ?? null;
}

export function routeForTab(tab: ActiveTabType): string {
  return TAB_ROUTES[tab] ?? '/';
}
