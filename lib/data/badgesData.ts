export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  category: string;
  tier: BadgeTier;
  tierLevel: number; // 1: Bronz, 2: Gümüş, 3: Altın, 4: Elmas
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
  minBadgesRequired?: number;
  minDuelWinsRequired?: number;
}

export interface AvatarThemeOption {
  id: string;
  name: string;
  bgGradient: string;
  borderGlow: string;
  badgePinBg: string;
}

export const AVATAR_ICONS: AvatarIconOption[] = [
  { id: 'apprentice', icon: '🐣', label: 'Çırak Kuş', minBadgesRequired: 0 },
  { id: 'mountain', icon: '🏔️', label: 'Doruk Zirvesi', minBadgesRequired: 1 },
  { id: 'compass', icon: '🧭', label: 'Altın Pusula', minBadgesRequired: 1 },
  { id: 'map', icon: '🗺️', label: 'Atlas Kaşifi', minBadgesRequired: 2 },
  { id: 'eagle', icon: '🦅', label: 'Anadolu Kartalı', minBadgesRequired: 2 },
  { id: 'target', icon: '🎯', label: 'Keskin Nişancı', minBadgesRequired: 2 },
  { id: 'swords', icon: '⚔️', label: 'Düello Gladyatörü', minDuelWinsRequired: 1 },
  { id: 'shield', icon: '🛡️', label: 'Muhafız Kalkanı', minBadgesRequired: 3 },
  { id: 'water', icon: '🌊', label: 'Akarsu Dalgaları', minBadgesRequired: 3 },
  { id: 'volcano', icon: '🌋', label: 'Volkan Ateşi', minBadgesRequired: 3 },
  { id: 'temple', icon: '🏛️', label: 'Karstik Kanyon', minBadgesRequired: 3 },
  { id: 'fire', icon: '🔥', label: 'Seri Alevi', minBadgesRequired: 4 },
  { id: 'lightning', icon: '⚡', label: 'Şimşek Hız', minBadgesRequired: 4 },
  { id: 'lion', icon: '🦁', label: 'Bozkır Aslanı', minBadgesRequired: 5 },
  { id: 'grad_cap', icon: '🎓', label: 'KPSS Üstadı', minBadgesRequired: 5 },
  { id: 'trophy', icon: '🏆', label: 'Kupa Şampiyonu', minDuelWinsRequired: 3 },
  { id: 'crown', icon: '👑', label: 'Arena Kralı', minDuelWinsRequired: 5 },
  { id: 'rocket', icon: '🚀', label: 'Derece Roketi', minBadgesRequired: 7 },
  { id: 'diamond', icon: '💎', label: 'Efsanevi Elmas', minBadgesRequired: 8 }
];

export const AVATAR_THEMES: AvatarThemeOption[] = [
  {
    id: 'indigo_midnight',
    name: 'Gece Yarısı Mavisi',
    bgGradient: 'bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900',
    borderGlow: 'border-indigo-500/60 ring-indigo-500/30',
    badgePinBg: 'bg-indigo-900 border-indigo-400'
  },
  {
    id: 'emerald_forest',
    name: 'Zümrüt Yeşili',
    bgGradient: 'bg-gradient-to-tr from-emerald-950 via-teal-950 to-slate-900',
    borderGlow: 'border-emerald-400/80 ring-emerald-500/40 shadow-emerald-500/20',
    badgePinBg: 'bg-emerald-900 border-emerald-400'
  },
  {
    id: 'gold_glory',
    name: 'Kraliyet Altını',
    bgGradient: 'bg-gradient-to-tr from-amber-950 via-yellow-950 to-slate-900',
    borderGlow: 'border-amber-400 ring-amber-500/50 shadow-amber-500/30',
    badgePinBg: 'bg-amber-900 border-amber-300'
  },
  {
    id: 'ruby_fire',
    name: 'Yakut Alevi',
    bgGradient: 'bg-gradient-to-tr from-rose-950 via-red-950 to-orange-950',
    borderGlow: 'border-rose-400 ring-red-500/50 shadow-red-500/30',
    badgePinBg: 'bg-rose-900 border-rose-400'
  },
  {
    id: 'amethyst_mystic',
    name: 'Ametist Büyüsü',
    bgGradient: 'bg-gradient-to-tr from-purple-950 via-fuchsia-950 to-indigo-950',
    borderGlow: 'border-purple-400 ring-fuchsia-500/50 shadow-purple-500/30',
    badgePinBg: 'bg-purple-900 border-purple-400'
  },
  {
    id: 'cyan_mythic',
    name: 'Kutup Elması',
    bgGradient: 'bg-gradient-to-tr from-cyan-950 via-blue-950 to-slate-900',
    borderGlow: 'border-cyan-400 ring-cyan-500/60 shadow-cyan-500/40',
    badgePinBg: 'bg-cyan-900 border-cyan-300'
  }
];

export const ALL_TITLES: UserTitle[] = [
  {
    id: 'cografyaci_ciragi',
    name: '3D Coğrafyacı Çırağı',
    icon: '🐣',
    tier: 'bronze',
    desc: 'Coğrafya öğrenim serüvenine adım atan hevesli öğrenci.',
    requiredBadge: '3D Coğrafyacı Çırağı',
    requiredMetricText: 'Varsayılan Başlangıç Ünvanı'
  },
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
    id: 'toroslar_fatihi',
    name: 'Toroslar Fatihi',
    icon: '🏛️',
    tier: 'silver',
    desc: 'Akdeniz karstik şekilleri, polye ve Toros dağ sisteminin uzmanı.',
    requiredBadge: 'Akdeniz Karstik Şekiller & Toroslar Kaptanı',
    requiredMetricText: 'Akdeniz Bölgesi testlerinde 3 doğru'
  },
  {
    id: 'horst_graben_ustasi',
    name: 'Horst-Graben Ustası',
    icon: '🏖️',
    tier: 'silver',
    desc: 'Ege kırık dağları ve enine kıyı yapısına bütünüyle hakim usta.',
    requiredBadge: 'Ege Kıyı & Horst-Graben Fatihi',
    requiredMetricText: 'Ege Bölgesi testlerinde 3 doğru'
  },
  {
    id: 'gap_muhafizi',
    name: 'GAP & Fırat Muhafızı',
    icon: '🌾',
    tier: 'silver',
    desc: 'Güneydoğu Anadolu ovaları, barajları ve Fırat-Dicle havzası hakimi.',
    requiredBadge: 'Güneydoğu Anadolu Baraj & Ovalar Şampiyonu',
    requiredMetricText: 'Güneydoğu testlerinde 3 doğru'
  },
  {
    id: 'volkan_avcisi',
    name: 'Volkan & Bozkır Bilgesi',
    icon: '🌋',
    tier: 'silver',
    desc: 'İç Anadolu platoları ve sönmüş volkan dizilimini eksiksiz bilen bilge.',
    requiredBadge: 'İç Anadolu Platoları & Volkanları Üstadı',
    requiredMetricText: 'İç Anadolu testlerinde 3 doğru'
  },
  {
    id: 'karadeniz_kaplani',
    name: 'Karadeniz Kıvrım Kaplanı',
    icon: '⛰️',
    tier: 'silver',
    desc: 'Karadeniz kıvrım dağları, boyuna kıyıları ve dik geçitlerinin fatihi.',
    requiredBadge: 'Karadeniz Dağları & Geçitleri Kaplanı',
    requiredMetricText: 'Karadeniz testlerinde 3 doğru'
  },
  {
    id: 'dogu_kalesi',
    name: 'Doğu Anadolu Kalesi',
    icon: '🌊',
    tier: 'silver',
    desc: 'Doğu Anadolu yüksek platoları, gölleri ve akarsularının ustası.',
    requiredBadge: 'Doğu Anadolu Akarsuları Uzmanı',
    requiredMetricText: 'Doğu Anadolu akarsu ve göllerinde 3 doğru'
  },
  {
    id: 'bogazlar_hakimi',
    name: 'Boğazlar & Marmara Hakimi',
    icon: '🌉',
    tier: 'silver',
    desc: 'Marmara iklim geçişleri, boğazlar ve sanayi-tarım coğrafyası uzmanı.',
    requiredBadge: 'Marmara İklim & Coğrafya Uzmanı',
    requiredMetricText: 'Marmara testlerinde 3 doğru'
  },
  {
    id: 'sinir_bekcisi',
    name: 'Sınır & Geçit Bekçisi',
    icon: '🚪',
    tier: 'silver',
    desc: 'Türkiye\'nin tüm stratejik sınır kapılarını ve dağ geçitlerini ezberleyen muhafız.',
    requiredBadge: 'Türkiye Sınır Kapıları & Geçit Muhafızı',
    requiredMetricText: 'Sınır Kapıları & Geçitlerde 3 doğru'
  },
  {
    id: 'dilsiz_harita_dehasi',
    name: 'Dilsiz Harita Dehası',
    icon: '🙈',
    tier: 'gold',
    desc: 'Harita yazıları ve sınır çizgileri olmadan yer şekillerini gözü kapalı bulan dahi.',
    requiredBadge: '3D Dilsiz Harita Kasırgası',
    requiredMetricText: 'Dilsiz modda 3 doğru tahmin'
  },
  {
    id: 'arena_gladyatoru',
    name: '1v1 Gladyatör',
    icon: '🛡️',
    tier: 'gold',
    desc: 'Canlı 1v1 coğrafya düellolarında rakiplerini alt eden savaşçı.',
    requiredBadge: '1v1 Gladyatör',
    requiredMetricText: '3 Düello zaferi kazan'
  },
  {
    id: 'seri_canavari_unvan',
    name: 'Yenilmez Seri Canavarı',
    icon: '🔥',
    tier: 'gold',
    desc: 'Ardı ardına sıfır hatayla soru zincirleri kuran coğrafya makinesi.',
    requiredBadge: '5\'li Seri Canavarı',
    requiredMetricText: '5 üst üste doğru cevap ver'
  },
  {
    id: 'duello_krali',
    name: 'Arena Şampiyonu',
    icon: '👑',
    tier: 'diamond',
    desc: '10 düello zaferiyle KPSS coğrafya arenasında tahta oturan hükümdar.',
    requiredBadge: 'Düello Şampiyonu',
    requiredMetricText: '10 Düello zaferi kazan'
  },
  {
    id: 'kpss_sampiyonu',
    name: 'KPSS Coğrafya Şampiyonu',
    icon: '🎓',
    tier: 'diamond',
    desc: 'KPSS Coğrafya test havuzunu domine eden ve dereceye koşan üstat.',
    requiredBadge: 'KPSS Coğrafya Üstadı',
    requiredMetricText: '300 toplam test puanına ulaş'
  },
  {
    id: 'efsanevi_elmas_deha',
    name: 'Efsanevi Harita Dehası',
    icon: '💎',
    tier: 'diamond',
    desc: 'Tüm kademeli rozetleri toplayarak efsane mertebesine yükselen elit üstat.',
    requiredBadge: 'Efsanevi Coğrafyacı',
    requiredMetricText: '8 veya daha fazla rozet kazan'
  }
];

export const ALL_BADGES: Badge[] = [
  // --- KADEMELİ BÖLGE UZMANLIKLARI (SEVİYE 1 - 2) ---
  {
    id: 'dogu_anadolu_akarsu',
    name: 'Doğu Anadolu Akarsuları Uzmanı',
    icon: '🌊',
    category: 'Bölge Uzmanlığı',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Doğu Anadolu Bölgesi akarsularını (Fırat, Dicle, Aras, Kura, Çoruh) ve göllerini çözdün.',
    targetCount: 3,
    reqText: 'Doğu Anadolu Akarsu & Göllerinde 3 doğru cevap ver.',
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
    targetCount: 3,
    reqText: 'Marmara Bölgesi sorularında 3 doğru cevap ver.',
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
    desc: 'Ege Kıyı tipleri, enine kıyı yapısı ve Kırık Dağları (Horst-Graben) eksiksiz bildin.',
    targetCount: 3,
    reqText: 'Ege Bölgesi sorularında 3 doğru cevap ver.',
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
    targetCount: 3,
    reqText: 'Karadeniz Bölgesi sorularında 3 doğru cevap ver.',
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
    targetCount: 3,
    reqText: 'İç Anadolu sorularında 3 doğru cevap ver.',
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
    desc: 'Akdeniz karstik platoları (Teke-Taşeli), lapya/düden/polye ve Toros dağ sistemini çözdün.',
    targetCount: 3,
    reqText: 'Akdeniz sorularında 3 doğru cevap ver.',
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
    targetCount: 3,
    reqText: 'Güneydoğu Anadolu sorularında 3 doğru cevap ver.',
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
    targetCount: 3,
    reqText: 'Sınır Kapıları veya Geçitler kategorisinde 3 doğru cevap ver.',
    trackerKey: 'PassesAndGates',
    associatedTitle: 'Sınır & Geçit Bekçisi'
  },
  {
    id: 'dilsiz_harita_kasirgasi',
    name: '3D Dilsiz Harita Kasırgası',
    icon: '🙈',
    category: 'Zorlu Mod',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Şehir isimleri ve harita yazıları olmadan dilsiz modda ustalaştın.',
    targetCount: 3,
    reqText: 'Dilsiz Harita Modunda 3 doğru tahmin yap.',
    trackerKey: 'BlindMapCorrect',
    associatedTitle: 'Dilsiz Harita Dehası'
  },

  // --- GENEL GAMIFICATION ROZETLERİ (BRONZ - GÜMÜŞ - ALTIN) ---
  {
    id: 'cografyaci_ciragi',
    name: '3D Coğrafyacı Çırağı',
    icon: '🐣',
    category: 'Başlangıç',
    tier: 'bronze',
    tierLevel: 1,
    desc: 'Uygulamaya ilk adım attın.',
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
    id: 'seri_canavari',
    name: '5\'li Seri Canavarı',
    icon: '🔥',
    category: 'Seri Başarımı',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Üst üste 5 doğru cevap verdin.',
    targetCount: 5,
    reqText: 'Üst üste 5 doğru cevap ver.',
    trackerKey: 'Streak5',
    associatedTitle: 'Yenilmez Seri Canavarı'
  },
  {
    id: 'kpss_ustadi',
    name: 'KPSS Coğrafya Üstadı',
    icon: '🎓',
    category: 'Skor Başarımı',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Test modunda 300 puan barajını aştın.',
    targetCount: 300,
    reqText: 'Testlerde 300 toplam puana ulaş.',
    trackerKey: 'Score300',
    associatedTitle: 'KPSS Coğrafya Şampiyonu'
  },

  // --- 1v1 CANLI DÜELLO & REKABET ROZETLERİ (KADEMELİ 1-4) ---
  {
    id: 'arena_caylagi',
    name: 'Arena Çaylağı',
    icon: '⚔️',
    category: 'Düello Başarımı',
    tier: 'bronze',
    tierLevel: 1,
    desc: 'İlk 1v1 canlı coğrafya düellona katıldın.',
    targetCount: 1,
    reqText: 'En az 1 düelloyu tamamla.',
    trackerKey: 'DuelPlayed1'
  },
  {
    id: 'duello_gladyatoru',
    name: '1v1 Gladyatör',
    icon: '🛡️',
    category: 'Düello Başarımı',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Canlı düellolarda 3 zafer kazanarak rüştünü ispatladın.',
    targetCount: 3,
    reqText: 'Düellolarda 3 maç kazan.',
    trackerKey: 'DuelWins3',
    associatedTitle: '1v1 Gladyatör'
  },
  {
    id: 'duello_sampiyonu',
    name: 'Düello Şampiyonu',
    icon: '👑',
    category: 'Düello Başarımı',
    tier: 'diamond',
    tierLevel: 4,
    desc: '10 düello zaferiyle KPSS coğrafya arenasında tahta oturdun.',
    targetCount: 10,
    reqText: 'Düellolarda 10 maç kazan.',
    trackerKey: 'DuelWins10',
    associatedTitle: 'Arena Şampiyonu'
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
  {
    id: 'yenilmez_fatih',
    name: 'Yenilmez Fatih',
    icon: '🏆',
    category: 'Düello Serisi',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Düellolarda üst üste 3 maç kazanarak namağlup seri yakaladın.',
    targetCount: 3,
    reqText: 'Üst üste 3 düello maçı kazan.',
    trackerKey: 'DuelStreak3'
  },
  {
    id: 'efsane_cografyaci',
    name: 'Efsanevi Coğrafyacı',
    icon: '💎',
    category: 'Efsanevi Prestij',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Toplam 8 veya daha fazla rozet kazanarak elit seviyeye ulaştın.',
    targetCount: 8,
    reqText: 'Toplam 8 rozet kilidi aç.',
    trackerKey: 'BadgesCount8',
    associatedTitle: 'Efsanevi Harita Dehası'
  }
];

export type BadgePrestigeTier = 'starter' | 'bronze_silver' | 'gold_champion' | 'diamond_mythic';

export interface PrestigeTierInfo {
  tier: BadgePrestigeTier;
  title: string;
  badgeCount: number;
  frameBorderClass: string;
  glowClass: string;
  pinIcon: string;
  pinBadgeName: string;
  gradientBg: string;
}

/**
 * Calculates user's avatar frame prestige and crowning badge based on unlocked badges and duel wins.
 */
export function getPrestigeTier(
  unlockedBadges: string[] = [],
  duelWins = 0,
  customTitle?: string
): PrestigeTierInfo {
  const count = unlockedBadges.length;

  if (count >= 8 || duelWins >= 10 || unlockedBadges.includes('Efsanevi Coğrafyacı') || unlockedBadges.includes('Düello Şampiyonu')) {
    return {
      tier: 'diamond_mythic',
      title: customTitle || 'Efsanevi Elmas Deha',
      badgeCount: count,
      frameBorderClass: 'border-2 border-cyan-400 ring-2 ring-purple-500/80 shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse',
      glowClass: 'from-cyan-500 via-indigo-500 to-fuchsia-500',
      pinIcon: '💎',
      pinBadgeName: 'Efsanevi Elmas Prestij',
      gradientBg: 'bg-gradient-to-tr from-cyan-950 via-indigo-950 to-purple-950'
    };
  }

  if (count >= 5 || duelWins >= 3 || unlockedBadges.includes('1v1 Gladyatör') || unlockedBadges.includes('KPSS Coğrafya Üstadı')) {
    return {
      tier: 'gold_champion',
      title: customTitle || 'Altın Şampiyon',
      badgeCount: count,
      frameBorderClass: 'border-2 border-amber-400 ring-2 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      glowClass: 'from-amber-400 via-yellow-300 to-amber-600',
      pinIcon: '👑',
      pinBadgeName: 'Altın Şampiyon Prestij',
      gradientBg: 'bg-gradient-to-tr from-amber-950 via-yellow-950 to-slate-900'
    };
  }

  if (count >= 2 || duelWins >= 1 || unlockedBadges.includes('Arena Çaylağı') || unlockedBadges.includes('Tam İsabet Kaptan')) {
    return {
      tier: 'bronze_silver',
      title: customTitle || 'Gümüş Savaşçı',
      badgeCount: count,
      frameBorderClass: 'border-2 border-slate-300 ring-1 ring-slate-400/40 shadow-[0_0_10px_rgba(203,213,225,0.3)]',
      glowClass: 'from-slate-300 via-slate-100 to-slate-400',
      pinIcon: '🛡️',
      pinBadgeName: 'Gümüş Savaşçı Prestij',
      gradientBg: 'bg-gradient-to-tr from-slate-800 via-indigo-950 to-slate-900'
    };
  }

  return {
    tier: 'starter',
    title: customTitle || 'Çırak Gezgin',
    badgeCount: count,
    frameBorderClass: 'border border-indigo-500/40 ring-1 ring-indigo-500/20',
    glowClass: 'from-indigo-500 to-purple-500',
    pinIcon: '🐣',
    pinBadgeName: '3D Coğrafyacı Çırağı',
    gradientBg: 'bg-gradient-to-tr from-indigo-950 to-slate-900'
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
