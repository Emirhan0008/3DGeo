import type { GlyphKey } from '@/components/ui/wearables/glyphs';

/* ==================================================================
   Wearable → glyph map.

   Why a separate file instead of putting `glyph` on every record:
   `badgesData.ts` is the gameplay database (names, thresholds, tracker
   keys). Art direction must be free to change without touching game
   balance, and the emoji `icon` field stays as the legacy/compat value
   so old localStorage saves keep working.

   Rule enforced here and checked by `scripts/check-wearables` style
   assertions: within one family no glyph repeats. Across families a
   concept may repeat, but the frame silhouette differs (medallion vs
   banner vs ring) so the three never read as the same sticker.
   ================================================================== */

export type WearableFamily = 'avatar' | 'title' | 'badge';

export const AVATAR_GLYPHS: Record<string, GlyphKey> = {
  // 5 — kozmik
  cosmic_master: 'nebula',
  trident_god: 'trident',
  galaxy_explorer: 'planet',
  sun_emperor: 'sun',
  time_oracle: 'hourglass',
  falling_star: 'starfall',
  all_seeing_eye: 'eye',
  cosmic_wings: 'wings',
  ufo_traveler: 'ufo',
  cosmic_infinity: 'infinity',
  // 4 — elmas
  diamond: 'gem',
  crown: 'crown',
  lightning_lord: 'bolt',
  north_star: 'star8',
  wisdom_monument: 'monument',
  phoenix_bird: 'phoenix',
  red_dragon: 'dragon',
  magic_sword: 'saber',
  storm_cloud: 'storm',
  evil_eye_amulet: 'amulet',
  meteor_comet: 'comet',
  sparkles_gem: 'sparkle',
  // 3 — altın
  trophy: 'trophy',
  grad_cap: 'gradcap',
  lion_anatolian: 'lion',
  flame_dragon: 'flame',
  brain_master: 'brain',
  castle_conqueror: 'castle',
  leopard: 'leopard',
  volcano: 'volcano',
  double_swords: 'bladesTwin',
  seljuk_eagle: 'eagleDouble',
  lightning_rider: 'boltRing',
  golden_crown: 'crownHeavy',
  // 2 — gümüş
  swords: 'swords',
  target: 'target',
  shield: 'shield',
  steppe_eagle: 'eagle',
  sea_wave: 'wave',
  cavalry: 'horseRun',
  grey_wolf: 'wolf',
  archery_bow: 'bow',
  anchor: 'anchor',
  ancient_temple: 'column',
  wild_horse: 'horse',
  waterfall: 'waterfall',
  // 1 — bronz
  map: 'mapFolded',
  compass: 'compassRose',
  backpack: 'backpack',
  camp_tent: 'tent',
  pine_tree: 'tree',
  mountain_peak: 'mountainRange',
  river_canoe: 'canoe',
  binocular: 'binocular',
  sunrise: 'sunrise',
  hot_balloon: 'balloon',
  // 0 — başlangıç
  apprentice: 'chick',
  novice_compass: 'compass',
  green_sprout: 'sprout',
  camp_fire: 'campfire',
  pin_marker: 'pinFlag',
  walking_traveler: 'walker',
  tea_glass: 'teacup',
  clover: 'clover'
};

export const TITLE_GLYPHS: Record<string, GlyphKey> = {
  kozmik_cografya_efendisi: 'atom',
  mutlak_taht_efendisi: 'crownStar',
  kpss_ordinaryusu: 'oracle',
  namaGlup_fatih_lord: 'medal',
  efsanevi_elmas_deha: 'ribbon',
  arena_tanrisi: 'shieldCrest',
  tahtin_sahibi: 'throne',
  duello_krali: 'circlet',
  kpss_sampiyonu: 'scroll',
  turing_basmuhendisi: 'chip',
  milimetrik_kartograf: 'crosshair',
  dilsiz_harita_efendisi: 'eyeOff',
  il_81_fatihi: 'flag',
  kusursuz_nisanci: 'target',
  seri_canavari_unvan: 'flameTwin',
  arena_gladyatoru: 'swords',
  dilsiz_harita_dehasi: 'blindfold',
  volkan_avcisi: 'glacier',
  bot_avcisi_unvan: 'bolt',
  turing_ustasi_unvan: 'brain',
  karadeniz_kaplani: 'mountain',
  gap_muhafizi: 'wheat',
  dogu_kalesi: 'dam',
  bogazlar_hakimi: 'bridge',
  sinir_bekcisi: 'gateArch',
  horst_graben_ustasi: 'plateauSteps',
  toroslar_fatihi: 'karst',
  harita_kasifi: 'map',
  cografyaci_ciragi: 'chick'
};

export const BADGE_GLYPHS: Record<string, GlyphKey> = {
  kozmik_cografya_hakimi: 'galaxy',
  mutlak_taht_sahibi: 'key',
  namaglup_seri_10: 'star5',
  kpss_ordinaryus_rozet: 'moon',
  tahtin_sahibi: 'throne',
  duello_50_zafer: 'dagger',
  duello_sampiyonu: 'crown',
  efsane_cografyaci: 'star4',
  kpss_ustadi: 'book',
  siber_antrenor: 'rocket',
  milimetrik_kartograf_rozet: 'pin',
  dilsiz_harita_efendisi_rozet: 'owl',
  duello_gladyatoru: 'shield',
  yenilmez_fatih: 'flame',
  seri_canavari: 'bolt',
  bot_mat_eden: 'robot',
  dilsiz_harita_kasirgasi: 'waveCrest',
  volkanik_sekiller_ustasi: 'thermometer',
  il_81_kasifi: 'pennant',
  kpss_puan_500: 'laurel',
  dogu_anadolu_akarsu: 'river',
  marmara_iklim_cografya: 'coast',
  ege_kiyi_horst: 'plateau',
  karadeniz_dag_gecit: 'mountain',
  ic_anadolu_plato_volkan: 'volcano',
  akdeniz_karstik: 'temple',
  guneydogu_baraj_ova: 'lake',
  sinir_kapilari_gecit: 'gate',
  plato_ova_fatihi: 'riverDelta',
  karstik_sekiller_ustasi: 'droplet',
  bot_kiran: 'chip',
  simsek_refleks: 'boltRing',
  cografyaci_ciragi: 'chick',
  tam_isabet: 'crosshair',
  bot_caylagi: 'sprout',
  arena_caylagi: 'swords'
};

/** Compact, legible tier names — no emoji so the chips stay one line. */
export const TIER_LABELS: Record<number, { short: string; name: string; desc: string }> = {
  0: { short: 'Başlangıç', name: 'Başlangıç', desc: 'Herkesin açtığı ilk set — yön ve temel coğrafya.' },
  1: { short: '1. Kademe', name: 'Bronz', desc: 'İlk rozetlerinle açılan bronz yuvarlak çerçeve.' },
  2: { short: '2. Kademe', name: 'Gümüş', desc: 'Gümüş kalkan: düello ve rozet birikimi başladı.' },
  3: { short: '3. Kademe', name: 'Altın', desc: 'Altın yıldız: düzenli oynayan oyuncunun işareti.' },
  4: { short: '4. Kademe', name: 'Elmas', desc: 'Elmas kesim: uzun vadeli hedefleri tamamlayanlar.' },
  5: { short: '5. Kademe', name: 'Kozmik', desc: 'Kozmik patlama + yörünge halkası: aylar süren zirve.' }
};

export function tierLevelOf(tier?: string): number {
  switch (tier) {
    case 'mythic': return 5;
    case 'diamond': return 4;
    case 'gold': return 3;
    case 'silver': return 2;
    case 'bronze': return 1;
    default: return 0;
  }
}

export function glyphForAvatar(id?: string): GlyphKey | undefined {
  return id ? AVATAR_GLYPHS[id] : undefined;
}

export function glyphForTitle(idOrName?: string): GlyphKey | undefined {
  if (!idOrName) return undefined;
  return TITLE_GLYPHS[idOrName];
}

export function glyphForBadge(idOrName?: string): GlyphKey | undefined {
  if (!idOrName) return undefined;
  return BADGE_GLYPHS[idOrName];
}

/**
 * Stable wearable token stored in `avatarIcon`.
 * Legacy saves hold a raw emoji; new saves hold `g:<glyph>`.
 */
export function avatarToken(glyph: string): string {
  return `g:${glyph}`;
}

export function isAvatarToken(value?: string): boolean {
  return !!value && value.startsWith('g:');
}

export function glyphFromAvatarToken(value?: string): GlyphKey | undefined {
  if (!isAvatarToken(value)) return undefined;
  const key = value!.slice(2);
  return key as GlyphKey;
}
