export interface GeoFeature {
  id: string;
  name: string;
  type: 'mountain' | 'river' | 'lake' | 'plateau' | 'plain' | 'border_gate' | 'pass' | 'province' | 'mine' | 'karstic' | 'coastal';
  category?: string; // e.g., 'Volkanik Dağ', 'Kıvrım Dağ', 'Kırık Dağ', 'Karstik Göl', etc.
  subCategory?: 'volcanic' | 'fold' | 'fault' | 'glacial' | 'delta' | 'tectonic' | 'karstic' | string;
  coordinates: [number, number]; // [lng, lat]
  elevation?: number; // meters
  region: 'Marmara' | 'Ege' | 'Akdeniz' | 'İç Anadolu' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu';
  description: string;
  kpssTips: string[];
  mnemonic?: string; // Memory code / Akılda kalıcı kodlama
  details?: {
    connectedCountry?: string; // for border gates
    activeStatus?: string;
    railway?: boolean;
    lengthKm?: number; // for rivers
    originMouth?: string;
    dams?: string[];
    cropMineProducts?: string[];
    plateCode?: string; // for provinces
  };
}

export const MOUNTAINS_DATA: GeoFeature[] = [
  // --- VOLKANİK DAĞLAR ---
  {
    id: 'm-agri',
    name: 'Ağrı Dağı',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ (Buzul Var)',
    coordinates: [44.298, 39.702],
    elevation: 5137,
    region: 'Doğu Anadolu',
    description: 'Türkiye ve Avrupa\'nın en yüksek dağıdır (5.137 m). Çift tepeli (Büyük ve Küçük Ağrı) bir stratovolkandır.',
    kpssTips: [
      'Türkiye\'nin en yüksek noktasıdır ve üzerinde takke buzulu (Atatürk Buzulu) bulunur.',
      'Sönmüş volkanik dağdır, milli park alanıdır.',
      'Iğdır ve Ağrı illeri sınırında yer alır.'
    ],
    mnemonic: 'AĞRI = Zirvede tek ve takke buzuluna sahip Dev Volkan!'
  },
  {
    id: 'm-erciyes',
    name: 'Erciyes Dağı',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ (Buzul Var)',
    coordinates: [35.448, 38.531],
    elevation: 3917,
    region: 'İç Anadolu',
    description: 'Kayseri ilinde yer alan İç Anadolu\'nun en yüksek sönmüş volkanik dağıdır.',
    kpssTips: [
      'İç Anadolu Bölgesi\'nin en yüksek noktasıdır ve zirvesinde buzul şekilleri bulunur.',
      'Kış turizmi (Erciyes Kayak Merkezi) bakımından çok gelişmiştir.',
      'Kapadokya peri bacalarının oluşumunda püskürttüğü tüfler büyük rol oynamıştır.'
    ],
    mnemonic: 'Kayseri\'nin Tacı - Kapadokya\'nin Anası Erciyes'
  },
  {
    id: 'm-hasan',
    name: 'Hasan Dağı',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ',
    coordinates: [34.164, 38.127],
    elevation: 3268,
    region: 'İç Anadolu',
    description: 'Aksaray ve Niğde sınırlarında yer alan volkanik dağ.',
    kpssTips: [
      'Çatalhöyük duvar resimlerinde patlaması resmedilen tarihi volkandır.',
      'İç Anadolu volkanik kuşağı hattında (Karadağ - Karacadağ - Hasan Dağı - Melendiz - Erciyes) yer alır.',
      'Buzul şekilleri GÖRÜLMEZ.'
    ],
    mnemonic: 'K-K-H-M-E Hattı (Karadağ, Karacadağ, Hasan, Melendiz, Erciyes)'
  },
  {
    id: 'm-karadag-ic',
    name: 'Karadağ (Karaman)',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ',
    coordinates: [33.150, 37.400],
    elevation: 2271,
    region: 'İç Anadolu',
    description: 'İç Anadolu\'nun güneybatısında Karaman ili sınırlarında yer alan sönmüş volkanik dağ.',
    kpssTips: [
      'İç Anadolu volkanik hizalanmasının en güneybatı halkasıdır.',
      'Buzul şekilleri GÖRÜLMEZ.'
    ]
  },
  {
    id: 'm-karacadag-ic',
    name: 'Karacadağ (Konya)',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ',
    coordinates: [32.850, 37.950],
    elevation: 2025,
    region: 'İç Anadolu',
    description: 'Konya Karapınar yakınlarındaki İç Anadolu volkanik kütlesi.',
    kpssTips: [
      'Mekke Maar Gölü ve Karapınar çevresindeki volkanik şekiller ile aynı hat üzerindedir.',
      'Buzul şekilleri GÖRÜLMEZ.'
    ]
  },
  {
    id: 'm-melendiz',
    name: 'Melendiz Dağı',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ',
    coordinates: [34.400, 38.150],
    elevation: 2963,
    region: 'İç Anadolu',
    description: 'Niğde ve Aksaray arasında Hasan Dağı ile Erciyes arasında kalan volkanik sıra.',
    kpssTips: [
      'İç Anadolu volkanik çizgisinin orta kesimini oluşturur.',
      'Buzul şekilleri GÖRÜLMEZ.'
    ]
  },
  {
    id: 'm-karacadag-gap',
    name: 'Karacadağ (Güneydoğu)',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Kalkan Tipi Volkan Dağı',
    coordinates: [39.833, 37.667],
    elevation: 1957,
    region: 'Güneydoğu Anadolu',
    description: 'Şanlıurfa ve Diyarbakır arasında akıcı lavların yayılmasıyla oluşmuş Türkiye\'nin tek kalkan (shield) tipi volkanıdır.',
    kpssTips: [
      'Ülkemizin TEK Kalkan tipi (yayvan) volkanıdır.',
      'Lavlar çok akıcı olduğu için geniş bir alana yayılmış, dik bir koni oluşturmamıştır.',
      'Yükseltisi azdır ve buzul şekilleri kesinlikle GÖRÜLMEZ.'
    ],
    mnemonic: 'Güneydoğu Karacadağ = Ülkemizin Tek Kalkan Tipi Yayvan Volkanı!'
  },
  {
    id: 'm-nemrut-d',
    name: 'Nemrut Dağı (Bitlis Volkanı)',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ (Kaldera)',
    coordinates: [42.233, 38.621],
    elevation: 2948,
    region: 'Doğu Anadolu',
    description: 'Bitlis ilinde Tatvan yakınlarında yer alan, zirvesinde dünyanın en büyük 2. kaldera gölü (Nemrut Kaldera Gölü) bulunan volkanik dağ.',
    kpssTips: [
      'Türkiye\'nin en son faaliyet gösterip sönen (1441 ve 1443) volkanik dağıdır.',
      'Zirvesinde Nemrut Kaldera Gölü yer alır.',
      'Buzul şekilleri GÖRÜLMEZ (Nemrut, Hasan, Melendiz, Karadağ, Karacadağ\'da buzul yoktur!).'
    ]
  },
  {
    id: 'm-suphan',
    name: 'Süphan Dağı',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ (Buzul Var)',
    coordinates: [42.828, 38.926],
    elevation: 4058,
    region: 'Doğu Anadolu',
    description: 'Van Gölü\'nün kuzeyinde yer alan Türkiye\'nin en yüksek 3. sönmüş volkanik dağı.',
    kpssTips: [
      'Van Gölü\'nün oluşumunda lav seti görevi görmüştür (Van Gölü Volkanik Set Gölüdür).',
      'Zirvesinde örtü buzulu ve buzul şekilleri bulunur.'
    ]
  },
  {
    id: 'm-tendurek',
    name: 'Tendürek Dağı',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Dağ',
    coordinates: [43.866, 39.358],
    elevation: 3533,
    region: 'Doğu Anadolu',
    description: 'Ağrı ve Van arasında aktif gaz ve buhar çıkışlarının devam ettiği kalkan biçimli volkanik dağ.',
    kpssTips: [
      'Türkiye\'de sıcak gaz çıkışlarının (solfatar) halen görüldüğü genç volkanik kütledir.'
    ]
  },
  {
    id: 'm-kula',
    name: 'Kula Volkanları (Manisa)',
    type: 'mountain',
    subCategory: 'volcanic',
    category: 'Volkanik Jeopark',
    coordinates: [28.647, 38.544],
    elevation: 750,
    region: 'Ege',
    description: 'Türkiye\'nin en genç volkanik arazisi ve UNESCO tescilli tek küresel jeoparkı.',
    kpssTips: [
      'Türkiye\'nin ilk ve tek UNESCO Küresel Jeoparkıdır.',
      'Yanık Ülke (Katakekaumene) olarak bilinir. İnsan ayak izleri barındırır.'
    ],
    mnemonic: 'KULA = Türkiye\'nin En Genç Yanık Ülke Jeoparkı'
  },

  // --- KIRIKLI DAĞLAR (HORST) ---
  {
    id: 'm-kazdaglari',
    name: 'Kaz Dağları (İda)',
    type: 'mountain',
    subCategory: 'fault',
    category: 'Kırık Dağı (Horst - Kıyıya Dik)',
    coordinates: [26.852, 39.704],
    elevation: 1774,
    region: 'Ege',
    description: 'Biga Yarımadası ile Edremit Körfezi arasında yer alan yüksek oksijen oranına sahip horst kütlesi.',
    kpssTips: [
      'Ege\'nin en kuzeyindeki HORST (Kırık dağ) yapısıdır.',
      'Kıyıya DİK uzanır. Kırıklı dağlarımızda buzul şekilleri GÖRÜLMEZ!'
    ],
    mnemonic: 'Kırık Dağlar Sırası: KAZ - MADRA - YUNT - BOZDAĞLAR - AYDIN - MENTEŞE'
  },
  {
    id: 'm-madra',
    name: 'Madra Dağı',
    type: 'mountain',
    subCategory: 'fault',
    category: 'Kırık Dağı (Horst - Kıyıya Dik)',
    coordinates: [27.000, 39.300],
    elevation: 1344,
    region: 'Ege',
    description: 'Balıkesir ve İzmir arasında yer alan kırıklı horst dağı.',
    kpssTips: [
      'Kıyıya DİK uzanır. Edremit ile Bakırçay grabeni arasında yükselir.'
    ]
  },
  {
    id: 'm-yunt',
    name: 'Yunt Dağı',
    type: 'mountain',
    subCategory: 'fault',
    category: 'Kırık Dağı (Horst - Kıyıya Dik)',
    coordinates: [27.200, 38.800],
    elevation: 1075,
    region: 'Ege',
    description: 'İzmir ve Manisa arasında Bakırçay ile Gediz grabenleri arasındaki horst kütlesi.',
    kpssTips: [
      'Kıyıya DİK uzanır.'
    ]
  },
  {
    id: 'm-bozdaglar',
    name: 'Bozdağlar',
    type: 'mountain',
    subCategory: 'fault',
    category: 'Kırık Dağı (Horst - Kıyıya Dik)',
    coordinates: [28.100, 38.350],
    elevation: 2157,
    region: 'Ege',
    description: 'İzmir ve Manisa sınırında Gediz ile Küçük Menderes grabenleri arasında yükselen dağ.',
    kpssTips: [
      'Ege kırık dağları içinde en yüksek kütlelerden biridir. Üzerinde kayak merkezi bulunur.',
      'Kıyıya DİK uzanır.'
    ]
  },
  {
    id: 'm-aydin',
    name: 'Aydın Dağları',
    type: 'mountain',
    subCategory: 'fault',
    category: 'Kırık Dağı (Horst - Kıyıya Dik)',
    coordinates: [28.000, 37.900],
    elevation: 1831,
    region: 'Ege',
    description: 'Küçük Menderes ile Büyük Menderes grabenleri arasında yer alan horst dağı.',
    kpssTips: [
      'Kıyıya DİK uzanır.'
    ]
  },
  {
    id: 'm-mentese',
    name: 'Menteşe Dağları',
    type: 'mountain',
    subCategory: 'fault',
    category: 'Kırık Dağı (Horst - Kıyıya Paralel)',
    coordinates: [28.283, 37.311],
    elevation: 1892,
    region: 'Ege',
    description: 'Muğla civarında kıyıya PARALEL uzanan tek Ege kırıklı dağ kütlesidir.',
    kpssTips: [
      'Ege Dağları genelde kıyıya dik uzanırken, Menteşe Dağları KIYIYA PARALEL UZANIR!',
      'Ege\'de en çok yağış alan, engebeli ve arıcılığın geliştiği masif arazidir.'
    ],
    mnemonic: 'Menteşe = Ege\'de Kıyıya Paralel Uzanıp Yağış Rekoru Kıran İstisna!'
  },
  {
    id: 'm-amanos',
    name: 'Amanos (Nur) Dağları',
    type: 'mountain',
    subCategory: 'fault',
    category: 'Kırık Dağı (Horst - Kıyıya Paralel)',
    coordinates: [36.300, 36.500],
    elevation: 2240,
    region: 'Akdeniz',
    description: 'Hatay ve Osmaniye boyunca İskenderun Körfezi\'ne paralel uzanan kırıklı horst dağı.',
    kpssTips: [
      'Akdeniz\'deki TEK KIRIKLI (Horst) dağ kütlesidir!',
      'Kıyıya PARALEL uzanır. Üzerinde tarihi Belen Geçidi bulunur.'
    ],
    mnemonic: 'Amanos (Nur) = Akdeniz\'in Paralel Uzanışlı Kırık Dağı + Belen Geçidi'
  },

  // --- KIVRIMLI DAĞLAR (ALP OROJENEZİ - KUZEY ANADOLU & TOROSLAR) ---
  {
    id: 'm-yildiz',
    name: 'Yıldız Dağları (Istranca)',
    type: 'mountain',
    subCategory: 'fold',
    category: 'Kıvrım Dağı (Masif Arazi)',
    coordinates: [27.500, 41.800],
    elevation: 1031,
    region: 'Marmara',
    description: 'Trakya\'da Karadeniz kıyısına paralel uzanan eski kütle (Masif) kıvrım dağları.',
    kpssTips: [
      'Marmara Bölgesi\'nin EN YAĞIŞLI alanıdır.',
      'Kıvrılma ile oluşmuştur, Masif arazidir ve deprem riski düşüktür.',
      'Yükseltisi azdır ve buzul şekilleri kesinlikle GÖRÜLMEZ!'
    ],
    mnemonic: 'Yıldız Dağları = Trakya\'nın Yağışlı Masif Kıvrım Dağı'
  },
  {
    id: 'm-samanli',
    name: 'Samanlı Dağları',
    type: 'mountain',
    subCategory: 'fold',
    category: 'Kıvrım Dağı (Marmara)',
    coordinates: [29.600, 40.600],
    elevation: 1601,
    region: 'Marmara',
    description: 'Yalova, Kocaeli ve Bursa arasında İzmit Körfezi ile İznik Gölü arasında uzanan kıvrım sırası.',
    kpssTips: [
      'Kuzey Anadolu kıvrım sisteminin Marmara uzantılarındandır.'
    ]
  },
  {
    id: 'm-bolu-d',
    name: 'Bolu Dağları',
    type: 'mountain',
    subCategory: 'fold',
    category: 'Kıvrım Dağı (Batı Karadeniz)',
    coordinates: [31.600, 40.750],
    elevation: 1980,
    region: 'Karadeniz',
    description: 'Batı Karadeniz\'de ulaşım geçitleri ve tünelleriyle ünlü kıvrım kütlesi.',
    kpssTips: [
      'Buzul şekilleri GÖRÜLMEZ.'
    ]
  },
  {
    id: 'm-kure',
    name: 'Küre (İsfendiyar) Dağları',
    type: 'mountain',
    subCategory: 'fold',
    category: 'Kıvrım Dağı (Batı Karadeniz)',
    coordinates: [33.700, 41.700],
    elevation: 2019,
    region: 'Karadeniz',
    description: 'Kastamonu ve Sinop boyunca Karadeniz kıyısına paralel uzanan kıvrım sırası.',
    kpssTips: [
      'Kıyı ile iç kesimler arasında iklim ve ulaşımı zorlaştırır.',
      'Buzul şekilleri GÖRÜLMEZ.'
    ]
  },
  {
    id: 'm-koroglu',
    name: 'Köroğlu Dağları',
    type: 'mountain',
    subCategory: 'fold',
    category: 'Kıvrım Dağı (Batı Karadeniz)',
    coordinates: [32.100, 40.600],
    elevation: 2400,
    region: 'Karadeniz',
    description: 'Bolu ve Çankırı kuzeyinde yükselen volkanik çeşnili kıvrım dağları.',
    kpssTips: [
      'Buzul şekilleri GÖRÜLMEZ.'
    ]
  },
  {
    id: 'm-ilgaz',
    name: 'Ilgaz Dağları',
    type: 'mountain',
    subCategory: 'fold',
    category: 'Kıvrım Dağı (Batı Karadeniz)',
    coordinates: [33.870, 41.080],
    elevation: 2587,
    region: 'Karadeniz',
    description: 'Kastamonu ve Çankırı sınırında yer alan milli park ve kış turizm merkezi.',
    kpssTips: [
      'Ilgaz Tüneli iç kesimler ile Kastamonu arasındaki ulaşımı rahatlatmıştır.'
    ]
  },
  {
    id: 'm-canik',
    name: 'Canik Dağları',
    type: 'mountain',
    subCategory: 'fold',
    category: 'Kıvrım Dağı (Orta Karadeniz)',
    coordinates: [36.500, 41.000],
    elevation: 1500,
    region: 'Karadeniz',
    description: 'Samsun gerisinde yükselen alçak ve kıyıdan uzak kıvrım dağları.',
    kpssTips: [
      'Yükseltisi az ve kıyıdan UZAK olduğu için Orta Karadeniz daha az yağış alır!',
      'Hinterlandı ve kıta sahanlığı son derece geniştir (Bafra ve Çarşamba ovaları oluşmuştur).',
      'Buzul şekilleri GÖRÜLMEZ.'
    ],
    mnemonic: 'Canik = Alçak & Uzak -> Geniş Hinterland + Az Yağış!'
  },
  {
    id: 'm-giresun',
    name: 'Giresun Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Buzul Var)',
    coordinates: [38.500, 40.500],
    elevation: 3385,
    region: 'Karadeniz',
    description: 'Doğu Karadeniz sıradağlarının batı kanadı (Karagöl Tepesi buzul gölleri barındırır).',
    kpssTips: [
      'Zirve kesimlerinde Karagöl buzul sirk gölleri yer alır.'
    ]
  },
  {
    id: 'm-kackar',
    name: 'Kaçkar Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Doğu Karadeniz - Buzul Var)',
    coordinates: [41.159, 40.842],
    elevation: 3937,
    region: 'Karadeniz',
    description: 'Doğu Karadeniz\'in en yüksek zirvesi. Rize ve Artvin boyunca uzanır.',
    kpssTips: [
      'Karadeniz\'in EN YÜKSEK kıvrım dağıdır.',
      'Bol yağış alır, kıta sahanlığı ve hinterlandı dardır.',
      'Buzul vadileri, sirk gölleri ve yaylacılık çok gelişmiştir.'
    ],
    mnemonic: 'Kaçkar = Karadeniz Zirvesi + Dar Hinterland + Buzul Vadileri'
  },
  {
    id: 'm-karcal',
    name: 'Karçal Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Buzul Var)',
    coordinates: [41.900, 41.350],
    elevation: 3428,
    region: 'Karadeniz',
    description: 'Artvin Borçka ile Gürcistan sınırında yükselen buzul izli yüksek kıvrım dağları.',
    kpssTips: [
      'Buzul şekilleri görülür, biyoçeşitlilik bakımından koruma altındadır.'
    ]
  },
  {
    id: 'm-yalnizcam',
    name: 'Yalnızçam Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Buzul Var)',
    coordinates: [42.300, 41.100],
    elevation: 3202,
    region: 'Doğu Anadolu',
    description: 'Ardahan ve Artvin arasında Karadeniz ile Doğu Anadolu\'yu ayıran buzul kütlesi.',
    kpssTips: [
      'Zirvelerinde buzul şekillerine rastlanır.'
    ]
  },
  {
    id: 'm-mescit',
    name: 'Mescit Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Buzul Var)',
    coordinates: [41.200, 40.400],
    elevation: 3239,
    region: 'Doğu Anadolu',
    description: 'Erzurum kuzeyinde Çoruh ile Aras havzalarını ayıran buzul kütlesi.',
    kpssTips: [
      'Çoruh Nehri\'nin doğduğu dağ kütlelerindendir.'
    ]
  },
  {
    id: 'm-mercan',
    name: 'Mercan (Munzur) Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Buzul Var)',
    coordinates: [39.400, 39.300],
    elevation: 3462,
    region: 'Doğu Anadolu',
    description: 'Tunceli ve Erzincan sınırında Munzur Vadisi Milli Parkı\'nı oluşturan dik sirk buzullu dağlar.',
    kpssTips: [
      'Munzur Vadisi Milli Parkı yer alır. Güncel buzul izleri taşır.'
    ]
  },
  {
    id: 'm-bingol-d',
    name: 'Bingöl Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Buzul Var)',
    coordinates: [41.100, 39.200],
    elevation: 3250,
    region: 'Doğu Anadolu',
    description: 'Bingöl, Erzurum ve Muş sınırında yer alan buzul gölleriyle ünlü dağ kütlesi.',
    kpssTips: [
      'Güneşin doğuşunun izlendiği buzul gölleriyle tanınır.'
    ]
  },

  // Toroslar (Akdeniz & Güney)
  {
    id: 'm-beydaglari',
    name: 'Bey Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Batı Toroslar - Buzul Var)',
    coordinates: [30.300, 36.600],
    elevation: 3086,
    region: 'Akdeniz',
    description: 'Antalya batısında kıyıya paralel uzanan kış turizmi (Saklıkent) ve buzul izli dağlar.',
    kpssTips: [
      'Kıyıya PARALEL uzanır.',
      'Olimpos-Beydağları Milli Parkı alanı ve yaylacılık gelişmiştir.'
    ]
  },
  {
    id: 'm-dedegol',
    name: 'Dedegöl Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Batı Toroslar - Buzul Var)',
    coordinates: [31.300, 37.700],
    elevation: 2992,
    region: 'Akdeniz',
    description: 'Isparta Beyşehir Gölü batısında yükselen karstik ve sirk buzullu dağ kütlesi.',
    kpssTips: [
      'Buzul gölleri ve Pınarözü Mağarası ile ünlüdür.'
    ]
  },
  {
    id: 'm-geyik',
    name: 'Geyik Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Batı Toroslar - Buzul Var)',
    coordinates: [32.200, 36.900],
    elevation: 2877,
    region: 'Akdeniz',
    description: 'Antalya, Karaman ve Konya arasında yer alan yüksek karstik ve sirkli dağlar.',
    kpssTips: [
      'Buzul izleri taşır.'
    ]
  },
  {
    id: 'm-bolkar',
    name: 'Bolkar Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Orta Toroslar - Buzul Var)',
    coordinates: [34.300, 37.200],
    elevation: 3524,
    region: 'Akdeniz',
    description: 'Mersin, Niğde ve Karaman arasında yer alan karstik aşınım ve buzul şekilli Orta Toroslar zirvesi.',
    kpssTips: [
      'Sertavul Geçidi bu dağ kütlesi üzerindedir.',
      'Endemik bitkiler (Örn: Öttüren Boğa Kurbağası - Karagöl) ve sirk gölleri barındırır.'
    ],
    mnemonic: 'Bolkar = Sertavul Geçidi + Endemik Türler + Sirk Gölleri'
  },
  {
    id: 'm-aladaglar',
    name: 'Aladağlar',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Orta Toroslar - Buzul Var)',
    coordinates: [35.150, 37.800],
    elevation: 3756,
    region: 'Akdeniz',
    description: 'Niğde, Adana ve Kayseri sınırında Torosların en yüksek zirvesi (Demirkazık Peak).',
    kpssTips: [
      'Toroslar\'ın EN YÜKSEK zirvesidir (Demirkazık: 3.756m).',
      'Milli park alanıdır, dağcılık ve buzul şekilleri çok yaygındır.'
    ],
    mnemonic: 'Aladağlar = Toroslar\'ın Şahı Demirkazık + Milli Park'
  },
  {
    id: 'm-nurhak',
    name: 'Nurhak Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Buzul Var)',
    coordinates: [37.400, 38.000],
    elevation: 3081,
    region: 'Güneydoğu Anadolu',
    description: 'Kahramanmaraş ve Malatya arasında Güneydoğu Toroslar uzantısı.',
    kpssTips: [
      'Buzul şekilleri görülen yüksek dağlarımızdandır.'
    ]
  },
  {
    id: 'm-cilo-sat',
    name: 'Buzul (Cilo - Sat) Dağları',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (En Yüksek Kıvrım - Buzul Var)',
    coordinates: [44.000, 37.500],
    elevation: 3950,
    region: 'Doğu Anadolu',
    description: 'Hakkari il sınırlarında yer alan Türkiye\'nin en yüksek kıvrım dağı ve en büyük güncel buzul sahası (Uludoruk / Reşko).',
    kpssTips: [
      'Türkiye\'nin EN YÜKSEK KIVRIMLI dağıdır (Uludoruk / Reşko: 3.950m).',
      'Ülkemizin EN BÜYÜK GÜNCEL BUZULU (Cilo Buzulu) buradadır.',
      'Milli park alanıdır.'
    ],
    mnemonic: 'CILO (SAT) = Ülkemizin En Yüksek Kıvrım Dağı & En Büyük Güncel Buzulu!'
  },

  // DİĞER ÖNEMLİ BUZUL İZLİ DAĞLAR
  {
    id: 'm-uludag',
    name: 'Uludağ',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Batolit İç Püskürük (Buzul Var)',
    coordinates: [29.131, 40.069],
    elevation: 2543,
    region: 'Marmara',
    description: 'Marmara Bölgesi\'nin en yüksek dağıdır. Yeraltındaki magmanın yüzeye çıkamadan soğumasıyla (Batolit) oluşmuştur.',
    kpssTips: [
      'Volkanik patlama yapmamıştır, bir Batolit (İç Püskürük) kütlesidir.',
      'Marmara\'da buzul izleri (Sirk gölleri: Aynalı, Karagöl) taşıyan TEK dağdır.',
      'Volfram (Tungsten) madeni çıkarılır.'
    ],
    mnemonic: 'Uludağ = Marmara\'nın Tek Buzul İzli Batoliti'
  },
  {
    id: 'm-honaz',
    name: 'Honaz Dağı',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Ege\'nin En Yüksek Dağı (Buzul Var)',
    coordinates: [29.280, 37.760],
    elevation: 2571,
    region: 'Ege',
    description: 'Denizli ilinde yer alan Ege Bölgesi\'nin en yüksek dağıdır.',
    kpssTips: [
      'Ege Bölgesi\'nin EN YÜKSEK noktasıdır (2.571m).',
      'Milli park tescillidir ve sirk buzul izleri barındırır.'
    ],
    mnemonic: 'Honaz = Ege\'nin Zirvesi (2571m)'
  },
  {
    id: 'm-davraz',
    name: 'Davraz Dağı',
    type: 'mountain',
    subCategory: 'glacial',
    category: 'Kıvrım Dağı (Buzul Var)',
    coordinates: [30.750, 37.780],
    elevation: 2635,
    region: 'Akdeniz',
    description: 'Isparta yakınlarında Eğirdir Gölü güneyinde yükselen kış turizm merkezi.',
    kpssTips: [
      'Davraz Kayak Merkezi bulunur ve sirk buzul şekillerine sahiptir.'
    ]
  }
];

export const RIVERS_DATA: GeoFeature[] = [
  // --- KARADENİZ'E DÖKÜLEN AKARSULAR ---
  {
    id: 'r-kizilirmak',
    name: 'Kızılırmak',
    type: 'river',
    category: 'Açık Havza Akarsu (Karadeniz)',
    coordinates: [36.002, 41.597],
    region: 'Karadeniz',
    description: 'Türkiye sınırları içerisinde doğup yine Türkiye denizlerine dökülen EN UZUN nehirdir (1.355 km).',
    kpssTips: [
      'Sivas Kızıldağ\'dan doğar, Karadeniz\'e döküldüğü yerde Bafra Delta Ovası\'nı oluşturur.',
      'Üzerinde Hirfanlı, Kesikköprü, Altınkaya, Deriner, Kapulukaya barajları yer alır.',
      'Tuz Gölü ve jipsli arazilerden geçtiği için suyu yer yer tuzludur/kireçlidir.',
      'İç Anadolu\'da dev bir yay (Kızılırmak Yayı) çizer.'
    ],
    details: {
      lengthKm: 1355,
      originMouth: 'Sivas Kızıldağ -> Bafra (Karadeniz)',
      dams: ['Altınkaya', 'Derbent', 'Hirfanlı', 'Kesikköprü', 'Kapulukaya']
    },
    mnemonic: 'KIZILIRMAK = En Uzun Yerli Nehir -> Bafra Deltası + Altınkaya & Hirfanlı Barajları'
  },
  {
    id: 'r-yesilirmak',
    name: 'Yeşilırmak',
    type: 'river',
    category: 'Açık Havza Akarsu (Karadeniz)',
    coordinates: [36.628, 41.385],
    region: 'Karadeniz',
    description: 'Sivas Kösedağ\'dan doğup Çarşamba Ovası\'nı denizi doldurarak oluşturan akarsu.',
    kpssTips: [
      'Samsun Çarşamba Delta Ovası\'nı oluşturur.',
      'Erozyon ve alüvyon taşıma kapasitesi çok yüksektir.',
      'Başlıca kolları: Kelkit Çayı ve Çekerek Irmağı\'dır.',
      'Barajları: Hasan Uğurlu, Suat Uğurlu, Almus, Kılıçkaya.'
    ],
    details: {
      lengthKm: 519,
      originMouth: 'Sivas Kösedağ -> Çarşamba (Karadeniz)',
      dams: ['Hasan Uğurlu', 'Suat Uğurlu', 'Almus', 'Kılıçkaya']
    },
    mnemonic: 'Yeşilırmak -> Çarşamba Deltası + Hasan/Suat Uğurlu Barajları'
  },
  {
    id: 'r-kelkit',
    name: 'Kelkit Çayı (Yeşilırmak Kolu)',
    type: 'river',
    category: 'Fay Oluğu Akarsuyu',
    coordinates: [37.500, 40.350],
    region: 'Karadeniz',
    description: 'Gümüşhane\'den doğup Kuzey Anadolu Fay Hattı (KAF) çöküntü oluğu boyunca akan Yeşilırmak\'ın en büyük kolu.',
    kpssTips: [
      'Kuzey Anadolu Fay zonu boyunca uzanan tektonik vadiden akar.',
      'Niksar ve Erbaa ovalarını sulayarak Yeşilırmak ile birleşir.'
    ],
    details: {
      lengthKm: 320,
      dams: ['Kılıçkaya Barajı']
    }
  },
  {
    id: 'r-sakarya',
    name: 'Sakarya Nehri',
    type: 'river',
    category: '4 Bölgeli Akarsu (Karadeniz)',
    coordinates: [30.655, 41.130],
    region: 'Marmara',
    description: 'Eskişehir Çifteler\'den doğup İç Anadolu, Ege, Marmara ve Karadeniz olmak üzere 4 FARKLI COĞRAFİ BÖLGEDEN geçen nehir.',
    kpssTips: [
      '4 ayrı coğrafi bölgeden (İç Anadolu, Ege, Marmara, Karadeniz) su toplar.',
      'Karasu\'da Karadeniz\'e dökülür; kıyı akıntıları ve derinlik nedeniyle büyük delta oluşturamaz.',
      'En önemli kolları: Porsuk Çayı ve Ankara Çayı\'dır.',
      'Sanayi ve evsel atıklar nedeniyle kirlilik oranı yüksektir.'
    ],
    details: {
      lengthKm: 824,
      originMouth: 'Afyon/Eskişehir -> Sakarya Karasu (Karadeniz)',
      dams: ['Sarıyar (Hasan Polatkan)', 'Gökçekaya', 'Yenice']
    },
    mnemonic: 'Sakarya = 4 Bölge Gezen Nehir + Sarıyar & Gökçekaya Barajları'
  },
  {
    id: 'r-porsuk',
    name: 'Porsuk Çayı (Sakarya Kolu)',
    type: 'river',
    category: 'Açık Havza / Şehir Akarsuyu',
    coordinates: [30.520, 39.770],
    region: 'İç Anadolu',
    description: 'Kütahya Murat Dağı\'ndan doğup Eskişehir şehir merkezini güzelleştiren Sakarya Nehri\'nin en uzun kolu.',
    kpssTips: [
      'Eskişehir şehir içi gondol ve tekne turizmiyle tanınır.',
      'Porsuk Barajı kentin su ihtiyacını karşılar.'
    ],
    details: {
      lengthKm: 448,
      dams: ['Porsuk Barajı']
    }
  },
  {
    id: 'r-coruh',
    name: 'Çoruh Nehri',
    type: 'river',
    category: 'Sınır Aşan / Rafting & En Yüksek Barajlar',
    coordinates: [41.550, 41.600],
    region: 'Karadeniz',
    description: 'Dünyanın en hızlı akan ve en derin vadilerinden geçen akarsularından biri. Gürcistan Batum\'dan Karadeniz\'e dökülür.',
    kpssTips: [
      'Türkiye\'nin akış hızı, aşındırma gücü ve rafting potansiyeli EN YÜKSEK nehridir.',
      'Üzerinde Türkiye\'nin EN YÜKSEK BARAJI olan YUSUFELİ BARAJI (275 m) yer alır!',
      'Deriner (249 m), Borçka, Muratlı ve Artvin barajları da bu vadidedir.',
      'Sınır aşan nehirdir; Gürcistan topraklarından Karadeniz\'e dökülür.'
    ],
    details: {
      lengthKm: 431,
      originMouth: 'Mescit Dağları (Erzurum) -> Batum (Karadeniz)',
      dams: ['Yusufeli (En Yüksek - 275m)', 'Deriner (249m)', 'Borçka', 'Muratlı', 'Artvin']
    },
    mnemonic: 'Çoruh = Hızlı Akış + Yusufeli (275m Zirve Baraj) + Deriner + Rafting'
  },
  {
    id: 'r-bartin',
    name: 'Bartın Çayı',
    type: 'river',
    category: 'Üzerinde Taşımacılık Yapılan Tek Akarsu',
    coordinates: [32.225, 41.685],
    region: 'Karadeniz',
    description: 'Türkiye\'de denize döküldüğü ağız kısmından itibaren yaklaşık 15 km boyunca İÇ ULAŞIM ve TAŞIMACILIK YAPILABİLEN TEK AKARSU.',
    kpssTips: [
      'ÖSYM KPSS KİLİT SORU: Türkiye\'de üzerinde deniz/yük taşımacılığı yapılabilen TEK akarsu Bartın Çayı\'dır!',
      'Akış rejimi düzenli ve vadi eğimi az olduğu için küçük tonajlı gemiler girebilir.'
    ],
    details: {
      lengthKm: 107,
      originMouth: 'Küre Dağları -> Karadeniz (Bartın Boğazı)'
    },
    mnemonic: 'BARTIN ÇAYI = Türkiye\'de TAŞIMACILIK (Ulaşım) Yapılan TEK Akarsu!'
  },
  {
    id: 'r-filyos',
    name: 'Filyos (Yenice) Çayı',
    type: 'river',
    category: 'Karadeniz Sanayi & Liman Havzası',
    coordinates: [32.020, 41.570],
    region: 'Karadeniz',
    description: 'Karabük ve Zonguldak arasından geçerek Karadeniz Filyos Limanı\'na dökülen kilit akarsu.',
    kpssTips: [
      'Karabük Demir-Çelik Fabrikası ve Filyos Endüstri Bölgesi için hayati önem taşır.',
      'Karadeniz Doğalgazı karaya Filyos Limanı ve vadisinden çıkarılmaktadır.'
    ],
    details: {
      lengthKm: 288
    }
  },
  {
    id: 'r-harsit',
    name: 'Harşit (Doğankent) Çayı',
    type: 'river',
    category: 'Doğu Karadeniz Akarsuyu',
    coordinates: [38.920, 40.980],
    region: 'Karadeniz',
    description: 'Gümüşhane dağlarından doğup derin vadilerle Tirebolu (Giresun)\'dan Karadeniz\'e ulaşan akarsu.',
    kpssTips: [
      'Tarihi Harşit Savunması\'nın yapıldığı derin vadi sistemidir.',
      'Hidroelektrik potansiyeli yüksektir (Kürtün, Torul ve Doğankent barajları).'
    ],
    details: {
      lengthKm: 160,
      dams: ['Torul Barajı', 'Kürtün Barajı', 'Doğankent HES']
    }
  },

  // --- MARMARA'YA DÖKÜLEN AKARSULAR ---
  {
    id: 'r-susurluk',
    name: 'Susurluk (Simav) Çayı',
    type: 'river',
    category: 'Marmara Havzası Akarsuyu',
    coordinates: [28.450, 40.380],
    region: 'Marmara',
    description: 'İç Batı Anadolu\'dan doğup Nilüfer ve Kemalpaşa çaylarını alarak Marmara Denizi\'ne (Kapıdağ doğusu) dökülen akarsu.',
    kpssTips: [
      'Güney Marmara\'nın en büyük akarsu havzasıdır.',
      'Nilüfer Çayı (Bursa sanayi atıkları) ile birleştiği için Marmara\'nın en kirli akarsularındandır.',
      'Manyas ve Uluabat göllerinin fazla sularını tahliye eder.'
    ],
    details: {
      lengthKm: 321,
      dams: ['Çaygören Barajı']
    }
  },
  {
    id: 'r-gonen',
    name: 'Gönen Çayı',
    type: 'river',
    category: 'Güney Marmara Akarsuyu',
    coordinates: [27.650, 40.380],
    region: 'Marmara',
    description: 'Kaz Dağları\'ndan doğup Çanakkale ve Balıkesir üzerinden Marmara Denizi\'ne dökülen çeltik (pirinç) sulama akarsuyu.',
    kpssTips: [
      'Gönen Ovası\'nda dünyaca ünlü pirinç üretiminin ana can damarıdır.'
    ],
    details: {
      lengthKm: 134,
      dams: ['Gönen Barajı']
    }
  },

  // --- EGE'YE DÖKÜLEN AKARSULAR (GRABEN NEHİRLERİ) ---
  {
    id: 'r-meric',
    name: 'Meriç Nehri',
    type: 'river',
    category: 'Sınır Aşan / Sınır Çizen Nehir (Ege)',
    coordinates: [26.350, 41.200],
    region: 'Marmara',
    description: 'Bulgaristan Rila Dağları\'ndan doğup Türkiye - Yunanistan sınırını çizerek Saros Körfezi/Enez\'den Ege Denizi\'ne dökülen nehir.',
    kpssTips: [
      'Türkiye - Yunanistan doğal kara sınırının büyük bölümünü oluşturur.',
      'Yurtdışından doğup Türkiye\'de denize dökülen nehirlerimizdendir (Meriç ve Asi).',
      'En büyük kolu Ergene Nehri\'dir. Taşkınlarıyla ve pirinç (çeltik) üretimiyle bilinir.'
    ],
    details: {
      lengthKm: 480,
      originMouth: 'Bulgaristan -> Edirne Sınırı -> Ege Denizi (Enez)'
    },
    mnemonic: 'Meriç = Bulgaristan\'dan Gelir + Yunanistan Sınırı + Ergene Çeltik Tarlaları'
  },
  {
    id: 'r-ergene',
    name: 'Ergene Nehri (Meriç Kolu)',
    type: 'river',
    category: 'Marmara İç Havza / Kirlilik & Pirinç',
    coordinates: [26.850, 41.300],
    region: 'Marmara',
    description: 'Yıldız Dağları\'ndan doğup Trakya içinden geçerek Meriç ile birleşen akarsu.',
    kpssTips: [
      'Türkiye\'de pirinç (çeltik) üretiminin 1. sırasında yer alan havzadır (Edirne/Tekirdağ).',
      'Trakya sanayi tesisleri nedeniyle Türkiye\'nin EN KİRLİ akarsularından biridir.'
    ],
    details: {
      lengthKm: 285
    }
  },
  {
    id: 'r-bakircay',
    name: 'Bakırçay',
    type: 'river',
    category: 'Graben / Menderesli Akarsu (Ege)',
    coordinates: [27.000, 39.000],
    region: 'Ege',
    description: 'Madra ve Yunt dağları arasındaki graben oluğundan akıp Çandarlı Körfezi\'nde Dikili Deltası\'nı oluşturan Ege akarsuyu.',
    kpssTips: [
      'Ege grabenleri içerisinde en kuzeydeki akarsudur (Şifre: B-G-K-B sıralamasının ilki).',
      'Çandarlı Körfezi\'nde Dikili alüvyal deltası oluşturur.',
      'Akış hızı ve hidroelektrik potansiyeli düşüktür; sık menderesler çizer.'
    ],
    details: {
      lengthKm: 129,
      dams: ['Yortanlı Barajı']
    },
    mnemonic: 'Ege Akarsuları Kuzeyden Güneye: B-G-K-B (Bakırçay, Gediz, Küçük Menderes, Büyük Menderes)'
  },
  {
    id: 'r-gediz',
    name: 'Gediz Nehri',
    type: 'river',
    category: 'Graben / Delta Akarsuyu (Ege)',
    coordinates: [27.050, 38.600],
    region: 'Ege',
    description: 'İç Batı Anadolu\'dan (Murat Dağı) doğup Manisa ve İzmir Menemen Ovası\'ndan geçerek Ege Denizi\'ne dökülen nehir.',
    kpssTips: [
      'Menemen Delta Ovası\'nı oluşturmuştur.',
      'İzmir Körfezi dolmasın diye Osmanlı döneminde yatağı kuzeye (Çamaltı Tuzlası yanına) kaydırılmıştır!',
      'Gediz Deltası (İzmir Kuş Cenneti) uluslararası Ramsar koruma alanıdır.',
      'Üzerinde Demirköprü Barajı yer alır.'
    ],
    details: {
      lengthKm: 401,
      originMouth: 'Murat Dağı -> Menemen Deltası (İzmir Körfezi Dışı)',
      dams: ['Demirköprü Barajı']
    },
    mnemonic: 'Gediz = Menemen Deltası + Demirköprü Barajı + Yatağı Değiştirilen Nehir'
  },
  {
    id: 'r-kucuk-menderes',
    name: 'Küçük Menderes Nehri',
    type: 'river',
    category: 'Graben / Antik Liman Dolduran Akarsu',
    coordinates: [27.300, 37.950],
    region: 'Ege',
    description: 'Bozdağlar ile Aydın Dağları arasındaki grabenden akıp Selçuk\'ta denize dökülen ve Efes Antik Limanı\'nı dolduran akarsu.',
    kpssTips: [
      'Selçuk Delta Ovası\'nı oluşturmuştur.',
      'Taşıdığı alüvyonlarla tarihi EFES ANTİK KENTİ\'nin denizle bağını kesip içeride kalmasına yol açmıştır!',
      'Kirlilik oranı kimyasal tarım ilaçları nedeniyle yüksektir.'
    ],
    details: {
      lengthKm: 175
    },
    mnemonic: 'Küçük Menderes -> Selçuk Deltası + Efes Limanını Dolduran Nehir'
  },
  {
    id: 'r-buyuk-menderes',
    name: 'Büyük Menderes Nehri',
    type: 'river',
    category: 'Ege\'nin En Uzun Nehri / Balat Deltası',
    coordinates: [27.200, 37.550],
    region: 'Ege',
    description: 'Ege Bölgesi\'nin EN UZUN NEHRİDİR (548 km). Milet Antik Limanı\'nı doldurup Bafa Gölü\'nü oluşturan nehir.',
    kpssTips: [
      'Ege Bölgesi\'nin en uzun akarsuyudur ve dünyada "Menderes" (kıvrım) coğrafi terimine adını vermiştir!',
      'Balat Delta Ovası\'nı oluşturmuştur.',
      'Taşıdığı alüvyonlarla Latmos Körfezi\'nin önünü kapatarak Bafa (Çamiçi) Gölü\'nü (Alüvyal Set) meydana getirmiştir.',
      'Milet Antik Kenti\'nin denizden kopmasına neden olmuştur.',
      'Barajları: Adıgüzel, Kemer barajları.'
    ],
    details: {
      lengthKm: 548,
      originMouth: 'Afyon Dinar -> Balat Deltası (Ege Denizi)',
      dams: ['Adıgüzel Barajı', 'Kemer Barajı', 'Cindere Barajı']
    },
    mnemonic: 'Büyük Menderes = Ege\'nin En Uzunu + Balat Deltası + Bafa Gölü Oluşumu'
  },

  // --- AKDENİZ'E DÖKÜLEN AKARSULAR ---
  {
    id: 'r-dalaman',
    name: 'Dalaman Çayı',
    type: 'river',
    category: 'Akdeniz / Rafting Akarsuyu',
    coordinates: [28.700, 36.700],
    region: 'Ege',
    description: 'Batı Toroslar ve Menteşe yöresinden doğup Köyceğiz-Dalaman arasından Akdeniz\'e dökülen rafting akarsuyu.',
    kpssTips: [
      'Rafting ve doğa sporları açısından Türkiye\'nin önde gelen akarsularındandır.',
      'Akdeniz ile Ege coğrafi sınırında yer alır.'
    ],
    details: {
      lengthKm: 229,
      dams: ['Akköprü Barajı']
    }
  },
  {
    id: 'r-esen',
    name: 'Eşen (Kocaçay) Çayı',
    type: 'river',
    category: 'Akdeniz / Kanyon Vadisi Akarsuyu',
    coordinates: [29.250, 36.300],
    region: 'Akdeniz',
    description: 'Muğla Seydikemer ve Antalya Kaş sınırında Saklıkent Kanyonu\'nu besleyerek Patara kumsalından Akdeniz\'e dökülen akarsu.',
    kpssTips: [
      'Ünlü Saklıkent Kanyonu ve Patara Plajı kordonunu besler.',
      'Muğla ile Antalya illeri arasında doğal sınır oluşturur.'
    ],
    details: {
      lengthKm: 146
    }
  },
  {
    id: 'r-manavgat',
    name: 'Manavgat Çayı',
    type: 'river',
    category: 'Karstik Kaynaklı Düzenli Akarsu (Akdeniz)',
    coordinates: [31.450, 36.750],
    region: 'Akdeniz',
    description: 'Batı Toroslar karstik gür kaynaklarından (Dumanlı Kaynağı) beslenen ve debisi yıl boyu en düzenli olan akarsulardan biri.',
    kpssTips: [
      'Karstik kaynaklarla (voklüz) beslendiği için Akdeniz ikliminde olmasına rağmen YAZIN BİLE KURUMAZ, rejimi oldukça düzenlidir!',
      'Üzerinde Manavgat Şelalesi ve Oymapınar Barajı (Seydişehir Alüminyum Tesisleri enerjisini karşılar) yer alır.'
    ],
    details: {
      lengthKm: 93,
      dams: ['Oymapınar Barajı', 'Manavgat Barajı']
    },
    mnemonic: 'Manavgat = Karstik Voklüz Kaynak + Oymapınar Barajı + Düzenli Rejim'
  },
  {
    id: 'r-koprucay',
    name: 'Köprüçay',
    type: 'river',
    category: 'Kanyon / Rafting Akarsuyu',
    coordinates: [31.180, 36.830],
    region: 'Akdeniz',
    description: 'Isparta dağlarından doğup Köprülü Kanyon Milli Parkı içinden geçerek Serik\'ten Akdeniz\'e dökülen kilit rafting çayı.',
    kpssTips: [
      'Türkiye\'nin en popüler Köprülü Kanyon Rafting merkezidir.',
      'Karstik kireçtaşı kanyonlarını yarmıştır.'
    ],
    details: {
      lengthKm: 184
    }
  },
  {
    id: 'r-aksu',
    name: 'Aksu Çayı (Antalya)',
    type: 'river',
    category: 'Akdeniz Akarsuyu',
    coordinates: [30.850, 36.850],
    region: 'Akdeniz',
    description: 'Eğirdir ve Kovada gölleri çevresinden doğup Antalya Ovası\'nı sulayarak Akdeniz\'e dökülen nehir.',
    kpssTips: [
      'Perge antik kentinin yanından geçer ve Antalya seracılığının ana su kaynağıdır.',
      'Karacaören I ve II barajları bu akarsu üzerindedir.'
    ],
    details: {
      lengthKm: 145,
      dams: ['Karacaören I', 'Karacaören II']
    }
  },
  {
    id: 'r-duden',
    name: 'Düden Çayı & Şelaleleri',
    type: 'river',
    category: 'Karstik Yeraltı Akarsuyu',
    coordinates: [30.780, 36.850],
    region: 'Akdeniz',
    description: 'Toroslar karstik düdenlerinden yeraltına batıp (batan) kilometrelerce sonra tekrar yüzeye çıkarak falezlerden denize dökülen su.',
    kpssTips: [
      'Aşağı Düden (Karpuzkaldıran) 40 metre yükseklikteki traverten falezlerinden doğrudan denize dökülür!',
      'Karstik batan-çıkan (düden) hidrografyasının en belirgin simgesidir.'
    ]
  },
  {
    id: 'r-goksu',
    name: 'Göksu Nehri',
    type: 'river',
    category: 'Akdeniz / Silifke Deltası',
    coordinates: [34.000, 36.300],
    region: 'Akdeniz',
    description: 'Orta Toroslar\'dan doğup Taşeli Platosu\'nu derin kanyonlarla yararak Silifke Delta Ovası\'nı oluşturan akarsu.',
    kpssTips: [
      'Silifke Delta Ovası\'nı ve Göksu Deltası Özel Çevre Koruma Alanı\'nı (Caretta Caretta & Kuş Cenneti) oluşturmuştur.',
      'Mavi Tünel projesi ile Göksu\'nun suları Konya Ovası\'na (KOP) aktarılmaktadır!',
      'Gezende ve Ermenek barajları üzerindedir.'
    ],
    details: {
      lengthKm: 260,
      originMouth: 'Orta Toroslar -> Silifke Deltası (Akdeniz)',
      dams: ['Ermenek Barajı (Çok Yüksek Kemer)', 'Gezende Barajı']
    },
    mnemonic: 'Göksu = Silifke Deltası + Ermenek Barajı + Mavi Tünel KOP Kaynağı'
  },
  {
    id: 'r-seyhan',
    name: 'Seyhan Nehri',
    type: 'river',
    category: 'Çukurova Deltası / Akdeniz',
    coordinates: [34.900, 36.720],
    region: 'Akdeniz',
    description: 'Zamantı ve Göksu kollarının birleşmesiyle Adana merkezden geçip Çukurova\'yı oluşturan büyük nehir.',
    kpssTips: [
      'Ceyhan ile birlikte Türkiye\'nin en büyük delta ovası olan ÇUKUROVA\'yı oluşturur.',
      'En büyük kolu Kayseri/Aladağlar\'dan gelen Zamantı Irmağı\'dır.',
      'Üzerinde Seyhan Barajı ve Çatalan Barajı yer alır.'
    ],
    details: {
      lengthKm: 560,
      dams: ['Seyhan Barajı', 'Çatalan Barajı', 'Yedigöze']
    },
    mnemonic: 'Seyhan & Ceyhan = Çukurova Deltası Mimarları'
  },
  {
    id: 'r-ceyhan',
    name: 'Ceyhan Nehri',
    type: 'river',
    category: 'Çukurova Deltası / Akdeniz',
    coordinates: [35.550, 36.600],
    region: 'Akdeniz',
    description: 'Elbistan Ovası\'ndan doğup Kahramanmaraş ve Osmaniye üzerinden İskenderun Körfezi yanından Akdeniz\'e dökülen nehir.',
    kpssTips: [
      'Seyhan ile birlikte Çukurova deltasının doğu kanadını inşa etmiştir.',
      'Barajları: Aslantaş, Menzelet, Sır, Berke (yüksek kemer baraj), Kılavuzlu.',
      'Ağzında Akyatan ve Yumurtalık lagünleri yer alır.'
    ],
    details: {
      lengthKm: 509,
      dams: ['Berke Barajı (201m)', 'Menzelet', 'Sır', 'Aslantaş', 'Kılavuzlu']
    }
  },
  {
    id: 'r-asi',
    name: 'Asi Nehri',
    type: 'river',
    category: 'Sınır Aşan / Ters Akan Nehir (Akdeniz)',
    coordinates: [35.950, 36.100],
    region: 'Akdeniz',
    description: 'Lübnan Bekaa Vadisi\'nden doğup Suriye\'den geçerek Hatay Samandağ\'dan Akdeniz\'e dökülen nehir.',
    kpssTips: [
      'Güneyden Kuzeye doğru aktığı için halk arasında "TERS AKAN NEHİR" olarak bilinir.',
      'Yurtdışından doğup Türkiye denizlerine dökülen iki akarsudan biridir (Asi ve Meriç).',
      'Amik Ovası\'nı sular ve Samandağ sahilinde Akdeniz\'e dökülür.'
    ],
    details: {
      lengthKm: 380,
      originMouth: 'Lübnan Bekaa -> Suriye -> Hatay Samandağ (Akdeniz)'
    },
    mnemonic: 'ASİ = Lübnan/Suriye\'den Gelen Ters Akan Akarsu'
  },

  // --- BASRA KÖRFEZİ'NE DÖKÜLEN AKARSULAR (SINIR AŞAN NEHİRLER) ---
  {
    id: 'r-firat',
    name: 'Fırat Nehri',
    type: 'river',
    category: 'Sınır Aşan / En Yüksek Enerji Potansiyeli',
    coordinates: [38.800, 37.150],
    region: 'Güneydoğu Anadolu',
    description: 'Türkiye\'nin debisi, uzunluğu ve hidroelektrik enerji potansiyeli EN YÜKSEK nehridir (Karasu ve Murat kollarının birleşimi).',
    kpssTips: [
      'Karasu ve Murat kollarının Keban Baraj Gölü\'nde birleşmesiyle Fırat adını alır.',
      'Türkiye\'nin en büyük barajları Fırat üzerindedir: ATATÜRK BARAJI (Türkiye\'nin en büyüğü), Keban, Karakaya, Birecik, Karkamış.',
      'GAP (Güneydoğu Anadolu Projesi)\'nin temel omurgasıdır; Şanlıurfa Sulama Tünelleri ile Harran Ovası\'nı sular.',
      'Suriye ve Irak\'a geçerek Dicle ile birleşir (Şattülarap) ve Basra Körfezi\'ne dökülür.'
    ],
    details: {
      lengthKm: 2800,
      originMouth: 'Doğu Anadolu -> Suriye/Irak -> Basra Körfezi',
      dams: ['Atatürk Barajı (En Büyük Gövde/Rezerv)', 'Keban Barajı', 'Karakaya Barajı', 'Birecik Barajı', 'Karkamış Barajı']
    },
    mnemonic: 'FIRAT = GAP\'ın Kalbi + Atatürk & Keban & Karakaya Dev Barajları'
  },
  {
    id: 'r-karasu',
    name: 'Karasu Nehri (Fırat Kolu)',
    type: 'river',
    category: 'Doğu Anadolu / Fırat Ana Kolu',
    coordinates: [39.500, 39.750],
    region: 'Doğu Anadolu',
    description: 'Erzurum Dumlu Dağı\'ndan doğup Aşkale, Erzincan Ovası ve Kemah Boğazı\'ndan geçerek Keban\'a ulaşan Fırat\'ın kuzey ana kolu.',
    kpssTips: [
      'Karasu, Fırat Nehri\'ni oluşturan iki ana nehirden biridir.',
      'Erzincan ve Kemah kanyonlarından geçer.'
    ],
    details: {
      lengthKm: 460
    }
  },
  {
    id: 'r-murat',
    name: 'Murat Nehri (Fırat Kolu)',
    type: 'river',
    category: 'Doğu Anadolu / Fırat En Uzun Kolu',
    coordinates: [40.800, 38.750],
    region: 'Doğu Anadolu',
    description: 'Van Gölü kuzeyindeki Aladağlar\'dan doğup Ağrı, Muş, Bingöl ve Elazığ ovalarından geçerek Fırat\'ı oluşturan en uzun kol.',
    kpssTips: [
      'Fırat\'ın en uzun koludur (722 km).',
      'Üzerinde Yukarı Kaleköy, Aşağı Kaleköy, Beyhan ve Alpaslan barajları kurulmuştur.'
    ],
    details: {
      lengthKm: 722,
      dams: ['Alpaslan I', 'Alpaslan II', 'Kale Barajları', 'Beyhan']
    }
  },
  {
    id: 'r-munzur',
    name: 'Munzur Çayı & Gözeleri',
    type: 'river',
    category: 'Milli Park / Karstik Gözeler',
    coordinates: [39.550, 39.100],
    region: 'Doğu Anadolu',
    description: 'Tunceli Munzur Dağları eteklerindeki karstik gözelerden doğup Keban Baraj Gölü\'ne karışan vadi nehri.',
    kpssTips: [
      'Munzur Vadisi Milli Parkı alanı içerisindedir.',
      'Buzul ve karstik kaynakların birleştiği zengin debili berrak akarsudur.'
    ],
    details: {
      lengthKm: 144
    }
  },
  {
    id: 'r-dicle',
    name: 'Dicle Nehri',
    type: 'river',
    category: 'Sınır Aşan / Mezopotamya Nehri',
    coordinates: [41.250, 37.100],
    region: 'Güneydoğu Anadolu',
    description: 'Elazığ Hazar Gölü güneyinden doğup Diyarbakır, Batman, Mardin ve Şırnak\'tan geçerek Irak\'ta Fırat ile birleşen akarsu.',
    kpssTips: [
      'Türkiye - Suriye ve Türkiye - Irak arasında yer yer doğal sınır çizer.',
      'Ilısu Barajı (Prof. Dr. Veysel Eroğlu Barajı - Türkiye\'nin gövde hacmi 2. büyük barajı) Dicle üzerindedir ve Hasankeyf sular altında kalmıştır.',
      'Önemli kolları: Batman Çayı, Garzan Çayı, Botan Çayı ve Zap Suyu\'dur.'
    ],
    details: {
      lengthKm: 1900,
      originMouth: 'Hazar Gölü Güneyi -> Irak (Şattülarap) -> Basra Körfezi',
      dams: ['Ilısu (Veysel Eroğlu)', 'Kralkızı Barajı', 'Dicle Barajı', 'Batman Barajı', 'Silvan Barajı']
    },
    mnemonic: 'DİCLE = Ilısu Barajı (Veysel Eroğlu) + Hasankeyf + Kralkızı & Batman Barajları'
  },
  {
    id: 'r-zap',
    name: 'Zap Suyu (Dicle Kolu)',
    type: 'river',
    category: 'En Hızlı & En Engebeli Akarsu',
    coordinates: [43.750, 37.500],
    region: 'Doğu Anadolu',
    description: 'Hakkari dağlarından ve Cilo kütlesinden doğup Irak topraklarına geçerek Dicle\'ye karışan Türkiye\'nin en derin vadili akarsuyu.',
    kpssTips: [
      'Hakkari Cilo-Sat dağları kanyonlarından çok hızlı akar.',
      'Sınır aşan Dicle koludur.'
    ],
    details: {
      lengthKm: 426
    }
  },
  {
    id: 'r-botan',
    name: 'Botan (Uluçay) Çayı',
    type: 'river',
    category: 'Kanyon / Dicle Kolu',
    coordinates: [41.900, 37.800],
    region: 'Güneydoğu Anadolu',
    description: 'Van ve Siirt dağlarından doğup ünlü Botan Kanyonu boyunca akarak Çetin Barajı ve Ilısu Gölü\'ne dökülen çay.',
    kpssTips: [
      'Botan Kanyonu (Siirt) Türkiye\'nin en derin kanyon vadilerindendir.',
      'Üzerinde Çetin Barajı (Avrupa\'nın en büyük RCC silindirle sıkıştırılmış beton barajı) yer alır.'
    ],
    details: {
      lengthKm: 268,
      dams: ['Çetin Barajı', 'Alkumru Barajı']
    }
  },

  // --- HAZAR DENİZİ'NE DÖKÜLEN AKARSULAR (KAPALI HAVZA) ---
  {
    id: 'r-aras',
    name: 'Aras Nehri',
    type: 'river',
    category: 'Kapalı Havza (Hazar Denizi) / Sınır Çizen Nehir',
    coordinates: [44.000, 40.000],
    region: 'Doğu Anadolu',
    description: 'Erzurum Bingöl Dağları\'ndan doğup Iğdır Ovası\'nı sulayan, Türkiye-Ermenistan sınırını çizerek Azerbaycan\'da Kura ile birleşip Hazar Denizi\'ne dökülen nehir.',
    kpssTips: [
      'Okyanuslara veya açık denizlere dökülmediği için HAZAR DENİZİ KAPALI HAVZASI\'na aittir!',
      'Türkiye ile Ermenistan ve Nahçıvan arasındaki uluslararası sınırı oluşturur.',
      'Iğdır Ovası\'nda pamuk ve mikroklimal tarımın yapılmasını sağlar.'
    ],
    details: {
      lengthKm: 1072,
      originMouth: 'Erzurum -> Iğdır Sınırı -> Hazar Denizi'
    },
    mnemonic: 'ARAS & KURA = Hazar Kapalı Havzası + Sınır Çizen Doğu Nehirleri'
  },
  {
    id: 'r-kura',
    name: 'Kura Nehri',
    type: 'river',
    category: 'Kapalı Havza (Hazar Denizi)',
    coordinates: [42.700, 41.100],
    region: 'Doğu Anadolu',
    description: 'Ardahan Allahuekber Dağları\'ndan doğup Gürcistan ve Azerbaycan\'a geçerek Aras ile birleşen ve Hazar Denizi\'ne dökülen nehir.',
    kpssTips: [
      'Ardahan platosunu sular ve Gürcistan/Tiflis üzerinden Hazar Denizi kapalı havzasına akar.',
      'Çıldır Gölü yanından geçer.'
    ],
    details: {
      lengthKm: 1515
    }
  },

  // --- İÇ KAPALI HAVZA AKARSU ÖRNEKLERİ ---
  {
    id: 'r-carsamba-ic',
    name: 'Çarşamba Çayı (Konya Kapalı Havzası)',
    type: 'river',
    category: 'İç Kapalı Havza Akarsuyu',
    coordinates: [32.350, 37.400],
    region: 'İç Anadolu',
    description: 'Beyşehir Gölü\'nün gideğeni (göl ayağı) olarak doğup Konya Ovası\'nda kaybolan iç kapalı havza akarsuyu.',
    kpssTips: [
      'Beyşehir Gölü\'nün sularını Konya Ovası\'nın sulamasına taşıyan tarihi kanaldır.',
      'Apa Barajı bu akarsu üzerindedir.'
    ],
    details: {
      lengthKm: 105,
      dams: ['Apa Barajı']
    }
  },
  {
    id: 'r-bendimahi',
    name: 'Bendimahi Çayı (Van Kapalı Havzası)',
    type: 'river',
    category: 'Van Gölü Kapalı Havzası',
    coordinates: [43.700, 38.950],
    region: 'Doğu Anadolu',
    description: 'Tendürek ve Çaldıran dağlarından doğup Muradiye Şelalesi\'ni oluşturarak Van Gölü\'ne dökülen akarsu.',
    kpssTips: [
      'Ünlü Muradiye Şelalesi bu akarsu üzerindedir.',
      'Van Gölü\'nün endemik İnci Kefali balıklarının üremek için tersine yüzdüğü akarsudur.'
    ]
  }
];

export const LAKES_DATA: GeoFeature[] = [
  // ==========================================
  // 1. TEKTONİK GÖLLER (ÇÖKÜNTÜ OLUĞU GÖLLERİ)
  // ==========================================
  {
    id: 'l-van',
    name: 'Van Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Karma Oluşumlu Göl (Tektonik + Volkanik Set)',
    coordinates: [42.900, 38.630],
    region: 'Doğu Anadolu',
    description: 'Türkiye\'nin EN BÜYÜK GÖLÜDÜR (3.713 km²). Sodalı ve tuzlu suları vardır. Nemrut volkanının lav setiyle büyümüştür.',
    kpssTips: [
      'Türkiye\'nin en büyük gölüdür ve dünyanın en büyük sodalı gölüdür.',
      'Suları sodalı ve tuzlu olduğu için donmaz; endemik İNCİ KEFALİ (Van Balığı) yaşar.',
      'Nemrut volkanından çıkan lavların havzanın önünü kapatmasıyla volkanik set niteliği de kazanmıştır (Karma oluşumlu).',
      'Üzerinde feribotla demiryolu taşımacılığı (Tatvan - Van tren feribotu) yapılır.',
      'Akdamar Adası ve tarihi kilisesi turistik cazibe merkezidir.'
    ],
    mnemonic: 'VAN GÖLÜ = En Büyük Sodalı Göl + İnci Kefali + Feribot Demiryolu + Nemrut Volkanik Seti'
  },
  {
    id: 'l-tuz',
    name: 'Tuz Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (Sığ Kapalı Havza)',
    coordinates: [33.300, 38.750],
    elevation: 905,
    region: 'İç Anadolu',
    description: 'Türkiye\'nin yüzölçümü bakımından 2. büyük gölü fakat derinliği en az (1-2 m) olan sığ tektonik gölü.',
    kpssTips: [
      'Türkiye\'nin sofra tuzu ihtiyacının %60-70\'ini karşılar.',
      'Yaz aylarında şiddetli buharlaşma nedeniyle yüzölçümü en çok küçülen/alan değiştiren göldür.',
      'Suları aşırı tuzlu olduğu için dışarıya akışı (gideğeni) yoktur, kapalı havzadır.',
      'Allı Turna (Flamingo) kuşlarının Akdeniz havzasındaki en büyük doğal kuluçka alanıdır.',
      'Altında Türkiye\'nin en büyük Doğalgaz Yeraltı Depolama Tesisi yer alır.'
    ],
    mnemonic: 'TUZ GÖLÜ = Sofra Tuzu Kaynağı + Flamingo Cenneti + Doğalgaz Deposu'
  },
  {
    id: 'l-beysehir',
    name: 'Beyşehir Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik - Karstik Tatlısu Gölü',
    coordinates: [31.500, 37.750],
    elevation: 1123,
    region: 'İç Anadolu',
    description: 'Türkiye\'nin EN BÜYÜK TATLISU GÖLÜDÜR (656 km²). Konya ve Isparta sınırlarında milli parktır.',
    kpssTips: [
      'Türkiye\'nin 3. büyük gölü ve 1. EN BÜYÜK TATLISU GÖLÜDÜR.',
      'Göl ayağı (Çarşamba Çayı gideğeni) bulunduğu için suları tatlıdır ve tarımsal sulamada kullanılır.',
      'Milli Park statüsündedir, tatlı su balıkçılığı yapılır.'
    ],
    mnemonic: 'BEYŞEHİR = Türkiye\'nin En Büyük TATLISU Gölü! (Gideğeni: Çarşamba Çayı)'
  },
  {
    id: 'l-egirdir',
    name: 'Eğirdir Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik - Karstik Tatlısu Gölü',
    coordinates: [30.880, 37.950],
    elevation: 917,
    region: 'Akdeniz',
    description: 'Isparta ilinde yer alan Türkiye\'nin EN BÜYÜK 2. TATLISU GÖLÜ (Kovada Kanalı ile Kovada Gölü\'ne bağlanır).',
    kpssTips: [
      'Türkiye\'nin 2. büyük tatlı su gölüdür.',
      'Gideğeni Kovada Gölü\'ne ve Kovada Hidroelektrik Santrali\'ne su sağlar; elektrik üretilir!',
      'İçme suyu, elma bahçeleri sulaması ve kerevit avcılığı yaygındır.'
    ],
    mnemonic: 'Eğirdir = 2. Büyük Tatlı Su Gölü + Kovada Kanalı + Enerji Üretimi'
  },
  {
    id: 'l-burdur',
    name: 'Burdur Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (Acı Sular)',
    coordinates: [30.180, 37.750],
    elevation: 857,
    region: 'Akdeniz',
    description: 'Göller Yöresi\'nde tektonik çöküntü oluğunda yer alan, gideğeni olmadığı için suları acı ve tuzlu olan derin göl.',
    kpssTips: [
      'Gideğeni (boşalımı) olmadığı için suları acı-tuzludur.',
      'Dikkuyruk ördeklerinin dünya popülasyonunun büyük kısmını barındıran Ramsar alanıdır.',
      'Son yıllarda aşırı kuyu açımı ve kuraklık nedeniyle su seviyesi hızla çekilmektedir.'
    ]
  },
  {
    id: 'l-iznik',
    name: 'İznik Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (Marmara)',
    coordinates: [29.500, 40.430],
    elevation: 85,
    region: 'Marmara',
    description: 'Marmara Bölgesi\'nin EN BÜYÜK GÖLÜDÜR. Kuzey Anadolu Fay Hattı güney kolu çöküntüsünde yer alır.',
    kpssTips: [
      'Marmara Bölgesi\'nin en büyük tatlı su gölüdür.',
      'Karasu Deresi gideğeni ile Gemlik Körfezi\'ne akar, bu yüzden suları tatlıdır.',
      'Göl altında keşfedilen 1500 yıllık Bazilika kalıntısıyla ünlüdür.',
      'Marmara Tektonik Gölleri şifresi: İ-S-U-M (İznik, Sapanca, Uluabat, Manyas).'
    ],
    mnemonic: 'İ-S-U-M = İznik, Sapanca, Uluabat, Manyas (Marmara Tektonik Gölleri)'
  },
  {
    id: 'l-sapanca',
    name: 'Sapanca Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (Marmara)',
    coordinates: [30.250, 40.710],
    elevation: 33,
    region: 'Marmara',
    description: 'Kocaeli ve Sakarya arasında yer alan içme suyu kaynağı tektonik göl.',
    kpssTips: [
      'Kuzey Anadolu Fayı tektonik oluğundadır.',
      'Kocaeli ve Sakarya illerinin ana içme ve kullanma suyu kaynağıdır.',
      'Çark Deresi ile fazla sularını Sakarya Nehri\'ne boşaltır.'
    ]
  },
  {
    id: 'l-uluabat',
    name: 'Uluabat (Apolyont) Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (Ramsar Alanı)',
    coordinates: [28.600, 40.170],
    elevation: 9,
    region: 'Marmara',
    description: 'Bursa ilinde yer alan, leylek köyleri (Eskikaraağaç) ve nilüfer çiçekleriyle ünlü sığ tektonik göl.',
    kpssTips: [
      'Uluslararası Yaşayan Göller ve Ramsar koruma ağına dahildir.',
      'Suyu tatlıdır, Susurluk akarsu sistemine bağlanır.'
    ]
  },
  {
    id: 'l-manyas',
    name: 'Manyas (Kuş) Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl / Kuş Cenneti Milli Parkı',
    coordinates: [27.950, 40.180],
    elevation: 18,
    region: 'Marmara',
    description: 'Balıkesir Bandırma yakınında Türkiye\'nin ilk milli parklarından olan Kuşcenneti Milli Parkı\'na ev sahipliği yapan göl.',
    kpssTips: [
      'Türkiye\'nin ilk A sınıfı Avrupa Diploması alan Kuş Cenneti Milli Parkı buradadır.',
      'Göçmen kuşların ana konaklama merkezidir, tektonik oluşumludur.'
    ]
  },
  {
    id: 'l-aksehir-eber',
    name: 'Akşehir ve Eber Gölleri',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (İç Anadolu)',
    coordinates: [31.420, 38.600],
    elevation: 958,
    region: 'İç Anadolu',
    description: 'Afyon ve Konya sınırında Sultan Dağları çöküntü oluğunda yer alan ikiz tektonik göller.',
    kpssTips: [
      'Nasreddin Hoca\'nın "Ya tutarsa" diyerek maya çaldığı tarihi göldür (Akşehir).',
      'Kamış/hasır üretimi yapılır; kuraklık nedeniyle alanı daralmaktadır.'
    ]
  },
  {
    id: 'l-hazar',
    name: 'Hazar Gölü (Elazığ)',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (Doğu Anadolu Fay Oluğu)',
    coordinates: [39.420, 38.480],
    elevation: 1250,
    region: 'Doğu Anadolu',
    description: 'Elazığ Sivrice\'de Doğu Anadolu Fay Hattı (DAF) üzerinde yer alan derin tektonik göl (Batık Şehir barındırır).',
    kpssTips: [
      'Doğu Anadolu Fayı (DAF) çöküntü çanağında oluşmuştur.',
      'Dicle Nehri\'nin kaynaklarından birini oluşturur.',
      'Göl içinde tarihi "Batık Şehir" kalıntıları bulunur.'
    ]
  },
  {
    id: 'l-seyfe',
    name: 'Seyfe Gölü',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (Kırşehir Ramsar Alanı)',
    coordinates: [34.330, 39.200],
    elevation: 1080,
    region: 'İç Anadolu',
    description: 'Kırşehir Mucur ilçesinde yer alan önemli kuş göç yolu durağı tektonik göl.',
    kpssTips: [
      'Ramsar alanı tescillidir.',
      'Flamingo ve yüzlerce su kuşu türünün üreme sahasıdır.'
    ]
  },
  {
    id: 'l-ladik',
    name: 'Ladik Gölü (Samsun)',
    type: 'lake',
    subCategory: 'tectonic',
    category: 'Tektonik Göl (Yüzen Adalar)',
    coordinates: [35.950, 40.910],
    elevation: 867,
    region: 'Karadeniz',
    description: 'Samsun Ladik ilçesinde Kuzey Anadolu Fayı üzerindeki tektonik göl (üzerinde yüzen torf adaları bulunur).',
    kpssTips: [
      'Torf madeni ve üzerinde hareket eden "Yüzen Adacıklar" ile tanınır.'
    ]
  },

  // ==========================================
  // 2. KARSTİK GÖLLER (ERİME ÇUKURU GÖLLERİ)
  // ==========================================
  {
    id: 'l-salda',
    name: 'Salda Gölü',
    type: 'lake',
    subCategory: 'karstic',
    category: 'Karstik Göl (Türkiye\'nin Maldivleri & Mars İkizi)',
    coordinates: [29.680, 37.550],
    elevation: 1163,
    region: 'Akdeniz',
    description: 'Burdur Yeşilova\'da beyaz magnezyumlu hidromanyezit kumsalları ve turkuaz sularıyla tanınan karstik göl.',
    kpssTips: [
      'Türkiye\'nin en derin 2. gölüdür (184 metre).',
      'Beyaz kumsalları magnezyum minerali içerir ve NASA araştırmalarında Mars Jezero Krateri ile aynı mineral yapısına sahip olduğu saptanmıştır!',
      'Karstik çanaktır, Özel Çevre Koruma Bölgesi\'dir.'
    ],
    mnemonic: 'SALDA = Mars Jezero İkizi + Beyaz Hidromanyezit Kumsal + Karstik Derin Göl'
  },
  {
    id: 'l-avlan',
    name: 'Avlan ve Elmalı Gölleri',
    type: 'lake',
    subCategory: 'karstic',
    category: 'Karstik Polye Gölü',
    coordinates: [29.930, 36.580],
    elevation: 1030,
    region: 'Akdeniz',
    description: 'Antalya Elmalı Polyesi\'nde kireçtaşlarının erimesiyle oluşan karstik göller.',
    kpssTips: [
      'Döneminde kurutulup ekolojik dengenin bozulması üzerine yeniden su tutulmaya başlanan karstik göldür.',
      'Karstik polyelerin tabanında yer alır.'
    ]
  },
  {
    id: 'l-sugla',
    name: 'Suğla Gölü',
    type: 'lake',
    subCategory: 'karstic',
    category: 'Karstik Göl (Konya Seydişehir)',
    coordinates: [31.950, 37.330],
    elevation: 1040,
    region: 'İç Anadolu',
    description: 'Konya Seydişehir ve Yalıhüyük arasında yer alan karstik erimelerle şekillenmiş göl.',
    kpssTips: [
      'Suları düdenlerle yeraltına sızdığı için dönem dönem alanı değişir.',
      'Konya Ovası Projesi (KOP) kapsamında depolama alanı olarak kullanılır.'
    ]
  },
  {
    id: 'l-kizoren-obruk',
    name: 'Kızören ve Çıralı Obruk Gölleri',
    type: 'lake',
    subCategory: 'karstic',
    category: 'Karstik Obruk Gölü',
    coordinates: [33.180, 38.170],
    elevation: 990,
    region: 'İç Anadolu',
    description: 'Konya Karapınar ve Obruk Platosu\'nda yeraltı kireçtaşı mağara tavanlarının çökmesiyle oluşan karstik obruk gölleri.',
    kpssTips: [
      'Kızören Obruğu 145 metre derinliği ile Türkiye\'nin en tipik obruk gölüdür ve Ramsar alanıdır.',
      'İç Anadolu Obruk Platosu\'nun karstik çöküntüleridir.'
    ],
    mnemonic: 'Kızören & Çıralı = Obruk Platosu Karstik Çökme Gölleri'
  },
  {
    id: 'l-kovada',
    name: 'Kovada Gölü',
    type: 'lake',
    subCategory: 'karstic',
    category: 'Karstik Göl / Milli Park',
    coordinates: [30.870, 37.620],
    elevation: 900,
    region: 'Akdeniz',
    description: 'Isparta Eğirdir Gölü\'nün fazla sularının aktığı doğal kanal ile beslenen karstik milli park gölü.',
    kpssTips: [
      'Kovada Gölü Milli Parkı flora ve fauna çeşitliliğiyle koruma altındadır.',
      'Üzerinde Kovada 1 ve Kovada 2 hidroelektrik santralleri çalışır.'
    ]
  },

  // ==========================================
  // 3. VOLKANİK GÖLLER (KRATER / KALDERA / MAĞAR)
  // ==========================================
  {
    id: 'l-meke',
    name: 'Meke Gölü Mağarı',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Mağar Gölü (Dünyanın Nazar Boncuğu)',
    coordinates: [33.633, 37.683],
    elevation: 980,
    region: 'İç Anadolu',
    description: 'Konya Karapınar\'da gaz patlaması sonucu oluşan ve ortasındaki kül konisiyle "DÜNYANIN NAZAR BONCUĞU" olarak adlandırılan çift patlamalı volkanik mağar.',
    kpssTips: [
      'Türkiye\'nin ve dünyanın en belirgin Mağar (gaz patlama çukuru) örneğidir.',
      'Ramsar alanı tescillidir; yeraltı sularının aşırı çekilmesiyle kuruma tehlikesi yaşamaktadır.',
      'ÖSYM KPSS KİLİT SORUSU: "Dünyanın Nazar Boncuğu" olarak tanımlanır.'
    ],
    mnemonic: 'MEKE GÖLÜ = Dünyanın Nazar Boncuğu Volkanik Mağarı (Konya Karapınar)'
  },
  {
    id: 'l-nemrut-kaldera',
    name: 'Nemrut Kalderası ve Krater Gölü (Bitlis)',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Kaldera Gölü',
    coordinates: [42.235, 38.625],
    elevation: 2247,
    region: 'Doğu Anadolu',
    description: 'Bitlis Tatvan\'da Nemrut Volkanı zirvesinde yer alan, Türkiye\'nin EN BÜYÜK, dünyanın 2. büyük kaldera gölü.',
    kpssTips: [
      'Türkiye\'nin en büyük Kaldera gölüdür.',
      'Avrupa Seçkin Destinasyonları (EDEN) ödüllüdür.',
      'İçerisinde biri Soğuk Göl, diğeri jeotermal kaynaklı Sıcak Göl olmak üzere göller barındırır.',
      'Nemrut Dağı 1441-1443 patlamalarıyla Türkiye\'de en son aktif olan sönmüş volkandır.'
    ],
    mnemonic: 'NEMRUT KALDERASI = Türkiye\'nin En Büyük Kaldera Krater Gölü (Bitlis)'
  },
  {
    id: 'l-golcuk-isparta',
    name: 'Gölcük Krater Gölü (Isparta)',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Krater Gölü',
    coordinates: [30.490, 37.730],
    elevation: 1380,
    region: 'Akdeniz',
    description: 'Isparta merkez yakınında sönmüş volkan bacası patlamasıyla oluşan krater gölü ve tabiat parkı.',
    kpssTips: [
      'Akdeniz Bölgesi\'ndeki nadir volkanik krater göllerindendir.'
    ]
  },
  {
    id: 'l-acigol-nevsehir',
    name: 'Acıgöl Mağarı (Nevşehir)',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Mağar Çukuru',
    coordinates: [34.520, 38.550],
    elevation: 1260,
    region: 'İç Anadolu',
    description: 'Kapadokya volkanik arazisinde gaz patlaması sonucu oluşan mağar gölü.',
    kpssTips: [
      'Volkanik gaz patlama çukuru (Mağar) örneğidir.'
    ]
  },

  // ==========================================
  // 4. VOLKANİK SET GÖLLERİ
  // ŞİFRE: ERÇEK'li NAZİK BALIK ÇILDIRINCA HAÇLI VAN'A KAÇTI
  // ==========================================
  {
    id: 'l-cildir',
    name: 'Çıldır Gölü',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Set Gölü (Kışın Tamamen Donan)',
    coordinates: [43.250, 41.050],
    elevation: 1959,
    region: 'Doğu Anadolu',
    description: 'Kars ve Ardahan arasında yer alan, kışın yüzeyi tamamen 1 metre buz tutan volkanik set gölü.',
    kpssTips: [
      'Doğu Anadolu\'nun Van Gölü\'nden sonra 2. büyük gölüdür.',
      'Kışın yüzeyi kalın buz tutar; üzerinde atlı kızak ve Eskimo usulü sarıbalık avcılığı yapılır.',
      'Oluşumu Volkanik Set gölüdür.'
    ],
    mnemonic: 'Çıldır = Kışın Donan Buz Üstü Atlı Kızak + Volkanik Set'
  },
  {
    id: 'l-ercek',
    name: 'Erçek Gölü',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Set Gölü (Van Yanı)',
    coordinates: [43.580, 38.650],
    elevation: 1803,
    region: 'Doğu Anadolu',
    description: 'Van Gölü\'nün hemen doğusunda yer alan sodalı-tuzlu volkanik set gölü.',
    kpssTips: [
      'Flamingoların Doğu Anadolu\'daki en önemli mola yeridir.',
      'Volkanik lav settiyle oluşmuştur.'
    ]
  },
  {
    id: 'l-nazik',
    name: 'Nazik Gölü',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Set Gölü (Bitlis)',
    coordinates: [42.270, 38.850],
    elevation: 1816,
    region: 'Doğu Anadolu',
    description: 'Bitlis Ahlat yakınında lavların vadiyi kapatmasıyla oluşan volkanik set tatlısu gölü.',
    kpssTips: [
      'Kışın donan volkanik set göllerimizdendir.'
    ]
  },
  {
    id: 'l-balik',
    name: 'Balık Gölü (Ağrı - Taşlıçay)',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Set Gölü (Türkiye\'nin En Yüksek Göllerinden)',
    coordinates: [43.560, 39.750],
    elevation: 2250,
    region: 'Doğu Anadolu',
    description: 'Ağrı Taşlıçay ve Doğubayazıt arasında 2.250 m rakımda Türkiye\'nin en yüksek rakımlı volkanik set göllerinden biri.',
    kpssTips: [
      'Üzerinde alabalık yaşar ve içme suyu kalitesindedir.'
    ]
  },
  {
    id: 'l-hacli',
    name: 'Haçlı (Bulanık) Gölü',
    type: 'lake',
    subCategory: 'volcanic',
    category: 'Volkanik Set Gölü (Muş)',
    coordinates: [42.180, 39.020],
    elevation: 1583,
    region: 'Doğu Anadolu',
    description: 'Muş Bulanık ilçesinde Şerafettin volkanik lavlarının vadiyi tıkamasıyla oluşan set gölü.',
    kpssTips: [
      'Volkanik Set Gölleri Şifresi: V-E-B-A-N-Ç (Van, Erçek, Balık, Aygır, Nazik, Çıldır, Haçlı).'
    ],
    mnemonic: 'Volkanik Set Şifresi: ERÇEK\'Lİ NAZİK BALIK ÇILDIRINCA HAÇLI VAN\'A KAÇTI'
  },

  // ==========================================
  // 5. HEYELAN SET GÖLLERİ
  // ŞİFRE: S-A-T-O-B-Y (Sera, Abant, Tortum, Özenç, Borabay, Yedigöller)
  // ==========================================
  {
    id: 'l-tortum',
    name: 'Tortum Gölü ve Şelalesi',
    type: 'lake',
    subCategory: 'landslide',
    category: 'Heyelan Set Gölü (Erzurum)',
    coordinates: [41.650, 40.640],
    elevation: 1000,
    region: 'Doğu Anadolu',
    description: 'Erzurum Uzundere\'de Kemerlidağ\'dan kopan dev kütlenin Tortum Çayı vadisini tıkamasıyla oluşan heyelan set gölü ve 48 m\'lik şelalesi.',
    kpssTips: [
      'Türkiye\'nin en ünlü Heyelan Set göllerindendir.',
      'Gölün gideğeninden Tortum Şelalesi (Türkiye\'nin en görkemli şelalelerinden) dökülür ve elektrik üretilir.'
    ],
    mnemonic: 'Tortum = Heyelan Seti + 48m Dev Şelale'
  },
  {
    id: 'l-abant',
    name: 'Abant Gölü (Bolu)',
    type: 'lake',
    subCategory: 'landslide',
    category: 'Heyelan Set Gölü / Tabiat Parkı',
    coordinates: [31.280, 40.600],
    elevation: 1328,
    region: 'Karadeniz',
    description: 'Bolu\'da heyelan sonucu vadi önünün kapanmasıyla oluşan ünlü turistik heyelan set gölü.',
    kpssTips: [
      'Bolu Abant Alabalığı (Salmo trutta abanticus) endemik türüne ev sahipliği yapar.',
      'Karadeniz Bölgesi heyelan set oluşumunun en tipik simgesidir.'
    ]
  },
  {
    id: 'l-yedigoller',
    name: 'Yedigöller (Bolu)',
    type: 'lake',
    subCategory: 'landslide',
    category: 'Heyelan Set Gölleri Milli Parkı',
    coordinates: [31.750, 40.940],
    elevation: 780,
    region: 'Karadeniz',
    description: 'Bolu\'da birbirini izleyen heyelanların oluşturduğu 7 adet göl (Büyükgöl, Seringöl, Deringöl, Nazlıgöl, Küçükgöl, İncegöl, Sazlıgöl).',
    kpssTips: [
      'Birbiri ardına dizilmiş 7 heyelan set gölünden oluşan Milli Parktır.',
      'Sonbahar doğa ve fotoğraf turizminin merkezidir.'
    ],
    mnemonic: 'Yedigöller = 7 Kademeli Heyelan Seti (Bolu)'
  },
  {
    id: 'l-sera',
    name: 'Sera Gölü (Trabzon)',
    type: 'lake',
    subCategory: 'landslide',
    category: 'Heyelan Set Gölü (1950 Tarihli)',
    coordinates: [39.620, 40.970],
    elevation: 120,
    region: 'Karadeniz',
    description: 'Trabzon Akçaabat Derecik Vadisi\'nde 1950 yılında gözler önünde gerçekleşen dev heyelanla oluşan genç set gölü.',
    kpssTips: [
      'Oluşumu bizzat insanlık tarihinde kaydedilmiş genç heyelan set gölüdür.'
    ]
  },
  {
    id: 'l-borabay',
    name: 'Borabay Gölü (Amasya)',
    type: 'lake',
    subCategory: 'landslide',
    category: 'Heyelan Set Gölü (Tabiat Parkı)',
    coordinates: [36.150, 40.860],
    elevation: 1050,
    region: 'Karadeniz',
    description: 'Amasya Taşova ilçesinde heyelan sonucu oluşan zümrüt yeşili krater görünümlü set gölü.',
    kpssTips: [
      'Karadeniz Heyelan Set Gölleri şifresi: S-A-T-O-B-Y (Sera, Abant, Tortum, Zinav, Borabay, Yedigöller).'
    ],
    mnemonic: 'Heyelan Gölleri Şifresi: S-A-T-O-B-Y (Sera, Abant, Tortum, Zinav, Borabay, Yedigöller)'
  },
  {
    id: 'l-zinav',
    name: 'Zinav Gölü (Tokat Reşadiye)',
    type: 'lake',
    subCategory: 'landslide',
    category: 'Heyelan Set Gölü',
    coordinates: [37.280, 40.420],
    elevation: 900,
    region: 'Karadeniz',
    description: 'Tokat Reşadiye ilçesinde heyelan birikintisinin dereyi kapatmasıyla oluşan göl.',
    kpssTips: [
      'Karadeniz heyelan set gölleri grubundadır.'
    ]
  },

  // ==========================================
  // 6. ALÜVYAL SET GÖLLERİ
  // ŞİFRE: B-A-M-K-E + Mogan & Eymir
  // ==========================================
  {
    id: 'l-bafa',
    name: 'Bafa (Çamiçi) Gölü',
    type: 'lake',
    subCategory: 'alluvial',
    category: 'Alüvyal Set Gölü (Ege)',
    coordinates: [27.420, 37.500],
    elevation: 10,
    region: 'Ege',
    description: 'Aydın ve Muğla sınırında Büyük Menderes Nehri\'nin taşıdığı alüvyonların eski Latmos Körfezi\'nin önünü kapatmasıyla oluşan göl.',
    kpssTips: [
      'Büyük Menderes\'in alüvyon setiyle denizden kopardığı eski deniz koyudur (Alüvyal Set).',
      'Yılan balıkları ve antik Herakleia kenti kalıntılarıyla ünlüdür.'
    ],
    mnemonic: 'BAFA (ÇAMİÇİ) = Büyük Menderes Alüvyon Setiyle Kapanan Deniz Koyu'
  },
  {
    id: 'l-koycegiz',
    name: 'Köyceğiz Gölü',
    type: 'lake',
    subCategory: 'alluvial',
    category: 'Alüvyal Set Gölü / Dalyan Labirenti',
    coordinates: [28.650, 36.950],
    elevation: 8,
    region: 'Ege',
    description: 'Muğla Köyceğiz\'de Namnam Çayı alüvyonlarıyla oluşan ve Dalyan Boğazı kanal labirentiyle İztuzu Plajı\'ndan denize bağlanan göl.',
    kpssTips: [
      'Dalyan kanalı ile Akdeniz\'e bağlanır (ayaklı göl / deniz kulağı).',
      'Caretta Caretta deniz kaplumbağaları ve Kaunos Kral Mezarları buradadır.'
    ],
    mnemonic: 'Köyceğiz = Alüvyal Set + Dalyan Boğazı + İztuzu Carettaları'
  },
  {
    id: 'l-marmara-gol',
    name: 'Marmara Gölü (Manisa Gölmarmara)',
    type: 'lake',
    subCategory: 'alluvial',
    category: 'Alüvyal Set Gölü (Gediz Havzası)',
    coordinates: [28.020, 38.620],
    elevation: 75,
    region: 'Ege',
    description: 'Manisa Salihli ve Gölmarmara arasında Gediz Nehri alüvyonlarının önünü tıkamasıyla oluşan doğal set gölü.',
    kpssTips: [
      'Gediz alüvyon setiyle oluşmuştur.',
      'Tepeli Pelikan kuşlarının önemli üreme merkezidir.'
    ]
  },
  {
    id: 'l-eymir-mogan',
    name: 'Mogan ve Eymir Gölleri (Ankara Gölbaşı)',
    type: 'lake',
    subCategory: 'alluvial',
    category: 'Alüvyal Set Gölleri (İç Anadolu)',
    coordinates: [32.780, 39.770],
    elevation: 970,
    region: 'İç Anadolu',
    description: 'Ankara Gölbaşı\'nda yan derelerin getirdiği alüvyonların vadiyi kapatmasıyla oluşan ikiz alüvyal set gölleri.',
    kpssTips: [
      'İncesu Deresi vadisinin alüvyonlarla tıkanması sonucu oluşmuş Alüvyal Set gölleridir.',
      'Mogan Gölü suları fazla olduğunda regülatörle Eymir Gölü\'ne akar.'
    ],
    mnemonic: 'Mogan & Eymir = Ankara\'nın Alüvyal Set Gölleri'
  },
  {
    id: 'l-uzungol',
    name: 'Uzungöl (Trabzon Çaykara)',
    type: 'lake',
    subCategory: 'alluvial',
    category: 'Alüvyal Set / Heyelan Karışımı Göl',
    coordinates: [40.290, 40.620],
    elevation: 1090,
    region: 'Karadeniz',
    description: 'Trabzon Çaykara ilçesinde Haldizen Deresi vadisinin heyelan ve yamaç döküntüsü alüvyonlarıyla kapanması sonucu oluşan ünlü yayla gölü.',
    kpssTips: [
      'KPSS kaynaklarında Alüvyal Set / Heyelan Seti karma örneği olarak geçer.',
      'Doğu Karadeniz yayla turizminin simgesidir.'
    ]
  },

  // ==========================================
  // 7. KIYI SET GÖLLERİ (LAGÜN / DENİZ KULAĞI)
  // ==========================================
  {
    id: 'l-terkos',
    name: 'Terkos (Durusu) Gölü',
    type: 'lake',
    subCategory: 'coastal',
    category: 'Kıyı Set Gölü (Lagün - İstanbul)',
    coordinates: [28.580, 41.330],
    elevation: 5,
    region: 'Marmara',
    description: 'İstanbul Çatalca Yarımadası Karadeniz kıyısında dalgaların oluşturduğu kıyı kordonunun eski koyu kapatmasıyla oluşan dev lagün.',
    kpssTips: [
      'İstanbul\'un en önemli içme suyu baraj göllerindendir.',
      'Tipik Kıyı Set Gölü (Lagün / Deniz Kulağı) örneğidir.'
    ],
    mnemonic: 'Terkos, Büyükçekmece, Küçükçekmece = İstanbul\'un 3 Büyük Kıyı Set Lagünü'
  },
  {
    id: 'l-buyukcekmece',
    name: 'Büyükçekmece Gölü',
    type: 'lake',
    subCategory: 'coastal',
    category: 'Kıyı Set Gölü (Lagün / Marmara Denizi)',
    coordinates: [28.550, 41.060],
    elevation: 3,
    region: 'Marmara',
    description: 'Marmara Denizi kıyısında koyun önünün kıyı oku ile kapatılmasıyla lagüne dönüşen göl.',
    kpssTips: [
      'Tarihi Mimar Sinan Köprüsü gölün denizle birleştiği kıyı kordonu üzerindedir.',
      'İçme suyu barajı olarak kullanılır.'
    ]
  },
  {
    id: 'l-kucukcekmece',
    name: 'Küçükçekmece Gölü',
    type: 'lake',
    subCategory: 'coastal',
    category: 'Kıyı Set Gölü (Lagün / Marmara Denizi)',
    coordinates: [28.760, 41.000],
    elevation: 2,
    region: 'Marmara',
    description: 'İstanbul Avrupa yakasında Marmara Denizi ile kıyı kordonuyla ayrılan lagün gölü.',
    kpssTips: [
      'Kıyı Set Gölü (Lagün) türünün en belirgin örneklerindendir.',
      'Yarımburgaz Mağarası (Türkiye\'nin en eski insan yerleşimlerinden) gölün kuzey yamacındadır.'
    ]
  },
  {
    id: 'l-akyatan',
    name: 'Akyatan Lagünü (Adana Çukurova)',
    type: 'lake',
    subCategory: 'coastal',
    category: 'Kıyı Set Lagünü (Türkiye\'nin En Büyük Lagünü)',
    coordinates: [35.250, 36.620],
    elevation: 1,
    region: 'Akdeniz',
    description: 'Çukurova Deltası kıyısında Seyhan ve Ceyhan nehirlerinin dalgalarla biriktirdiği kum kordonunun arkasında oluşan TÜRKİYE\'NİN EN BÜYÜK LAGÜNÜ.',
    kpssTips: [
      'Türkiye\'nin yüzölçümü olarak EN BÜYÜK KIYI SET GÖLÜ (Lagünü)\'dür.',
      'Yeşil Deniz Kaplumbağası (Chelonia mydas) ve kuş göç yollarının en büyük Akdeniz sığınağıdır (Ramsar Alanı).'
    ],
    mnemonic: 'AKYATAN = Türkiye\'nin En Büyük Lagünü (Çukurova Kıyı Seti)'
  },

  // ==========================================
  // 8. BUZUL (SİRK) GÖLLERİ
  // ==========================================
  {
    id: 'l-kackar-sirk',
    name: 'Kaçkar Buzul Sirk Gölleri (Deniz Gölü & Karagöl)',
    type: 'lake',
    subCategory: 'glacial',
    category: 'Buzul (Sirk) Gölü (3.000m+)',
    coordinates: [41.160, 40.840],
    elevation: 3370,
    region: 'Karadeniz',
    description: 'Rize ve Artvin Kaçkar Dağları zirve kuşağında buzul aşındırmasıyla oluşan derin ve buz gibi turkuaz sirk gölleri.',
    kpssTips: [
      'Türkiye\'de buzul göllerinin en yoğun olduğu yer Doğu Karadeniz (Kaçkarlar) ve Hakkari (Cilo-Sat)\'dir.',
      'Deniz Gölü 3.370 m rakımı ile Kaçkarlar\'ın en derin buzul gölüdür.'
    ],
    mnemonic: 'Kaçkar Deniz Gölü = Zirvedeki Buzul Sirk Gölü'
  },
  {
    id: 'l-uludag-sirk',
    name: 'Uludağ Buzul Sirk Gölleri (Aynalı, Kilimli, Karagöl)',
    type: 'lake',
    subCategory: 'glacial',
    category: 'Buzul (Sirk) Gölü (Marmara\'da Tek)',
    coordinates: [29.130, 40.070],
    elevation: 2400,
    region: 'Marmara',
    description: 'Marmara Bölgesi\'nde üzerinde buzul aşınım çukurları ve sirk gölleri bulunan TEK YER olan Uludağ zirve gölleri.',
    kpssTips: [
      'Marmara Bölgesi\'nde buzul şekillerine ve sirk göllerine rastlanan TEK DAĞ Uludağ\'dır!',
      'Göller: Aynalı Göl, Kilimli Göl, Karagöl, Buzlu Göl.'
    ],
    mnemonic: 'Uludağ Aynalı/Kilimli = Marmara\'nın Tek Buzul Sirk Gölleri'
  },
  {
    id: 'l-cilo-sat-sirk',
    name: 'Cilo - Sat Buzul Gölleri (Hakkari)',
    type: 'lake',
    subCategory: 'glacial',
    category: 'Buzul (Sirk) Gölü (En Yüksek Kıvrım Kuşağı)',
    coordinates: [44.000, 37.500],
    elevation: 3400,
    region: 'Doğu Anadolu',
    description: 'Hakkari Yüksekova ve Cilo-Sat Dağları Milli Parkı\'nda Türkiye\'nin en büyük güncel vadi buzulları eteklerindeki sirk gölleri.',
    kpssTips: [
      'Türkiye\'nin en büyük güncel takke ve vadi buzulları (Uludoruk) altındaki sirk gölleridir.',
      'Milli Park ilan edilerek koruma altına alınmıştır.'
    ]
  }
];

export const BORDER_GATES_DATA: GeoFeature[] = [
  {
    id: 'bg-kapikule',
    name: 'Kapıkule Sınır Kapısı',
    type: 'border_gate',
    category: 'Avrupa Ticaret Kapısı',
    coordinates: [26.351, 41.717],
    region: 'Marmara',
    description: 'Edirne\'de Bulgaristan sınırında yer alan, Türkiye ve Avrupa\'nın en işlek gümrük kapısı.',
    kpssTips: [
      'Türkiye\'nin araç ve yolcu trafiği en yoğun gümrük kapısıdır.',
      'Bulgaristan\'a açılır ve aktif DEMİRYOLU BAĞLANTISI vardır!',
      'Avrupa transit karayolu (E-80) üzerindedir.'
    ],
    details: {
      connectedCountry: 'Bulgaristan',
      activeStatus: 'Açık (En İşlek)',
      railway: true
    },
    mnemonic: 'KAPIKULE = Bulgaristan + En İşlek Kara/Demiryolu Kapısı'
  },
  {
    id: 'bg-ipsala',
    name: 'İpsala Sınır Kapısı',
    type: 'border_gate',
    category: 'Avrupa Ticaret Kapısı',
    coordinates: [26.381, 40.930],
    region: 'Marmara',
    description: 'Edirne\'de Yunanistan ile aramızdaki ana sınır kapısı.',
    kpssTips: [
      'Yunanistan ile aramızdaki en önemli sınır kapısıdır.',
      'Meriç nehri yakınındadır.'
    ],
    details: {
      connectedCountry: 'Yunanistan',
      activeStatus: 'Açık',
      railway: false
    }
  },
  {
    id: 'bg-sarp',
    name: 'Sarp Sınır Kapısı',
    type: 'border_gate',
    category: 'Karadeniz Kapısı',
    coordinates: [41.551, 41.523],
    region: 'Karadeniz',
    description: 'Artvin Hopa\'da Gürcistan\'a açılan Doğu Karadeniz kapısı.',
    kpssTips: [
      'Gürcistan ile pasaportsuz sadece kimlik kartı ile geçiş yapılabilen kapımızdır.',
      'Doğu Karadeniz ticaretinin can damarıdır.'
    ],
    details: {
      connectedCountry: 'Gürcistan',
      activeStatus: 'Açık (Kimlikle Geçiş)',
      railway: false
    }
  },
  {
    id: 'bg-gurbulak',
    name: 'Gürbulak Sınır Kapısı',
    type: 'border_gate',
    category: 'Orta Doğu / Asya Kapısı',
    coordinates: [44.380, 39.380],
    region: 'Doğu Anadolu',
    description: 'Ağrı Doğubayazıt\'ta İran ile olan en eski ve en işlek gümrük kapısı.',
    kpssTips: [
      'İran sınırımızdaki en büyük kara gümrük kapısıdır.',
      'Tarihi İpek Yolu güzergahı üzerindedir.'
    ],
    details: {
      connectedCountry: 'İran',
      activeStatus: 'Açık',
      railway: false
    }
  },
  {
    id: 'bg-kapikoy',
    name: 'Kapıköy Sınır Kapısı (Van)',
    type: 'border_gate',
    category: 'İran Demiryolu Kapısı',
    coordinates: [44.380, 38.520],
    region: 'Doğu Anadolu',
    description: 'Van Özalp\'te İran\'a açılan sınır kapısı.',
    kpssTips: [
      'İran ile aktif DEMİRYOLU bağlantımızın olduğu sınır kapısıdır (Van-Tebriz tren hattı).'
    ],
    details: {
      connectedCountry: 'İran',
      activeStatus: 'Açık',
      railway: true
    },
    mnemonic: 'Kapıköy & Esendere = İran Demiryolu & Yüksekova Kapıları'
  },
  {
    id: 'bg-habur',
    name: 'Habur Sınır Kapısı',
    type: 'border_gate',
    category: 'Irak Ticaret Kapısı',
    coordinates: [42.620, 37.150],
    region: 'Güneydoğu Anadolu',
    description: 'Şırnak Silopi\'de Irak\'a açılan, Orta Doğu ihracatımızın kilit kapısı.',
    kpssTips: [
      'Irak\'a açılan tek aktif ana gümrük kapımızdır.',
      'Güneydoğu Anadolu ihracat rakamlarında 1. sıradadır.'
    ],
    details: {
      connectedCountry: 'Irak',
      activeStatus: 'Açık',
      railway: false
    }
  },
  {
    id: 'bg-dilucu',
    name: 'Dilucu (Umut) Sınır Kapısı',
    type: 'border_gate',
    category: 'Nahçıvan / Türk Dünyası Kapısı',
    coordinates: [44.800, 39.800],
    region: 'Doğu Anadolu',
    description: 'Iğdır\'da Azerbaycan Nahçıvan Özerk Cumhuriyeti\'ne açılan tek sınır kapımız.',
    kpssTips: [
      'Türkiye\'nin Türk Dünyası ve Azerbaycan Nahçıvan ile doğrudan TEK KARA SINIR KAPISIDIR!',
      'Aras nehri üzerindeki Hasret Köprüsü ile bağlanır.'
    ],
    details: {
      connectedCountry: 'Azerbaycan (Nahçıvan)',
      activeStatus: 'Açık',
      railway: false
    },
    mnemonic: 'DİLUCU = Nahçıvan\'a Açılan Tek Hasret Kapımız!'
  },
  {
    id: 'bg-cilvegozu',
    name: 'Cilvegözü ve Öncüpınar',
    type: 'border_gate',
    category: 'Suriye Kapısı',
    coordinates: [36.650, 36.250],
    region: 'Akdeniz',
    description: 'Hatay Reyhanlı ve Kilis\'te Suriye\'ye açılan ana sınır kapıları.',
    kpssTips: [
      'Suriye ile en uzun kara sınırına sahibiz (822 km).'
    ],
    details: {
      connectedCountry: 'Suriye',
      activeStatus: 'İnsani Yardım & Transit',
      railway: true
    }
  },
  {
    id: 'bg-hamzabeyli',
    name: 'Hamzabeyli Sınır Kapısı',
    type: 'border_gate',
    category: 'Bulgaristan Kapısı',
    coordinates: [26.690, 41.960],
    region: 'Marmara',
    description: 'Edirne Lalapaşa\'da Bulgaristan\'a açılan Kapıkule alternatif gümrük kapısı.',
    kpssTips: ['Kapıkule yoğunluğunu azaltmak için kullanılan Bulgaristan kapımızdır.'],
    details: { connectedCountry: 'Bulgaristan', activeStatus: 'Açık', railway: false }
  },
  {
    id: 'bg-pazarkule',
    name: 'Pazarkule Sınır Kapısı',
    type: 'border_gate',
    category: 'Yunanistan Kapısı',
    coordinates: [26.480, 41.660],
    region: 'Marmara',
    description: 'Edirne merkezde Yunanistan Kastanies\'e açılan sınır kapısı.',
    kpssTips: ['Yunanistan ile İpsala\'dan sonraki ikinci karayolu geçiş noktasıdır.'],
    details: { connectedCountry: 'Yunanistan', activeStatus: 'Açık', railway: false }
  },
  {
    id: 'bg-turkgozu',
    name: 'Türkgözü Sınır Kapısı',
    type: 'border_gate',
    category: 'Gürcistan Kapısı',
    coordinates: [42.850, 41.500],
    region: 'Doğu Anadolu',
    description: 'Ardahan Posof\'ta Gürcistan\'a açılan sınır gümrük kapısı.',
    kpssTips: ['Sarp Sınır Kapısı\'ndan sonra Gürcistan\'a açılan Doğu Anadolu kapısıdır.'],
    details: { connectedCountry: 'Gürcistan', activeStatus: 'Açık', railway: false }
  },
  {
    id: 'bg-aktas',
    name: 'Aktaş Sınır Kapısı',
    type: 'border_gate',
    category: 'Gürcistan Kapısı',
    coordinates: [43.220, 41.220],
    region: 'Doğu Anadolu',
    description: 'Ardahan Çıldır Aktaş Gölü yakınında Gürcistan\'a açılan modenize edilmiş sınır kapısı.',
    kpssTips: ['Gürcistan ile 3. kara geçiş kapımızdır.'],
    details: { connectedCountry: 'Gürcistan', activeStatus: 'Açık', railway: false }
  },
  {
    id: 'bg-esendere',
    name: 'Esendere Sınır Kapısı',
    type: 'border_gate',
    category: 'İran Kapısı',
    coordinates: [44.580, 37.710],
    region: 'Doğu Anadolu',
    description: 'Hakkari Yüksekova\'da İran\'a açılan gümrük kapısı.',
    kpssTips: ['Doğu Anadolu güneydoğu ucundan İran\'a geçiş sağlar.'],
    details: { connectedCountry: 'İran', activeStatus: 'Açık', railway: false }
  },
  {
    id: 'bg-akcakale',
    name: 'Akçakale Sınır Kapısı',
    type: 'border_gate',
    category: 'Suriye Kapısı',
    coordinates: [38.950, 36.700],
    region: 'Güneydoğu Anadolu',
    description: 'Şanlıurfa Akçakale\'de Suriye\'ye açılan sınır kapısı.',
    kpssTips: ['Güneydoğu Anadolu ovalarının Suriye sınır gümrük noktasıdır.'],
    details: { connectedCountry: 'Suriye', activeStatus: 'Açık', railway: false }
  }
];

export const PASSES_DATA: GeoFeature[] = [
  {
    id: 'p-zigana',
    name: 'Zigana Geçidi & Tüneli',
    type: 'pass',
    category: 'Kuzey Anadolu Geçitleri',
    coordinates: [39.400, 40.630],
    elevation: 2010,
    region: 'Karadeniz',
    description: 'Trabzon ile Gümüşhane\'yi birbirine bağlayan tarihi geçit. Yeni Zigana Tüneli (14.5 km) Avrupa\'nın ve Türkiye\'nin en uzun çift tüp karayolu tünelidir.',
    kpssTips: [
      'Doğu Karadeniz kıyısı ile iç kesimler (Trabzon - Gümüşhane) arasındaki bağlantıyı sağlar.',
      'Yeni Zigana Tüneli 14,5 km uzunluğu ile Türkiye ve Avrupa\'nın EN UZUN KARAYOLU TÜNELİDİR!'
    ],
    mnemonic: 'Zigana = Trabzon-Gümüşhane + Avrupa\'nın En Uzun Çift Tüp Tüneli (14.5 km)'
  },
  {
    id: 'p-kop',
    name: 'Kop Geçidi & Tüneli',
    type: 'pass',
    category: 'Kuzey Anadolu Geçitleri',
    coordinates: [40.500, 40.020],
    elevation: 2409,
    region: 'Doğu Anadolu',
    description: 'Gümüşhane ve Bayburt üzerinden Erzurum ve Doğu Anadolu\'yu Karadeniz\'e bağlayan 2.409 m rakımlı geçit.',
    kpssTips: [
      'Gümüşhane/Bayburt üzerinden Erzurum\'u Trabzon limanına ve Karadeniz sahil yoluna bağlar.',
      'Çoruh ve Fırat havzaları arasında doğal su bölümü çizgisidir.'
    ],
    mnemonic: 'Kop Geçidi = Bayburt-Erzurum Arası Yüksek Geçit'
  },
  {
    id: 'p-cankurtaran',
    name: 'Cankurtaran Geçidi & Tüneli',
    type: 'pass',
    category: 'Doğu Karadeniz Geçidi',
    coordinates: [41.420, 41.320],
    elevation: 690,
    region: 'Karadeniz',
    description: 'Artvin Hopa sahilini Borçka ve iç kesimlere bağlayan Karçal Dağları geçidi.',
    kpssTips: [
      'Doğu Karadeniz sahili Hopa\'yı Artvin şehir merkezine bağlayan tünelli kilit geçittir.'
    ]
  },
  {
    id: 'p-ilgaz',
    name: 'Ilgaz 15 Temmuz İstiklal Tüneli & Geçidi',
    type: 'pass',
    category: 'Batı Karadeniz Geçidi',
    coordinates: [33.870, 41.080],
    elevation: 1875,
    region: 'Karadeniz',
    description: 'Kastamonu ile Çankırı arasındaki Ilgaz Dağları\'nı aşan çift tüp tünelli geçit.',
    kpssTips: [
      'İç Anadolu\'yu (Ankara/Çankırı) Batı Karadeniz\'e (Kastamonu/İnebolu) bağlar.'
    ]
  },
  {
    id: 'p-egribel',
    name: 'Eğribel Tüneli & Geçidi',
    type: 'pass',
    category: 'Doğu Karadeniz Geçidi',
    coordinates: [38.450, 40.580],
    elevation: 2200,
    region: 'Karadeniz',
    description: 'Giresun sahilini Şebinkarahisar ve Sivas iç kesimlerine bağlayan tünelli yüksek geçit.',
    kpssTips: ['Giresun ile Sivas arasındaki ulaşımı kışın da kesintisiz kılar.']
  },
  {
    id: 'p-sakaltutan',
    name: 'Sakaltutan Geçidi',
    type: 'pass',
    category: 'Doğu Anadolu Geçidi',
    coordinates: [39.750, 39.850],
    elevation: 2160,
    region: 'Doğu Anadolu',
    description: 'Erzincan ile Erzurum arasındaki yüksek dağ geçidi.',
    kpssTips: ['Doğu Anadolu içi karayolu ulaşımının çetin geçitlerindendir.']
  },
  {
    id: 'p-sabuncubeli',
    name: 'Sabuncubeli Tüneli',
    type: 'pass',
    category: 'Ege Ulaşım Tüneli',
    coordinates: [27.350, 38.520],
    elevation: 575,
    region: 'Ege',
    description: 'İzmir ile Manisa arasındaki Spil Dağı ve Yamanlar kütlesini aşan yoğun trafikli tünel geçidi.',
    kpssTips: ['İzmir ile Manisa arasındaki seyahat süresini 15 dakikaya indiren tüneldir.']
  },
  {
    id: 'p-ovit',
    name: 'Ovit Tüneli & Geçidi',
    type: 'pass',
    category: 'Rize - Erzurum Geçidi',
    coordinates: [40.750, 40.600],
    elevation: 2640,
    region: 'Karadeniz',
    description: 'Rize İkizdere ile Erzurum İspir\'i bağlayan 14.3 km uzunluğundaki tünel.',
    kpssTips: [
      'Rize\'yi Erzurum ve Doğu Anadolu\'ya bağlayan devasa tünel projesidir.'
    ]
  },
  {
    id: 'p-gulek',
    name: 'Gülek Boğazı',
    type: 'pass',
    category: 'Toros Geçitleri',
    coordinates: [34.780, 37.280],
    elevation: 1050,
    region: 'Akdeniz',
    description: 'İç Anadolu\'yu (Niğde/Pozantı) Çukurova\'ya (Adana/Mersin) bağlayan doğal boğaz.',
    kpssTips: [
      'Tarihten beri Akdeniz\'i İç Anadolu\'ya bağlayan en stratejik geçittir.',
      'Otoyol geçişi mevcuttur.'
    ],
    mnemonic: 'Akdeniz Toros Geçitleri Batıdan Doğuya: Ç-S-G-B (Çubuk, Sertavul, Gülek, Belen)'
  },
  {
    id: 'p-sertavul',
    name: 'Sertavul Geçidi',
    type: 'pass',
    category: 'Toros Geçitleri',
    coordinates: [33.250, 36.900],
    elevation: 1650,
    region: 'Akdeniz',
    description: 'Karaman ile Mersin Mut arasındaki bağlantıyı sağlayan Orta Toros geçidi.',
    kpssTips: [
      'İç Anadolu\'yu Mersin limanına bağlayan kilit güzergahtır.'
    ]
  },
  {
    id: 'p-cubuk',
    name: 'Çubuk Boğazı',
    type: 'pass',
    category: 'Toros Geçitleri',
    coordinates: [30.600, 37.100],
    elevation: 920,
    region: 'Akdeniz',
    description: 'Antalya\'yı Göller Yöresi ve Burdur/Isparta\'ya bağlayan Batı Toros geçidi.',
    kpssTips: [
      'Antalya\'nın iç kesimlerle bağlantısını sağlayan karstik kökenli geçittir.'
    ]
  },
  {
    id: 'p-belen',
    name: 'Belen Geçidi',
    type: 'pass',
    category: 'Amanos (Nur) Dağları Geçidi',
    coordinates: [36.200, 36.500],
    elevation: 740,
    region: 'Akdeniz',
    description: 'İskenderun ile Antakya ve Amik Ovası\'nı bağlayan Amanos dağları geçidi.',
    kpssTips: [
      'İskenderun limanı sanayisini Amik Ovası ve Orta Doğu\'ya bağlar.'
    ]
  }
];

export const PLAINS_PLATEAUS_DATA: GeoFeature[] = [
  {
    id: 'pl-cukurova',
    name: 'Çukurova (Delta Ovası)',
    type: 'plain',
    subCategory: 'delta',
    category: 'Delta Ovası',
    coordinates: [35.300, 36.850],
    region: 'Akdeniz',
    description: 'Seyhan ve Ceyhan nehirlerinin taşıdığı alüvyonlarla oluşan Türkiye\'nin EN BÜYÜK DELTA OVASIDIR.',
    kpssTips: [
      'Türkiye\'nin en büyük delta ovası ve en verimli tarım alanlarındandır.',
      'Yılda birden fazla ürün alınabilir (Pamuk, Mısır, Narenciye, Soya).'
    ],
    mnemonic: 'Çukurova = Türkiye\'nin En Büyük Alüvyal Deltası (Seyhan + Ceyhan)'
  },
  {
    id: 'pl-bafra-carsamba',
    name: 'Bafra ve Çarşamba Delta Ovaları',
    type: 'plain',
    subCategory: 'delta',
    category: 'Karadeniz Deltaları',
    coordinates: [36.200, 41.450],
    region: 'Karadeniz',
    description: 'Bafra (Kızılırmak) ve Çarşamba (Yeşilırmak) tarafından Karadeniz kıyısında oluşturulan verimli ovalar.',
    kpssTips: [
      'Karadeniz Bölgesi\'nin en büyük kıyı tarım ovalarıdır.',
      'Tütün, çeltik (pirinç), mısır ve sebze yetiştiriciliği yaygındır.'
    ]
  },
  {
    id: 'pl-takkee',
    name: 'TAKKEM Karstik Ovaları (Polye)',
    type: 'plain',
    subCategory: 'karstic',
    category: 'Karstik Ova (Polye)',
    coordinates: [29.800, 37.100],
    region: 'Akdeniz',
    description: 'Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı ve Muğla karstik ovaları (TAKKEM kuralı).',
    kpssTips: [
      'Kireçtaşının erimesiyle oluşan geniş polyelerdir.',
      'Arazisi karstik olduğu için suları kolayca sızdırır.'
    ],
    mnemonic: 'TAKKEM = Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla'
  },
  {
    id: 'pl-tektonik-kaf',
    name: 'Kuzey Anadolu Tektonik Ovaları',
    type: 'plain',
    subCategory: 'tectonic',
    category: 'Tektonik Ova',
    coordinates: [30.400, 40.750],
    region: 'Marmara',
    description: 'Adapazarı, Düzce, Bolu, Erbaa, Niksar, Taşova ve Erzincan tektonik fay ovaları.',
    kpssTips: [
      'Fay hatları boyunca çöküntü alanlarında yer alırlar.',
      'Deprem riski yüksektir ancak tarım toprakları verimlidir.'
    ]
  },
  {
    id: 'pl-erzurum-kars',
    name: 'Erzurum - Kars - Ardahan Platosu',
    type: 'plateau',
    subCategory: 'plateau',
    category: 'Volkanik / Lav Örtüsü Platosu',
    coordinates: [42.000, 40.500],
    elevation: 2000,
    region: 'Doğu Anadolu',
    description: 'Türkiye\'nin EN YÜKSEK VE EN SOĞUK volcanik lav örtülü platosu.',
    kpssTips: [
      'Yaz yağışlarına bağlı GÜR ALPIN ÇAYIRLAR gelişir.',
      'Bu nedenle BÜYÜKBAŞ MERA HAYVANCILIĞI 1. sıradadır.',
      'Toprak türü en verimli olan ÇERNOZYOM (Kara Toprak) tir ancak iklim soğuk olduğu için tarımda yeterince yararlanılamaz!'
    ],
    mnemonic: 'Erzurum-Kars = Lav Platosu + Çernozyom + Alpin Çayır + Büyükbaş Hayvancılık'
  },
  {
    id: 'pl-teke-taseli',
    name: 'Teke ve Taşeli Platoları',
    type: 'plateau',
    subCategory: 'karstic',
    category: 'Karstik Plateau',
    coordinates: [32.300, 36.600],
    elevation: 1200,
    region: 'Akdeniz',
    description: 'Kireçtaşı (Kalker) kayacının yaygın olduğu engebeli karstik platolar.',
    kpssTips: [
      'Su tutma kapasitesi zayıf (yeraltına sızar), tarım imkanları kısıtlıdır.',
      'Nüfusu en seyrek alanlarımızdandır.',
      'KIL KEÇİSİ yetiştiriciliği yaygındır.'
    ],
    mnemonic: 'Teke-Taşeli = Karstik + Seyrek Nüfus + Kıl Keçisi'
  },
  {
    id: 'pl-catalca-kocaeli',
    name: 'Çatalca - Kocaeli Platosu',
    type: 'plateau',
    subCategory: 'plateau',
    category: 'Aşınım Platosu',
    coordinates: [29.200, 41.000],
    elevation: 200,
    region: 'Marmara',
    description: 'Türkiye\'nin EN ALÇAK, EN YOĞUN NÜFUSLU VE EN GELİŞMİŞ platosu.',
    kpssTips: [
      'Aşınım (Peneplen) platosudur.',
      'Nüfus, sanayi, ulaşım ve ticaret bakımından 1. sıradadır.',
      'Tarım ve hayvancılık alanları kentsel gelişmeyle daralmıştır.'
    ]
  },
  {
    id: 'pl-bozok-cihanbeyli',
    name: 'İç Anadolu Platoları (Cihanbeyli, Haymana, Bozok, Obruk, Uzunyayla)',
    type: 'plateau',
    subCategory: 'plateau',
    category: 'Yatuk Duruşlu (Tabaka Düzlüğü) Platolar',
    coordinates: [32.800, 39.000],
    elevation: 1000,
    region: 'İç Anadolu',
    description: 'Tahıl ambarı niteliğindeki geniş steplerle kaplı platolar topluluğu.',
    kpssTips: [
      'Küçükbaş hayvancılık (Koyun/Tiftik Keçisi) ve tahıl (buğday/arpay) üretimi yaygındır.',
      'Obruk platosunda karstik obruk çökmeleri sıklıkla yaşanır.'
    ]
  }
];

export const KARSTIC_COASTAL_DATA: GeoFeature[] = [
  {
    id: 'kf-pamukkale',
    name: 'Pamukkale Travertenleri',
    type: 'karstic',
    subCategory: 'karstic',
    category: 'Karstik Birikim (Traverten)',
    coordinates: [29.120, 37.920],
    region: 'Ege',
    description: 'Kalsiyum karbonatlı termal suların çökelmesiyle oluşan UNESCO Dünya Mirası karstik traverten sahası.',
    kpssTips: [
      'Dünyaca ünlü karstik birikim şeklidir.',
      'Denizli ilinde yer alır ve termal turizm açısından stratejiktir.'
    ]
  },
  {
    id: 'kf-cennet-cehennem',
    name: 'Cennet - Cehennem Obrukları',
    type: 'karstic',
    subCategory: 'karstic',
    category: 'Karstik Obruk',
    coordinates: [34.110, 36.450],
    region: 'Akdeniz',
    description: 'Mersin Silifke\'de yeraltı mağara tavanlarının çökmesiyle oluşan devasa karstik obruklar.',
    kpssTips: [
      'Karstik çökme obruklarının Türkiye\'deki en belirgin örneğidir.'
    ]
  },
  {
    id: 'cf-kapidag',
    name: 'Kapıdağ Yarımadası (Tombolo)',
    type: 'coastal',
    subCategory: 'coastal',
    category: 'Kıyı Birikim (Saplı Ada / Tombolo)',
    coordinates: [27.800, 40.450],
    region: 'Marmara',
    description: 'Balıkesir Erdek\'te eski bir adanın dalga biriktirmesiyle karaya bağlanması (Tombolo).',
    kpssTips: [
      'Türkiye\'nin en tipik Tombolo (Saplı Ada) örneğidir.'
    ],
    mnemonic: 'Kapıdağ & Sinop İnceburun = Ülkemizin İki Dev Tombolosu'
  },
  {
    id: 'cf-sinop-inceburun',
    name: 'Sinop İnceburun (Tombolo)',
    type: 'coastal',
    subCategory: 'coastal',
    category: 'Kıyı Birikim (Tombolo)',
    coordinates: [35.000, 42.100],
    region: 'Karadeniz',
    description: 'Türkiye\'nin en kuzey noktası ve doğal limanlı tombolo yapısı.',
    kpssTips: [
      'Türkiye\'nin en kuzey ucudur (42° K paralelidir).'
    ]
  },
  {
    id: 'kf-nemrut-kaldera',
    name: 'Nemrut Kalderası ve Krater Gölü (Bitlis)',
    type: 'karstic',
    subCategory: 'volcanic',
    category: 'Kaldera & Volkanik Şekil',
    coordinates: [42.235, 38.625],
    region: 'Doğu Anadolu',
    description: 'Bitlis\'te Türkiye\'nin en büyük kaldera gölüdür. Nemrut Dağı 1441-1443 tarihlerinde patlayarak ülkemizde en son aktif olan sönmüş volkanımızdır.',
    kpssTips: [
      'Türkiye\'de en son tarihi patlamayı gerçekleştiren volkandır (1441-1443).',
      'İçinde soğuk ve sıcak su kaynaklı krater gölleri bulunur.'
    ],
    mnemonic: 'Suratsız Nemrut = En son patlayan volkanımız (1441-1443)'
  },
  {
    id: 'kf-meke-golu',
    name: 'Meke Gölü Mağarı (Konya Karapınar)',
    type: 'karstic',
    subCategory: 'volcanic',
    category: 'Mağar & Patlama Çukuru',
    coordinates: [33.633, 37.683],
    region: 'İç Anadolu',
    description: 'Gaz patlaması sonucu oluşan ve "Dünyanın Nazar Boncuğu" olarak bilinen volkanik mağar gölü.',
    kpssTips: [
      'Türkiye\'deki en belirgin gaz patlama çukuru (Mağar) örneğidir.',
      'Sularının çekilmesiyle kuraklık tehlikesi yaşamaktadır.'
    ],
    mnemonic: 'Meke = Dünyanın Nazar Boncuğu Mağar Gölü'
  },
  {
    id: 'kf-insuyu-magara',
    name: 'İnsuyu Mağarası (Burdur)',
    type: 'karstic',
    subCategory: 'karstic',
    category: 'Karstik Mağara',
    coordinates: [30.370, 37.650],
    region: 'Akdeniz',
    description: 'Burdur ilinde yer alan ve Türkiye\'de turizme açılan İLK karstik mağaradır.',
    kpssTips: [
      'Türkiye\'de turizme açılan İLK mağaradır (1965).',
      'Sarkıt, dikit ve yeraltı gölleri içerir.'
    ]
  },
  {
    id: 'kf-karain-magara',
    name: 'Karain Mağarası (Antalya)',
    type: 'karstic',
    subCategory: 'karstic',
    category: 'Karstik Mağara & Paleolitik Yerleşim',
    coordinates: [30.550, 36.980],
    region: 'Akdeniz',
    description: 'Antalya\'da Türkiye\'nin en eski insan yaşam izlerini (Paleolitik Çağ) barındıran doğal karstik mağarası.',
    kpssTips: [
      'Türkiye\'de insan yaşayan EN ESKİ doğal mağara yerleşimidir.'
    ]
  },
  {
    id: 'cf-kas-finike',
    name: 'Kaş - Finike Kıyıları (Dalmatça Kıyı Tipi)',
    type: 'coastal',
    subCategory: 'coastal',
    category: 'Dalmatça Kıyı Tipi',
    coordinates: [29.640, 36.200],
    region: 'Akdeniz',
    description: 'Kıyıya paralel uzanan dağların vadilerinin deniz suyu altında kalmasıyla adacıklı yapıya dönüşen kıyı tipi.',
    kpssTips: [
      'Türkiye\'de Dalmatça kıyı tipinin görüldüğü TEK alandır (Teke Yarımadası güneyi).'
    ],
    mnemonic: 'Kaş-Finike = Dalmatça Benekli Adalı Kıyı'
  },
  {
    id: 'cf-silifke-kalankli',
    name: 'Silifke - Mersin Kıyıları (Kalanklı Kıyı Tipi)',
    type: 'coastal',
    subCategory: 'coastal',
    category: 'Kalanklı (Karstik) Kıyı Tipi',
    coordinates: [33.930, 36.370],
    region: 'Akdeniz',
    description: 'Karstik kanyon vadilerinin deniz seviyesine ulaşmasıyla oluşan özel kanyonlu kıyı yapısı.',
    kpssTips: [
      'ÖSYM KPSS Notu: Kalanklı kıyı tipi denince Mersin-Silifke karstik kanyon kıyıları hatırlanmalıdır.'
    ]
  },
  {
    id: 'pl-takkem-polyeler',
    name: 'TAKKEM Karstik Ovaları (Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla)',
    type: 'plain',
    subCategory: 'karstic',
    category: 'Karstik Ova (Polye)',
    coordinates: [30.100, 37.100],
    region: 'Akdeniz',
    description: 'Karstik erimelerle oluşan ülkemizin en büyük kireçtaşı aşınım düzlükleri (Polyeler).',
    kpssTips: [
      'TAKKEM kodlaması ile hafızada tutulur.',
      'Tabanı kireçli olduğu için su tutmaz ancak alüvyon kaplı alanlarında tarım yapılır.'
    ],
    mnemonic: 'TAKKEM = Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla'
  },
  {
    id: 'pl-develi-ova',
    name: 'Develi Ovası (Kayseri - Volkanik Ova)',
    type: 'plain',
    subCategory: 'volcanic',
    category: 'Volkanik Ova',
    coordinates: [35.480, 38.390],
    region: 'İç Anadolu',
    description: 'Erciyes Dağı\'nın çıkardığı lav ve tüflerin çukurluğu doldurmasıyla oluşan volkanik ova.',
    kpssTips: [
      'Türkiye\'deki nadir Volkanik Ova örneklerindendir.'
    ]
  },
  {
    id: 'pl-bursa-ova',
    name: 'Bursa Ovası (Dağ Eteği Ovası)',
    type: 'plain',
    subCategory: 'tectonic',
    category: 'Dağ Eteği Ovası',
    coordinates: [29.060, 40.200],
    region: 'Marmara',
    description: 'Uludağ\'ın eteklerinden inen akarsuların taşıdığı alüvyonları biriktirmesiyle oluşan dağ eteği ovası.',
    kpssTips: [
      'Dağ Eteği Ovası denince KPSS\'de akla gelen ilk örnektir.'
    ]
  }
];

export const MINES_DATA: GeoFeature[] = [
  // ==========================================
  // 1. DEMİR MADENİ
  // ==========================================
  {
    id: 'mn-demir-divrigi',
    name: 'Sivas Divriği Demir Yatakları',
    type: 'mine',
    category: 'Demir Madeni (Türkiye\'nin En Büyük Rezervi)',
    coordinates: [38.120, 39.370],
    region: 'İç Anadolu',
    description: 'Türkiye demir rezervinin ve üretiminin yaklaşık %60-70\'ini tek başına karşılayan en büyük demir madeni sahası.',
    kpssTips: [
      'Türkiye\'nin en zengin demir yatağıdır.',
      'Buradan çıkarılan demir, demiryolu ile Karabük ve Ereğli Demir-Çelik fabrikalarına (Taşkömürüne yakınlık) ile İskenderun Demir-Çelik tesislerine (Liman/Ulaşım) taşınır.',
      'Sivas Kangal ve Divriği demir cevheri rezerv merkezidir.'
    ],
    mnemonic: 'Sivas Divriği = Türkiye\'nin Demir Kalbi -> Karabük & İskenderun\'a Taşınır'
  },
  {
    id: 'mn-demir-hekimhan',
    name: 'Malatya Hekimhan & Hasançelebi Demir Yatakları',
    type: 'mine',
    category: 'Demir Madeni (Peletleme Tesisi)',
    coordinates: [38.030, 38.830],
    region: 'Doğu Anadolu',
    description: 'Malatya\'nın Hekimhan ve Hasançelebi havzasında yer alan, Türkiye\'nin en büyük demir peletleme tesisine sahip maden alanı.',
    kpssTips: [
      'Hasançelebi\'de zenginleştirme ve pelet tesisleri kuruludur.',
      'İskenderun Demir-Çelik Fabrikası\'nın temel hammadde kaynağıdır.'
    ]
  },
  {
    id: 'mn-demir-eymir',
    name: 'Balıkesir Eymir & Şamlı Demir Yatakları',
    type: 'mine',
    category: 'Demir Madeni (Marmara)',
    coordinates: [27.900, 39.550],
    region: 'Marmara',
    description: 'Balıkesir Havran ve Eymir çevresindeki demir cevheri yatakları.',
    kpssTips: [
      'Batı Anadolu\'nun en eski işletilen demir madenlerindendir.'
    ]
  },

  // ==========================================
  // 2. BAKIR MADENİ (ŞİFRE: KADER)
  // Küre, Artvin, Diyarbakır, Elazığ, Rize
  // ==========================================
  {
    id: 'mn-bakir-murgul',
    name: 'Artvin Murgul Bakır Madeni & İşletmesi',
    type: 'mine',
    category: 'Bakır Madeni (Doğu Karadeniz)',
    coordinates: [41.570, 41.280],
    region: 'Karadeniz',
    description: 'Türkiye\'nin en eski ve en büyük bakır madeni ocaklarından biri (Karadeniz Bakır İşletmeleri).',
    kpssTips: [
      'Artvin Murgul ve Cerattepe bakır/altın sahalarıdır.',
      'Samsun Bakır Fabrikası\'na hammadde gönderilir (Samsun\'da maden çıkmaz, LİMAN ve ULAŞIMDAN dolayı fabrika oradadır!).',
      'Bakır şifresi: K-A-D-E-R (Küre, Artvin, Diyarbakır, Elazığ, Rize).'
    ],
    mnemonic: 'Bakır Çıkarılan İller = K-A-D-E-R (Kastamonu Küre, Artvin Murgul, Diyarbakır Ergani, Elazığ Maden, Rize Çayeli)'
  },
  {
    id: 'mn-bakir-kure',
    name: 'Kastamonu Küre Bakır Madeni',
    type: 'mine',
    category: 'Bakır & Pirit Yatakları',
    coordinates: [33.720, 41.800],
    region: 'Karadeniz',
    description: 'Kastamonu Küre Dağları\'nda yer alan, yeraltı ve açık ocak bakır ve pirit işletmesi.',
    kpssTips: [
      'Buradan çıkarılan bakır cevheri İnebolu Limanı\'ndan deniz yoluyla Samsun Bakır İzabe Tesisleri\'ne sevk edilir.',
      'Pirit madeni gübre sanayinde sülfürik asit üretiminde kullanılır.'
    ]
  },
  {
    id: 'mn-bakir-elazig',
    name: 'Elazığ Maden Bakır İşletmesi',
    type: 'mine',
    category: 'Bakır Madeni (Tarihi İşletme)',
    coordinates: [39.670, 38.390],
    region: 'Doğu Anadolu',
    description: 'Elazığ\'ın Maden ilçesinde binlerce yıldır işletilen tarihi bakır cevheri yatağı ve izabe tesisi.',
    kpssTips: [
      'Ergani ve Elazığ Maden ilçesi bakır havzasıdır.'
    ]
  },
  {
    id: 'mn-bakir-cayeli',
    name: 'Rize Çayeli Bakır ve Çinko Yatakları',
    type: 'mine',
    category: 'Bakır & Çinko (Modern Yeraltı)',
    coordinates: [40.730, 41.080],
    region: 'Karadeniz',
    description: 'Rize Çayeli Madenli beldesinde Türkiye\'nin en modern derin yeraltı bakır ve çinko flotasyon tesisi.',
    kpssTips: [
      'Yüksek tenörlü bakır ve çinko konsantresi ihraç edilir.'
    ]
  },

  // ==========================================
  // 3. BOR MİNERALLERİ (DÜNYA REZERVİNİN %73'Ü)
  // ==========================================
  {
    id: 'mn-bor-balikesir',
    name: 'Balıkesir Bigadiç & Bandırma Bor Tesisleri',
    type: 'mine',
    category: 'Bor Mineralleri (Kolemanit & Üretim)',
    coordinates: [28.120, 39.400],
    region: 'Marmara',
    description: 'Dünya bor rezervinin yaklaşık %73\'üne sahip olan Türkiye\'nin en zengin bor cevheri ocakları ve Bandırma Borik Asit Fabrikası.',
    kpssTips: [
      'Türkiye dünyada 1. sıradadır (%73 rezerv payı).',
      'İşlendiği fabrikalar: Balıkesir Bandırma Borik Asit Fabrikası (Liman avantajı) ve Eskişehir Kırka Bor Türevleri Tesisi.',
      'Çıkarıldığı yerler: Balıkesir (Bigadiç, Susurluk), Kütahya (Emet), Eskişehir (Seyitgazi-Kırka), Bursa (Mustafakemalpaşa).',
      'Kullanım: Roket/füze yakıtı, nükleer reaktörler, zırh kaplama, cam-seramik, temizlik ürünleri (BORON).'
    ],
    mnemonic: 'BOR Çıkarılan Yerler: Balıkesir (Bigadiç), Kütahya (Emet), Eskişehir (Kırka), Bursa (Kestelek)'
  },
  {
    id: 'mn-bor-kirka',
    name: 'Eskişehir Seyitgazi (Kırka) Tinkal Bor Yatakları',
    type: 'mine',
    category: 'Bor Mineralleri (Dünyanın En Büyük Tinkal Rezervi)',
    coordinates: [30.530, 39.280],
    region: 'İç Anadolu',
    description: 'Dünyanın bilinen en büyük sodyum bazlı tinkal bor rezervine sahip devasa açık ocak işletmesi.',
    kpssTips: [
      'Kırka Bor İşletme Müdürlüğü tesislerinde rafine bor ürünleri üretilir.'
    ]
  },
  {
    id: 'mn-bor-emet',
    name: 'Kütahya Emet Kolemanit Bor Madeni',
    type: 'mine',
    category: 'Bor Mineralleri (Kolemanit)',
    coordinates: [29.260, 39.340],
    region: 'Ege',
    description: 'Kütahya Emet ve Hisarcık ilçelerinde yer alan yüksek tenörlü kolemanit bor madenleri ve borik asit fabrikası.',
    kpssTips: [
      'Eti Maden Genel Müdürlüğü bünyesinde işlenir.'
    ]
  },

  // ==========================================
  // 4. KROM MADENİ (PASLANMAZ ÇELİK)
  // ==========================================
  {
    id: 'mn-krom-fethiye',
    name: 'Muğla Fethiye - Köyceğiz - Dalaman Krom Havzası',
    type: 'mine',
    category: 'Krom Madeni (Ege - Akdeniz)',
    coordinates: [28.900, 36.850],
    region: 'Ege',
    description: 'Türkiye\'nin en kaliteli krom yataklarına sahip Güney Ege havzası.',
    kpssTips: [
      'Paslanmaz çelik, kaplama, silah ve otomotiv sanayiinde kullanılır.',
      'İşlendiği yer: Antalya Ferrokrom Fabrikası (Liman ve elektrik avantajı).',
      'Türkiye krom ihracatında dünyada ilk sıralarda yer alır.'
    ],
    mnemonic: 'Krom İşleme Tesisleri (Ferrokrom): 1. Elazığ Ferrokrom (Hammaddeye yakın), 2. Antalya Ferrokrom (Liman/Ulaşım)'
  },
  {
    id: 'mn-krom-guleman',
    name: 'Elazığ Guleman (Alacakaya) Krom Yatakları',
    type: 'mine',
    category: 'Krom Madeni (Doğu Anadolu)',
    coordinates: [39.870, 38.450],
    region: 'Doğu Anadolu',
    description: 'Türkiye\'nin ilk keşfedilen ve en zengin krom yataklarına sahip tarihi Guleman havzası.',
    kpssTips: [
      'Elazığ Ferrokrom Fabrikası hammaddeye yakınlık ilkesiyle burada kurulmuştur.'
    ]
  },

  // ==========================================
  // 5. BOKSİT (ALÜMİNYUM HAMMADDESİ)
  // ==========================================
  {
    id: 'mn-boksit-seydisehir',
    name: 'Konya Seydişehir & Antalya Akseki Boksit Yatakları',
    type: 'mine',
    category: 'Boksit / Alüminyum Tesisleri',
    coordinates: [31.850, 37.420],
    region: 'İç Anadolu',
    description: 'Türkiye\'nin TEK ENTEGRE ALÜMİNYUM TESİSİ olan Seydişehir Alüminyum Fabrikası ve boksit madenleri.',
    kpssTips: [
      'Alüminyumun hammaddesi BOKSİT madenidir.',
      'Seydişehir Entegre Alüminyum Fabrikası Türkiye\'deki tek tesistir.',
      'Fabrikanın elektrik enerjisi Manavgat üzerindeki Oymapınar Barajı\'ndan karşılanır!',
      'Çıkarıldığı diğer yerler: Antalya (Akseki), Muğla (Milas), Gaziantep (İslahiye), Hatay (Payas).'
    ],
    mnemonic: 'Boksit = Alüminyum -> Konya Seydişehir Entegre Tesisi + Oymapınar Barajı Elektriği'
  },

  // ==========================================
  // 6. TAŞKÖMÜRÜ & LİNYİT (KÖMÜR HAVZALARI)
  // ==========================================
  {
    id: 'mn-taskomuru-zonguldak',
    name: 'Zonguldak & Karadeniz Ereğli Taşkömürü Havzası',
    type: 'mine',
    category: 'Taşkömürü (1. Jeolojik Zaman / Paleozoik)',
    coordinates: [31.790, 41.450],
    region: 'Karadeniz',
    description: 'Türkiye\'de I. Jeolojik Zaman\'da (Paleozoik/Karbonifer) oluşmuş TEK TAŞKÖMÜRÜ HAVZASI.',
    kpssTips: [
      'Türkiye\'de taşkömürü SADECE Batı Karadeniz\'de (Zonguldak, Ereğli, Amasra) bulunur.',
      'I. Jeolojik Zaman arazisi (Masif/Paleozoik) olduğunun en kesin kanıtıdır!',
      'Kalorisi ve ısı değeri çok yüksek olduğu için Karabük ve Ereğli Demir-Çelik fabrikalarında demiri eritmek için (KOK KÖMÜRÜ) kullanılır.',
      'Çatalağzı Termik Santrali (Zonguldak) taşkömürü ile çalışan ilk santralimizdir.'
    ],
    mnemonic: 'Taşkömürü = 1. Jeolojik Zaman + Zonguldak + Demir Çelik Yakıtı + Çatalağzı Termik Santrali'
  },
  {
    id: 'mn-linyit-soma',
    name: 'Manisa Soma Linyit Havzası',
    type: 'mine',
    category: 'Linyit (3. Jeolojik Zaman / Tersiyer)',
    coordinates: [27.610, 39.180],
    region: 'Ege',
    description: 'Ege Bölgesi\'nin en büyük linyit havzası ve dev Soma Termik Santrali.',
    kpssTips: [
      'Linyit III. Jeolojik Zaman\'da (Tersiyer) oluştuğu için Türkiye\'nin her bölgesinde yaygın bulunur.',
      'Manisa Soma, Kütahya Tunçbilek/Seyitömer/Tavşanlı, Muğla Yatağan/Yeniköy/Kemerköy linyitle çalışan Ege santralleridir.'
    ],
    mnemonic: 'Linyit = 3. Zaman (Tersiyer) + Türkiye\'nin Hemen Her Yerinde Yaygın'
  },
  {
    id: 'mn-linyit-elbistan',
    name: 'Kahramanmaraş Afşin - Elbistan Linyit Havzası',
    type: 'mine',
    category: 'Linyit (Türkiye\'nin En Büyük Rezervi)',
    coordinates: [36.910, 38.250],
    region: 'Akdeniz',
    description: 'Türkiye\'nin açık ocak linyit rezervi EN BÜYÜK olan sahası ve Afşin-Elbistan Termik Santralleri (A ve B).',
    kpssTips: [
      'Türkiye\'nin en büyük linyit rezervi buradadır (Düşük kalorili fakat devasa miktar).',
      'Elektrik enerjisi üretiminde payı çok büyüktür.'
    ]
  },
  {
    id: 'mn-linyit-kutahya',
    name: 'Kütahya Tunçbilek, Seyitömer & Tavşanlı Linyitleri',
    type: 'mine',
    category: 'Linyit & Termik Santraller',
    coordinates: [29.470, 39.630],
    region: 'Ege',
    description: 'Kütahya il sınırları içerisindeki yüksek kalorili linyit madenleri ve termik santralleri.',
    kpssTips: [
      'Tunçbilek ve Seyitömer santralleri hammaddeye yakın kurulmuştur.'
    ]
  },
  {
    id: 'mn-asfaltit-sirnak',
    name: 'Şırnak Silopi Asfaltit Yatakları',
    type: 'mine',
    category: 'Asfaltit (Katı Petrol Türevi Maden)',
    coordinates: [42.480, 37.170],
    region: 'Güneydoğu Anadolu',
    description: 'Petrol kökenli katı yakıt olan asfaltitin Türkiye\'deki tek büyük yatağı ve Silopi Asfaltit Termik Santrali.',
    kpssTips: [
      'ÖSYM KPSS KİLİT SORU: Türkiye\'de ASFALTİT madeni Şırnak Silopi\'dedir!',
      'Silopi Asfaltit Termik Santrali Türkiye\'de asfaltitle çalışan tek santraldir.'
    ],
    mnemonic: 'ASFALTİT = Şırnak Silopi (Türkiye\'de Tek Asfaltit Termik Santrali)'
  },

  // ==========================================
  // 7. PETROL & DOĞALGAZ (FOSİL YAKITLAR)
  // ==========================================
  {
    id: 'mn-petrol-batman',
    name: 'Batman Raman & Garzan Petrol Sahası',
    type: 'mine',
    category: 'Petrol & Rafineri',
    coordinates: [41.130, 37.880],
    region: 'Güneydoğu Anadolu',
    description: 'Türkiye\'de ilk petrolün çıkarıldığı (1940 Raman Dağı) tarihi petrol havzası ve Batman Rafinerisi.',
    kpssTips: [
      'Türkiye\'nin ilk petrol kuyusu Raman-8\'dir.',
      'Batman Rafinerisi hammaddeye yakın kurulmuştur.',
      'Türkiye petrol rafinerileri: Batman (Hammaddeye yakın), İzmir Aliağa, Kocaeli İpraş (Tüpraş), Kırıkkale Orta Anadolu (Ordu/Ankara tüketim merkezine yakın).'
    ],
    mnemonic: 'Türkiye Rafinerileri: Batman (Tek Hammaddeye Yakın), Aliağa, İpraş, Kırıkkale'
  },
  {
    id: 'mn-petrol-gabar',
    name: 'Şırnak Gabar Dağı & Cudi Şehit Esma Çevik Petrol Sahası',
    type: 'mine',
    category: 'Yüksek Graviteli Yeni Petrol Sahası',
    coordinates: [42.180, 37.450],
    region: 'Güneydoğu Anadolu',
    description: 'Türkiye\'nin son yıllarda keşfettiği en yüksek kaliteli (41 API gravite) ve en yüksek üretim hacmine ulaşan Gabar Dağı petrol rezervi.',
    kpssTips: [
      'Türkiye\'nin günlük petrol üretimini rekor seviyelere çıkaran sahadır.'
    ]
  },
  {
    id: 'mn-dogalgaz-hamitabat',
    name: 'Kırklareli Hamitabat Doğalgaz Sahası',
    type: 'mine',
    category: 'Doğalgaz & Termik Santral (Trakya)',
    coordinates: [27.350, 41.450],
    region: 'Marmara',
    description: 'Türkiye\'de ilk doğalgaz çıkarılan saha ve Hamitabat Doğalgaz Kombine Çevrim Santrali.',
    kpssTips: [
      'Kırklareli Hamitabat ve Tekirdağ Hayrabolu Trakya doğalgaz havzasıdır.',
      'Hamitabat Çevrim Santrali hammaddeye yakın kurulmuştur.'
    ],
    mnemonic: 'Doğalgaz Çıkarılan Yerler: Kırklareli Hamitabat, Tekirdağ Hayrabolu, Düzce Akçakoca, Karadeniz Sakarya Sahası'
  },
  {
    id: 'mn-dogalgaz-sakarya-sahasi',
    name: 'Karadeniz Sakarya Gaz Sahası (Filyos)',
    type: 'mine',
    category: 'Açık Deniz Derin Doğalgaz Rezervi',
    coordinates: [31.500, 42.800],
    region: 'Karadeniz',
    description: 'Fatih sondaj gemisinin keşfettiği 710 milyar metreküplük Türkiye\'nin en büyük açık deniz doğalgaz rezervi (Filyos Gaz İşleme Tesisi).',
    kpssTips: [
      'Cumhuriyet tarihinin en büyük enerji keşfidir.',
      'Karadeniz derin deniz kuyularından çıkan gaz Filyos Limanı\'nda karaya bağlanmıştır.'
    ]
  },

  // ==========================================
  // 8. YENİLENEBİLİR & ALTERNATİF ENERJİ KAYNAKLARI
  // ==========================================
  {
    id: 'mn-jeotermal-denizli',
    name: 'Denizli Sarayköy (Kızıldere) Jeotermal Santrali',
    type: 'mine',
    category: 'Jeotermal Enerji (Yerin Sıcak Suyu)',
    coordinates: [28.920, 37.920],
    region: 'Ege',
    description: 'Türkiye\'nin İLK JEOTERMAL ELEKTRİK SANTRALİ (Kızıldere). Fay hatları boyunca yükselen buhar enerjisi.',
    kpssTips: [
      'Türkiye jeotermal potansiyelde Avrupa\'da 1., dünyada 4. sıradadır!',
      'İlk santral: Denizli Sarayköy Kızıldere.',
      'Diğer santraller: Aydın Germencik, Buharkent, Manisa Alaşehir, Çanakkale Tuzla.',
      'Jeotermal enerji elektrik üretimi dışında sera ısıtmasında ve kaplıca sağlık turizminde kullanılır.'
    ],
    mnemonic: 'JEOTERMAL = Fay Hatları -> Denizli Sarayköy (İlk Santral) & Aydın Germencik'
  },
  {
    id: 'mn-res-cesme',
    name: 'İzmir Çeşme / Alaçatı Rüzgar Enerji Santrali (RES)',
    type: 'mine',
    category: 'Rüzgar Enerjisi (Türkiye\'nin İlk RES\'i)',
    coordinates: [26.370, 38.310],
    region: 'Ege',
    description: 'Türkiye\'nin 1998 yılında kurulan İLK RÜZGAR ENERJİ SANTRALİ (Alaçatı Germiyan).',
    kpssTips: [
      'Türkiye\'nin ilk RES\'i İzmir Çeşme Alaçatı\'da kurulmuştur.',
      'Rüzgar potansiyelinin en yüksek olduğu bölgeler: Ege ve Marmara (İzmir, Balıkesir, Çanakkale, Manisa, Hatay Belen Geçidi).'
    ],
    mnemonic: 'RES = Rüzgarın Başkenti Ege ve Marmara (İlk RES: Alaçatı)'
  },
  {
    id: 'mn-ges-karapinar',
    name: 'Konya Karapınar Güneş Enerji Santrali (Kalyon GES)',
    type: 'mine',
    category: 'Güneş Enerjisi (Avrupa\'nın En Büyük GES\'i)',
    coordinates: [33.550, 37.710],
    region: 'İç Anadolu',
    description: 'Konya Karapınar Çölleşme sahasında 20 milyon metrekare alana kurulu, Avrupa\'nın en büyük tek parça Güneş Enerji Santrali (1.350 MW).',
    kpssTips: [
      'Güneşlenme süresi en fazla olan bölgelerimiz: Güneydoğu Anadolu ve Akdeniz\'dir.',
      'Güneşlenme süresi en az olan bölge: Karadeniz\'dir (Bulutluluk ve yağış fazla olduğu için).',
      'Karapınar GES Türkiye\'nin ve Avrupa\'nın tek alandaki en büyük fotovoltaik güneş santralidir.'
    ],
    mnemonic: 'GES = En Fazla Güneydoğu & Akdeniz, En Az Karadeniz -> Dev Santral: Konya Karapınar'
  },

  // ==========================================
  // 9. NÜKLEER MADENLER (STRATEJİK CEVHERLER)
  // ==========================================
  {
    id: 'mn-toryum-eskisehir',
    name: 'Eskişehir Sivrihisar (Beylikova) Toryum Yatakları',
    type: 'mine',
    category: 'Toryum (Geleceğin Nükleer Yakıtı - Dünya 2.si)',
    coordinates: [31.530, 39.450],
    region: 'İç Anadolu',
    description: 'Türkiye\'yi dünyada 2. sıraya taşıyan devasa Toryum ve Nadir Toprak Elementleri (NTE) kompleksi.',
    kpssTips: [
      'ÖSYM KPSS KİLİT SORU: Toryum rezervinde Türkiye dünyada 2. sıradadır!',
      'Yeri: Eskişehir Sivrihisar Beylikova sahası.',
      'Geleceğin temiz nükleer enerji hammaddesi ve yüksek teknoloji mıknatıs/çip bileşenidir.'
    ],
    mnemonic: 'TORYUM = Eskişehir Sivrihisar Beylikova (Dünyada 2. Büyük Rezerv)'
  },
  {
    id: 'mn-uranyum-yozgat',
    name: 'Yozgat Sorgun & Manisa Köprübaşı Uranyum Yatakları',
    type: 'mine',
    category: 'Uranyum (Nükleer Enerji Hammaddesi)',
    coordinates: [35.180, 39.810],
    region: 'İç Anadolu',
    description: 'Nükleer reaktörlerin yakıtı olan uranyumun Türkiye\'deki en büyük rezerv alanı (Yozgat Sorgun ve Manisa Köprübaşı).',
    kpssTips: [
      'Uranyum nükleer enerji ve sarı pasta (yellowcake) hammaddesidir.',
      'Yozgat Sorgun, Manisa Köprübaşı, Uşak Eşme ve Aydın Koçarlı\'da yatakları bulunur.'
    ]
  },

  // ==========================================
  // 10. DİĞER STRATEJİK & DEĞERLİ MADENLER
  // ==========================================
  {
    id: 'mn-mermer-afyon',
    name: 'Afyonkarahisar İscehisar & Marmara Adası Mermer Ocakları',
    type: 'mine',
    category: 'Mermer (Doğaltaş İhracat Lideri)',
    coordinates: [30.750, 38.870],
    region: 'Ege',
    description: 'Türkiye\'nin maden ihracat gelirinde 1. SIRADA yer alan doğaltaş ve mermer ocakları.',
    kpssTips: [
      'ÖSYM KPSS KİLİT SORU: Türkiye\'nin maden ihracatında en çok gelir getiren madeni MERMERDİR (%50\'den fazla pay)!',
      'Kalkerlerin (kireçtaşı) başkalaşıma (metamorfizma) uğramasıyla oluşur.',
      'Başlıca yerler: Afyon (İscehisar), Balıkesir (Marmara Adası), Bursa, Bilecik, Muğla, Denizli travertenleri, Elazığ (Vişne mermeri).'
    ],
    mnemonic: 'MERMER = İhracatta 1. Sırada En Çok Gelir Getiren Madenimiz!'
  },
  {
    id: 'mn-altin-usak',
    name: 'Uşak Kışladağ Altın Madeni',
    type: 'mine',
    category: 'Altın (Türkiye ve Avrupa\'nın En Büyük Açık Ocak Altın Madeni)',
    coordinates: [29.180, 38.520],
    region: 'Ege',
    description: 'Türkiye\'nin ve Avrupa\'nın en büyük altın üretim kapasitesine sahip açık ocak altın madeni.',
    kpssTips: [
      'Türkiye\'nin yıllık altın üretiminde 1. sıradadır.',
      'Diğer altın sahaları: İzmir (Bergama Ovacık, Efemçukuru), Balıkesir (Havran), Artvin (Cerattepe), Erzincan (İliç), Gümüşhane (Mastra).'
    ]
  },
  {
    id: 'mn-kursun-cinko-keban',
    name: 'Elazığ Keban & Kayseri Yahyalı Kurşun-Çinko Yatakları',
    type: 'mine',
    category: 'Kurşun ve Çinko (Akü & Radyasyon Kalkanı)',
    coordinates: [38.740, 38.790],
    region: 'Doğu Anadolu',
    description: 'Akü imalatı, kablo kaplama ve radyasyon kalkanı üretiminde kullanılan kurşun ve galvaniz kaplama çinko madenleri.',
    kpssTips: [
      'Elazığ Keban, Kayseri Yahyalı, Balıkesir Balya, Çanakkale Yenice ve Niğde Çamardı\'da çıkarılır.'
    ]
  },
  {
    id: 'mn-fosfat-mazidagi',
    name: 'Mardin Mazıdağı Fosfat Tesisleri',
    type: 'mine',
    category: 'Fosfat (Suni Gübre Hammaddesi)',
    coordinates: [40.480, 37.520],
    region: 'Güneydoğu Anadolu',
    description: 'Tarımsal suni gübre üretiminin ana hammaddesi olan fosfatın Türkiye\'deki en büyük entegre tesisi.',
    kpssTips: [
      'ÖSYM KPSS KİLİT SORU: Türkiye\'de FOSFAT denince akla Mardin Mazıdağı gelir!',
      'Yurtiçi üretim yetmediği için Kuzey Afrika ülkelerinden (Fas, Tunus) ithal edilir.'
    ],
    mnemonic: 'FOSFAT = Mardin Mazıdağı (Suni Gübre Hammaddesi)'
  },
  {
    id: 'mn-barit-antalya',
    name: 'Antalya Alanya & Gazipaşa Barit Yatakları',
    type: 'mine',
    category: 'Barit (Petrol Sondaj Çamuru Ağırlaştırıcı)',
    coordinates: [32.310, 36.270],
    region: 'Akdeniz',
    description: 'Yüksek yoğunluğu ve suda erimemesi sebebiyle petrol ve doğalgaz derin sondaj kuyularında kullanılan ağır mineral.',
    kpssTips: [
      'Petrol sondaj çamurunun basıncını dengelemek ve röntgen odalarında radyasyonu yutmak için kullanılır.',
      'Antalya (Alanya, Gazipaşa), Kahramanmaraş (Elbistan), Muş ve Eskişehir\'de çıkarılır.'
    ]
  },
  {
    id: 'mn-volfram-uludag',
    name: 'Bursa Uludağ Volfram (Tungsten) Yatakları',
    type: 'mine',
    category: 'Volfram / Tungsten (Çok Yüksek Isıya Dayanıklı)',
    coordinates: [29.130, 40.090],
    region: 'Marmara',
    description: 'Erime sıcaklığı en yüksek metallerden olan volframın (tungsten) Bursa Uludağ eteklerindeki yatakları.',
    kpssTips: [
      'Ampul filamanı, uzay araçları gövdesi ve zırh delici mermilerde kullanılır.',
      'Bursa Uludağ, Kırıkkale Keskin ve Elazığ Keban\'da bulunur.'
    ]
  },
  {
    id: 'mn-zimpara-tasi-aydin',
    name: 'Muğla Yatağan & Aydın Söke Zımpara Taşı',
    type: 'mine',
    category: 'Zımpara Taşı (Aşındırıcı Doğal Mineral)',
    coordinates: [27.700, 37.600],
    region: 'Ege',
    description: 'Elmas ve korunddan sonra en sert minerallerden olan zımpara taşının Ege Menteşe yöresindeki zengin yatakları.',
    kpssTips: [
      'Türkiye dünyada zımpara taşı ihracatında önde gelen ülkelerdendir.',
      'Muğla (Milas, Yatağan), Aydın (Söke, Çine) ve İzmir (Tire, Ödemiş)\'de çıkarılır.'
    ]
  },
  {
    id: 'mn-civa-izmir',
    name: 'İzmir Ödemiş & Konya Sarayönü Cıva Yatakları',
    type: 'mine',
    category: 'Cıva (Oda Sıcaklığında Sıvı Tek Metal)',
    coordinates: [27.970, 38.230],
    region: 'Ege',
    description: 'Doğada oda sıcaklığında sıvı halde bulunan TEK METAL olan cıvanın tarihi yatakları.',
    kpssTips: [
      'Zehirli etkisi ve çevre standartları nedeniyle günümüzde ocakların çoğu kapatılmıştır.',
      'İzmir (Ödemiş, Karaburun), Konya (Sarayönü), Niğde ve Uşak\'ta bulunur.'
    ]
  },
  {
    id: 'mn-tuz-camalti',
    name: 'İzmir Çamaltı Tuzlası (Deniz Tuzu)',
    type: 'mine',
    category: 'Deniz Tuzu (Türkiye\'nin En Büyük Deniz Tuzlası)',
    coordinates: [26.920, 38.550],
    region: 'Ege',
    description: 'Gediz Deltası sahilinde deniz suyunun buharlaştırılmasıyla sofra ve sanayi tuzu üretilen devasa tuzla.',
    kpssTips: [
      'Türkiye tuz üretim kaynakları: 1. Göl Tuzu (Tuz Gölü %60), 2. Deniz Tuzu (İzmir Çamaltı Tuzlası %30), 3. Kaya Tuzu (Çankırı, Yozgat Yerköy, Iğdır Tuzluca, Kars Kağızman %10).'
    ],
    mnemonic: 'Tuz Kaynakları: 1. Tuz Gölü (%60), 2. Çamaltı Tuzlası (%30), 3. Çankırı Kaya Tuzu (%10)'
  },
  {
    id: 'mn-kaya-tuzu-cankiri',
    name: 'Çankırı Kaya Tuzu Mağarası',
    type: 'mine',
    category: 'Kaya Tuzu (5000 Yıllık Hitit Mirası)',
    coordinates: [33.780, 40.550],
    region: 'İç Anadolu',
    description: 'Hititler döneminden beri 5.000 yıldır işletilen, içinde tuzdan heykeller ve ambulans bulunan dev yer altı tuz şehri.',
    kpssTips: [
      'Türkiye\'nin en büyük kaya tuzu rezervidir.',
      'Astım ve bronşit tedavisi (Speleoterapi/tuz terapisi) için sağlık turizminde kullanılır.'
    ]
  },
  {
    id: 'mn-luletasi-eskisehir',
    name: 'Eskişehir Lületaşı (Beyaz Altın / Sepiyolit)',
    type: 'mine',
    category: 'Süs Taşı (Dünyada Sadece Eskişehir)',
    coordinates: [30.520, 39.780],
    region: 'İç Anadolu',
    description: 'Hafif, gözenekli ve kolay işlenebilen, dünyada en kaliteli rezervi SADECE ESKİŞEHİR\'de bulunan süs taşı.',
    kpssTips: [
      'ÖSYM KPSS KİLİT SORU: Lületaşı = SADECE ESKİŞEHİR (Pipo, biblo, süs eşyası).',
      'Yeraltından çıkarıldığında yumuşaktır, kurudukça sertleşir ve beyazlaşır.'
    ],
    mnemonic: 'LÜLETAŞI = ESKİŞEHİR (Beyaz Süs Taşı)'
  },
  {
    id: 'mn-oltutasi-erzurum',
    name: 'Erzurum Oltu Taşı (Siyah Kehribar)',
    type: 'mine',
    category: 'Süs Taşı (Siyah Kehribar)',
    coordinates: [41.990, 40.550],
    region: 'Doğu Anadolu',
    description: 'Erzurum Oltu ilçesinde çıkarılan, sürtünmeyle elektriklenen ve tespih/takı yapımında kullanılan siyah renkli organik taş.',
    kpssTips: [
      'ÖSYM KPSS KİLİT SORU: Oltu Taşı = ERZURUM OLTU (Tespih, takı, siyah süs taşı).',
      'Linyit kömürünün özel bir türüdür, sürtünmeyle hafif cisimleri çeker.'
    ],
    mnemonic: 'OLTU TAŞI = ERZURUM OLTU (Siyah Tespih Taşı)'
  },
  {
    id: 'mn-feldispat-aydin',
    name: 'Aydın Çine & Muğla Milas Feldispat Yatakları',
    type: 'mine',
    category: 'Feldispat (Seramik & Cam Sanayi İhracatçısı)',
    coordinates: [28.060, 37.610],
    region: 'Ege',
    description: 'Seramik, porselen, cam ve kaynak elektrodu sanayiinde kullanılan ve Türkiye\'nin dünya ihracatında 1. olduğu mineral.',
    kpssTips: [
      'Türkiye dünyada feldispat ihracatında lider ülkelerdendir (İtalya ve İspanya seramik fabrikalarına ihraç edilir).'
    ]
  },
  {
    id: 'mn-pomza-bitlis',
    name: 'Bitlis Tatvan & Nevşehir Pomza (Sünger Taşı / Bims)',
    type: 'mine',
    category: 'Pomza / Bims (Hafif Volkanik Yapı Malzemesi)',
    coordinates: [42.280, 38.500],
    region: 'Doğu Anadolu',
    description: 'Nemrut ve Erciyes gibi volkanik dağların patlamasıyla oluşan, gözenekli, hafif, ısı ve ses yalıtımında kullanılan volkanik sünger taşı.',
    kpssTips: [
      'İnşaat sektöründe bimsblok (hafif yalıtımlı tuğla) ve tekstilde kot taşlamada kullanılır.',
      'Bitlis, Van, Nevşehir ve Kayseri volkanik sahalarında çok yaygındır.'
    ]
  }
];

export const ALL_GEO_FEATURES: GeoFeature[] = [
  ...MOUNTAINS_DATA,
  ...RIVERS_DATA,
  ...LAKES_DATA,
  ...BORDER_GATES_DATA,
  ...PASSES_DATA,
  ...PLAINS_PLATEAUS_DATA,
  ...KARSTIC_COASTAL_DATA,
  ...MINES_DATA
];

export function getFeatureImageUrl(item?: { id?: string; name?: string; type?: string; category?: string; title?: string } | null): string {
  if (!item) return 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80';
  
  const id = (item.id || '').toLowerCase();
  const name = (item.name || item.title || '').toLowerCase();
  const type = (item.type || '').toLowerCase();

  // Curated High-Res Turkey Geography Photography
  if (id.includes('agri') || name.includes('ağrı')) {
    return 'https://images.unsplash.com/photo-1627916607164-7b20241db935?w=800&q=80';
  }
  if (id.includes('erciyes') || name.includes('erciyes')) {
    return 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80';
  }
  if (id.includes('nemrut') || name.includes('nemrut')) {
    return 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80';
  }
  if (id.includes('kackar') || name.includes('kaçkar')) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';
  }
  if (name.includes('pamukkale') || name.includes('traverten') || name.includes('salda')) {
    return 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80';
  }
  if (name.includes('kapadokya') || name.includes('peri bacaları')) {
    return 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=800&q=80';
  }
  if (name.includes('van gölü') || name.includes('van')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80';
  }
  if (name.includes('istanbul') || name.includes('boğaz') || name.includes('çanakkale')) {
    return 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80';
  }
  if (type === 'mountain' || name.includes('dağ') || name.includes('volkan')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80';
  }
  if (type === 'river' || name.includes('nehir') || name.includes('ırmak') || name.includes('çayı')) {
    return 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80';
  }
  if (type === 'lake' || name.includes('göl')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80';
  }
  if (type === 'pass' || name.includes('geçit') || name.includes('bel')) {
    return 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80';
  }
  if (type === 'border_gate' || name.includes('kapı') || name.includes('sınır')) {
    return 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=800&q=80';
  }
  if (type === 'mine' || name.includes('maden') || name.includes('yatak')) {
    return 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&q=80';
  }
  if (type === 'plateau' || type === 'plain' || name.includes('ova') || name.includes('plato')) {
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80';
  }
  if (type === 'province' || name.includes('il')) {
    return 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80';
}

