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
  { id: 'diamond', icon: '💎', label: 'Efsanevi Elmas', minBadgesRequired: 8, minDuelWinsRequired: 10 },
  { id: 'crown', icon: '👑', label: 'Arena Kralı', minDuelWinsRequired: 10 },
  { id: 'trophy', icon: '🏆', label: 'Kupa Şampiyonu', minDuelWinsRequired: 5 },
  { id: 'grad_cap', icon: '🎓', label: 'KPSS Üstadı', minBadgesRequired: 5 },
  { id: 'swords', icon: '⚔️', label: 'Düello Gladyatörü', minDuelWinsRequired: 3 },
  { id: 'target', icon: '🎯', label: 'Keskin Nişancı', minBadgesRequired: 3 },
  { id: 'shield', icon: '🛡️', label: 'Muhafız Kalkanı', minBadgesRequired: 2 },
  { id: 'map', icon: '🗺️', label: 'Atlas Kaşifi', minDuelWinsRequired: 1 },
  { id: 'apprentice', icon: '🐣', label: 'Çırak Gezgin', minBadgesRequired: 0 }
];

export const AVATAR_THEMES: AvatarThemeOption[] = [
  {
    id: 'cyan_mythic',
    name: '💎 Elmas & Efsanevi Lig',
    bgGradient: 'bg-gradient-to-tr from-cyan-950 via-indigo-950 to-purple-950',
    borderGlow: 'border-cyan-400 ring-2 ring-purple-500/80 shadow-[0_0_20px_rgba(6,182,212,0.6)]',
    badgePinBg: 'bg-cyan-900 border-cyan-300'
  },
  {
    id: 'gold_glory',
    name: '👑 Altın & Şampiyon Lig',
    bgGradient: 'bg-gradient-to-tr from-amber-950 via-yellow-950 to-slate-900',
    borderGlow: 'border-amber-400 ring-2 ring-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.6)]',
    badgePinBg: 'bg-amber-900 border-amber-300'
  },
  {
    id: 'indigo_midnight',
    name: '🛡️ Gümüş & Uzman Lig',
    bgGradient: 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800',
    borderGlow: 'border-slate-300 ring-1 ring-slate-400/50 shadow-[0_0_10px_rgba(203,213,225,0.4)]',
    badgePinBg: 'bg-indigo-900 border-indigo-400'
  },
  {
    id: 'emerald_forest',
    name: '🐣 Bronz & Çırak Lig',
    bgGradient: 'bg-gradient-to-tr from-emerald-950 via-teal-950 to-slate-900',
    borderGlow: 'border-emerald-500/50 ring-1 ring-emerald-500/30',
    badgePinBg: 'bg-emerald-900 border-emerald-400'
  }
];

export const ALL_TITLES: UserTitle[] = [
  // --- 💎 ELMAS & EFSANEVİ KADEME (EN YÜKSEK VE EN ZOR ÜNVANLAR EN ÜSTTE) ---
  {
    id: 'efsanevi_elmas_deha',
    name: 'Efsanevi Harita Dehası',
    icon: '💎',
    tier: 'diamond',
    desc: 'Tüm kademeli rozetleri toplayarak efsane mertebesine yükselen elit üstat.',
    requiredBadge: 'Efsanevi Coğrafyacı',
    requiredMetricText: '8 veya daha fazla rozet kazan'
  },
  {
    id: 'tahtin_sahibi',
    name: 'Arena Efsanesi',
    icon: '⚔️',
    tier: 'diamond',
    desc: '25 canlı PVP düello zaferiyle kırılması güç bir rekor kıran efsane.',
    requiredBadge: 'Tahtın Sahibi',
    requiredMetricText: '25 Canlı Düello zaferi kazan'
  },
  {
    id: 'duello_krali',
    name: 'Arena Şampiyonu',
    icon: '👑',
    tier: 'diamond',
    desc: '10 canlı düello zaferiyle KPSS coğrafya arenasında tahta oturan hükümdar.',
    requiredBadge: 'Düello Şampiyonu',
    requiredMetricText: '10 Canlı Düello zaferi kazan'
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

  // --- 👑 ALTIN & ŞAMPİYON KADEME ---
  {
    id: 'il_81_fatihi',
    name: '81 İl Fatihi',
    icon: '🇹🇷',
    tier: 'gold',
    desc: 'Türkiye\'nin 81 ilinin yerini ve coğrafi özelliklerini ezbere bilen usta.',
    requiredBadge: '81 İl Kaşifi',
    requiredMetricText: '81 İl Şehir Bulmaca modunda başarı elde et'
  },
  {
    id: 'kusursuz_nisanci',
    name: 'Kusursuz Nişancı',
    icon: '🎯',
    tier: 'gold',
    desc: 'Harita testlerinde 10km altı milimetrik tam isabetler tutturan usta.',
    requiredBadge: 'Tam İsabet Kaptan',
    requiredMetricText: '10km altı tam isabet yap'
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
    id: 'arena_gladyatoru',
    name: '1v1 Gladyatör',
    icon: '🛡️',
    tier: 'gold',
    desc: 'Canlı 1v1 coğrafya düellolarında rakiplerini alt eden savaşçı.',
    requiredBadge: '1v1 Gladyatör',
    requiredMetricText: '3 Canlı Düello zaferi kazan'
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
    id: 'turing_ustasi_unvan',
    name: 'Turing Fatihi',
    icon: '🧠',
    tier: 'gold',
    desc: 'Algoritmik hız ve bilgi refleksinde yapay zekayı geride bırakan dahi.',
    requiredBadge: 'Turing Ustası',
    requiredMetricText: 'Bot Arenasında 5 Zafer Kazan'
  },

  // --- 🛡️ GÜMÜŞ & UZMAN KADEME ---
  {
    id: 'bot_avcisi_unvan',
    name: 'Yapay Zeka Mat Eden',
    icon: '🤖',
    tier: 'silver',
    desc: 'Yapay Zeka Coğrafya Botunu antrenman arenasında defalarca alt eden usta.',
    requiredBadge: 'Yapay Zeka Mat Eden',
    requiredMetricText: 'Bot Arenasında 10 Zafer Kazan'
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
    id: 'bogazlar_hakimi',
    name: 'Boğazlar & Marmara Hakimi',
    icon: '🌉',
    tier: 'silver',
    desc: 'Marmara iklim geçişleri, boğazlar ve sanayi-tarım coğrafyası uzmanı.',
    requiredBadge: 'Marmara İklim & Coğrafya Uzmanı',
    requiredMetricText: 'Marmara testlerinde 3 doğru'
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
    id: 'volkan_avcisi',
    name: 'Volkan & Bozkır Bilgesi',
    icon: '🌋',
    tier: 'silver',
    desc: 'İç Anadolu platoları ve sönmüş volkan dizilimini eksiksiz bilen bilge.',
    requiredBadge: 'İç Anadolu Platoları & Volkanları Üstadı',
    requiredMetricText: 'İç Anadolu testlerinde 3 doğru'
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
    id: 'horst_graben_ustasi',
    name: 'Horst-Graben Ustası',
    icon: '🏖️',
    tier: 'silver',
    desc: 'Ege kırık dağları ve enine kıyı yapısına bütünüyle hakim usta.',
    requiredBadge: 'Ege Kıyı & Horst-Graben Fatihi',
    requiredMetricText: 'Ege Bölgesi testlerinde 3 doğru'
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

  // --- 🐣 BRONZ & ÇIRAK KADEME ---
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

  // Calculate granular progress based on specific title targets
  let current = 0;
  let target = 1;
  let unit = '';

  switch (title.id) {
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
      target = 8;
      unit = 'rozet';
      break;
    case 'kpss_sampiyonu':
      current = score;
      target = 300;
      unit = 'puan';
      break;
    case 'turing_ustasi_unvan':
      current = botWins;
      target = 5;
      unit = 'bot zaferi';
      break;
    case 'bot_avcisi_unvan':
      current = botWins;
      target = 10;
      unit = 'bot zaferi';
      break;
    case 'seri_canavari_unvan':
      current = categoryMasteryProgress['max_streak'] || 0;
      target = 5;
      unit = 'seri doğru';
      break;
    case 'dilsiz_harita_dehasi':
      current = categoryMasteryProgress['dilsiz_harita'] || 0;
      target = 3;
      unit = 'doğru';
      break;
    case 'toroslar_fatihi':
      current = categoryMasteryProgress['Akdeniz_Karstik'] || 0;
      target = 3;
      unit = 'doğru';
      break;
    case 'horst_graben_ustasi':
      current = categoryMasteryProgress['Ege_Genel'] || 0;
      target = 3;
      unit = 'doğru';
      break;
    case 'gap_muhafizi':
      current = categoryMasteryProgress['Güneydoğu_Barajlar'] || 0;
      target = 3;
      unit = 'doğru';
      break;
    case 'volkan_avcisi':
      current = categoryMasteryProgress['İç Anadolu_Volkanlar'] || 0;
      target = 3;
      unit = 'doğru';
      break;
    case 'karadeniz_kaplani':
      current = categoryMasteryProgress['Karadeniz_Genel'] || 0;
      target = 3;
      unit = 'doğru';
      break;
    case 'dogu_kalesi':
      current = categoryMasteryProgress['Doğu Anadolu_Akarsular'] || 0;
      target = 3;
      unit = 'doğru';
      break;
    case 'bogazlar_hakimi':
      current = categoryMasteryProgress['Marmara_Genel'] || 0;
      target = 3;
      unit = 'doğru';
      break;
    case 'sinir_bekcisi':
      current = categoryMasteryProgress['Sınır Kapıları_Geçitler'] || 0;
      target = 3;
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

  // --- JEOMORFOLOJİ & YER ŞEKİLLERİ ÖZEL ROZETLERİ ---
  {
    id: 'plato_ova_fatihi',
    name: 'Platolar & Ovalar Hakimi',
    icon: '🗺️',
    category: 'Jeomorfoloji',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Tabaka düzlüğü, karstik, lav ve aşınım platoları ile delta ve tektonik ovaları eksiksiz bildin.',
    targetCount: 3,
    reqText: 'Platolar & Ovalar sorularında 3 doğru cevap ver.',
    trackerKey: 'PlateausPlains'
  },
  {
    id: 'karstik_sekiller_ustasi',
    name: 'Karstik & Kıyı Şekilleri Uzmanı',
    icon: '🏖️',
    category: 'Jeomorfoloji',
    tier: 'silver',
    tierLevel: 2,
    desc: 'Lapya-dolin-polye dizilimi, obruklar, mağaralar, travertenler ve falez/tombolo yapılarını bildin.',
    targetCount: 3,
    reqText: 'Karstik & Kıyı kategorisinde 3 doğru cevap ver.',
    trackerKey: 'KarsticCoastal'
  },
  {
    id: 'volkanik_sekiller_ustasi',
    name: 'Volkanizma & Buzul Bilgesi',
    icon: '🌋',
    category: 'Jeomorfoloji',
    tier: 'gold',
    tierLevel: 3,
    desc: 'Maarlar, kalderalar, genç volkan konileri ve yüksek dağlardaki aktüel/sirk buzullarını çözdün.',
    targetCount: 3,
    reqText: 'Volkanik & Buzul oluşum sorularında 3 doğru cevap ver.',
    trackerKey: 'VolcanicGlacial'
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

  // --- YAPAY ZEKA (BOT) ANTRENMAN ARENASI BAŞARIMLARI (ÖZEL) ---
  {
    id: 'bot_caylagi',
    name: 'Yapay Zeka Çırağı',
    icon: '🤖',
    category: 'Yapay Zeka Arenası',
    tier: 'bronze',
    tierLevel: 1,
    desc: 'Yapay zeka antrenman modunda ilk maçını tamamlayıp galibiyet kazandın.',
    targetCount: 1,
    reqText: 'Yapay zekaya karşı 1 galibiyet al.',
    trackerKey: 'BotWins1'
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
    id: 'siber_antrenor',
    name: 'Siber Antrenör',
    icon: '🚀',
    category: 'Yapay Zeka Arenası',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Yapay zeka botuna karşı 20 maç kazanarak kusursuz antrenman seviyesine ulaştın.',
    targetCount: 20,
    reqText: 'Yapay zekaya karşı 20 galibiyet al.',
    trackerKey: 'BotWins20'
  },

  // --- 1v1 CANLI GERÇEK OYUNCU DÜELLO ROZETLERİ (KADEMELİ 1-4) ---
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
  },
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
    id: 'duello_sampiyonu',
    name: 'Düello Şampiyonu',
    icon: '👑',
    category: 'Canlı 1v1 Düello',
    tier: 'diamond',
    tierLevel: 4,
    desc: 'Canlı 1v1 düellolarda gerçek rakiplere karşı 10 zaferle arenada tahta oturdun.',
    targetCount: 10,
    reqText: 'Canlı düellolarda 10 maç kazan.',
    trackerKey: 'DuelWins10',
    associatedTitle: 'Arena Şampiyonu'
  },
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
    associatedTitle: 'Arena Efsanesi'
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
 * Returns the most glorious auto-equipped title specifically for 1v1 duels based on duel wins/streaks
 */
export function getAutoEquippedDuelTitle(duelWins = 0, duelStreak = 0, unlockedBadges: string[] = []): string {
  if (duelWins >= 25 || unlockedBadges.includes('Tahtın Sahibi')) {
    return '👑 Arena Efsanesi';
  }
  if (duelWins >= 10 || unlockedBadges.includes('Düello Şampiyonu')) {
    return '🏆 Düello Şampiyonu';
  }
  if (duelStreak >= 3 || unlockedBadges.includes('Yenilmez Fatih')) {
    return '🔥 Yenilmez Fatih';
  }
  if (duelWins >= 3 || unlockedBadges.includes('1v1 Gladyatör')) {
    return '⚔️ 1v1 Gladyatör';
  }
  if (duelWins >= 1 || unlockedBadges.includes('Arena Çaylağı')) {
    return '🛡️ Arena Savaşçısı';
  }
  return '🎯 Arena Adayı';
}

/**
 * Calculates 1v1 duel exclusive prestige tier (borders, glow, top-right pin icon)
 * Only 1v1 duel achievements are counted.
 */
export function getDuelPrestigeTier(
  duelWins = 0,
  duelStreak = 0,
  unlockedBadges: string[] = []
): PrestigeTierInfo {
  const duelTitle = getAutoEquippedDuelTitle(duelWins, duelStreak, unlockedBadges);

  if (duelWins >= 25 || unlockedBadges.includes('Tahtın Sahibi')) {
    return {
      tier: 'diamond_mythic',
      title: duelTitle,
      badgeCount: duelWins,
      frameBorderClass: 'border-2 border-amber-300 ring-2 ring-purple-500 shadow-[0_0_25px_rgba(234,179,8,0.8)] animate-pulse',
      glowClass: 'from-amber-400 via-purple-500 to-cyan-400',
      pinIcon: '👑',
      pinBadgeName: 'Tahtın Sahibi',
      gradientBg: 'bg-gradient-to-tr from-amber-950 via-purple-950 to-slate-900'
    };
  }

  if (duelWins >= 10 || unlockedBadges.includes('Düello Şampiyonu')) {
    return {
      tier: 'diamond_mythic',
      title: duelTitle,
      badgeCount: duelWins,
      frameBorderClass: 'border-2 border-cyan-400 ring-2 ring-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.7)] animate-pulse',
      glowClass: 'from-cyan-400 via-indigo-500 to-fuchsia-500',
      pinIcon: '🏆',
      pinBadgeName: 'Düello Şampiyonu',
      gradientBg: 'bg-gradient-to-tr from-cyan-950 via-indigo-950 to-purple-950'
    };
  }

  if (duelWins >= 3 || duelStreak >= 3 || unlockedBadges.includes('1v1 Gladyatör') || unlockedBadges.includes('Yenilmez Fatih')) {
    return {
      tier: 'gold_champion',
      title: duelTitle,
      badgeCount: duelWins,
      frameBorderClass: 'border-2 border-amber-400 ring-2 ring-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.6)]',
      glowClass: 'from-amber-400 via-yellow-300 to-amber-600',
      pinIcon: duelStreak >= 3 ? '🔥' : '⚔️',
      pinBadgeName: '1v1 Gladyatör',
      gradientBg: 'bg-gradient-to-tr from-amber-950 via-yellow-950 to-slate-900'
    };
  }

  if (duelWins >= 1 || unlockedBadges.includes('Arena Çaylağı')) {
    return {
      tier: 'bronze_silver',
      title: duelTitle,
      badgeCount: duelWins,
      frameBorderClass: 'border-2 border-slate-300 ring-1 ring-slate-400/50 shadow-[0_0_10px_rgba(203,213,225,0.4)]',
      glowClass: 'from-slate-300 via-slate-100 to-slate-400',
      pinIcon: '🛡️',
      pinBadgeName: 'Arena Savaşçısı',
      gradientBg: 'bg-gradient-to-tr from-slate-800 via-indigo-950 to-slate-900'
    };
  }

  return {
    tier: 'starter',
    title: duelTitle,
    badgeCount: duelWins,
    frameBorderClass: 'border border-indigo-500/50 ring-1 ring-indigo-500/30',
    glowClass: 'from-indigo-500 to-purple-500',
    pinIcon: '🎯',
    pinBadgeName: 'Arena Adayı',
    gradientBg: 'bg-gradient-to-tr from-indigo-950 to-slate-900'
  };
}

/**
 * Calculates user's avatar frame prestige and crowning badge based on unlocked badges, duel wins, and equipped title.
 * The top-right pin emblem specifically inherits the equipped title's unique icon and prestige!
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
  const activePinIcon = matchedTitle?.icon || (count >= 8 ? '💎' : count >= 5 ? '👑' : count >= 2 ? '🛡️' : '🐣');
  const titleTier = matchedTitle?.tier || (count >= 8 ? 'diamond' : count >= 5 ? 'gold' : count >= 2 ? 'silver' : 'bronze');

  // Diamond / Mythic Level
  if (titleTier === 'diamond' || count >= 8 || duelWins >= 10 || unlockedBadges.includes('Efsanevi Coğrafyacı') || unlockedBadges.includes('Düello Şampiyonu')) {
    return {
      tier: 'diamond_mythic',
      title: activeTitleName,
      badgeCount: count,
      frameBorderClass: 'border-2 border-cyan-400 ring-2 ring-purple-500/80 shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse',
      glowClass: 'from-cyan-500 via-indigo-500 to-fuchsia-500',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitleName,
      gradientBg: 'bg-gradient-to-tr from-cyan-950 via-indigo-950 to-purple-950'
    };
  }

  // Gold Champion Level
  if (titleTier === 'gold' || count >= 5 || duelWins >= 3 || unlockedBadges.includes('1v1 Gladyatör') || unlockedBadges.includes('KPSS Coğrafya Üstadı')) {
    return {
      tier: 'gold_champion',
      title: activeTitleName,
      badgeCount: count,
      frameBorderClass: 'border-2 border-amber-400 ring-2 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      glowClass: 'from-amber-400 via-yellow-300 to-amber-600',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitleName,
      gradientBg: 'bg-gradient-to-tr from-amber-950 via-yellow-950 to-slate-900'
    };
  }

  // Silver / Warrior Level
  if (titleTier === 'silver' || count >= 2 || duelWins >= 1 || unlockedBadges.includes('Arena Çaylağı') || unlockedBadges.includes('Tam İsabet Kaptan')) {
    return {
      tier: 'bronze_silver',
      title: activeTitleName,
      badgeCount: count,
      frameBorderClass: 'border-2 border-slate-300 ring-1 ring-slate-400/40 shadow-[0_0_10px_rgba(203,213,225,0.3)]',
      glowClass: 'from-slate-300 via-slate-100 to-slate-400',
      pinIcon: activePinIcon,
      pinBadgeName: activeTitleName,
      gradientBg: 'bg-gradient-to-tr from-slate-800 via-indigo-950 to-slate-900'
    };
  }

  // Starter Level
  return {
    tier: 'starter',
    title: activeTitleName,
    badgeCount: count,
    frameBorderClass: 'border border-indigo-500/40 ring-1 ring-indigo-500/20',
    glowClass: 'from-indigo-500 to-purple-500',
    pinIcon: activePinIcon,
    pinBadgeName: activeTitleName,
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
