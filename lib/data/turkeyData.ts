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
  {
    id: 'r-kizilirmak',
    name: 'Kızılırmak',
    type: 'river',
    category: 'Açık Havza Akarsu',
    coordinates: [36.002, 41.597],
    region: 'Karadeniz',
    description: 'Türkiye sınırları içerisinde doğup yine Türkiye denizlerine dökülen EN UZUN nehirdir (1.355 km).',
    kpssTips: [
      'Sivas İmranlı\'dan doğar, Karadeniz\'e döküldüğü yerde Bafra Delta Ovası\'nı oluşturur.',
      'Üzerinde Hirfanlı, Kesikköprü, Altınkaya, Deriner gibi büyük barajlar yer alır.',
      'Tuz Çölü yakınlarından geçtiği için suyu yer yer tuzludur.'
    ],
    details: {
      lengthKm: 1355,
      originMouth: 'Sivas Kızıldağ -> Bafra (Karadeniz)',
      dams: ['Altınkaya', 'Deriner', 'Hirfanlı', 'Kesikköprü', 'Kapulukaya']
    }
  },
  {
    id: 'r-yesilirmak',
    name: 'Yeşilırmak',
    type: 'river',
    category: 'Açık Havza Akarsu',
    coordinates: [36.628, 41.385],
    region: 'Karadeniz',
    description: 'Sivas Kösedağ\'dan doğup Çarşamba Ovası\'nı oluşturan akarsu.',
    kpssTips: [
      'Çarşamba Delta Ovası\'nı denizi doldurarak oluşturmuştur.',
      'Erozyon taşıma kapasitesi çok yüksektir.',
      'Barajları: Hasan Uğurlu, Suat Uğurlu, Almus, Kılıçkaya.'
    ],
    details: {
      lengthKm: 519,
      originMouth: 'Sivas -> Çarşamba (Karadeniz)',
      dams: ['Hasan Uğurlu', 'Suat Uğurlu', 'Almus', 'Kılıçkaya']
    }
  },
  {
    id: 'r-sakarya',
    name: 'Sakarya Nehir',
    type: 'river',
    category: 'Çok Bölgeli Akarsu',
    coordinates: [30.655, 41.130],
    region: 'Marmara',
    description: 'Eskişehir, Ankara, Bilecik, Sakarya illerinden geçerek Karadeniz\'e dökülen 4 farklı bölgeden geçen nehir.',
    kpssTips: [
      'İç Anadolu, Ege, Karadeniz ve Marmara olmak üzere 4 coğrafi bölgeden su toplar.',
      'Karasu\'da Karadeniz\'e dökülür. Kirliliği yüksek akarsularımızdandır.'
    ],
    details: {
      lengthKm: 824,
      dams: ['Yenice', 'Gökçekaya', 'Sarıyar (Hasan Polatkan)']
    }
  },
  {
    id: 'r-firat',
    name: 'Fırat Nehir',
    type: 'river',
    category: 'Sınır Aşan Akarsu (Uluslararası)',
    coordinates: [38.800, 37.150],
    region: 'Güneydoğu Anadolu',
    description: 'Türkiye\'nin debisi ve hidroelektrik potansiyeli en yüksek nehri (Karasu ve Murat kollarının birleşimi).',
    kpssTips: [
      'Türkiye\'nin en büyük hidroelektrik santralleri Fırat üzerindedir (Atatürk, Keban, Karakaya).',
      'Suriye ve Irak\'a geçerek Basra Körfezi\'ne dökülür (Sınır aşan akarsu).',
      'GAP projesinin ana su kaynağıdır.'
    ],
    details: {
      lengthKm: 2800,
      originMouth: 'Doğu Anadolu -> Suriye/Irak -> Basra Körfezi',
      dams: ['Atatürk Barajı (En Büyük)', 'Keban', 'Karakaya', 'Birecik', 'Karkamış']
    },
    mnemonic: 'K-K-A = Keban, Karakaya, Atatürk (Fırat Dev Dev Barajlar!)'
  },
  {
    id: 'r-dicle',
    name: 'Dicle Nehir',
    type: 'river',
    category: 'Sınır Aşan Akarsu',
    coordinates: [41.250, 37.100],
    region: 'Güneydoğu Anadolu',
    description: 'Hazar Gölü güneyinden doğup Irak\'ta Fırat ile birleşerek Şattülarap\'ı oluşturan akarsu.',
    kpssTips: [
      'Ilısu Barajı (Veysel Eroğlu) Dicle üzerindedir ve Hasankeyf antik kenti sular altında kalmıştır.',
      'Irak ile Türkiye arasında yer yer doğal sınır oluşturur.'
    ],
    details: {
      dams: ['Ilısu (Veysel Eroğlu)', 'Kralkızı', 'Dicle', 'Batman']
    }
  },
  {
    id: 'r-coruh',
    name: 'Çoruh Nehir',
    type: 'river',
    category: 'Sınır Aşan Akarsu / Rafting',
    coordinates: [41.550, 41.600],
    region: 'Karadeniz',
    description: 'Dünyanın en hızlı akan ve en derin vadilerinden geçen akarsularından biri. Gürcistan Batum\'dan Karadeniz\'e dökülür.',
    kpssTips: [
      'Türkiye\'nin akış hızı ve debi rejimi en yüksek rafting nehridir.',
      'Üzerinde Türkiye\'nin EN YÜKSEK BARAJI olan YUSUFELİ BARAJI (275 m) inşa edilmiştir!',
      'Deriner ve Borçka barajları da bu nehirdedir.'
    ],
    mnemonic: 'Çoruh = Derin Vadi + Yusufeli (En Yüksek Baraj) + Rafting'
  },
  {
    id: 'r-aras-kura',
    name: 'Aras ve Kura Nehirleri',
    type: 'river',
    category: 'Kapalı Havza Akarsu (Hazar Denizi)',
    coordinates: [43.800, 40.000],
    region: 'Doğu Anadolu',
    description: 'Erzurum ve Kars platolarından doğup Ermenistan/Azerbaycan sınırlarından geçerek Hazar Denizi\'ne dökülen nehirler.',
    kpssTips: [
      'Okyanuslara veya açık denizlere dökülmeyip HAZAR GÖLÜ (KAPALI HAVZA)\'ne dökülürler!',
      'Aras Nehri Türkiye - Ermenistan doğal sınırını oluşturur.'
    ]
  },
  {
    id: 'r-meric',
    name: 'Meriç Nehir',
    type: 'river',
    category: 'Sınır Oluşturan Akarsu',
    coordinates: [26.350, 41.200],
    region: 'Marmara',
    description: 'Bulgaristan\'dan doğup Türkiye - Yunanistan doğal sınırını çizerek Ege Denizi\'ne dökülen nehir.',
    kpssTips: [
      'Türkiye - Yunanistan kara sınırının büyük bölümünü oluşturur.',
      'Ergene nehri Meriç\'in en önemli koludur (Pirinç tarımı ve Ergene Ovası sulaması).'
    ]
  },
  {
    id: 'r-asi',
    name: 'Asi Nehri',
    type: 'river',
    category: 'Ters Akan Akarsu',
    coordinates: [35.950, 36.100],
    region: 'Akdeniz',
    description: 'Lübnan Bekaa Vadisi\'nden doğup Suriye\'den geçerek Hatay Samandağ\'dan Akdeniz\'e dökülen nehir.',
    kpssTips: [
      'Güneyden Kuzeye doğru akan TERS nehir olarak bilinir.',
      'Yurtdışından doğup Türkiye\'de denize dökülen akarsularımızdandır (Asi ve Meriç).'
    ]
  }
];

export const LAKES_DATA: GeoFeature[] = [
  {
    id: 'l-van',
    name: 'Van Gölü',
    type: 'lake',
    category: 'Karma Oluşumlu Göl (Tektonik + Volkanik Set)',
    coordinates: [42.900, 38.630],
    region: 'Doğu Anadolu',
    description: 'Türkiye\'nin EN BÜYÜK gölüdür (3.713 km²). Sodalı ve tuzlu suları vardır.',
    kpssTips: [
      'Türkiye\'nin en büyük gölüdür.',
      'Suları sodalıdır; dünyada sadece bu gölde yaşayan endemik İnci Kefali (Van Balığı) çıkar.',
      'Nemrut volkanından çıkan lavların önünü kesmesiyle Nemrut Volkanik Seti oluşmuştur.',
      'Üzerinde feribot taşımacılığı yapılır (Tatvan - Van tren feribotu).'
    ],
    mnemonic: 'Van = En Büyük Sodalı Göl + İnci Kefali + Feribot'
  },
  {
    id: 'l-tuz',
    name: 'Tuz Gölü',
    type: 'lake',
    category: 'Tektonik Göl',
    coordinates: [33.300, 38.750],
    region: 'İç Anadolu',
    description: 'Türkiye\'nin yüzölçümü bakımından 2. büyük gölü fakat derinliği en az (1-2 m) olan sığ tektonik göl.',
    kpssTips: [
      'Türkiye tuz ihtiyacının %60-70\'ini karşılar.',
      'Yazın buharlaşma ile yüzölçümü en çok küçülen göldür.',
      'Flamingo (Allıturna) kuşlarının Türkiye\'deki en büyük üreme alanıdır.'
    ]
  },
  {
    id: 'l-beysehir',
    name: 'Beyşehir Gölü',
    type: 'lake',
    category: 'Tektonik - Karstik Tatlısu Gölü',
    coordinates: [31.500, 37.750],
    region: 'İç Anadolu',
    description: 'Türkiye\'nin EN BÜYÜK TATLISU GÖLÜDÜR.',
    kpssTips: [
      'Türkiye\'nin 3. büyük gölü ve 1. büyük tatlısu gölüdür.',
      'Göl ayağı (düden/gideğeni) olduğu için suları tatlıdır ve içme suyu kaynağıdır.'
    ],
    mnemonic: 'BEYŞEHİR = Türkiye\'nin En Büyük TATLI Su Gölü!'
  },
  {
    id: 'l-egirdir',
    name: 'Eğirdir Gölü',
    type: 'lake',
    category: 'Karstik - Tektonik Göl',
    coordinates: [30.880, 37.950],
    region: 'Akdeniz',
    description: 'Isparta ilinde yer alan Türkiye\'nin 2. büyük tatlısu gölü.',
    kpssTips: [
      'Suları tatlıdır. Göller Yöresi\'nin önemli doğal mirasıdır.'
    ]
  },
  {
    id: 'l-salda',
    name: 'Salda Gölü',
    type: 'lake',
    category: 'Karstik - Tektonik Göl / Mars Benzeri',
    coordinates: [29.680, 37.550],
    region: 'Akdeniz',
    description: 'Burdur Yeşilova\'da yer alan beyaz kumsalları ve turkuaz tonlarıyla "Türkiye\'nin Maldivleri" denilen göl.',
    kpssTips: [
      'Magnezyum minerali zenginliği nedeniyle Mars\'ın Jezero kraterine benzerlik gösterir.',
      'Türkiye\'nin en derin 2. gölüdür (184 m).'
    ],
    mnemonic: 'Salda = Maldivler + Mars Jezero Krateri İkizi'
  },
  {
    id: 'l-iznik',
    name: 'İznik Gölü',
    type: 'lake',
    category: 'Tektonik Göl',
    coordinates: [29.500, 40.430],
    region: 'Marmara',
    description: 'Marmara Bölgesi\'nin en büyük tatlısu gölüdür.',
    kpssTips: [
      'Marmara Tektonik çöküntü oluğunda yer alır (İznik, Sapanca, Uluabat, Manyas sıralaması).'
    ],
    mnemonic: 'Marmara Tektonik Göller: İ-S-U-M (İznik, Sapanca, Uluabat, Manyas)'
  },
  {
    id: 'l-cildir',
    name: 'Çıldır Gölü',
    type: 'lake',
    category: 'Volkanik Set Gölü',
    coordinates: [43.250, 41.050],
    region: 'Doğu Anadolu',
    description: 'Kars ve Ardahan arasında yer alan, kışın tamamen donan volkanik set gölü.',
    kpssTips: [
      'Kışın yüzeyi tamamen buz tutar ve atlı kızak / Eskimo usulü balıkçılık yapılır.',
      'Doğu Anadolu\'nun 2. büyük gölüdür.'
    ]
  },
  {
    id: 'l-tortum-abant',
    name: 'Heyelan Set Gölleri (Tortum, Sera, Abant, Yedigöller, Borabay)',
    type: 'lake',
    category: 'Heyelan Set Gölü',
    coordinates: [41.650, 40.640],
    region: 'Karadeniz',
    description: 'Karadeniz heyelanlarının dik vadileri kapatmasıyla oluşan göller grubu.',
    kpssTips: [
      'Karadeniz Bölgesi heyelan riski en yüksek bölgedir.',
      'Heyelan set gölleri kodlaması: T-O-R-T-U-M, A-B-A-N-T, S-E-R-A, Y-E-D-İ-G-Ö-L-L-E-R, Z-İ-N-A-V, B-O-R-A-B-A-Y.'
    ],
    mnemonic: 'Heyelan Gölleri = S-A-T-O-B-Y (Sera, Abant, Tortum, Özenç, Borabay, Yedigöller)'
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
  {
    id: 'mn-demir-divrigi',
    name: 'Sivas Divriği & Malatya Hekimhan Demir Yatakları',
    type: 'mine',
    category: 'Demir Madeni',
    coordinates: [38.120, 39.370],
    region: 'Doğu Anadolu',
    description: 'Türkiye demir rezervinin %80\'ini karşılayan dev maden alanı.',
    kpssTips: [
      'İşlendiği yerler: Karabük ve Ereğli Demir-Çelik fabrikaları (Kömüre/Enerjiye yakınlık) ile İskenderun (Ulaşım/Liman).'
    ]
  },
  {
    id: 'mn-bakir-murgul',
    name: 'Artvin Murgul, Kastamonu Küre & Elazığ Maden Bakır Tesisleri',
    type: 'mine',
    category: 'Bakır Madeni',
    coordinates: [41.570, 41.280],
    region: 'Karadeniz',
    description: 'Türkiye\'nin en önemli bakır çıkarım ve işleme sahaları.',
    kpssTips: [
      'Samsun Bakır İşletmesi hammadde çıkarılmadığı halde LİMAN/ULAŞIM avantajı ile kurulmuştur!'
    ],
    mnemonic: 'Bakır Çıkarılan Yerler KADER (Küre, Artvin, Diyarbakır, Elazığ, Rize)'
  },
  {
    id: 'mn-bor-balikesir',
    name: 'Balıkesir Bigadiç, Eskişehir Seyitgazi, Kütahya Emet Bor Yatakları',
    type: 'mine',
    category: 'Bor Mineralleri',
    coordinates: [28.120, 39.400],
    region: 'Marmara',
    description: 'Dünya bor rezervinin yaklaşık %73\'üne sahip olan stratejik madenimiz.',
    kpssTips: [
      'Bandırma ve Kırka\'da işleme tesisleri bulunur.',
      'Jet/roket yakıtı, cam, seramik, deterjan sanayiinde kullanılır.'
    ]
  },
  {
    id: 'mn-kron-fethiye',
    name: 'Muğla Fethiye-Dalaman & Elazığ Guleman Krom Yatakları',
    type: 'mine',
    category: 'Krom Madeni',
    coordinates: [29.110, 36.620],
    region: 'Ege',
    description: 'Paslanmaz çelik yapımında kullanılan ve ihracatta önemli payı olan maden.',
    kpssTips: [
      'Elazığ Ferrokrom ve Antalya Ferrokrom tesislerinde işlenir.'
    ]
  },
  {
    id: 'mn-petrol-batman',
    name: 'Batman Raman & Garzan Petrol Sahası',
    type: 'mine',
    category: 'Petrol & Enerji',
    coordinates: [41.130, 37.880],
    region: 'Güneydoğu Anadolu',
    description: 'Türkiye\'de ilk petrolün çıkarıldığı (1940 Raman Dağı) bölge.',
    kpssTips: [
      'Yerli üretim tüketimimizin yaklaşık %10-12\'sini karşılar.',
      'Batman Rafinerisi hammaddeye yakın kurulmuştur.'
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
