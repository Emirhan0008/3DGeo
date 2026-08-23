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
  }
];
