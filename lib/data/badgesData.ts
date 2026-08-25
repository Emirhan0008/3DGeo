export interface Badge {
  id: string;
  name: string;
  icon: string;
  category: string;
  desc: string;
  targetCount: number;
  reqText: string;
  trackerKey: string;
}

export const ALL_BADGES: Badge[] = [
  // --- KATEGORİ & BÖLGE UZMANLIK ROZETLERİ ---
  {
    id: 'dogu_anadolu_akarsu',
    name: 'Doğu Anadolu Akarsuları Uzmanı',
    icon: '🌊',
    category: 'Kategori Uzmanlığı',
    desc: 'Doğu Anadolu Bölgesi akarsularını (Fırat, Dicle, Aras, Kura, Çoruh) ve göllerini çözdün.',
    targetCount: 3,
    reqText: 'Doğu Anadolu Akarsu & Göllerinde 3 doğru cevap ver.',
    trackerKey: 'Doğu Anadolu_Akarsular'
  },
  {
    id: 'marmara_iklim_cografya',
    name: 'Marmara İklim & Coğrafya Uzmanı',
    icon: '🌉',
    category: 'Bölge Uzmanlığı',
    desc: 'Marmara Bölgesi yer şekilleri, iklim geçişleri ve boğaz sistemlerini kavradın.',
    targetCount: 3,
    reqText: 'Marmara Bölgesi sorularında 3 doğru cevap ver.',
    trackerKey: 'Marmara_Genel'
  },
  {
    id: 'ege_kiyi_horst',
    name: 'Ege Kıyı & Horst-Graben Fatihi',
    icon: '🏖️',
    category: 'Bölge Uzmanlığı',
    desc: 'Ege Kıyı tipleri, enine kıyı yapısı ve Kırık Dağları (Horst-Graben) eksiksiz bildin.',
    targetCount: 3,
    reqText: 'Ege Bölgesi sorularında 3 doğru cevap ver.',
    trackerKey: 'Ege_Genel'
  },
  {
    id: 'karadeniz_dag_gecit',
    name: 'Karadeniz Dağları & Geçitleri Kaplanı',
    icon: '⛰️',
    category: 'Bölge Uzmanlığı',
    desc: 'Karadeniz Kıvrım Dağları, boyuna kıyı yapısı ve Zigana/Kop geçitlerine hakimsin.',
    targetCount: 3,
    reqText: 'Karadeniz Bölgesi sorularında 3 doğru cevap ver.',
    trackerKey: 'Karadeniz_Genel'
  },
  {
    id: 'ic_anadolu_plato_volkan',
    name: 'İç Anadolu Platoları & Volkanları Üstadı',
    icon: '🌋',
    category: 'Bölge Uzmanlığı',
    desc: 'İç Anadolu platoları, sönmüş volkan dizilimi ve kapalı havzalarını bildin.',
    targetCount: 3,
    reqText: 'İç Anadolu sorularında 3 doğru cevap ver.',
    trackerKey: 'İç Anadolu_Genel'
  },
  {
    id: 'akdeniz_karstik',
    name: 'Akdeniz Karstik Şekiller & Toroslar Kaptanı',
    icon: '🏛️',
    category: 'Bölge Uzmanlığı',
    desc: 'Akdeniz karstik platoları (Teke-Taşeli), lapya/düden/polye ve Toros dağ sistemini çözdün.',
    targetCount: 3,
    reqText: 'Akdeniz sorularında 3 doğru cevap ver.',
    trackerKey: 'Akdeniz_Genel'
  },
  {
    id: 'guneydogu_baraj_ova',
    name: 'Güneydoğu Anadolu Baraj & Ovalar Şampiyonu',
    icon: '🌾',
    category: 'Bölge Uzmanlığı',
    desc: 'GAP kapsamındaki barajlar, Fırat-Dicle havzası ve düz kütle yapısını bildin.',
    targetCount: 3,
    reqText: 'Güneydoğu Anadolu sorularında 3 doğru cevap ver.',
    trackerKey: 'Güneydoğu Anadolu_Genel'
  },
  {
    id: 'sinir_kapilari_gecit',
    name: 'Türkiye Sınır Kapıları & Geçit Muhafızı',
    icon: '🚪',
    category: 'Konu Uzmanlığı',
    desc: 'Tüm stratejik sınır kapıları ve dağ geçitlerini ezberledin.',
    targetCount: 3,
    reqText: 'Sınır Kapıları veya Geçitler kategorisinde 3 doğru cevap ver.',
    trackerKey: 'PassesAndGates'
  },
  {
    id: 'dilsiz_harita_kasirgasi',
    name: '3D Dilsiz Harita Kasırgası',
    icon: '🙈',
    category: 'Zorlu Mod',
    desc: 'Şehir isimleri ve harita yazıları olmadan dilsiz modda ustalaştın.',
    targetCount: 3,
    reqText: 'Dilsiz Harita Modunda 3 doğru tahmin yap.',
    trackerKey: 'BlindMapCorrect'
  },

  // --- GENEL GAMIFICATION ROZETLERİ ---
  {
    id: 'tam_isabet',
    name: 'Tam İsabet Kaptan',
    icon: '🎯',
    category: 'Pim Tahmin',
    desc: 'Pim bulma oyununda %100 tam isabet (<= 15km) yaptın.',
    targetCount: 1,
    reqText: 'Harita testinde 15 km altında isabet yap.',
    trackerKey: 'TamIsabet'
  },
  {
    id: 'seri_canavari',
    name: '5\'li Seri Canavarı',
    icon: '🔥',
    category: 'Seri Başarımı',
    desc: 'Üst üste 5 doğru cevap verdin.',
    targetCount: 5,
    reqText: 'Üst üste 5 doğru cevap ver.',
    trackerKey: 'Streak5'
  },
  {
    id: 'kpss_ustadi',
    name: 'KPSS Coğrafya Üstadı',
    icon: '🎓',
    category: 'Skor Başarımı',
    desc: 'Test modunda 300 puan barajını aştın.',
    targetCount: 300,
    reqText: 'Testlerde 300 toplam puana ulaş.',
    trackerKey: 'Score300'
  },
  {
    id: 'cografyaci_ciragi',
    name: '3D Coğrafyacı Çırağı',
    icon: '🐣',
    category: 'Başlangıç',
    desc: 'Uygulamaya ilk adım attın.',
    targetCount: 1,
    reqText: 'İlk harita keşfini yap.',
    trackerKey: 'InitialStep'
  },

  // --- 1v1 CANLI DÜELLO & REKABET ROZETLERİ ---
  {
    id: 'arena_caylagi',
    name: 'Arena Çaylağı',
    icon: '⚔️',
    category: 'Düello Başarımı',
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
    desc: 'Canlı düellolarda 3 zafer kazanarak rüştünü ispatladın.',
    targetCount: 3,
    reqText: 'Düellolarda 3 maç kazan.',
    trackerKey: 'DuelWins3'
  },
  {
    id: 'duello_sampiyonu',
    name: 'Düello Şampiyonu',
    icon: '👑',
    category: 'Düello Başarımı',
    desc: '10 düello zaferiyle KPSS coğrafya arenasında tahta oturdun.',
    targetCount: 10,
    reqText: 'Düellolarda 10 maç kazan.',
    trackerKey: 'DuelWins10'
  },
  {
    id: 'simsek_refleks',
    name: 'Şimşek Refleks',
    icon: '⚡',
    category: 'Hız & Refleks',
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
    desc: 'Toplam 8 veya daha fazla rozet kazanarak elit seviyeye ulaştın.',
    targetCount: 8,
    reqText: 'Toplam 8 rozet kilidi aç.',
    trackerKey: 'BadgesCount8'
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
export function getPrestigeTier(unlockedBadges: string[] = [], duelWins = 0): PrestigeTierInfo {
  const count = unlockedBadges.length;

  if (count >= 8 || duelWins >= 10 || unlockedBadges.includes('Efsanevi Coğrafyacı') || unlockedBadges.includes('Düello Şampiyonu')) {
    return {
      tier: 'diamond_mythic',
      title: 'Efsanevi Elmas',
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
      title: 'Altın Şampiyon',
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
      title: 'Gümüş Savaşçı',
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
    title: 'Çırak Gezgin',
    badgeCount: count,
    frameBorderClass: 'border border-indigo-500/40 ring-1 ring-indigo-500/20',
    glowClass: 'from-indigo-500 to-purple-500',
    pinIcon: '🐣',
    pinBadgeName: '3D Coğrafyacı Çırağı',
    gradientBg: 'bg-gradient-to-tr from-indigo-950 to-slate-900'
  };
}
