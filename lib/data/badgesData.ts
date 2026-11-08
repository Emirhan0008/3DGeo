export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'mythic';
export type BadgePrestigeTier = 'starter' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'mythic';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  category: string;
  tier: BadgeTier;
  tierLevel: number; // 1: Bronz, 2: Gümüş, 3: Altın, 4: Elmas, 5: Mistik Kozmik
  desc: string;
  targetCount: number;
  reqText: string;
  trackerKey: string;
  associatedTitle?: string;
}

export interface UserTitle {
  id: string;
  name: string;
  icon: string;
  tier: BadgeTier;
  desc: string;
  requiredBadge?: string;
  requiredMetricText: string;
}

export interface AvatarIconOption {
  id: string;
  icon: string;
  label: string;
  tier: BadgePrestigeTier;
  minBadgesRequired?: number;
  minDuelWinsRequired?: number;
  minScoreRequired?: number;
}

export interface AvatarThemeOption {
  id: string;
  name: string;
  tierLevel: number;
  bgGradient: string;
  borderGlow: string;
  badgePinBg: string;
  outlineFilter: string;
  outlineColor: string;
  outlineLabel: string;
}

export const AVATAR_ICONS: AvatarIconOption[] = [
  // --- 🌌 5. KADEME: KOZMİK & MİSTİK (Aylar Sürecek En Prestijli Zirve Hedefler) ---
  { id: 'cosmic_master', icon: '🌌', label: 'Kozmik Kozmograf (Zirve)', tier: 'mythic', minBadgesRequired: 30, minDuelWinsRequired: 50 },
  { id: 'trident_god', icon: '🔱', label: 'Karalar & Denizler Lordu', tier: 'mythic', minDuelWinsRequired: 100 },
  { id: 'galaxy_explorer', icon: '🪐', label: 'Galaksi Kaşifi', tier: 'mythic', minScoreRequired: 5000 },
  { id: 'sun_emperor', icon: '☀️', label: 'Güneş Hükümdarı', tier: 'mythic', minDuelWinsRequired: 75 },
  { id: 'time_oracle', icon: '🔮', label: 'Zaman Kahini', tier: 'mythic', minBadgesRequired: 35, minDuelWinsRequired: 50 },
  { id: 'falling_star', icon: '🌠', label: 'Kayan Yıldız Tanrısı', tier: 'mythic', minBadgesRequired: 30, minDuelWinsRequired: 60 },
  { id: 'all_seeing_eye', icon: '👁️', label: 'Kadim Coğrafya Gözü', tier: 'mythic', minBadgesRequired: 40 },
  { id: 'cosmic_wings', icon: '🪽', label: 'Altın Kanatlı Kozmik Anka', tier: 'mythic', minDuelWinsRequired: 80 },
  { id: 'ufo_traveler', icon: '🛸', label: 'Yıldızlararası Seyyah', tier: 'mythic', minScoreRequired: 6000 },
  { id: 'cosmic_infinity', icon: '♾️', label: 'Sonsuzluk Hükümdarı', tier: 'mythic', minDuelWinsRequired: 120, minBadgesRequired: 45 },

  // --- 💎 4. KADEME: ELMAS & EFSANE (Çok Zor Uzun Vadeli Hedefler) ---
  { id: 'diamond', icon: '💎', label: 'Efsanevi Elmas (Elit)', tier: 'diamond', minBadgesRequired: 20, minDuelWinsRequired: 25 },
  { id: 'crown', icon: '👑', label: 'Arena Kralı', tier: 'diamond', minDuelWinsRequired: 25 },
  { id: 'lightning_lord', icon: '⚡', label: 'Yıldırım Lordu', tier: 'diamond', minBadgesRequired: 15 },
  { id: 'north_star', icon: '🌟', label: 'Kutup Yıldızı', tier: 'diamond', minDuelWinsRequired: 20 },
  { id: 'wisdom_monument', icon: '🏛️', label: 'Bilgelik Anıtı', tier: 'diamond', minScoreRequired: 2500 },
  { id: 'phoenix_bird', icon: '🦚', label: 'Zümrüdüanka (Simurg)', tier: 'diamond', minBadgesRequired: 22, minDuelWinsRequired: 20 },
  { id: 'red_dragon', icon: '🐉', label: 'Kızıl Ejderha', tier: 'diamond', minDuelWinsRequired: 30 },
  { id: 'magic_sword', icon: '🗡️', label: 'Efsanevi Kılıç', tier: 'diamond', minBadgesRequired: 18, minDuelWinsRequired: 20 },
  { id: 'storm_cloud', icon: '⛈️', label: 'Kasırga Efendisi', tier: 'diamond', minBadgesRequired: 25 },
  { id: 'evil_eye_amulet', icon: '🧿', label: 'Kadim Nazar Zırhı', tier: 'diamond', minBadgesRequired: 22 },
  { id: 'meteor_comet', icon: '☄️', label: 'Göktaşı Fatihi', tier: 'diamond', minScoreRequired: 3000 },
  { id: 'sparkles_gem', icon: '✨', label: 'Safir Parıltısı', tier: 'diamond', minDuelWinsRequired: 22 },

  // --- 👑 3. KADEME: ALTIN & ŞAMPİYON ---
  { id: 'trophy', icon: '🏆', label: 'Kupa Şampiyonu', tier: 'gold', minDuelWinsRequired: 10 },
  { id: 'grad_cap', icon: '🎓', label: 'KPSS Üstadı', tier: 'gold', minBadgesRequired: 10 },
  { id: 'lion_anatolian', icon: '🦁', label: 'Anadolu Aslanı', tier: 'gold', minBadgesRequired: 12 },
  { id: 'flame_dragon', icon: '🔥', label: 'Yenilmez Ejder', tier: 'gold', minDuelWinsRequired: 10 },
  { id: 'brain_master', icon: '🧠', label: 'Turing Başmühendisi', tier: 'gold', minBadgesRequired: 8 },
  { id: 'castle_conqueror', icon: '🏰', label: 'Kale Fatihi', tier: 'gold', minScoreRequired: 1000 },
  { id: 'leopard', icon: '🐆', label: 'Anadolu Parsı', tier: 'gold', minBadgesRequired: 12, minDuelWinsRequired: 8 },
  { id: 'volcano', icon: '🌋', label: 'Ağrı Volkanı', tier: 'gold', minBadgesRequired: 10, minScoreRequired: 1500 },
  { id: 'double_swords', icon: '⚔️', label: 'Çift Pala Ustası', tier: 'gold', minDuelWinsRequired: 12 },
  { id: 'seljuk_eagle', icon: '🦅', label: 'Çift Başlı Selçuklu Kartalı', tier: 'gold', minBadgesRequired: 14 },
  { id: 'lightning_rider', icon: '⚡', label: 'Şimşek Süvarisi', tier: 'gold', minDuelWinsRequired: 10, minScoreRequired: 1000 },
  { id: 'golden_crown', icon: '👑', label: 'Taht Varisi', tier: 'gold', minDuelWinsRequired: 15 },

  // --- 🛡️ 2. KADEME: GÜMÜŞ & UZMAN ---
  { id: 'swords', icon: '⚔️', label: 'Düello Gladyatörü', tier: 'silver', minDuelWinsRequired: 3 },
  { id: 'target', icon: '🎯', label: 'Keskin Nişancı', tier: 'silver', minBadgesRequired: 4 },
  { id: 'shield', icon: '🛡️', label: 'Muhafız Kalkanı', tier: 'silver', minBadgesRequired: 3 },
  { id: 'steppe_eagle', icon: '🦅', label: 'Bozkır Kartalı', tier: 'silver', minBadgesRequired: 5 },
  { id: 'sea_wave', icon: '🌊', label: 'Karadeniz Fırtınası', tier: 'silver', minBadgesRequired: 4 },
  { id: 'cavalry', icon: '🐎', label: 'Akıncı Süvari', tier: 'silver', minDuelWinsRequired: 2 },
  { id: 'grey_wolf', icon: '🐺', label: 'Anadolu Bozkurdu', tier: 'silver', minBadgesRequired: 5, minDuelWinsRequired: 3 },
  { id: 'archery_bow', icon: '🏹', label: 'Kemankeş Yayı', tier: 'silver', minBadgesRequired: 4, minDuelWinsRequired: 2 },
  { id: 'anchor', icon: '⚓', label: 'Pruva Çapası', tier: 'silver', minBadgesRequired: 3, minScoreRequired: 500 },
  { id: 'ancient_temple', icon: '🏛️', label: 'Efes Sütunu', tier: 'silver', minBadgesRequired: 5 },
  { id: 'wild_horse', icon: '🐴', label: 'Yılkı Atı', tier: 'silver', minBadgesRequired: 4 },
  { id: 'waterfall', icon: '💧', label: 'Düden Şelalesi', tier: 'silver', minBadgesRequired: 5 },

  // --- 🐣 1. KADEME: BRONZ & ÇIRAK ---
  { id: 'map', icon: '🗺️', label: 'Atlas Kaşifi', tier: 'bronze', minBadgesRequired: 2 },
  { id: 'compass', icon: '🧭', label: 'Pusula Rehberi', tier: 'bronze', minBadgesRequired: 1 },
  { id: 'backpack', icon: '🎒', label: 'Gezgin Çantası', tier: 'bronze', minBadgesRequired: 1 },
  { id: 'camp_tent', icon: '⛺', label: 'Kampçı Çırak', tier: 'bronze', minBadgesRequired: 1 },
  { id: 'pine_tree', icon: '🌲', label: 'Toros Çamı', tier: 'bronze', minBadgesRequired: 2 },
  { id: 'mountain_peak', icon: '⛰️', label: 'Dağ Zirvesi', tier: 'bronze', minBadgesRequired: 1, minDuelWinsRequired: 1 },
  { id: 'river_canoe', icon: '🛶', label: 'Nehir Kanosu', tier: 'bronze', minBadgesRequired: 1 },
  { id: 'binocular', icon: '🔭', label: 'Dürbün Gözcüsü', tier: 'bronze', minBadgesRequired: 2 },
  { id: 'sunrise', icon: '🌄', label: 'Doğu Şafağı', tier: 'bronze', minBadgesRequired: 1, minScoreRequired: 250 },
  { id: 'hot_balloon', icon: '🎈', label: 'Kapadokya Balonu', tier: 'bronze', minBadgesRequired: 2 },

  // --- 🌱 0. KADEME: BAŞLANGIÇ (Herkes İçin Açık) ---
  { id: 'apprentice', icon: '🐣', label: 'Çırak Gezgin', tier: 'starter', minBadgesRequired: 0 },
  { id: 'novice_compass', icon: '🧭', label: 'Acemi Pusula', tier: 'starter', minBadgesRequired: 0 },
  { id: 'green_sprout', icon: '🌱', label: 'Yeşil Filiz', tier: 'starter', minBadgesRequired: 0 },
  { id: 'camp_fire', icon: '🔥', label: 'Çoban Ateşi', tier: 'starter', minBadgesRequired: 0 },
  { id: 'pin_marker', icon: '📍', label: 'Rota İğnesi', tier: 'starter', minBadgesRequired: 0 },
  { id: 'walking_traveler', icon: '🚶', label: 'Gezgin Seyyah', tier: 'starter', minBadgesRequired: 0 },
  { id: 'tea_glass', icon: '🫖', label: 'Demli Çay', tier: 'starter', minBadgesRequired: 0 },
  { id: 'clover', icon: '🍀', label: 'Şanslı Dört Yaprak', tier: 'starter', minBadgesRequired: 0 }
];

export const AVATAR_THEMES: AvatarThemeOption[] = [
  {
    id: 'cosmic_mythic',
    name: '🌌 5. Kademe (Kozmik Neon)',
    tierLevel: 5,
    bgGradient: 'bg-transparent',
    borderGlow: 'border-0',
    badgePinBg: 'text-amber-300',
    outlineFilter: 'drop-shadow(1.5px 0 0 #f472b6) drop-shadow(-1.5px 0 0 #f472b6) drop-shadow(0 1.5px 0 #22d3ee) drop-shadow(0 -1.5px 0 #22d3ee) drop-shadow(0 0 5px rgba(217,70,239,0.75))',
    outlineColor: '#f472b6',
    outlineLabel: 'Kozmik Neon'
  },
  {
    id: 'cyan_mythic',
    name: '💎 4. Kademe (Elmas Safir)',
    tierLevel: 4,
    bgGradient: 'bg-transparent',
    borderGlow: 'border-0',
    badgePinBg: 'text-cyan-300',
    outlineFilter: 'drop-shadow(1.5px 0 0 #38bdf8) drop-shadow(-1.5px 0 0 #38bdf8) drop-shadow(0 1.5px 0 #c084fc) drop-shadow(0 -1.5px 0 #c084fc) drop-shadow(0 0 4px rgba(56,189,248,0.75))',
    outlineColor: '#38bdf8',
    outlineLabel: 'Elmas Safir'
  },
  {
    id: 'gold_glory',
    name: '👑 3. Kademe (Şampiyon Altın)',
    tierLevel: 3,
    bgGradient: 'bg-transparent',
    borderGlow: 'border-0',
    badgePinBg: 'text-amber-300',
    outlineFilter: 'drop-shadow(1.5px 0 0 #fde047) drop-shadow(-1.5px 0 0 #fde047) drop-shadow(0 1.5px 0 #f59e0b) drop-shadow(0 -1.5px 0 #f59e0b) drop-shadow(0 0 4px rgba(245,158,11,0.65))',
    outlineColor: '#fde047',
    outlineLabel: 'Şampiyon Altını'
  },
  {
    id: 'indigo_midnight',
    name: '🛡️ 2. Kademe (Parlak Gümüş)',
    tierLevel: 2,
    bgGradient: 'bg-transparent',
    borderGlow: 'border-0',
    badgePinBg: 'text-slate-100',
    outlineFilter: 'drop-shadow(1.5px 0 0 #ffffff) drop-shadow(-1.5px 0 0 #ffffff) drop-shadow(0 1.5px 0 #94a3b8) drop-shadow(0 -1.5px 0 #94a3b8) drop-shadow(0 0 3px rgba(226,232,240,0.6))',
    outlineColor: '#ffffff',
    outlineLabel: 'Parlak Gümüş'
  },
  {
    id: 'emerald_forest',
    name: '🐣 1. Kademe (Sıcak Bronz)',
    tierLevel: 1,
    bgGradient: 'bg-transparent',
    borderGlow: 'border-0',
    badgePinBg: 'text-amber-300',
    outlineFilter: 'drop-shadow(1.5px 0 0 #fed7aa) drop-shadow(-1.5px 0 0 #fed7aa) drop-shadow(0 1.5px 0 #ea580c) drop-shadow(0 -1.5px 0 #ea580c) drop-shadow(0 0 3px rgba(234,88,12,0.5))',
    outlineColor: '#fed7aa',
    outlineLabel: 'Sıcak Bronz'
  }
];

/**
 * Returns sticker contour outline filter string for transparent avatars (PNG / Emoji / Glyph)
 * Purely outlines the object itself without any rectangular or circular bounding box!
 */
export function getAvatarOutlineFilter(themeId?: string, tierLevel = 0): string {
  if (themeId) {
    const matched = AVATAR_THEMES.find(t => t.id === themeId);
    if (matched && matched.outlineFilter) {
      return matched.outlineFilter;
    }
  }

  if (tierLevel >= 5) {
    return 'drop-shadow(1.5px 0 0 #f472b6) drop-shadow(-1.5px 0 0 #f472b6) drop-shadow(0 1.5px 0 #22d3ee) drop-shadow(0 -1.5px 0 #22d3ee) drop-shadow(0 0 5px rgba(217,70,239,0.75))';
  }
  if (tierLevel === 4) {
    return 'drop-shadow(1.5px 0 0 #38bdf8) drop-shadow(-1.5px 0 0 #38bdf8) drop-shadow(0 1.5px 0 #c084fc) drop-shadow(0 -1.5px 0 #c084fc) drop-shadow(0 0 4px rgba(56,189,248,0.75))';
  }
  if (tierLevel === 3) {
    return 'drop-shadow(1.5px 0 0 #fde047) drop-shadow(-1.5px 0 0 #fde047) drop-shadow(0 1.5px 0 #f59e0b) drop-shadow(0 -1.5px 0 #f59e0b) drop-shadow(0 0 4px rgba(245,158,11,0.65))';
  }
  if (tierLevel === 2) {
    return 'drop-shadow(1.5px 0 0 #ffffff) drop-shadow(-1.5px 0 0 #ffffff) drop-shadow(0 1.5px 0 #94a3b8) drop-shadow(0 -1.5px 0 #94a3b8) drop-shadow(0 0 3px rgba(226,232,240,0.6))';
  }
  if (tierLevel === 1) {
    return 'drop-shadow(1.5px 0 0 #fed7aa) drop-shadow(-1.5px 0 0 #fed7aa) drop-shadow(0 1.5px 0 #ea580c) drop-shadow(0 -1.5px 0 #ea580c) drop-shadow(0 0 3px rgba(234,88,12,0.5))';
  }
  return 'drop-shadow(1px 0 0 #ffffff) drop-shadow(-1px 0 0 #ffffff) drop-shadow(0 1px 0 #ffffff) drop-shadow(0 -1px 0 #ffffff) drop-shadow(0 1px 2px rgba(0,0,0,0.4))';
}

export const ALL_TITLES: UserTitle[] = [
  // --- 🌌 5. KADEME: MİSTİK KOZMİK & ZİRVE HÜKÜMDAR (EN ÜSTTE) ---
  {
    id: 'kozmik_cografya_efendisi',
    name: 'Kozmik Coğrafya Hükümdarı',
    icon: '🌌',
    tier: 'mythic',
    desc: '30\'dan fazla rozet ve mutlak bilgi birikimiyle evrensel zirveye ulaşan efsane.',
    requiredBadge: 'Kozmik Coğrafya Hükümdarı',
    requiredMetricText: '30 veya daha fazla rozet kazan'
  },
  {
    id: 'mutlak_taht_efendisi',
    name: 'Mutlak Tahtın Sahibi',
    icon: '🔱',
    tier: 'mythic',
    desc: '100 canlı 1v1 PvP düello zaferiyle kırılması imkansız bir efsane yazan hükümdar.',
    requiredBadge: 'Mutlak Tahtın Sahibi',
    requiredMetricText: '100 Canlı Düello zaferi kazan'
  },
  {
    id: 'kpss_ordinaryusu',
    name: 'KPSS Coğrafya Ordinaryüsü',
    icon: '🪐',
    tier: 'mythic',
    desc: '5000 test puanına ulaşarak Türkiye coğrafyasının en büyük otoritesi haline gelen bilgin.',
    requiredBadge: 'KPSS Coğrafya Ordinaryüsü',
    requiredMetricText: '5000 toplam test puanına ulaş'
  },
  {
    id: 'namaGlup_fatih_lord',
    name: 'Efsanevi Seri Fatihi',
    icon: '☀️',
    tier: 'mythic',
    desc: 'Canlı düellolarda üst üste 10 maç sıfır mağlubiyetle seriyi tamamlayan yenilmez.',
    requiredBadge: '10\'lu Yenilmez Seri',
    requiredMetricText: 'Üst üste 10 canlı düello kazan'
  },

  // --- 💎 4. KADEME: ELMAS & EFSANE ---
  {
    id: 'efsanevi_elmas_deha',
    name: 'Efsanevi Harita Dehası',
    icon: '💎',
    tier: 'diamond',
    desc: '20 kademeli rozeti toplayarak elmas mertebesine yükselen elit üstat.',
    requiredBadge: 'Efsanevi Coğrafyacı',
    requiredMetricText: '20 veya daha fazla rozet kazan'
  },
  {
    id: 'arena_tanrisi',
    name: 'Arena Efsanesi',
    icon: '⚔️',
    tier: 'diamond',
    desc: '50 canlı PVP düello zaferiyle arena tarihine adını altın harflerle kazıyan savaşçı.',
    requiredBadge: '50 Düello Zaferi',
    requiredMetricText: '50 Canlı Düello zaferi kazan'
  },
  {
    id: 'tahtin_sahibi',
    name: 'Tahtın Sahibi',
    icon: '🏆',
    tier: 'diamond',
    desc: '25 canlı PVP düello zaferiyle mutlak arena şampiyonu olan usta.',
    requiredBadge: 'Tahtın Sahibi',
    requiredMetricText: '25 Canlı Düello zaferi kazan'
  },
  {
    id: 'duello_krali',
    name: 'Arena Şampiyonu',
    icon: '👑',
    tier: 'diamond',
    desc: '10 canlı düello zaferiyle KPSS coğrafya arenasında zirveye oturan gladyatör.',
    requiredBadge: 'Düello Şampiyonu',
    requiredMetricText: '10 Canlı Düello zaferi kazan'
  },
  {
    id: 'kpss_sampiyonu',
    name: 'KPSS Coğrafya Şampiyonu',
    icon: '🎓',
    tier: 'diamond',
    desc: 'Testlerde 1500 puan barajını aşarak coğrafya sorularını altüst eden usta.',
    requiredBadge: 'KPSS Coğrafya Üstadı',
    requiredMetricText: '1500 toplam test puanına ulaş'
  },
  {
    id: 'turing_basmuhendisi',
    name: 'Turing Başmühendisi',
    icon: '🧠',
    tier: 'diamond',
    desc: 'Yapay zeka botuna karşı 25 galibiyet alarak siber arenayı fethetti.',
    requiredBadge: 'Siber Antrenör',
    requiredMetricText: 'Yapay zekaya karşı 25 galibiyet al'
  },
  {
    id: 'milimetrik_kartograf',
    name: 'Milimetrik Kartograf',
    icon: '🎯',
    tier: 'diamond',
    desc: 'Harita testlerinde 20 kez 5km altı kusursuz tam isabet gerçekleştirdi.',
    requiredBadge: 'Milimetrik Kartograf',
    requiredMetricText: '20 kez 5km altı tam isabet yap'
  },
  {
    id: 'dilsiz_harita_efendisi',
    name: 'Dilsiz Harita Efendisi',
    icon: '🙈',
    tier: 'diamond',
    desc: 'Dilsiz harita modunda 20 doğru tahmin yaparak haritayı hafızasına kazıdı.',
    requiredBadge: 'Dilsiz Harita Efendisi',
    requiredMetricText: 'Dilsiz modda 20 doğru yap'
  },

  // --- 👑 3. KADEME: ALTIN & ŞAMPİYON ---
  {
    id: 'il_81_fatihi',
    name: '81 İl Fatihi',
    icon: '🇹🇷',
    tier: 'gold',
    desc: 'Türkiye\'nin 81 ilinin yerini ve coğrafi özelliklerini ezbere bilen usta.',
    requiredBadge: '81 İl Fatihi',
    requiredMetricText: '81 İl test modunda başarı elde et'
  },
  {
    id: 'kusursuz_nisanci',
    name: 'Kusursuz Nişancı',
    icon: '🎯',
    tier: 'gold',
    desc: 'Harita testlerinde 5 kez 10km altı milimetrik tam isabetler tutturan usta.',
    requiredBadge: 'Tam İsabet Kaptan',
    requiredMetricText: '10km altı 5 tam isabet yap'
  },
  {
    id: 'seri_canavari_unvan',
    name: 'Yenilmez Seri Canavarı',
    icon: '🔥',
    tier: 'gold',
    desc: 'Ardı ardına sıfır hatayla 10 soru zincirleri kuran coğrafya makinesi.',
    requiredBadge: '10\'lu Seri Canavarı',
    requiredMetricText: 'Üst üste 10 doğru cevap ver'
  },
  {
    id: 'arena_gladyatoru',
    name: '1v1 Gladyatör',
    icon: '⚔️',
    tier: 'gold',
    desc: 'Canlı 1v1 düellolarda 3 maç kazanarak gerçek rakiplere üstünlük sağlayan yarışmacı.',
    requiredBadge: '1v1 Gladyatör',
    requiredMetricText: '3 Canlı Düello zaferi kazan'
  },
  {
    id: 'dilsiz_harita_dehasi',
    name: 'Dilsiz Harita Dehası',
    icon: '🙈',
    tier: 'gold',
    desc: 'Harita yazıları olmadan yer şekillerini ve illeri hatasız bulan usta.',
    requiredBadge: '3D Dilsiz Harita Kasırgası',
    requiredMetricText: 'Dilsiz haritada 5 doğru tahmin yap'
  },
  {
    id: 'volkan_avcisi',
    name: 'Volkan & Bozkır Bilgesi',
    icon: '🌋',
    tier: 'gold',
    desc: 'Türkiye volkan konileri, kalderaları ve İç Anadolu jeomorfolojisine hakim uzman.',
    requiredBadge: 'Volkanizma & Buzul Bilgesi',
    requiredMetricText: 'Volkanizma sorularında 5 doğru cevap'
  },
  {
    id: 'bot_avcisi_unvan',
    name: 'Yapay Zeka Mat Eden',
    icon: '⚡',
    tier: 'gold',
    desc: 'Yapay zeka botuna karşı 10 galibiyet alarak yapay zekayı dize getiren oyuncu.',
    requiredBadge: 'Yapay Zeka Mat Eden',
    requiredMetricText: 'Yapay zekaya karşı 10 galibiyet al'
  },

  // --- 🛡️ 2. KADEME: GÜMÜŞ & UZMAN ---
  {
    id: 'turing_ustasi_unvan',
    name: 'Turing Fatihi',
    icon: '🧠',
    tier: 'silver',
    desc: 'Yapay zeka antrenman botuna karşı 5 galibiyet kazanan öğrenci.',
    requiredBadge: 'Turing Ustası',
    requiredMetricText: 'Yapay zekaya karşı 5 galibiyet al'
  },
  {
    id: 'karadeniz_kaplani',
    name: 'Karadeniz Kıvrım Kaplanı',
    icon: '⛰️',
    tier: 'silver',
    desc: 'Kuzey Anadolu dağları, boyuna kıyı tipi ve Zigana/Kop geçitlerini çözen usta.',
    requiredBadge: 'Karadeniz Dağları & Geçitleri Kaplanı',
    requiredMetricText: 'Karadeniz Bölgesi testlerinde 5 doğru'
  },
  {
    id: 'gap_muhafizi',
    name: 'GAP & Fırat Muhafızı',
    icon: '🌾',
    tier: 'silver',
    desc: 'Güneydoğu Anadolu ovaları, Fırat-Dicle havzası ve hidroelektrik santralleri uzmanı.',
    requiredBadge: 'Güneydoğu Anadolu Baraj & Ovalar Şampiyonu',
    requiredMetricText: 'Güneydoğu Anadolu testlerinde 5 doğru'
  },
  {
    id: 'dogu_kalesi',
    name: 'Doğu Anadolu Kalesi',
    icon: '🌊',
    tier: 'silver',
    desc: 'Doğu Anadolu yüksek platoları, tektonik-volkanik gölleri ve akarsularına hakim usta.',
    requiredBadge: 'Doğu Anadolu Akarsuları Uzmanı',
    requiredMetricText: 'Doğu Anadolu Bölgesi testlerinde 5 doğru'
  },
  {
    id: 'bogazlar_hakimi',
    name: 'Boğazlar & Marmara Hakimi',
    icon: '🌉',
    tier: 'silver',
    desc: 'Marmara geçiş iklimleri, boğaz akıntıları, ria kıyıları ve sanayi coğrafyası uzmanı.',
    requiredBadge: 'Marmara İklim & Coğrafya Uzmanı',
    requiredMetricText: 'Marmara Bölgesi testlerinde 5 doğru'
  },
  {
    id: 'sinir_bekcisi',
    name: 'Sınır & Geçit Bekçisi',
    icon: '🚪',
    tier: 'silver',
    desc: 'Türkiye\'nin tüm demiryolu ve karayolu sınır kapıları ile dağ geçitlerini ezberleyen.',
    requiredBadge: 'Türkiye Sınır Kapıları & Geçit Muhafızı',
    requiredMetricText: 'Sınır Kapıları testlerinde 5 doğru'
  },
  {
    id: 'horst_graben_ustasi',
    name: 'Horst-Graben Ustası',
    icon: '🏖️',
    tier: 'silver',
    desc: 'Ege kırık dağları ve enine kıyı yapısına bütünüyle hakim usta.',
    requiredBadge: 'Ege Kıyı & Horst-Graben Fatihi',
    requiredMetricText: 'Ege Bölgesi testlerinde 5 doğru'
  },
  {
    id: 'toroslar_fatihi',
    name: 'Toroslar Fatihi',
    icon: '🏛️',
    tier: 'silver',
    desc: 'Akdeniz karstik şekilleri, polye ve Toros dağ sisteminin uzmanı.',
    requiredBadge: 'Akdeniz Karstik Şekiller & Toroslar Kaptanı',
    requiredMetricText: 'Akdeniz Bölgesi testlerinde 5 doğru'
  },

  // --- 🐣 1. KADEME: BRONZ & ÇIRAK ---
  {
    id: 'harita_kasifi',
    name: 'Harita Kaşifi',
    icon: '🗺️',
    tier: 'bronze',
    desc: 'Türkiye topoğrafyasında ilk yer şekillerini keşfeden gezgin.',
    requiredBadge: 'Tam İsabet Kaptan',
    requiredMetricText: '15km altı tam isabet yap'
  },
  {
    id: 'cografyaci_ciragi',
    name: '3D Coğrafyacı Çırağı',
    icon: '🐣',
    tier: 'bronze',
    desc: 'Coğrafya öğrenim serüvenine adım atan hevesli öğrenci.',
    requiredBadge: '3D Coğrafyacı Çırağı',
    requiredMetricText: 'Varsayılan Başlangıç Ünvanı'
  }
];

export interface TitleProgressInfo {
  isUnlocked: boolean;
  currentValue: number;
  targetValue: number;
  progressPct: number;
  remainingText: string;
  metricLabel: string;
}

export function getTitleProgress(
  title: UserTitle,
  unlockedBadges: string[] = [],
  duelWins: number = 0,
  score: number = 0,
  categoryMasteryProgress: Record<string, number> = {},
  botWins: number = 0
): TitleProgressInfo {
  const isBadgeUnlocked = !title.requiredBadge || unlockedBadges.includes(title.requiredBadge) || title.id === 'cografyaci_ciragi';
  
  if (isBadgeUnlocked) {
    return {
      isUnlocked: true,
      currentValue: 1,
      targetValue: 1,
      progressPct: 100,
      remainingText: 'Kuşanılabilir ✓',
      metricLabel: title.requiredMetricText
    };
  }

  let current = 0;
  let target = 1;
  let unit = '';

  switch (title.id) {
    case 'kozmik_cografya_efendisi':
      current = unlockedBadges.length;
      target = 30;
      unit = 'rozet';
      break;
    case 'mutlak_taht_efendisi':
      current = duelWins;
      target = 100;
      unit = 'zafer';
      break;
    case 'kpss_ordinaryusu':
      current = score;
      target = 5000;
      unit = 'puan';
      break;
    case 'namaGlup_fatih_lord':
      current = categoryMasteryProgress['max_duel_streak'] || 0;
      target = 10;
      unit = 'seri zafer';
      break;
    case 'arena_tanrisi':
      current = duelWins;
      target = 50;
      unit = 'zafer';
      break;
    case 'tahtin_sahibi':
      current = duelWins;
      target = 25;
      unit = 'zafer';
      break;
    case 'duello_krali':
      current = duelWins;
      target = 10;
      unit = 'zafer';
      break;
    case 'arena_gladyatoru':
      current = duelWins;
      target = 3;
      unit = 'zafer';
      break;
    case 'efsanevi_elmas_deha':
      current = unlockedBadges.length;
      target = 20;
      unit = 'rozet';
      break;
    case 'kpss_sampiyonu':
      current = score;
      target = 1500;
      unit = 'puan';
      break;
    case 'turing_basmuhendisi':
      current = botWins;
      target = 25;
      unit = 'bot zaferi';
      break;
    case 'bot_avcisi_unvan':
      current = botWins;
      target = 10;
      unit = 'bot zaferi';
      break;
    case 'turing_ustasi_unvan':
      current = botWins;
      target = 5;
      unit = 'bot zaferi';
      break;
    case 'seri_canavari_unvan':
      current = categoryMasteryProgress['max_streak'] || 0;
      target = 10;
      unit = 'seri doğru';
      break;
    case 'dilsiz_harita_efendisi':
      current = categoryMasteryProgress['dilsiz_harita'] || 0;
      target = 20;
      unit = 'doğru';
      break;
    case 'dilsiz_harita_dehasi':
      current = categoryMasteryProgress['dilsiz_harita'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'milimetrik_kartograf':
      current = categoryMasteryProgress['kusursuz_isabet_5km'] || 0;
      target = 20;
      unit = 'tam isabet';
      break;
    case 'kusursuz_nisanci':
      current = categoryMasteryProgress['kusursuz_isabet_10km'] || 0;
      target = 5;
      unit = 'tam isabet';
      break;
    case 'toroslar_fatihi':
      current = categoryMasteryProgress['Akdeniz_Karstik'] || categoryMasteryProgress['Akdeniz_Genel'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'horst_graben_ustasi':
      current = categoryMasteryProgress['Ege_Genel'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'gap_muhafizi':
      current = categoryMasteryProgress['Güneydoğu_Barajlar'] || categoryMasteryProgress['Güneydoğu Anadolu_Genel'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'volkan_avcisi':
      current = categoryMasteryProgress['İç Anadolu_Volkanlar'] || categoryMasteryProgress['İç Anadolu_Genel'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'karadeniz_kaplani':
      current = categoryMasteryProgress['Karadeniz_Genel'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'dogu_kalesi':
      current = categoryMasteryProgress['Doğu Anadolu_Akarsular'] || categoryMasteryProgress['Doğu Anadolu_Genel'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'bogazlar_hakimi':
      current = categoryMasteryProgress['Marmara_Genel'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'sinir_bekcisi':
      current = categoryMasteryProgress['Sınır Kapıları_Geçitler'] || categoryMasteryProgress['PassesAndGates'] || 0;
      target = 5;
      unit = 'doğru';
      break;
    case 'il_81_fatihi':
      current = categoryMasteryProgress['81_il_provinces'] || 0;
      target = 1;
      unit = 'tamamlama';
      break;
    default:
      current = 0;
      target = 1;
      unit = 'adım';
      break;
  }

  const clamped = Math.min(target, Math.max(0, current));
  const pct = Math.min(100, Math.round((clamped / target) * 100));
  const remaining = Math.max(0, target - clamped);

  return {
    isUnlocked: clamped >= target,
    currentValue: clamped,
    targetValue: target,
    progressPct: pct,
    remainingText: clamped >= target ? 'Kazanıldı ✓' : `${remaining} ${unit} kaldı`,
    metricLabel: title.requiredMetricText
  };
}

export const ALL_BADGES: Badge[] = [
  // ==========================================
  // --- 🌌 5. KADEME: MİSTİK & KOZMİK BAŞARIMLAR (Aylar Süren Hedefler) ---
  // ==========================================
  {
    id: 'kozmik_cografya_hakimi',
    name: 'Kozmik Coğrafya Hükümdarı',
    icon: '🌌',
    category: 'Efsanevi Prestij',
    tier: 'mythic',
    tierLevel: 5,
    desc: '30 veya daha fazla başarı rozeti toplayarak Türkiye coğrafyasında mutlak zirveye ulaştın.',
    targetCount: 30,
    reqText: 'Toplam 30 rozet kilidi aç.',
    trackerKey: 'BadgesCount30',
    associatedTitle: 'Kozmik Coğrafya Hükümdarı'
  },
  {
    id: 'mutlak_taht_sahibi',
    name: 'Mutlak Tahtın Sahibi',
    icon: '🔱',
    category: 'Canlı 1v1 Düello',
    tier: 'mythic',
    tierLevel: 5,
    desc: 'Canlı 1v1 düellolarda 100 gerçek zafer kazanarak mutlak arena tahtına adını kazıdın.',
    targetCount: 100,
    reqText: 'Canlı düellolarda 100 maç kazan.',
    trackerKey: 'DuelWins100',
    associatedTitle: 'Mutlak Tahtın Sahibi'
  },
  {
    id: 'kpss_ordinaryus_rozet',
    name: 'KPSS Coğrafya Ordinaryüsü',
    icon: '🪐',
    category: 'Skor Başarımı',
    tier: 'mythic',
    tierLevel: 5,
    desc: 'Testlerde toplam 5000 puan barajını aşarak coğrafya ansiklopedisi unvanını aldın.',
    targetCount: 5000,
    reqText: 'Testlerde 5000 toplam puana ulaş.',
    trackerKey: 'Score5000',
    associatedTitle: 'KPSS Coğrafya Ordinaryüsü'
  },
  {
    id: 'namaglup_seri_10',
    name: '10\'lu Yenilmez Seri',
    icon: '☀️',
    category: 'Canlı 1v1 Düello',
    tier: 'mythic',
    tierLevel: 5,
    desc: 'Canlı 1v1 düellolarda üst üste 10 maç sıfır mağlubiyetle namağlup seri yakaladın.',
    targetCount: 10,
    reqText: 'Üst üste 10 canlı düello kazan.',
    trackerKey: 'DuelStreak10',
    associatedTitle: 'Efsanevi Seri Fatihi'
  },

  // ==========================================
  // --- 💎 4. KADEME: ELMAS & EFSANE BAŞARIMLARI ---
  // ==========================================
  {
    id: 'tahtin_sahibi',
    name: 'Tahtın Sahibi',
    icon: '🏆',
    category: 'Canlı 1v1 Düello',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Canlı 1v1 düellolarda 25 zafer kazanarak mutlak arena efsanesi oldun.',
    targetCount: 25,
    reqText: 'Canlı düellolarda 25 maç kazan.',
    trackerKey: 'DuelWins25',
    associatedTitle: 'Tahtın Sahibi'
  },
  {
    id: 'duello_50_zafer',
    name: '50 Düello Zaferi',
    icon: '⚔️',
    category: 'Canlı 1v1 Düello',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Canlı 1v1 düellolarda gerçek rakiplere karşı 50 galibiyet kazandın.',
    targetCount: 50,
    reqText: 'Canlı düellolarda 50 maç kazan.',
    trackerKey: 'DuelWins50',
    associatedTitle: 'Arena Efsanesi'
  },
  {
    id: 'duello_sampiyonu',
    name: 'Düello Şampiyonu',
    icon: '👑',
    category: 'Canlı 1v1 Düello',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Canlı 1v1 düellolarda 10 zaferle arenada zirveye oturdun.',
    targetCount: 10,
    reqText: 'Canlı düellolarda 10 maç kazan.',
    trackerKey: 'DuelWins10',
    associatedTitle: 'Arena Şampiyonu'
  },
  {
    id: 'efsane_cografyaci',
    name: 'Efsanevi Coğrafyacı',
    icon: '💎',
    category: 'Efsanevi Prestij',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Toplam 20 veya daha fazla rozet kazanarak elit elmas seviyeye ulaştın.',
    targetCount: 20,
    reqText: 'Toplam 20 rozet kilidi aç.',
    trackerKey: 'BadgesCount20',
    associatedTitle: 'Efsanevi Harita Dehası'
  },
  {
    id: 'kpss_ustadi',
    name: 'KPSS Coğrafya Üstadı',
    icon: '🎓',
    category: 'Skor Başarımı',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Test modunda 1500 puan barajını aştın.',
    targetCount: 1500,
    reqText: 'Testlerde 1500 toplam puana ulaş.',
    trackerKey: 'Score1500',
    associatedTitle: 'KPSS Coğrafya Şampiyonu'
  },
  {
    id: 'siber_antrenor',
    name: 'Siber Antrenör',
    icon: '🚀',
    category: 'Yapay Zeka Arenası',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Yapay zeka botuna karşı 25 maç kazanarak kusursuz antrenman seviyesine ulaştın.',
    targetCount: 25,
    reqText: 'Yapay zekaya karşı 25 galibiyet al.',
    trackerKey: 'BotWins25',
    associatedTitle: 'Turing Başmühendisi'
  },
  {
    id: 'milimetrik_kartograf_rozet',
    name: 'Milimetrik Kartograf',
    icon: '🎯',
    category: 'Pim Tahmin',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Harita testinde 20 kez 5 km altında kusursuz tam isabet yaptın.',
    targetCount: 20,
    reqText: '20 kez 5 km altında tam isabet yap.',
    trackerKey: 'TamIsabet5km_20',
    associatedTitle: 'Milimetrik Kartograf'
  },
  {
    id: 'dilsiz_harita_efendisi_rozet',
    name: 'Dilsiz Harita Efendisi',
    icon: '🙈',
    category: 'Zorlu Mod',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Dilsiz harita modunda 20 doğru tahmin yaparak haritayı zihnine kazıdın.',
    targetCount: 20,
    reqText: 'Dilsiz modda 20 doğru tahmin yap.',
    trackerKey: 'BlindMap20',
    associatedTitle: 'Dilsiz Harita Efendisi'
  },

  // ==========================================
  // --- 👑 3. KADEME: ALTIN & ŞAMPİYON BAŞARIMLARI ---
  // ==========================================
  {
    id: 'duello_gladyatoru',
    name: '1v1 Gladyatör',
    icon: '🛡️',
    category: 'Canlı 1v1 Düello',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Canlı 1v1 düellolarda gerçek rakiplere karşı 3 zafer kazandın.',
    targetCount: 3,
    reqText: 'Canlı düellolarda 3 maç kazan.',
    trackerKey: 'DuelWins3',
    associatedTitle: '1v1 Gladyatör'
  },
  {
    id: 'yenilmez_fatih',
    name: 'Yenilmez Fatih',
    icon: '🔥',
    category: 'Canlı 1v1 Düello',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Canlı düellolarda üst üste 3 maç kazanarak namağlup seri yakaladın.',
    targetCount: 3,
    reqText: 'Üst üste 3 canlı düello maçı kazan.',
    trackerKey: 'DuelStreak3'
  },
  {
    id: 'seri_canavari',
    name: '10\'lu Seri Canavarı',
    icon: '🔥',
    category: 'Seri Başarımı',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Üst üste 10 doğru cevap verdin.',
    targetCount: 10,
    reqText: 'Üst üste 10 doğru cevap ver.',
    trackerKey: 'Streak10',
    associatedTitle: 'Yenilmez Seri Canavarı'
  },
  {
    id: 'bot_mat_eden',
    name: 'Yapay Zeka Mat Eden',
    icon: '⚡',
    category: 'Yapay Zeka Arenası',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Yapay zeka botuna karşı 10 galibiyetle antrenman arenasını fethettin.',
    targetCount: 10,
    reqText: 'Yapay zekaya karşı 10 galibiyet al.',
    trackerKey: 'BotWins10',
    associatedTitle: 'Yapay Zeka Mat Eden'
  },
  {
    id: 'dilsiz_harita_kasirgasi',
    name: '3D Dilsiz Harita Kasırgası',
    icon: '🙈',
    category: 'Zorlu Mod',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Şehir isimleri ve harita yazıları olmadan dilsiz modda 5 doğru yaptın.',
    targetCount: 5,
    reqText: 'Dilsiz Harita Modunda 5 doğru tahmin yap.',
    trackerKey: 'BlindMapCorrect',
    associatedTitle: 'Dilsiz Harita Dehası'
  },
  {
    id: 'volkanik_sekiller_ustasi',
    name: 'Volkanizma & Buzul Bilgesi',
    icon: '🌋',
    category: 'Jeomorfoloji',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Maarlar, kalderalar, genç volkan konileri ve aktüel/sirk buzullarını çözdün.',
    targetCount: 5,
    reqText: 'Volkanik & Buzul oluşum sorularında 5 doğru cevap ver.',
    trackerKey: 'VolcanicGlacial',
    associatedTitle: 'Volkan & Bozkır Bilgesi'
  },
  {
    id: 'il_81_kasifi',
    name: '81 İl Fatihi',
    icon: '🇹🇷',
    category: 'Şehir Uzmanlığı',
    tier: 'gold',
    tierLevel: 3,
    desc: '81 il bulmaca modunu başarıyla tamamlayıp Türkiye mülki haritasına hakim oldun.',
    targetCount: 1,
    reqText: '81 İl harita bulmacasını tamamla.',
    trackerKey: 'Provinces81',
    associatedTitle: '81 İl Fatihi'
  },
  {
    id: 'kpss_puan_500',
    name: 'KPSS 500 Puan Barajı',
    icon: '🏅',
    category: 'Skor Başarımı',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Testlerde 500 toplam puan barajını aştın.',
    targetCount: 500,
    reqText: 'Testlerde 500 puana ulaş.',
    trackerKey: 'Score500'
  },

  // ==========================================
  // --- 🛡️ 2. KADEME: GÜMÜŞ & UZMAN BAŞARIMLARI ---
  // ==========================================
  {
    id: 'dogu_anadolu_akarsu',
    name: 'Doğu Anadolu Akarsuları Uzmanı',
    icon: '🌊',
    category: 'Bölge Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Doğu Anadolu akarsuları (Fırat, Dicle, Aras, Kura, Çoruh) ve göllerini çözdün.',
    targetCount: 5,
    reqText: 'Doğu Anadolu sorularında 5 doğru cevap ver.',
    trackerKey: 'Doğu Anadolu_Akarsular',
    associatedTitle: 'Doğu Anadolu Kalesi'
  },
  {
    id: 'marmara_iklim_cografya',
    name: 'Marmara İklim & Coğrafya Uzmanı',
    icon: '🌉',
    category: 'Bölge Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Marmara Bölgesi yer şekilleri, iklim geçişleri ve boğaz sistemlerini kavradın.',
    targetCount: 5,
    reqText: 'Marmara Bölgesi sorularında 5 doğru cevap ver.',
    trackerKey: 'Marmara_Genel',
    associatedTitle: 'Boğazlar & Marmara Hakimi'
  },
  {
    id: 'ege_kiyi_horst',
    name: 'Ege Kıyı & Horst-Graben Fatihi',
    icon: '🏖️',
    category: 'Bölge Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Ege Kıyı tipleri, enine kıyı yapısı ve Kırık Dağları eksiksiz bildin.',
    targetCount: 5,
    reqText: 'Ege Bölgesi sorularında 5 doğru cevap ver.',
    trackerKey: 'Ege_Genel',
    associatedTitle: 'Horst-Graben Ustası'
  },
  {
    id: 'karadeniz_dag_gecit',
    name: 'Karadeniz Dağları & Geçitleri Kaplanı',
    icon: '⛰️',
    category: 'Bölge Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Karadeniz Kıvrım Dağları, boyuna kıyı yapısı ve Zigana/Kop geçitlerine hakimsin.',
    targetCount: 5,
    reqText: 'Karadeniz Bölgesi sorularında 5 doğru cevap ver.',
    trackerKey: 'Karadeniz_Genel',
    associatedTitle: 'Karadeniz Kıvrım Kaplanı'
  },
  {
    id: 'ic_anadolu_plato_volkan',
    name: 'İç Anadolu Platoları & Volkanları Üstadı',
    icon: '🌋',
    category: 'Bölge Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'İç Anadolu platoları, sönmüş volkan dizilimi ve kapalı havzalarını bildin.',
    targetCount: 5,
    reqText: 'İç Anadolu sorularında 5 doğru cevap ver.',
    trackerKey: 'İç Anadolu_Genel',
    associatedTitle: 'Volkan & Bozkır Bilgesi'
  },
  {
    id: 'akdeniz_karstik',
    name: 'Akdeniz Karstik Şekiller & Toroslar Kaptanı',
    icon: '🏛️',
    category: 'Bölge Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Akdeniz karstik platoları (Teke-Taşeli), polye ve Toros dağ sistemini çözdün.',
    targetCount: 5,
    reqText: 'Akdeniz sorularında 5 doğru cevap ver.',
    trackerKey: 'Akdeniz_Genel',
    associatedTitle: 'Toroslar Fatihi'
  },
  {
    id: 'guneydogu_baraj_ova',
    name: 'Güneydoğu Anadolu Baraj & Ovalar Şampiyonu',
    icon: '🌾',
    category: 'Bölge Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'GAP kapsamındaki barajlar, Fırat-Dicle havzası ve düz kütle yapısını bildin.',
    targetCount: 5,
    reqText: 'Güneydoğu Anadolu sorularında 5 doğru cevap ver.',
    trackerKey: 'Güneydoğu Anadolu_Genel',
    associatedTitle: 'GAP & Fırat Muhafızı'
  },
  {
    id: 'sinir_kapilari_gecit',
    name: 'Türkiye Sınır Kapıları & Geçit Muhafızı',
    icon: '🚪',
    category: 'Konu Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Tüm stratejik sınır kapıları ve dağ geçitlerini ezberledin.',
    targetCount: 5,
    reqText: 'Sınır Kapıları veya Geçitler kategorisinde 5 doğru cevap ver.',
    trackerKey: 'PassesAndGates',
    associatedTitle: 'Sınır & Geçit Bekçisi'
  },
  {
    id: 'plato_ova_fatihi',
    name: 'Platolar & Ovalar Hakimi',
    icon: '🗺️',
    category: 'Jeomorfoloji',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Tabaka düzlüğü, karstik, lav ve aşınım platoları ile deltaları bildin.',
    targetCount: 5,
    reqText: 'Platolar & Ovalar sorularında 5 doğru cevap ver.',
    trackerKey: 'PlateausPlains'
  },
  {
    id: 'karstik_sekiller_ustasi',
    name: 'Karstik & Kıyı Şekilleri Uzmanı',
    icon: '🏖️',
    category: 'Jeomorfoloji',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Lapya-dolin-polye, obruklar, mağaralar, travertenler ve falez/tomboloları çözdün.',
    targetCount: 5,
    reqText: 'Karstik & Kıyı kategorisinde 5 doğru cevap ver.',
    trackerKey: 'KarsticCoastal'
  },
  {
    id: 'bot_kiran',
    name: 'Turing Ustası',
    icon: '🧠',
    category: 'Yapay Zeka Arenası',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Yapay zeka botuna karşı 5 maç kazanarak hızını ve bilgini kanıtladın.',
    targetCount: 5,
    reqText: 'Yapay zekaya karşı 5 galibiyet al.',
    trackerKey: 'BotWins5',
    associatedTitle: 'Turing Fatihi'
  },
  {
    id: 'simsek_refleks',
    name: 'Şimşek Refleks',
    icon: '⚡',
    category: 'Hız & Refleks',
    tier: 'silver',
    tierLevel: 2,
    desc: '3 saniye içinde nokta atışı veya doğru test cevabı verdin.',
    targetCount: 1,
    reqText: '3 saniyenin altında doğru cevap ver.',
    trackerKey: 'SpeedReflex'
  },

  // ==========================================
  // --- 🐣 1. KADEME: BRONZ & ÇIRAK BAŞARIMLARI ---
  // ==========================================
  {
    id: 'cografyaci_ciragi',
    name: '3D Coğrafyacı Çırağı',
    icon: '🐣',
    category: 'Başlangıç',
    tier: 'bronze',
    tierLevel: 1,
    desc: 'Uygulamaya ilk adım attın ve keşfe başladın.',
    targetCount: 1,
    reqText: 'İlk harita keşfini yap.',
    trackerKey: 'InitialStep',
    associatedTitle: '3D Coğrafyacı Çırağı'
  },
  {
    id: 'tam_isabet',
    name: 'Tam İsabet Kaptan',
    icon: '🎯',
    category: 'Pim Tahmin',
    tier: 'bronze',
    tierLevel: 1,
    desc: 'Pim bulma oyununda %100 tam isabet (<= 15km) yaptın.',
    targetCount: 1,
    reqText: 'Harita testinde 15 km altında isabet yap.',
    trackerKey: 'TamIsabet',
    associatedTitle: 'Harita Kaşifi'
  },
  {
    id: 'bot_caylagi',
    name: 'Yapay Zeka Çırağı',
    icon: '🤖',
    category: 'Yapay Zeka Arenası',
    tier: 'bronze',
    tierLevel: 1,
    desc: 'Yapay zeka antrenman modunda ilk maçını kazanıp galibiyet aldın.',
    targetCount: 1,
    reqText: 'Yapay zekaya karşı 1 galibiyet al.',
    trackerKey: 'BotWins1'
  },
  {
    id: 'arena_caylagi',
    name: 'Arena Çaylağı',
    icon: '⚔️',
    category: 'Canlı 1v1 Düello',
    tier: 'bronze',
    tierLevel: 1,
    desc: 'İlk canlı 1v1 gerçek rakip coğrafya düellona katıldın.',
    targetCount: 1,
    reqText: 'En az 1 canlı düelloyu tamamla.',
    trackerKey: 'DuelPlayed1'
  }
];

export interface TitleTierStyleInfo {
  badgeClass: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
  tierName: string;
  tierNumber: number;
  glowShadow: string;
}

/**
 * Returns distinct, strictly hierarchical visual styling for titles
 */
export function getTitleTierStyle(tier: BadgeTier | 'starter'): TitleTierStyleInfo {
  switch (tier) {
    case 'mythic':
      return {
        badgeClass: 'bg-purple-950/90 border-2 border-fuchsia-400 ring-2 ring-cyan-400/80 text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.7)] font-black',
        textClass: 'text-fuchsia-200 font-black',
        borderClass: 'border-2 border-fuchsia-400 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(217,70,239,0.7)]',
        bgClass: 'bg-gradient-to-tr from-purple-950/90 via-slate-950 to-cyan-950/90',
        tierName: '🌌 5. Kademe (Mistik)',
        tierNumber: 5,
        glowShadow: 'shadow-[0_0_20px_rgba(217,70,239,0.7)]'
      };
    case 'diamond':
      return {
        badgeClass: 'bg-cyan-950/90 border-2 border-cyan-300 ring-2 ring-purple-400/80 text-cyan-100 shadow-[0_0_16px_rgba(6,182,212,0.6)] font-black',
        textClass: 'text-cyan-200 font-black',
        borderClass: 'border-2 border-cyan-300 ring-2 ring-purple-400 shadow-[0_0_16px_rgba(6,182,212,0.6)]',
        bgClass: 'bg-gradient-to-tr from-cyan-950/90 via-indigo-950 to-purple-950/90',
        tierName: '💎 4. Kademe (Elmas)',
        tierNumber: 4,
        glowShadow: 'shadow-[0_0_16px_rgba(6,182,212,0.6)]'
      };
    case 'gold':
      return {
        badgeClass: 'bg-amber-950/90 border-2 border-amber-300 ring-2 ring-amber-400/70 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.5)] font-bold',
        textClass: 'text-amber-300 font-bold',
        borderClass: 'border-2 border-amber-300 ring-2 ring-amber-400/70 shadow-[0_0_14px_rgba(245,158,11,0.5)]',
        bgClass: 'bg-gradient-to-tr from-amber-950 via-yellow-950 to-slate-900',
        tierName: '👑 3. Kademe (Altın)',
        tierNumber: 3,
        glowShadow: 'shadow-[0_0_14px_rgba(245,158,11,0.5)]'
      };
    case 'silver':
      return {
        badgeClass: 'bg-slate-900/90 border-2 border-slate-200 ring-1 ring-slate-300/70 text-slate-100 shadow-[0_0_10px_rgba(203,213,225,0.4)] font-bold',
        textClass: 'text-slate-100 font-bold',
        borderClass: 'border-2 border-slate-200 ring-1 ring-slate-300/70 shadow-[0_0_10px_rgba(203,213,225,0.4)]',
        bgClass: 'bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950',
        tierName: '🛡️ 2. Kademe (Gümüş)',
        tierNumber: 2,
        glowShadow: 'shadow-[0_0_10px_rgba(203,213,225,0.4)]'
      };
    case 'bronze':
      return {
        badgeClass: 'bg-amber-950/70 border-2 border-amber-500 ring-1 ring-amber-700/60 text-amber-200 shadow-[0_0_8px_rgba(180,83,9,0.3)] font-semibold',
        textClass: 'text-amber-300 font-semibold',
        borderClass: 'border-2 border-amber-500 ring-1 ring-amber-700/60 shadow-[0_0_8px_rgba(180,83,9,0.3)]',
        bgClass: 'bg-gradient-to-tr from-amber-950/50 to-slate-950',
        tierName: '🐣 1. Kademe (Bronz)',
        tierNumber: 1,
        glowShadow: 'shadow-[0_0_8px_rgba(180,83,9,0.3)]'
      };
    case 'starter':
    default:
      return {
        badgeClass: 'bg-slate-900/60 border-2 border-slate-600/80 text-slate-300 shadow-none font-normal',
        textClass: 'text-slate-300 font-normal',
        borderClass: 'border-2 border-slate-600/80 shadow-none',
        bgClass: 'bg-slate-950',
        tierName: '🌱 Başlangıç',
        tierNumber: 0,
        glowShadow: 'shadow-none'
      };
  }
}

export interface PrestigeTierInfo {
  tier: BadgePrestigeTier;
  tierLevel: number; // 0: Başlangıç, 1: Bronz, 2: Gümüş, 3: Altın, 4: Elmas, 5: Mistik Kozmik
  tierLabel: string;
  title: string;
  badgeCount: number;
  frameBorderClass: string;
  glowClass: string;
  pinIcon: string;
  pinBadgeName: string;
  pinBorderClass: string;
  gradientBg: string;
  titleBadgeClass: string;
  ringClass: string;
  sparkleEffect: boolean;
  orbitalEffect?: boolean;
}

/**
 * Returns auto-equipped title specifically for 1v1 duels based on duel wins/streaks
 */
export function getAutoEquippedDuelTitle(duelWins = 0, duelStreak = 0, unlockedBadges: string[] = []): string {
  if (duelWins >= 100 || unlockedBadges.includes('Mutlak Tahtın Sahibi')) {
    return '🔱 Mutlak Tahtın Sahibi';
  }
  if (duelWins >= 50 || unlockedBadges.includes('50 Düello Zaferi')) {
    return '⚔️ Arena Efsanesi';
  }
  if (duelWins >= 25 || unlockedBadges.includes('Tahtın Sahibi')) {
    return '🏆 Tahtın Sahibi';
  }
  if (duelWins >= 10 || unlockedBadges.includes('Düello Şampiyonu')) {
    return '👑 Arena Şampiyonu';
  }
  if (duelStreak >= 3 || unlockedBadges.includes('Yenilmez Fatih')) {
    return '🔥 Yenilmez Fatih';
  }
  if (duelWins >= 3 || unlockedBadges.includes('1v1 Gladyatör')) {
    return '🛡️ 1v1 Gladyatör';
  }
  if (duelWins >= 1 || unlockedBadges.includes('Arena Çaylağı')) {
    return '⚔️ Arena Savaşçısı';
  }
  return '🎯 Arena Adayı';
}

/**
 * Calculates 1v1 duel exclusive prestige tier (borders, glow, top-right pin icon)
 * Strict hierarchy: Mythic (100+ wins) > Diamond (25+ wins) > Gold (3+ wins or streak) > Silver (1+ win) > Starter (0 wins)
 */
export function getDuelPrestigeTier(
  duelWins = 0,
  duelStreak = 0,
  unlockedBadges: string[] = [],
  customTitle?: string
): PrestigeTierInfo {
  const duelTitle = getAutoEquippedDuelTitle(duelWins, duelStreak, unlockedBadges);

  // Check if custom title is equipped and its tier
  const cleanTitleName = (customTitle || '').replace(/^[^\w\s\u00C0-\u017F]+/i, '').trim();
  const matchedTitle = ALL_TITLES.find(t => 
    t.name === customTitle || 
    t.id === customTitle || 
    t.name.toLowerCase() === cleanTitleName.toLowerCase() ||
    (customTitle && customTitle.includes(t.name))
  );

  const activeTitle = customTitle && customTitle !== '3D Coğrafyacı Çırağı' ? customTitle : duelTitle;
  const activePinIcon = matchedTitle?.icon || (duelWins >= 100 ? '🔱' : duelWins >= 50 ? '⚔️' : duelWins >= 25 ? '🏆' : duelStreak >= 3 ? '🔥' : duelWins >= 10 ? '👑' : duelWins >= 3 ? '🛡️' : duelWins >= 1 ? '⚔️' : '🎯');
  const isCustomMythic = matchedTitle?.tier === 'mythic';
  const isCustomDiamond = matchedTitle?.tier === 'diamond';

  // 5. KADEME: MİSTİK KOZMİK ZİRVE (100+ Zafer veya Mutlak Tahtın Sahibi veya Mistik Ünvan)
  if (isCustomMythic || duelWins >= 100 || unlockedBadges.includes('Mutlak Tahtın Sahibi') || unlockedBadges.includes('Kozmik Coğrafya Hükümdarı')) {
    return {
      tier: 'mythic',
      tierLevel: 5,
      tierLabel: '🌌 Mistik Kozmik Zirve',
      title: activeTitle,
      badgeCount: Math.max(duelWins, unlockedBadges.length),
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-fuchsia-400 border-2 border-cyan-300 shadow-[0_0_35px_rgba(217,70,239,0.85),0_0_18px_rgba(6,182,212,0.7)] animate-pulse',
      glowClass: 'from-fuchsia-500 via-cyan-400 to-amber-300',
      pinIcon: matchedTitle?.icon || '🔱',
      pinBadgeName: activeTitle,
      pinBorderClass: 'border-2 border-amber-300 bg-slate-950 text-amber-200 outline outline-1 outline-fuchsia-400 shadow-xl shadow-fuchsia-500/70 animate-bounce',
      gradientBg: 'bg-gradient-to-tr from-purple-950/80 via-slate-950/90 to-cyan-950/80',
      titleBadgeClass: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-amber-200 border-2 border-fuchsia-400 ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(217,70,239,0.8)] font-black',
      ringClass: 'ring-4 ring-cyan-400',
      sparkleEffect: true,
      orbitalEffect: true
    };
  }

  // 4. KADEME: ELMAS LİG (25+ Zafer veya Tahtın Sahibi veya Elmas Ünvan)
  if (isCustomDiamond || duelWins >= 25 || unlockedBadges.includes('Tahtın Sahibi') || unlockedBadges.includes('50 Düello Zaferi') || unlockedBadges.includes('Efsanevi Coğrafyacı')) {
    return {
      tier: 'diamond',
      tierLevel: 4,
      tierLabel: '💎 Elmas Zirve',
      title: activeTitle,
      badgeCount: Math.max(duelWins, unlockedBadges.length),
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-cyan-400 border-2 border-indigo-400 shadow-[0_0_28px_rgba(6,182,212,0.85),0_0_14px_rgba(168,85,247,0.6)] animate-pulse',
      glowClass: 'from-cyan-400 via-indigo-500 to-fuchsia-500',
      pinIcon: matchedTitle?.icon || (duelWins >= 50 ? '⚔️' : '🏆'),
      pinBadgeName: activeTitle,
      pinBorderClass: 'border-2 border-cyan-300 bg-slate-950 text-cyan-200 outline outline-1 outline-purple-400 shadow-lg shadow-cyan-500/80 animate-bounce',
      gradientBg: 'bg-gradient-to-tr from-cyan-950/80 via-purple-950/80 to-indigo-950/80',
      titleBadgeClass: 'text-cyan-200 border-2 border-cyan-400 ring-1 ring-purple-500/70 shadow-[0_0_15px_rgba(6,182,212,0.6)] font-black',
      ringClass: 'ring-3 ring-indigo-500',
      sparkleEffect: true
    };
  }

  // 3. KADEME: ALTIN & ŞAMPİYON LİG (3+ Zafer veya Seri veya Gladyatör veya Altın Ünvan)
  if (matchedTitle?.tier === 'gold' || duelWins >= 3 || duelStreak >= 3 || unlockedBadges.includes('1v1 Gladyatör') || unlockedBadges.includes('Yenilmez Fatih') || unlockedBadges.includes('Düello Şampiyonu')) {
    return {
      tier: 'gold',
      tierLevel: 3,
      tierLabel: '👑 Altın Şampiyon',
      title: activeTitle,
      badgeCount: Math.max(duelWins, unlockedBadges.length),
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-amber-400 border-2 border-yellow-300 shadow-[0_0_22px_rgba(245,158,11,0.8)] animate-pulse',
      glowClass: 'from-amber-400 via-yellow-300 to-amber-500',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitle,
      pinBorderClass: 'border-2 border-amber-300 bg-amber-950 text-amber-200 outline outline-1 outline-yellow-400 shadow-md shadow-amber-500/60',
      gradientBg: 'bg-gradient-to-tr from-amber-950/80 via-yellow-950/80 to-slate-900/90',
      titleBadgeClass: 'text-amber-300 border-2 border-amber-400 ring-1 ring-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.5)] font-black',
      ringClass: 'ring-2 ring-amber-400',
      sparkleEffect: false
    };
  }

  // 2. KADEME: GÜMÜŞ & UZMAN LİG (1-2 Zafer veya Arena Çaylağı veya Gümüş Ünvan)
  if (matchedTitle?.tier === 'silver' || duelWins >= 1 || unlockedBadges.includes('Arena Çaylağı')) {
    return {
      tier: 'silver',
      tierLevel: 2,
      tierLabel: '🛡️ Gümüş Uzman',
      title: activeTitle,
      badgeCount: Math.max(duelWins, unlockedBadges.length),
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-slate-300 border-2 border-slate-400 shadow-[0_0_14px_rgba(203,213,225,0.6)]',
      glowClass: 'from-slate-300 via-sky-200/50 to-slate-400',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitle,
      pinBorderClass: 'border-2 border-slate-200 bg-slate-900 text-slate-100 outline outline-1 outline-slate-300 shadow-sm',
      gradientBg: 'bg-gradient-to-tr from-slate-900/90 via-slate-800 to-indigo-950/90',
      titleBadgeClass: 'text-slate-200 border border-slate-300/70 shadow-[0_0_6px_rgba(203,213,225,0.3)] font-bold',
      ringClass: 'ring-1 ring-slate-400/50',
      sparkleEffect: false
    };
  }

  // 0. KADEME: BAŞLANGIÇ (0 Zafer)
  return {
    tier: 'starter',
    tierLevel: 0,
    tierLabel: '🌱 Başlangıç',
    title: activeTitle,
    badgeCount: duelWins,
    frameBorderClass: 'outline outline-1 outline-offset-1 outline-slate-600 border border-slate-700 shadow-sm',
    glowClass: 'from-transparent to-transparent opacity-0',
    pinIcon: activePinIcon,
    pinBadgeName: activeTitle,
    pinBorderClass: 'border border-slate-700 bg-slate-900 text-slate-400 shadow-none',
    gradientBg: 'bg-gradient-to-tr from-slate-950 to-slate-900',
    titleBadgeClass: 'text-slate-400 border border-slate-800 shadow-none font-normal',
    ringClass: 'ring-0',
    sparkleEffect: false
  };
}

/**
 * Calculates user's avatar frame prestige and crowning badge based on unlocked badges, duel wins, and equipped title.
 * Strict hierarchy enforced: Mythic (Tier 5) > Diamond (Tier 4) > Gold (Tier 3) > Silver (Tier 2) > Bronze (Tier 1) > Starter (Tier 0)
 */
export function getPrestigeTier(
  unlockedBadges: string[] = [],
  duelWins = 0,
  customTitle?: string
): PrestigeTierInfo {
  const count = unlockedBadges.length;

  // 1. Look up equipped title details
  const cleanTitleName = (customTitle || '').replace(/^[^\w\s\u00C0-\u017F]+/i, '').trim();
  const matchedTitle = ALL_TITLES.find(t => 
    t.name === customTitle || 
    t.id === customTitle || 
    t.name.toLowerCase() === cleanTitleName.toLowerCase() ||
    (customTitle && customTitle.includes(t.name))
  );

  const activeTitleName = matchedTitle?.name || customTitle || '3D Coğrafyacı Çırağı';
  const titleTier = matchedTitle?.tier || (count >= 30 ? 'mythic' : count >= 20 ? 'diamond' : count >= 10 ? 'gold' : count >= 5 ? 'silver' : count >= 1 ? 'bronze' : 'bronze');
  const activePinIcon = matchedTitle?.icon || (count >= 30 ? '🌌' : count >= 20 ? '💎' : count >= 10 ? '👑' : count >= 5 ? '🛡️' : '🐣');

  // 5. KADEME: MİSTİK KOZMİK ZİRVE (En Yüksek ve En Belirgin Kozmik Işıltı)
  if (titleTier === 'mythic' || count >= 30 || duelWins >= 100 || unlockedBadges.includes('Kozmik Coğrafya Hükümdarı') || unlockedBadges.includes('Mutlak Tahtın Sahibi')) {
    return {
      tier: 'mythic',
      tierLevel: 5,
      tierLabel: '🌌 Mistik Kozmik Zirve',
      title: activeTitleName,
      badgeCount: count,
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-fuchsia-400 border-2 border-cyan-300 shadow-[0_0_35px_rgba(217,70,239,0.85),0_0_18px_rgba(6,182,212,0.7)] animate-pulse',
      glowClass: 'from-fuchsia-500 via-cyan-400 to-amber-300',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitleName,
      pinBorderClass: 'border-2 border-amber-300 bg-slate-950 text-amber-200 outline outline-1 outline-fuchsia-400 shadow-xl shadow-fuchsia-500/70 animate-bounce',
      gradientBg: 'bg-gradient-to-tr from-purple-950/80 via-slate-950/90 to-cyan-950/80',
      titleBadgeClass: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-amber-200 border-2 border-fuchsia-400 ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(217,70,239,0.8)] font-black',
      ringClass: 'ring-4 ring-cyan-400',
      sparkleEffect: true,
      orbitalEffect: true
    };
  }

  // 4. KADEME: ELMAS & EFSANEVİ ZİRVE
  if (titleTier === 'diamond' || count >= 20 || duelWins >= 25 || unlockedBadges.includes('Efsanevi Coğrafyacı') || unlockedBadges.includes('Tahtın Sahibi')) {
    return {
      tier: 'diamond',
      tierLevel: 4,
      tierLabel: '💎 Elmas Zirve',
      title: activeTitleName,
      badgeCount: count,
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-cyan-400 border-2 border-indigo-400 shadow-[0_0_28px_rgba(6,182,212,0.85),0_0_14px_rgba(168,85,247,0.6)] animate-pulse',
      glowClass: 'from-cyan-400 via-indigo-500 to-fuchsia-500',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitleName,
      pinBorderClass: 'border-2 border-cyan-300 bg-slate-950 text-cyan-200 outline outline-1 outline-purple-400 shadow-lg shadow-cyan-500/80 animate-bounce',
      gradientBg: 'bg-gradient-to-tr from-cyan-950/80 via-purple-950/80 to-indigo-950/80',
      titleBadgeClass: 'text-cyan-200 border-2 border-cyan-400 ring-1 ring-purple-500/70 shadow-[0_0_15px_rgba(6,182,212,0.6)] font-black',
      ringClass: 'ring-3 ring-indigo-500',
      sparkleEffect: true
    };
  }

  // 3. KADEME: ALTIN & ŞAMPİYON LİG (Belirgin Altın Parıltısı)
  if (titleTier === 'gold' || count >= 10 || duelWins >= 3 || unlockedBadges.includes('1v1 Gladyatör') || unlockedBadges.includes('KPSS Coğrafya Üstadı') || unlockedBadges.includes('Düello Şampiyonu')) {
    return {
      tier: 'gold',
      tierLevel: 3,
      tierLabel: '👑 Altın Şampiyon',
      title: activeTitleName,
      badgeCount: count,
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-amber-400 border-2 border-yellow-300 shadow-[0_0_22px_rgba(245,158,11,0.8)] animate-pulse',
      glowClass: 'from-amber-400 via-yellow-300 to-amber-500',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitleName,
      pinBorderClass: 'border-2 border-amber-300 bg-amber-950 text-amber-200 outline outline-1 outline-yellow-400 shadow-md shadow-amber-500/60',
      gradientBg: 'bg-gradient-to-tr from-amber-950/80 via-yellow-950/80 to-slate-900/90',
      titleBadgeClass: 'text-amber-300 border-2 border-amber-400 ring-1 ring-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.5)] font-black',
      ringClass: 'ring-2 ring-amber-400',
      sparkleEffect: false
    };
  }

  // 2. KADEME: GÜMÜŞ & UZMAN LİG (Temiz Metalik Işıltı)
  if (titleTier === 'silver' || count >= 5 || duelWins >= 1 || unlockedBadges.includes('Arena Çaylağı') || unlockedBadges.includes('Tam İsabet Kaptan')) {
    return {
      tier: 'silver',
      tierLevel: 2,
      tierLabel: '🛡️ Gümüş Uzman',
      title: activeTitleName,
      badgeCount: count,
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-slate-300 border-2 border-slate-400 shadow-[0_0_14px_rgba(203,213,225,0.6)]',
      glowClass: 'from-slate-300 via-sky-200/50 to-slate-400',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitleName,
      pinBorderClass: 'border-2 border-slate-200 bg-slate-900 text-slate-100 outline outline-1 outline-slate-300 shadow-sm',
      gradientBg: 'bg-gradient-to-tr from-slate-900/90 via-slate-800 to-indigo-950/90',
      titleBadgeClass: 'text-slate-200 border border-slate-300/70 shadow-[0_0_6px_rgba(203,213,225,0.3)] font-bold',
      ringClass: 'ring-1 ring-slate-400/50',
      sparkleEffect: false
    };
  }

  // 1. KADEME: BRONZ & ÇIRAK (Sıcak Bakır - Mütevazı)
  if (count >= 1 || customTitle === '3D Coğrafyacı Çırağı') {
    return {
      tier: 'bronze',
      tierLevel: 1,
      tierLabel: '🐣 Bronz Çırak',
      title: activeTitleName,
      badgeCount: count,
      frameBorderClass: 'outline outline-2 outline-offset-2 outline-amber-600 border-2 border-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.45)]',
      glowClass: 'from-amber-900/40 via-amber-800/30 to-amber-950/40',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitleName,
      pinBorderClass: 'border-2 border-amber-600 bg-amber-950 text-amber-300 outline outline-1 outline-amber-700 shadow-sm',
      gradientBg: 'bg-gradient-to-tr from-amber-950/70 via-stone-900/90 to-slate-950/90',
      titleBadgeClass: 'text-amber-400 border border-amber-800/60 shadow-none font-semibold',
      ringClass: 'ring-1 ring-amber-800/30',
      sparkleEffect: false
    };
  }

  // 0. KADEME: BAŞLANGIÇ (Sade Mat)
  return {
    tier: 'starter',
    tierLevel: 0,
    tierLabel: '🌱 Başlangıç',
    title: activeTitleName,
    badgeCount: count,
    frameBorderClass: 'outline outline-1 outline-offset-1 outline-slate-600 border border-slate-700 shadow-sm',
    glowClass: 'from-transparent to-transparent opacity-0',
    pinIcon: activePinIcon,
    pinBadgeName: activeTitleName,
    pinBorderClass: 'border border-slate-700 bg-slate-900 text-slate-400 shadow-none',
    gradientBg: 'bg-gradient-to-tr from-slate-950 to-slate-900',
    titleBadgeClass: 'text-slate-400 border border-slate-800 shadow-none font-normal',
    ringClass: 'ring-0',
    sparkleEffect: false
  };
}

/**
 * Returns all unlocked titles for a given set of unlocked badges and metrics.
 */
export function getUnlockedTitles(unlockedBadges: string[] = []): UserTitle[] {
  return ALL_TITLES.filter(t => {
    if (!t.requiredBadge) return true;
    return unlockedBadges.includes(t.requiredBadge);
  });
}
