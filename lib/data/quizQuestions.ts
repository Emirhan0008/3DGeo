import { ALL_GEO_FEATURES } from './turkeyData';

export interface PinGameQuestion {
  id: string;
  title: string;
  questionText: string;
  category: 'Dağlar' | 'Akarsular' | 'Göller' | 'Sınır Kapıları' | 'Geçitler' | 'Platolar & Ovalar' | 'Madenler' | 'Karstik & Kıyı';
  region?: 'Marmara' | 'Ege' | 'Akdeniz' | 'İç Anadolu' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu' | 'Genel' | string;
  targetFeatureId: string;
  targetCoords: [number, number]; // [lng, lat]
  hint: string;
  explanation: string;
  kpssTip: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  category: string;
  region?: 'Marmara' | 'Ege' | 'Akdeniz' | 'İç Anadolu' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu' | 'Genel' | string;
  questionText: string;
  options: string[];
  correctIndex: number;
  focusFeatureId?: string;
  targetCoords?: [number, number];
  explanation: string;
  osymTip: string;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getFilteredPinQuestions(category: string, shuffle: boolean = false): PinGameQuestion[] {
  let list = PIN_GAME_QUESTIONS;
  if (category && category !== 'Genel') {
    list = PIN_GAME_QUESTIONS.filter((q) => q.category === category || q.category.includes(category));
  }
  return shuffle ? shuffleArray(list) : list;
}

export function getFilteredQuizQuestions(category: string, shuffle: boolean = false): MultipleChoiceQuestion[] {
  let list = MULTIPLE_CHOICE_QUESTIONS;
  if (category && category !== 'Genel') {
    list = MULTIPLE_CHOICE_QUESTIONS.filter((q) => q.category === category || q.category.includes(category));
  }
  return shuffle ? shuffleArray(list) : list;
}

export function getCurrentPinQuestion(pinGameIndex: number, category: string, customList?: PinGameQuestion[]): PinGameQuestion | undefined {
  const list = customList && customList.length > 0 ? customList : getFilteredPinQuestions(category);
  if (!list.length) return PIN_GAME_QUESTIONS[0];
  const safeIndex = pinGameIndex % list.length;
  return list[safeIndex];
}

export function getCurrentQuizQuestion(quizTestIndex: number, category: string, customList?: MultipleChoiceQuestion[]): MultipleChoiceQuestion | undefined {
  const list = customList && customList.length > 0 ? customList : getFilteredQuizQuestions(category);
  if (!list.length) return MULTIPLE_CHOICE_QUESTIONS[0];
  const safeIndex = quizTestIndex % list.length;
  return list[safeIndex];
}

export function cleanFeatureTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/\s*\((?!.*\d+\s*m)[^)]*\)/gi, '')
    .trim();
}

const TURKEY_PROVINCES_AND_DISTRICTS = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Afyon', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan',
  'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
  'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ',
  'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta',
  'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli',
  'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla',
  'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop',
  'Sivas', 'Şanlıurfa', 'Urfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van',
  'Yalova', 'Yozgat', 'Zonguldak',
  'Silopi', 'Susurluk', 'Emet', 'Kırka', 'Bigadiç', 'Mustafakemalpaşa', 'Fethiye', 'Bodrum', 'Kaş',
  'Çarşamba', 'Bafra', 'Anamur', 'Alanya', 'Manavgat', 'Ceyhan', 'Seyhan', 'Elbistan', 'Afşin', 'Hamitabat', 'Çatalağzı'
];

export function sanitizeQuestionText(text: string): string {
  if (!text) return '';
  let clean = text;

  // 1. Remove parenthetical city references e.g. "(Kayseri)", "(Güneydoğu)"
  clean = clean.replace(/\s*\([A-ZÇĞİÖŞÜa-zçğıöşü\s\-,]+\)/g, (match) => {
    const lower = match.toLowerCase();
    if (TURKEY_PROVINCES_AND_DISTRICTS.some(c => lower.includes(c.toLowerCase()))) {
      return '';
    }
    return match;
  });

  // 2. Remove "X ilinde", "X ve Y illeri sınırında", "X ilçesinde", etc.
  TURKEY_PROVINCES_AND_DISTRICTS.forEach(city => {
    const regex1 = new RegExp(`\\b${city}\\s+(ve\\s+[A-ZÇĞİÖŞÜa-zçğıöşü]+\\s+)?(illeri\\s+sınırında|ilinde|ilçesinde|ili\\s+sınırlarında|illerinde|arasında|sınırları\\s+içerisinde|sınırında|ilindedir|sınırındadır)\\b`, 'gi');
    clean = clean.replace(regex1, 'bu bölgemizde');

    const regex2 = new RegExp(`\\b${city}'[daeıkunüveöşz\\s]+\\b`, 'gi');
    clean = clean.replace(regex2, 'ilgili yörede ');

    const regexDirect = new RegExp(`\\b${city}\\b`, 'gi');
    clean = clean.replace(regexDirect, 'ilgili yöre');
  });

  return clean.replace(/\s+/g, ' ').trim();
}

const HANDCRAFTED_PIN_QUESTIONS: PinGameQuestion[] = [
  // 1. DAĞLAR (Volkanik, Kırık, Kıvrım, Buzul)
  {
    id: 'pin-1',
    title: 'Ağrı Dağı (5.137 m)',
    questionText: 'Türkiye\'nin ve Avrupa\'nın en yüksek zirvesi olan ve üzerinde Takke Buzulu barındıran sönmüş stratovolkan Ağrı Dağı nerededir?',
    category: 'Dağlar',
    region: 'Doğu Anadolu',
    targetFeatureId: 'm-agri',
    targetCoords: [44.298, 39.702],
    hint: 'Doğu Anadolu\'nun en doğusunda, Iğdır ve Ağrı illeri sınırındadır.',
    explanation: 'Ağrı Dağı (5.137 m) Türkiye\'nin en yüksek noktasıdır. Üzerinde aktif Takke Buzulu bulunur.',
    kpssTip: 'KPSS Notu: Türkiye\'nin en yüksek noktasıdır ve sönmüş bir stratovolkandır.'
  },
  {
    id: 'pin-2',
    title: 'Erciyes Dağı (3.917 m)',
    questionText: 'Kapadokya peri bacalarının oluşumunda çıkardığı tüflerle rol oynayan İç Anadolu\'nun en yüksek volkanı Erciyes nerededir?',
    category: 'Dağlar',
    region: 'İç Anadolu',
    targetFeatureId: 'm-erciyes',
    targetCoords: [35.448, 38.531],
    hint: 'Kayseri il sınırları içerisindedir.',
    explanation: 'Erciyes Dağı (3.917 m) İç Anadolu\'nun en yüksek zirvesidir ve kış turizm merkezidir.',
    kpssTip: 'KPSS Notu: Kapadokya tüflerinin kaynağıdır ve üzerinde buzul kalıntıları bulunur.'
  },
  {
    id: 'pin-3',
    title: 'Hasan Dağı (3.268 m)',
    questionText: 'Aksaray ve Niğde arasında yükselen, Çatalhöyük duvar resimlerinde patlaması resmedilen volkanik dağımız nerededir?',
    category: 'Dağlar',
    region: 'İç Anadolu',
    targetFeatureId: 'm-hasan',
    targetCoords: [34.164, 38.127],
    hint: 'Tuz Gölü\'nün güneydoğusunda Aksaray ilindedir.',
    explanation: 'Hasan Dağı (3.268 m) İç Anadolu volkanik kuşağının önemli bir stratovolkanıdır.',
    kpssTip: 'KPSS Notu: Aksaray-Niğde hattındaki genç volkanik kütledir.'
  },
  {
    id: 'pin-4',
    title: 'Karacadağ Volkanı (Güneydoğu)',
    questionText: 'Güneydoğu Anadolu\'da akıcı lavların yayılmasıyla oluşan Türkiye\'nin tek "Kalkan Tipi" yayvan volkan dağı nerededir?',
    category: 'Dağlar',
    region: 'Güneydoğu Anadolu',
    targetFeatureId: 'm-karacadag-gap',
    targetCoords: [39.833, 37.667],
    hint: 'Şanlıurfa ve Diyarbakır arasındadır.',
    explanation: 'Karacadağ, cıvık bazaltik lavların yayılmasıyla oluşan kalkansı volkandır.',
    kpssTip: 'KPSS Notu: Akıcı lavları sayesinde eğimi az, kubbe şeklinde kalkan tipi tek volkanımızdır.'
  },
  {
    id: 'pin-5',
    title: 'Kula Volkanik Jeoparkı',
    questionText: 'Türkiye\'nin en genç volkanik konilerine sahip "Yanık Ülke" olarak bilinen UNESCO tescilli tek Küresel Jeoparkı nerededir?',
    category: 'Dağlar',
    region: 'Ege',
    targetFeatureId: 'm-kula',
    targetCoords: [28.647, 38.544],
    hint: 'Ege Bölgesi\'nde Manisa ili sınırları içerisindedir.',
    explanation: 'Kula Volkanları, Türkiye\'nin en genç volkan konileri ve lav akıntılarına ev sahipliği yapar.',
    kpssTip: 'KPSS Notu: Türkiye\'nin ilk ve tek UNESCO tescilli Küresel Jeopark alanıdır.'
  },
  {
    id: 'pin-6',
    title: 'Kaz Dağları (İda)',
    questionText: 'Ege Bölgesi\'nin en kuzeyinde yer alan, Oksijen oranı en yüksek ve kıyıya dik uzanan faylanmış kırık dağı (Horst) nerededir?',
    category: 'Dağlar',
    region: 'Ege',
    targetFeatureId: 'm-kazdaglari',
    targetCoords: [26.852, 39.704],
    hint: 'Çanakkale ile Balıkesir Edremit Körfezi kuzeyindedir.',
    explanation: 'Kaz Dağları, Biga Yarımadası güneyinde yer alan önemli bir Horst (Kırık) dağıdır.',
    kpssTip: 'KPSS Notu: Kaz, Madra, Yunt, Bozdağlar, Aydın ve Menteşe Ege\'nin kırık (Horst) dağlarıdır.'
  },
  {
    id: 'pin-7',
    title: 'Menteşe Dağları',
    questionText: 'Ege Bölgesi\'nde diğer kırık dağların aksine kıyıya PARALEL uzandığı için bol yağış alan ve engebeli olan Horst kütlesi nerededir?',
    category: 'Dağlar',
    region: 'Ege',
    targetFeatureId: 'm-mentese',
    targetCoords: [28.283, 37.311],
    hint: 'Muğla il sınırları içerisindedir.',
    explanation: 'Menteşe Dağları kıyıya paralel uzandığı için Ege\'nin en çok yağış alan ve engebeli yöresidir.',
    kpssTip: 'KPSS Notu: Kıyıya paralel uzandığından Ege\'de nüfusu seyrek ve engebeli tek Menteşe Yöresidir.'
  },
  {
    id: 'pin-8',
    title: 'Kaçkar Dağları (3.937 m)',
    questionText: 'Doğu Karadeniz\'de kıyıya paralel uzanan, sirk gölleri ve aktüel buzullarıyla tanınan en yüksek kıvrım dağ dizisi nerededir?',
    category: 'Dağlar',
    region: 'Karadeniz',
    targetFeatureId: 'm-kackar',
    targetCoords: [41.159, 40.842],
    hint: 'Rize ve Artvin illeri güneyindedir.',
    explanation: 'Kaçkar Dağları (3.937 m) Karadeniz Bölgesi\'nin en yüksek zirvesidir ve buzul topoğrafyasına sahiptir.',
    kpssTip: 'KPSS Notu: Doğu Karadeniz sıradağlarının en yüksek zirvesidir.'
  },
  {
    id: 'pin-9',
    title: 'Cilo (Sat) Dağları (3.950 m)',
    questionText: 'Türkiye\'nin ikinci en yüksek zirvesi (Uludoruk) ve en büyük vadi buzulunu barındıran Güneydoğu Toroslar uzantısı nerededir?',
    category: 'Dağlar',
    region: 'Doğu Anadolu',
    targetFeatureId: 'm-cilo-sat',
    targetCoords: [44.000, 37.500],
    hint: 'Hakkari ili sınırları içerisindedir.',
    explanation: 'Cilo (Buzul) Dağı üzerindeki Uludoruk (3.950 m) Türkiye\'nin 2. yüksek tepesidir ve en uzun vadi buzuluna sahiptir.',
    kpssTip: 'KPSS Notu: Türkiye\'nin en büyük aktif örtü/vadi buzulu Cilo Dağları\'ndadır.'
  },
  {
    id: 'pin-10',
    title: 'Uludağ (2.543 m)',
    questionText: 'Marmara Bölgesi\'nin en yüksek noktası olan, Derinlerde soğuyan mağmanın (Batolit İç Püskürük) aşınmayla yüzeye çıkmasıyla oluşan dağ nerededir?',
    category: 'Dağlar',
    region: 'Marmara',
    targetFeatureId: 'm-uludag',
    targetCoords: [29.131, 40.069],
    hint: 'Bursa ili sınırlarındadır.',
    explanation: 'Uludağ bir Batolit (İç Püskürük) kütlesidir. Sönmüş volkan değil, iç püskürük kubbedir.',
    kpssTip: 'KPSS Notu: Uludağ bir volkan konisi DEĞİLDİR, Derinlik Volkanizması (Batolit) kütlesidir.'
  },

  // 2. AKARSULAR
  {
    id: 'pin-11',
    title: 'Fırat Nehri & Atatürk Barajı',
    questionText: 'Türkiye\'nin su debisi ve hidroelektrik potansiyeli en yüksek nehri olan, Atatürk Barajı\'nı besleyen akarsuyu haritada bulun.',
    category: 'Akarsular',
    region: 'Güneydoğu Anadolu',
    targetFeatureId: 'r-firat',
    targetCoords: [38.800, 37.150],
    hint: 'Erzincan ve Elazığ\'dan doğup Güneydoğu\'dan Basra Körfezi\'ne akar.',
    explanation: 'Fırat Nehri, Keban, Karakaya ve Atatürk Barajları ile Türkiye elektriğinin kalbidir.',
    kpssTip: 'KPSS Notu: Türkiye sınırları dışına dökülen (Basra Körfezi) en uzun ve debisi yüksek nehir.'
  },
  {
    id: 'pin-12',
    title: 'Kızılırmak Nehri',
    questionText: 'Sivas\'tan doğup tamamen Türkiye sınırları içinde akarak Bafra Delta Ovası\'nı oluşturan en uzun iç akarsuyumuz nerededir?',
    category: 'Akarsular',
    region: 'Karadeniz',
    targetFeatureId: 'r-kizilirmak',
    targetCoords: [35.900, 41.200],
    hint: 'Sivas, Kayseri, Nevşehir, Kırıkkale ve Samsun üzerinden Karadeniz\'e dökülür.',
    explanation: 'Kızılırmak (1.355 km), kaynak ve ağız kısımları tamamen Türkiye\'de olan en uzun nehirdir.',
    kpssTip: 'KPSS Notu: Tamamı sınırımızda kalan en uzun nehirdir ve Bafra Deltası\'nı kurar.'
  },
  {
    id: 'pin-13',
    title: 'Çoruh Nehri',
    questionText: 'Türkiye\'nin en hızlı akan, su sporu (rafting) potansiyeli en yüksek ve Yusufeli Barajı\'na ev sahipliği yapan nehri nerededir?',
    category: 'Akarsular',
    region: 'Karadeniz',
    targetFeatureId: 'r-coruh',
    targetCoords: [41.600, 41.150],
    hint: 'Bayburt ve Artvin\'den geçip Gürcistan (Batum)\'dan Karadeniz\'e dökülür.',
    explanation: 'Çoruh Nehri debisi ve akış hızı en yüksek akarsularımızdandır.',
    kpssTip: 'KPSS Notu: Sınır ötesine (Gürcistan) dökülür ve Deriner ile Yusufeli Barajı buradadır.'
  },
  {
    id: 'pin-14',
    title: 'Meriç Nehri',
    questionText: 'Bulgaristan\'dan doğup Türkiye-Yunanistan doğal sınırını çizen ve Ergene koluyla Pirinç tarlalarını sulayan akarsu nerededir?',
    category: 'Akarsular',
    region: 'Marmara',
    targetFeatureId: 'r-meric',
    targetCoords: [26.550, 41.200],
    hint: 'Edirne sınırında akıp Ege Denizi Saros Körfezi\'ne dökülür.',
    explanation: 'Meriç nehri Yunanistan ile doğal sınırımızı oluşturur.',
    kpssTip: 'KPSS Notu: Yurt dışından doğup sınırımızda Ege\'ye dökülür. Sınır çizen nehirlerimizdendir.'
  },
  {
    id: 'pin-15',
    title: 'Asi Nehri',
    questionText: 'Lübnan Bekaa Vadisi\'nden doğup Suriye\'den geçerek Hatay\'dan Akdeniz\'e dökülen "Ters Akan Nehir" nerededir?',
    category: 'Akarsular',
    region: 'Akdeniz',
    targetFeatureId: 'r-asi',
    targetCoords: [36.000, 36.100],
    hint: 'Hatay ilimiz sınırları içindedir.',
    explanation: 'Asi nehri güneyden kuzeye doğru aktığı için ters akan nehir olarak bilinir.',
    kpssTip: 'KPSS Notu: Yurtdışından doğup Hatay\'dan Akdeniz\'e dökülen sınır ötesi akarsumuzdur.'
  },

  // 3. GÖLLER
  {
    id: 'pin-16',
    title: 'Van Gölü (Sodalı Göl)',
    questionText: 'Nemrut volkanik set oluşumuyla meydana gelen, sodalı sulara sahip Türkiye\'nin en büyük gölü nerededir?',
    category: 'Göller',
    region: 'Doğu Anadolu',
    targetFeatureId: 'l-van',
    targetCoords: [42.900, 38.630],
    hint: 'Tatvan ve Van ili arasındadır.',
    explanation: 'Van Gölü, Karma oluşumlu (Tektonik + Volkanik Set) sodalı göldür. İnci Kefali yaşar.',
    kpssTip: 'KPSS Notu: Türkiye\'nin en büyük gölüdür ve üzerinde feribot taşımacılığı yapılır.'
  },
  {
    id: 'pin-17',
    title: 'Tuz Gölü (Sığ Tektonik)',
    questionText: 'Yazın buharlaşmayla alanı daralan, Türkiye\'nin tuz ihtiyacının %60\'ını karşılayan sığ tektonik göl nerededir?',
    category: 'Göller',
    region: 'İç Anadolu',
    targetFeatureId: 'l-tuz',
    targetCoords: [33.500, 38.750],
    hint: 'Ankara, Konya ve Aksaray illerinin kesişimindedir.',
    explanation: 'Tuz Gölü, tektonik çanağa sahip derinliği az sığ bir göldür.',
    kpssTip: 'KPSS Notu: Türkiye\'nin en sığ ve tuzluluk oranı yüksek 2. büyük gölüdür.'
  },
  {
    id: 'pin-18',
    title: 'Beyşehir Gölü',
    questionText: 'Türkiye\'nin en büyük TATLI SU gölü olan ve Milli Park statüsündeki karstik-tektonik tatlı su havzası nerededir?',
    category: 'Göller',
    region: 'İç Anadolu',
    targetFeatureId: 'l-beysehir',
    targetCoords: [31.500, 37.700],
    hint: 'Konya ile Isparta arasındadır.',
    explanation: 'Beyşehir Gölü, gideğeni (göl ayağı) olduğu için suları tatlı olan en büyük tatlı su gölümüzdür.',
    kpssTip: 'KPSS Notu: Türkiye\'nin 1. büyük tatlı su gölüdür. Suları tatlıdır çünkü gideğeni vardır.'
  },
  {
    id: 'pin-19',
    title: 'Salda Gölü (Türkiye\'nin Maldivleri)',
    questionText: 'Magnezyum zengini beyaz kumsalları ve Mars yüzeyine benzeyen stromatolit yapılarıyla ünlü derin karstik göl nerededir?',
    category: 'Göller',
    region: 'Akdeniz',
    targetFeatureId: 'l-salda',
    targetCoords: [29.680, 37.550],
    hint: 'Burdur Yeşilova ilçesindedir.',
    explanation: 'Salda Gölü, Türkiye\'nin en temiz ve derin karstik göllerindendir.',
    kpssTip: 'KPSS Notu: Tektonik-karstik oluşumludur ve Mars yüzey araştırmalarında referans alınır.'
  },
  {
    id: 'pin-20',
    title: 'Bafa (Çamiçi) Gölü',
    questionText: 'Eski bir deniz koyu iken Büyük Menderes\'in taşıdığı alüvyonlarla önünün kapanması sonucu oluşan Alüvyal Set gölü nerededir?',
    category: 'Göller',
    region: 'Ege',
    targetFeatureId: 'l-bafa',
    targetCoords: [27.520, 37.500],
    hint: 'Aydın ile Muğla sınırında Latmos (Beşparmak) dağları dibindedir.',
    explanation: 'Bafa Gölü, alüvyal setleşme ile denizden kopan bir Kıyı Seti / Alüvyal Set gölüdür.',
    kpssTip: 'KPSS Notu: Büyük Menderes\'in tıkadığı alüvyal set gölüdür.'
  },

  // 4. DELTA VE TEKTONİK OVALAR / PLATOLAR
  {
    id: 'pin-21',
    title: 'Çukurova Delta Ovası',
    questionText: 'Seyhan ve Ceyhan nehirlerinin taşıdığı alüvyonlarla oluşan Türkiye\'nin en büyük delta ovası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-cukurova',
    targetCoords: [35.300, 36.850],
    hint: 'Adana ili merkezli Doğu Akdeniz kıyısındadır.',
    explanation: 'Çukurova, Akdeniz Bölgesi\'nin ve Türkiye\'nin en geniş alüvyal delta ovasıdır.',
    kpssTip: 'KPSS Notu: Yılda birden fazla ürün alınan en büyük alüvyal delta ovasıdır.'
  },
  {
    id: 'pin-22',
    title: 'TAKKEM Karstik Ovaları (Polye)',
    questionText: 'Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı ve Muğla ovalarından oluşan kireçtaşı erime polye sahası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-takkee',
    targetCoords: [29.800, 37.100],
    hint: 'Teke Yöresi ve Göller Yöresi çevresindedir.',
    explanation: 'TAKKEM şifresiyle bilinen kireçtaşı erimesiyle oluşan karstik polye ovalarıdır.',
    kpssTip: 'KPSS Notu: Şifre: TAKKEM (Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla).'
  },
  {
    id: 'pin-23',
    title: 'Bafra ve Çarşamba Deltaları',
    questionText: 'Kızılırmak ve Yeşilırmak nehirlerinin Karadeniz kıyısında oluşturduğu verimli delta ovaları nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Karadeniz',
    targetFeatureId: 'pl-bafra-carsamba',
    targetCoords: [36.200, 41.450],
    hint: 'Samsun ili sahillerindedir.',
    explanation: 'Bafra (Kızılırmak) ve Çarşamba (Yeşilırmak) Karadeniz\'in iki dev delta ovasıdır.',
    kpssTip: 'KPSS Notu: Karadeniz\'in en büyük iki alüvyal birikim deltasıdır.'
  },
  {
    id: 'pin-24',
    title: 'Erzurum-Kars Volkanik Platosu',
    questionText: 'Lav örtüsüyle kaplı, yaz yağışlarıyla Çayır bitkisi ve Çernozyom (Kara Toprak) barındıran en yüksek plato nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Doğu Anadolu',
    targetFeatureId: 'pl-erzurum-kars',
    targetCoords: [42.000, 40.500],
    hint: 'Doğu Anadolu\'nun kuzeydoğu ucundadır.',
    explanation: 'Erzurum-Kars Platosu, lav örtüsü platosudur. Büyükbaş hayvancılık yaygındır.',
    kpssTip: 'KPSS Notu: Volkanik plato, Çernozyom toprak ve büyükbaş mera hayvancılığı ilintilidir.'
  },
  {
    id: 'pin-25',
    title: 'Teke ve Taşeli Platoları',
    questionText: 'Kireçtaşı (Kalker) yapılı, engebeli ve nüfus yoğunluğunun son derece az olduğu karstik platolar nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-teke-taseli',
    targetCoords: [32.300, 36.600],
    hint: 'Antalya ve Mersin kıyı arkası platolarıdır.',
    explanation: 'Teke ve Taşeli platoları karstik erimeli yapıları nedeniyle tarıma elverişsiz ve seyrek nüfusludur.',
    kpssTip: 'KPSS Notu: Kıl keçisi yetiştiriciliği ve karstik yapısıyla tanınır.'
  },
  {
    id: 'pin-26',
    title: 'Çatalca - Kocaeli Platosu',
    questionText: 'Türkiye\'nin yükseltisi en az olan, aşınım düzlüğü niteliğinde Sanayi ve Nüfusun en yoğun olduğu plato nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Marmara',
    targetFeatureId: 'pl-catalca-kocaeli',
    targetCoords: [29.200, 41.000],
    hint: 'İstanbul ve Kocaeli il sınırları kapsar.',
    explanation: 'Çatalca-Kocaeli Platosu Aşınım Platosudur ve Türkiye ekonomisinin merkezidir.',
    kpssTip: 'KPSS Notu: En alçak, en gelişmiş ve nüfusu en yoğun olan platodur.'
  },

  // 5. SINIR KAPILARI
  {
    id: 'pin-27',
    title: 'Kapıkule Sınır Kapısı',
    questionText: 'Bulgaristan\'a açılan, hem karayolu hem demiryolu bağlantısı olan Türkiye ve Avrupa\'nın en işlek sınır kapısı nerededir?',
    category: 'Sınır Kapıları',
    region: 'Marmara',
    targetFeatureId: 'bg-kapikule',
    targetCoords: [26.351, 41.717],
    hint: 'Edirne ili sınırındadır.',
    explanation: 'Kapıkule, araç ve yolcu geçişinde Türkiye\'nin 1 numaralı sınır kapısıdır.',
    kpssTip: 'KPSS Notu: Bulgaristan sınırında yer alır ve demiryolu geçişi mevcuttur.'
  },
  {
    id: 'pin-28',
    title: 'Habur Sınır Kapısı',
    questionText: 'Irak ile ticaretimizin ana arteri olan, Güneydoğu Anadolu\'nun en yüksek işlem hacmine sahip gümrük kapısı nerededir?',
    category: 'Sınır Kapıları',
    region: 'Güneydoğu Anadolu',
    targetFeatureId: 'bg-habur',
    targetCoords: [42.617, 37.150],
    hint: 'Şırnak Silopi ilçesindedir.',
    explanation: 'Habur Sınır Kapısı Irak ile olan en büyük kara ticareti kapımızdır.',
    kpssTip: 'KPSS Notu: Irak kapısıdır. Ortadoğu kara ticaretinin ana kapısıdır.'
  },
  {
    id: 'pin-29',
    title: 'Sarp Sınır Kapısı',
    questionText: 'Gürcistan\'a açılan, Karadeniz sahil yolunun bitiminde pasaportsuz kimlikle geçiş yapılabilen sınır kapısı nerededir?',
    category: 'Sınır Kapıları',
    region: 'Karadeniz',
    targetFeatureId: 'bg-sarp',
    targetCoords: [41.551, 41.520],
    hint: 'Artvin Hopa/Hopa sınırındadır.',
    explanation: 'Sarp Sınır Kapısı Gürcistan ve Kafkaslar\'a açılan stratejik sınır geçişidir.',
    kpssTip: 'KPSS Notu: Gürcistan\'a açılır, kimlikle geçiş imkanı vardır.'
  },
  {
    id: 'pin-30',
    title: 'Gürbulak Sınır Kapısı',
    questionText: 'İran ile olan en eski ve en büyük sınır kapımız, Doğu Anadolu transit ticaret kapısı nerededir?',
    category: 'Sınır Kapıları',
    region: 'Doğu Anadolu',
    targetFeatureId: 'bg-gurbulak',
    targetCoords: [44.380, 39.380],
    hint: 'Ağrı Doğubayazıt ilçesindedir.',
    explanation: 'Gürbulak, İran sınırındaki en işlek karayolu gümrük noktasıdır.',
    kpssTip: 'KPSS Notu: İran ile transit ticaretin kalbidir.'
  },
  {
    id: 'pin-31',
    title: 'Dilucu Sınır Kapısı',
    questionText: 'Türkiye\'nin Azerbaycan (Nahçıvan Özerk Cumhuriyeti) ile doğrudan bağlantısını sağlayan tek sınır kapısı nerededir?',
    category: 'Sınır Kapıları',
    region: 'Doğu Anadolu',
    targetFeatureId: 'bg-dilucu',
    targetCoords: [44.800, 39.780],
    hint: 'Iğdır ili sınırındadır.',
    explanation: 'Dilucu Kapısı, Nahçıvan ve Türk Dünyası\'na açılan kara kapımızdır.',
    kpssTip: 'KPSS Notu: Nahçıvan (Azerbaycan) ile olan TEK sınır kapımızdır.'
  },

  // 6. GEÇİTLER
  {
    id: 'pin-32',
    title: 'Zigana Geçidi & Tüneli',
    questionText: 'Trabzon\'u Gümüşhane\'ye bağlayan ve Avrupa\'nın en uzun çift tüplü karayolu tüneline (14.5 km) sahip geçit nerededir?',
    category: 'Geçitler',
    region: 'Karadeniz',
    targetFeatureId: 'p-zigana',
    targetCoords: [39.400, 40.630],
    hint: 'Doğu Karadeniz sıradağları üzerindedir.',
    explanation: 'Yeni Zigana Tüneli 14.5 km uzunluğu ile Avrupa\'nın en uzun çift tüplü tünelidir.',
    kpssTip: 'KPSS Notu: Trabzon\'u iç kesimlere bağlar.'
  },
  {
    id: 'pin-33',
    title: 'Gülek Boğazı',
    questionText: 'İç Anadolu\'yu (Niğde/Adana) Çukurova\'ya ve Akdeniz limanlarına bağlayan Toroslar üzerindeki tarihi boğaz nerededir?',
    category: 'Geçitler',
    region: 'Akdeniz',
    targetFeatureId: 'p-gulek',
    targetCoords: [34.780, 37.260],
    hint: 'Pozantı Adana karayolu üzerindedir.',
    explanation: 'Gülek Boğazı, Toroslar\'ı aşarak Çukurova\'ya inen ana geçittir.',
    kpssTip: 'KPSS Notu: Akdeniz\'i İç Anadolu\'ya bağlayan en stratejik geçittir.'
  },
  {
    id: 'pin-34',
    title: 'Kop Geçidi',
    questionText: 'Gümüşhane\'yi Bayburt üzerinden Erzurum\'a bağlayan Doğu Karadeniz - Doğu Anadolu geçidi nerededir?',
    category: 'Geçitler',
    region: 'Doğu Anadolu',
    targetFeatureId: 'p-kop',
    targetCoords: [40.500, 40.030],
    hint: 'Bayburt - Erzurum il sınırındadır.',
    explanation: 'Kop Geçidi sert kış şartlarıyla tanınır.',
    kpssTip: 'KPSS Notu: Doğu Karadeniz\'i Doğu Anadolu\'ya bağlayan kritik geçittir.'
  },
  {
    id: 'pin-35',
    title: 'Sertavul Geçidi',
    questionText: 'İç Anadolu\'yu (Karaman) Göksu vadisi üzerinden Akdeniz\'e (Mersin Silifke) bağlayan geçit nerededir?',
    category: 'Geçitler',
    region: 'Akdeniz',
    targetFeatureId: 'p-sertavul',
    targetCoords: [33.280, 36.910],
    hint: 'Karaman ile Mersin Mut ilçesi arasındadır.',
    explanation: 'Sertavul Geçidi Orta Toroslar üzerinde ulaşımı sağlar.',
    kpssTip: 'KPSS Notu: Karaman - Mersin hattındaki geçittir.'
  },
  {
    id: 'pin-36',
    title: 'Belen Geçidi',
    questionText: 'İskenderun Limanı ve sanayi bölgesini Amik Ovası ile Antakya\'ya bağlayan Nur (Amanos) Dağları geçidi nerededir?',
    category: 'Geçitler',
    region: 'Akdeniz',
    targetFeatureId: 'p-belen',
    targetCoords: [36.200, 36.500],
    hint: 'Hatay İskenderun ile Antakya arasındadır.',
    explanation: 'Belen Geçidi Amanos Dağları\'nı aşan ana ulaşım yoludur.',
    kpssTip: 'KPSS Notu: İskenderun Limanı hinterlandını genişletir.'
  },

  // 7. MADENLER VE ENERJİ SANAYİSİ
  {
    id: 'pin-37',
    title: 'Divriği Demir Madeni',
    questionText: 'Türkiye demir rezervinin %80\'ini karşılayan ve Karabük/Ereğli demir-çelik fabrikalarını besleyen maden sahası nerededir?',
    category: 'Madenler',
    region: 'İç Anadolu',
    targetFeatureId: 'mn-demir-divrigi',
    targetCoords: [38.110, 39.370],
    hint: 'Sivas ili Divriği ilçesindedir.',
    explanation: 'Sivas Divriği, Türkiye\'nin en zengin demir yatağıdır.',
    kpssTip: 'KPSS Notu: Türkiye demir üretiminin kalbidir.'
  },
  {
    id: 'pin-38',
    title: 'Afşin-Elbistan Linyit Sahası',
    questionText: 'Türkiye\'nin en büyük linyit rezervine ev sahipliği yapan ve dev termik santrallere yakıt sağlayan yer nerededir?',
    category: 'Madenler',
    region: 'Akdeniz',
    targetFeatureId: 'mn-linyit-elbistan',
    targetCoords: [37.200, 38.350],
    hint: 'Kahramanmaraş ilindedir.',
    explanation: 'Afşin-Elbistan linyit havzası elektrik üretiminde devasa paya sahiptir.',
    kpssTip: 'KPSS Notu: En büyük linyit rezervimiz Kahramanmaraş Elbistan\'dadır.'
  },
  {
    id: 'pin-39',
    title: 'Seydişehir Boksit (Alüminyum)',
    questionText: 'Türkiye\'nin tek entegre Alüminyum (Boksit) tesisinin bulunduğu tesis ve maden sahası nerededir?',
    category: 'Madenler',
    region: 'İç Anadolu',
    targetFeatureId: 'mn-boksit-seydisehir',
    targetCoords: [31.850, 37.420],
    hint: 'Konya ili Seydişehir ilçesindedir.',
    explanation: 'Seydişehir Alüminyum Tesisleri boksit madenini işleyen tek entegre tesistir.',
    kpssTip: 'KPSS Notu: Boksit madeni ve Alüminyum işleme tesisi denince Konya Seydişehir bilinmelidir.'
  },
  {
    id: 'pin-40',
    title: 'Batman Petrol Sahası',
    questionText: '1940\'ta Raman Dağı\'nda bulunan Türkiye\'nin ilk ticari ham petrol kuyusu ve rafinerisi nerededir?',
    category: 'Madenler',
    region: 'Güneydoğu Anadolu',
    targetFeatureId: 'mn-petrol-batman',
    targetCoords: [41.130, 37.880],
    hint: 'Güneydoğu Anadolu Bölgesi Batman ilindedir.',
    explanation: 'Raman Dağı Türkiye petrol çıkarımının sembolüdür.',
    kpssTip: 'KPSS Notu: Türkiye\'de çıkarılan yerli petrolün merkezi Batman Raman ve Garzan\'dır.'
  },
  {
    id: 'pin-41',
    title: 'Murgul Bakır Madeni',
    questionText: 'Kastamonu Küre ve Elazığ Maden ile birlikte Türkiye bakır çıkarımının önemli merkezi olan Artvin ilçesi nerededir?',
    category: 'Madenler',
    region: 'Karadeniz',
    targetFeatureId: 'mn-bakir-murgul',
    targetCoords: [41.600, 41.280],
    hint: 'Artvin ili sınırları içerisindedir.',
    explanation: 'Artvin Murgul bakır maden ve işletmeleriyle tanınır.',
    kpssTip: 'KPSS Notu: Bakır madeni şifresi: Kader (Kastamonu, Artvin Murgul, Diyarbakır, Elazığ, Rize).'
  },
  {
    id: 'pin-42',
    title: 'Zonguldak Taşkömürü Havzası',
    questionText: 'Türkiye\'nin I. Jeolojik Zamandan (Paleozoik) kalma tek yüksek kalori değerine sahip Taşkömürü havzası nerededir?',
    category: 'Madenler',
    region: 'Karadeniz',
    targetFeatureId: 'mn-taskomuru-zonguldak',
    targetCoords: [31.790, 41.450],
    hint: 'Batı Karadeniz Zonguldak ve Ereğli çevresindedir.',
    explanation: 'Taşkömürü yüksek ısı enerjisiyle demir-çelik sanayisinde eritici olarak kullanılır.',
    kpssTip: 'KPSS Notu: I. Jeolojik zaman oluşumudur. Demir-Çelik fabrikalarının (Kardemir/Erdemir) kuruluş sebebidir.'
  },

  // 8. KARSTİK VE KIYI ŞEKİLLERİ
  {
    id: 'pin-43',
    title: 'Pamukkale Travertenleri',
    questionText: 'Kalsiyum karbonatlı termal suların çökelmesiyle oluşan dünyaca ünlü UNESCO Dünya Mirası karstik birikim sahası nerededir?',
    category: 'Karstik & Kıyı',
    region: 'Ege',
    targetFeatureId: 'kf-pamukkale',
    targetCoords: [29.120, 37.920],
    hint: 'Denizli ilimizdedir.',
    explanation: 'Pamukkale Travertenleri kalsiyum bikarbonatlı sıcak suların çökelmesiyle oluşur.',
    kpssTip: 'KPSS Notu: Karstik birikim şeklidir.'
  },
  {
    id: 'pin-44',
    title: 'Cennet-Cehennem Obrukları',
    questionText: 'Yeraltı mağara tavanlarının çökmesiyle oluşan devasa karstik çöküntü obrukları nerededir?',
    category: 'Karstik & Kıyı',
    region: 'Akdeniz',
    targetFeatureId: 'kf-cennet-cehennem',
    targetCoords: [34.110, 36.450],
    hint: 'Mersin Silifke ilçesindedir.',
    explanation: 'Cennet ve Cehennem Obrukları karstik çöküntü çukurlarıdır.',
    kpssTip: 'KPSS Notu: Karstik çökme obruklarının en belirgin örneğidir.'
  },
  {
    id: 'pin-45',
    title: 'Kapıdağ Yarımadası (Tombolo)',
    questionText: 'Eski bir adanın dalga biriktirmesiyle karaya bağlanması (Saplı Ada / Tombolo) sonucu oluşan yarımada nerededir?',
    category: 'Karstik & Kıyı',
    region: 'Marmara',
    targetFeatureId: 'cf-kapidag',
    targetCoords: [27.800, 40.450],
    hint: 'Balıkesir Erdek sahilindedir.',
    explanation: 'Kapıdağ Yarımadası, dalga biriktirmesi kıyı okunun adayı bağladığı Tombolo örneğidir.',
    kpssTip: 'KPSS Notu: Türkiye\'nin en tipik Tombolo (Saplı Ada) örneğidir.'
  },
  {
    id: 'pin-46',
    title: 'Sinop İnceburun (Tombolo)',
    questionText: 'Türkiye\'nin en kuzey noktası olan ve ada ile karanın saplı adaya dönüşmesiyle oluşan tombolo yapısı nerededir?',
    category: 'Karstik & Kıyı',
    region: 'Karadeniz',
    targetFeatureId: 'cf-sinop-inceburun',
    targetCoords: [35.000, 42.100],
    hint: 'Sinop ili yarımada ucundadır.',
    explanation: 'Sinop İnceburun, hem tombolo oluşumudur hem de ülkemizin en kuzey ucudur.',
    kpssTip: 'KPSS Notu: 42° Kuzey Paraleli Türkiye\'nin en kuzey noktasıdır.'
  },
  {
    id: 'pin-47',
    title: 'Gediz Menemen Deltası',
    questionText: 'İzmir Körfezi dolmasın diye yatağı değiştirilen ve verimli alüvyonlarıyla Ege tarımına yön veren delta nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Ege',
    targetFeatureId: 'pl-cukurova',
    targetCoords: [27.050, 38.600],
    hint: 'İzmir ili Menemen ilçesi sahilindedir.',
    explanation: 'Gediz nehri taşıdığı alüvyonlarla Menemen Delta Ovası\'nı oluşturmuştur.',
    kpssTip: 'KPSS Notu: Gediz Nehri İzmir Körfezi dolmasın diye Osmanlı döneminde kanalize edilmiştir.'
  },
  {
    id: 'pin-48',
    title: 'Kula Volkanik Konileri',
    questionText: 'Manisa ili sınırları içerisinde yer alan genelde cüruf konilerinden oluşan en genç volkanik kütle sahası nerededir?',
    category: 'Dağlar',
    region: 'Ege',
    targetFeatureId: 'm-kula',
    targetCoords: [28.647, 38.544],
    hint: 'Manisa Kula ilçesindedir.',
    explanation: 'Kula volkanları dördüncü zaman (Kuvaterner) oluşumlu genç konilerdir.',
    kpssTip: 'KPSS Notu: En genç volkan sahamızdır.'
  },
  {
    id: 'pin-49',
    title: 'Samanlı Dağları',
    questionText: 'Kocaeli Yarımadası güneyinde Yalova ve Bursa sınırlarında KAF fay kuşağı paralelinde uzanan kıvrım kütlesi nerededir?',
    category: 'Dağlar',
    region: 'Marmara',
    targetFeatureId: 'm-samanli',
    targetCoords: [29.600, 40.600],
    hint: 'Yalova-Kocaeli sınırındadır.',
    explanation: 'Samanlı dağları Marmara iç kıvrım kuşağıdır.',
    kpssTip: 'KPSS Notu: Marmara Güney kıyılarındaki orta yükseltili kütledir.'
  },
  {
    id: 'pin-50',
    title: 'Sarayköy Jeotermal Enerji Santrali',
    questionText: 'Türkiye\'nin ilk jeotermal elektrik üretim santralinin (Kızıldere) kurulduğu fay hattı sıcak su sahası nerededir?',
    category: 'Madenler',
    region: 'Ege',
    targetFeatureId: 'mn-jeotermal-saraykoy',
    targetCoords: [28.920, 37.910],
    hint: 'Denizli Sarayköy ilçesindedir.',
    explanation: 'Denizli Sarayköy Kızıldere Türkiye\'nin ilk jeotermal santralidir.',
    kpssTip: 'KPSS Notu: Jeotermal elektrik üretiminde ilk ve lider bölgemiz Ege (Denizli/Aydın)\'dir.'
  }
];

function mapTypeToPinCategory(type: string, categoryName?: string): PinGameQuestion['category'] {
  if (type === 'mountain') return 'Dağlar';
  if (type === 'river') return 'Akarsular';
  if (type === 'lake') return 'Göller';
  if (type === 'border_gate') return 'Sınır Kapıları';
  if (type === 'pass') return 'Geçitler';
  if (type === 'plateau' || type === 'plain') return 'Platolar & Ovalar';
  if (type === 'mine') return 'Madenler';
  if (type === 'karstic' || type === 'coastal') return 'Karstik & Kıyı';

  if (categoryName) {
    if (categoryName.includes('Dağ') || categoryName.includes('Volkan')) return 'Dağlar';
    if (categoryName.includes('Akarsu') || categoryName.includes('Nehir')) return 'Akarsular';
    if (categoryName.includes('Göl')) return 'Göller';
    if (categoryName.includes('Sınır') || categoryName.includes('Kapı')) return 'Sınır Kapıları';
    if (categoryName.includes('Geçit') || categoryName.includes('Tünel')) return 'Geçitler';
    if (categoryName.includes('Ova') || categoryName.includes('Plato')) return 'Platolar & Ovalar';
    if (categoryName.includes('Maden') || categoryName.includes('Enerji') || categoryName.includes('Petrol')) return 'Madenler';
  }
  return 'Platolar & Ovalar';
}

const coveredFeatureIds = new Set(HANDCRAFTED_PIN_QUESTIONS.map((q) => q.targetFeatureId));

const DYNAMIC_PIN_QUESTIONS: PinGameQuestion[] = ALL_GEO_FEATURES
  .filter((f) => !coveredFeatureIds.has(f.id))
  .map((f, index) => {
    let qText = '';
    const cleanDesc = f.description ? sanitizeQuestionText(f.description) : '';

    if (cleanDesc && cleanDesc.length > 10) {
      qText = `${cleanDesc} Bu coğrafi unsur haritada nerededir?`;
    } else if (f.type === 'border_gate') {
      qText = `Sınır kapılarımızdan biri olan ${f.name} haritada nerededir?`;
    } else if (f.type === 'pass') {
      qText = `Geçit ve tünellerimizden biri olan ${f.name} haritada nerededir?`;
    } else if (f.type === 'mountain') {
      qText = `Türkiye'nin önemli dağlarından ${f.name} haritada nerededir?`;
    } else if (f.type === 'river') {
      qText = `Türkiye'nin önemli akarsularından biri olan ${f.name} haritada nerededir?`;
    } else if (f.type === 'lake') {
      qText = `Türkiye'nin önemli göllerinden biri olan ${f.name} haritada nerededir?`;
    } else if (f.type === 'plateau' || f.type === 'plain') {
      qText = `Türkiye'nin önemli yer şekillerinden ${f.name} haritada nerededir?`;
    } else if (f.type === 'mine') {
      qText = `Türkiye'nin önemli maden / enerji alanlarından ${f.name} haritada nerededir?`;
    } else {
      qText = `${f.region ? f.region + ' bölgesindeki' : 'Türkiye\'deki'} ${f.name} haritada nerededir?`;
    }

    return {
      id: `pin-auto-${f.id}-${index}`,
      title: f.name,
      questionText: qText,
      category: mapTypeToPinCategory(f.type, f.category),
      region: f.region,
      targetFeatureId: f.id,
      targetCoords: f.coordinates,
      hint: f.kpssTips?.[0] ? sanitizeQuestionText(f.kpssTips[0]) : `${f.region || 'Türkiye'} bölgesinde yer alır.`,
      explanation: `${f.name}: ${f.description || (f.category || 'Coğrafi unsur')}`,
      kpssTip: f.kpssTips?.[0] ? `KPSS Notu: ${f.kpssTips[0]}` : `ÖSYM Konumu: ${f.name} - ${f.region || 'Türkiye'}`
    };
  });

export const PIN_GAME_QUESTIONS: PinGameQuestion[] = [
  ...HANDCRAFTED_PIN_QUESTIONS,
  ...DYNAMIC_PIN_QUESTIONS
];

export const MULTIPLE_CHOICE_QUESTIONS: MultipleChoiceQuestion[] = [
  {
    id: 'mc-1',
    category: 'Dağlar',
    region: 'Ege',
    questionText: 'Aşağıda verilen Ege Bölgesi dağlarından hangisi oluşum yönüyle diğerlerinden farklıdır (Kırık Dağ DEĞİLDİR)?',
    options: ['Kaz Dağları', 'Madra Dağı', 'Kula Volkanları', 'Bozdağlar', 'Aydın Dağları'],
    correctIndex: 2,
    targetCoords: [28.647, 38.544],
    explanation: 'Kula kütlesi Volkanik kökenlidir. Kaz, Madra, Bozdağlar ve Aydın dağları ise Faylanma (Kırık - Horst) sonucu oluşmuştur.',
    osymTip: 'Ege Dağları kodlaması: KazMA Yutmuş Boz Ayı Menteşede. (Hepsi kırık, sadece Kula volkaniktir).'
  },
  {
    id: 'mc-2',
    category: 'Göller',
    region: 'Doğu Anadolu',
    questionText: 'Nemrut Volkanından çıkan lavların Van havzasının önünü kapatmasıyla oluşan Van Gölü hangi göl sınıfına girer?',
    options: ['Karstik Göl', 'Volkanik Set Gölü', 'Tektonik Göl', 'Kıyı Set Gölü', 'Buzul Gölü'],
    correctIndex: 1,
    targetCoords: [42.900, 38.630],
    explanation: 'Van Gölü, Nemrut volkanik lavlarının tıkanmasıyla oluşan Volkanik Set gölüdür.',
    osymTip: 'Volkanik Set Gölleri Şifresi: ERÇEK\'li NAZİK HAFİK\'le ÇILDIRıp VAN GÖLÜ\'ne DÜŞTÜ.'
  },
  {
    id: 'mc-3',
    category: 'Platolar',
    region: 'Akdeniz',
    questionText: 'Teke ve Taşeli Platolarının en belirgin ortak özelliği aşağıdakilerden hangisidir?',
    options: ['Volkanik tüflerle kaplı olmaları', 'Karstik yapıya sahip olmaları', 'Aşınım düzlüğü olmaları', 'Yoğun sanayi bölgesi olmaları', 'Türkiye\'nin en alçak platoları olmaları'],
    correctIndex: 1,
    targetCoords: [32.300, 36.600],
    explanation: 'Teke ve Taşeli platoları kireçtaşı (Kalker) kökenli Karstik Platolardır.',
    osymTip: 'Teke ve Taşeli karstiktir, tarım zordur, nüfus seyrektir, Kıl Keçisi yaygındır.'
  },
  {
    id: 'mc-4',
    category: 'Sınır Kapıları',
    region: 'Marmara',
    questionText: 'Türkiye\'nin Bulgaristan ile olan ve aktif DEMİRYOLU hattına sahip ana sınır kapısı hangisidir?',
    options: ['Hamzabeyli', 'Kapıkule', 'İpsala', 'Sarp', 'Gürbulak'],
    correctIndex: 1,
    targetCoords: [26.351, 41.717],
    explanation: 'Kapıkule Sınır Kapısı Bulgaristan\'a açılır ve aktif demiryolu gümrük hattına sahiptir.',
    osymTip: 'Edirne Kapıkule hem karayolu hem demiryolu bağlantılı en işlek kapımızdır.'
  },
  {
    id: 'mc-5',
    category: 'Geçitler',
    region: 'Akdeniz',
    questionText: 'İç Anadolu Bölgesi\'ni Niğde-Pozantı üzerinden Çukurova ve Mersin Limanı\'na bağlayan Toros geçidi hangisidir?',
    options: ['Zigana Geçidi', 'Kop Geçidi', 'Gülek Boğazı', 'Belen Geçidi', 'Sertavul Geçidi'],
    correctIndex: 2,
    targetCoords: [34.780, 37.260],
    explanation: 'Gülek Boğazı, Toroslar üzerinden Adana Çukurova\'ya geçiş sağlayan en kritik doğal geçittir.',
    osymTip: 'Gülek Boğazı Akdeniz\'in en işlek boğaz geçididir.'
  },
  {
    id: 'mc-6',
    category: 'Madenler',
    region: 'İç Anadolu',
    questionText: 'Türkiye demir rezervlerinin büyük bölümünü karşılayan Divriği demir madenleri hangi ilimiz sınırları içindedir?',
    options: ['Sivas', 'Malatya', 'Kayseri', 'Elazığ', 'Erzincan'],
    correctIndex: 0,
    targetCoords: [38.110, 39.370],
    explanation: 'Sivas Divriği Türkiye\'nin en zengin demir yataklarına ev sahipliği yapar.',
    osymTip: 'Sivas Divriği ve Malatya Hekimhan/Hasançelebi demir rezervinde ilk sıradadır.'
  },
  {
    id: 'mc-7',
    category: 'Akarsular',
    region: 'Karadeniz',
    questionText: 'Sivas\'tan doğup Kızılırmak gibi Karadeniz\'e dökülen ve Bafra Deltasını oluşturan nehir hangisidir?',
    options: ['Yeşilırmak', 'Kızılırmak', 'Çoruh', 'Sakarya', 'Bartın'],
    correctIndex: 1,
    targetCoords: [35.900, 41.200],
    explanation: 'Kızılırmak Sivas İmranlı\'dan doğar ve Samsun Bafra Ovası\'nı kurar.',
    osymTip: 'Tamamı Türkiye sınırında olan en uzun nehir Kızılırmak\'tır.'
  },
  {
    id: 'mc-8',
    category: 'Dağlar',
    region: 'Marmara',
    questionText: 'Marmara Bölgesi\'nin en yüksek noktası Uludağ oluşum türü bakımından aşağıdakilerden hangisidir?',
    options: ['Volkanik Stratovolkan', 'Batolit (İç Püskürük Kütle)', 'Kırık (Horst) Dağı', 'Karstik Kütle', 'Kıyı Deltası'],
    correctIndex: 1,
    targetCoords: [29.131, 40.069],
    explanation: 'Uludağ iç magmanın derinlerde soğuması ve üstteki örtünün aşınmasıyla çıkan Batolit kütledir.',
    osymTip: 'Uludağ sönmüş bir volkan konisi DEĞİLDİR, Batolit Derinlik Volkanizması örneğidir.'
  },
  {
    id: 'mc-9',
    category: 'Karstik Şekiller',
    region: 'Ege',
    questionText: 'Sularındaki kalsiyum bikarbonatın çökelmesiyle oluşan Pamukkale Travertenleri hangi ilimizdedir?',
    options: ['Muğla', 'Denizli', 'Aydın', 'Burdur', 'Afyonkarahisar'],
    correctIndex: 1,
    targetCoords: [29.120, 37.920],
    explanation: 'Pamukkale Travertenleri Denizli ilinde yer alan karstik birikim şeklidir.',
    osymTip: 'Traverten karstik BİRİKİM, düden ve polye karstik AŞINIM şeklidir.'
  },
  {
    id: 'mc-10',
    category: 'Ovalar',
    region: 'Akdeniz',
    questionText: 'Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı ve Muğla ovaları hangi ova türüne girmektedir?',
    options: ['Delta Ovası', 'Tektonik Ova', 'Karstik Ova (Polye)', 'Volkanik Lavan Ovası', 'Alüvyal Tabanlı Ova'],
    correctIndex: 2,
    targetCoords: [29.800, 37.100],
    explanation: 'TAKKEM şifresiyle hatırlanan bu ovalar Kireçtaşı erimesiyle oluşan Karstik Polye ovalarıdır.',
    osymTip: 'TAKKEM = Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla (Karstik ovalar).'
  },
  {
    id: 'mc-11',
    category: 'Madenler',
    region: 'Karadeniz',
    questionText: 'Türkiye\'de I. Jeolojik Zamandan (Paleozoik) kalan tek yüksek kalorili Taşkömürü havzası nerededir?',
    options: ['Soma', 'Zonguldak', 'Elbistan', 'Yatağan', 'Sarayköy'],
    correctIndex: 1,
    targetCoords: [31.790, 41.450],
    explanation: 'Zonguldak taşkömürü havzası I. Zamana ait tek kömür havzamızdır.',
    osymTip: 'Linyit III. Zaman, Taşkömürü I. Zaman oluşumudur.'
  },
  {
    id: 'mc-12',
    category: 'Sınır Kapıları',
    region: 'Doğu Anadolu',
    questionText: 'Türkiye\'nin Azerbaycan\'a bağlı Nahçıvan Özerk Cumhuriyeti ile olan TEK sınır kapısı hangisidir?',
    options: ['Gürbulak', 'Sarp', 'Dilucu', 'Alican', 'Esendere'],
    correctIndex: 2,
    targetCoords: [44.800, 39.780],
    explanation: 'Dilucu Sınır Kapısı Iğdır\'da bulunur ve Nahçıvan ile tek sınır kapımızdır.',
    osymTip: 'Dilucu = Nahçıvan (Azerbaycan) bağlantısı.'
  },
  {
    id: 'mc-13',
    category: 'Kıyı Şekilleri',
    region: 'Marmara',
    questionText: 'Dalga biriktirmesi sonucu adanın karaya bağlanmasıyla oluşan (Tombolo / Saplı Ada) Kapıdağ Yarımadası hangi ilimizdedir?',
    options: ['Çanakkale', 'Balıkesir', 'Bursa', 'Tekirdağ', 'İstanbul'],
    correctIndex: 1,
    targetCoords: [27.800, 40.450],
    explanation: 'Balıkesir Erdek sınırlarında yer alan Kapıdağ Yarımadası Türkiye\'nin en net Tombolo örneğidir.',
    osymTip: 'Kapıdağ ve Sinop İnceburun Türkiye\'nin iki ana Tombolo örneğidir.'
  },
  {
    id: 'mc-14',
    category: 'Geçitler',
    region: 'Karadeniz',
    questionText: 'Trabzon\'u Gümüşhane\'ye bağlayan ve Avrupa\'nın en uzun çift tüp karayolu tüneline ev sahipliği yapan geçit hangisidir?',
    options: ['Zigana', 'Kop', 'Ecevit', 'Ovit', 'Ilgaz'],
    correctIndex: 0,
    targetCoords: [39.400, 40.630],
    explanation: 'Yeni Zigana Tüneli (14.5 km) Trabzon - Gümüşhane hattındadır.',
    osymTip: 'Zigana Karadeniz iç hat ticaret yolunun kalbidir.'
  },
  {
    id: 'mc-15',
    category: 'Madenler',
    region: 'Güneydoğu Anadolu',
    questionText: 'Türkiye\'de yerli ham petrol çıkarımının başladığı Raman ve Garzan sahaları hangi ilimiz sınırları içindedir?',
    options: ['Adıyaman', 'Şanlıurfa', 'Batman', 'Diyarbakır', 'Siirt'],
    correctIndex: 2,
    targetCoords: [41.130, 37.880],
    explanation: '1940\'ta Batman Raman Dağı\'nda bulunan petrol Türkiye ham petrol çıkarımının simgesidir.',
    osymTip: 'Batman petrol çıkarımı ve işlemesi (Batman Rafinerisi) ile tanınır.'
  },
  {
    id: 'mc-16',
    category: 'Platolar',
    region: 'Doğu Anadolu',
    questionText: 'Erzurum-Kars Platosunda yaz yağışlarıyla yeşeren gür çayırların varlığı hangi hayvancılık türünü ön plana çıkarmıştır?',
    options: ['Kümes Hayvancılığı', 'Kıl Keçisi Yetiştiriciliği', 'Büyükbaş Mera Hayvancılığı', 'İpek Böcekçiliği', 'Arıcılık (Sadece)'],
    correctIndex: 2,
    targetCoords: [42.000, 40.500],
    explanation: 'Erzurum-Kars platosunda yaz yağışları çayırları büyütür, bu da Büyükbaş mera hayvancılığını geliştirir.',
    osymTip: 'Erzurum-Kars = Yaz yağışı + Çayır + Çernozyom toprak + Büyükbaş Mera.'
  },
  {
    id: 'mc-17',
    category: 'Akarsular',
    region: 'Güneydoğu Anadolu',
    questionText: 'Atatürk, Keban ve Karakaya barajlarının üzerinde kurulu olduğu su debisi en yüksek nehri hangisidir?',
    options: ['Dicle', 'Fırat', 'Aras', 'Kura', 'Seyhan'],
    correctIndex: 1,
    targetCoords: [38.800, 37.150],
    explanation: 'Fırat nehri elektrik üretim kapasitesi ve debisi en yüksek akarsuyumuzdur.',
    osymTip: 'GAP projesinin ana su kaynağı Fırat ve Dicle nehirleridir.'
  },
  {
    id: 'mc-18',
    category: 'Dağlar',
    region: 'Güneydoğu Anadolu',
    questionText: 'Güneydoğu Anadolu Bölgesi\'nde yer alan, akıcı bazaltik lavların yayılmasıyla oluşmuş yayvan Kalkan Volkanı hangisidir?',
    options: ['Karacadağ', 'Nemrut', 'Süphan', 'Tendürek', 'Erciyes'],
    correctIndex: 0,
    targetCoords: [39.833, 37.667],
    explanation: 'Güneydoğu Karacadağ cıvık bazaltik lavların geniş alana yayılmasıyla kalkan şeklini almıştır.',
    osymTip: 'Konya Karacadağ ile karıştırılmamalıdır. Şanlıurfa Karacadağ kalkan tipi tek volkandır.'
  },
  {
    id: 'mc-19',
    category: 'Göller',
    region: 'Akdeniz',
    questionText: 'Magnezyum zengini beyaz sahilleri nedeniyle "Türkiye\'nin Maldivleri" olarak anılan karstik derin göl hangisidir?',
    options: ['Eğirdir Gölü', 'Kovada Gölü', 'Salda Gölü', 'Sufla Gölü', 'Beyşehir Gölü'],
    correctIndex: 2,
    targetCoords: [29.680, 37.550],
    explanation: 'Burdur Yeşilova\'daki Salda Gölü karstik magnezyumlu mineral yapısıyla Maldivler\'e benzetilir.',
    osymTip: 'Salda Gölü karstik yapılı derin berrak gölümüzdür.'
  },
  {
    id: 'mc-20',
    category: 'Madenler',
    region: 'İç Anadolu',
    questionText: 'Türkiye\'nin tek entegre Alüminyum işleme tesisine sahip olan boksit çıkarım sahası hangisidir?',
    options: ['Seydişehir', 'Divriği', 'Murgul', 'Küre', 'Madenelez'],
    correctIndex: 0,
    targetCoords: [31.850, 37.420],
    explanation: 'Konya Seydişehir boksit çıkarımı ve alüminyum fabrikasına sahiptir.',
    osymTip: 'Alüminyum ham maddesi Boksit = Konya Seydişehir.'
  },
  // --- YENİ EKLENEN KAPSAMLI KPSS GEOMETRİ & YER ŞEKİLLERİ SORULARI ---
  {
    id: 'mc-21',
    category: 'Yer Şekilleri & Oluşum',
    region: 'Doğu Anadolu',
    questionText: 'Tarihi kayıtlara göre (1441-1443) Türkiye\'de en son patlayan sönmüş volkanik dağımız ve üzerinde dev kalderası bulunan kütle hangisidir?',
    options: ['Tendürek Dağı', 'Nemrut Dağı (Bitlis)', 'Süphan Dağı', 'Ağrı Dağı', 'Hasan Dağı'],
    correctIndex: 1,
    targetCoords: [42.235, 38.625],
    explanation: 'Bitlis\'teki Nemrut Dağı 1441-1443 patlamalarıyla ülkemizde en son aktif olan volkanımızdır ve üzerinde dev Nemrut Kalderası oluşmuştur.',
    osymTip: 'KPSS Notu: Türkiye\'nin en son patlayan volkanı Nemrut Kalderasıdır.'
  },
  {
    id: 'mc-22',
    category: 'İç Kuvvetler',
    region: 'Marmara',
    questionText: 'Uludağ oluşum bakımından orojenik bir kıvrım dağı olmasına rağmen ana kütlesi yer altında soğumuş hangi iç püskürük granit kütlesinden oluşur?',
    options: ['Batolit', 'Lokolit', 'Dayk', 'Sill', 'Kaldera'],
    correctIndex: 0,
    targetCoords: [29.130, 40.070],
    explanation: 'Uludağ derinlik volkanizması olan bir Batolit kütlesidir. Zamanla üstündeki örtü aşınarak yüzeye granit kütle olarak çıkmıştır.',
    osymTip: 'Uludağ patlayan bir volkan değildir; bir derinlik volkanizması (Batolit Granit) örneğidir.'
  },
  {
    id: 'mc-23',
    category: 'Dış Kuvvetler',
    region: 'İç Anadolu',
    questionText: 'Konya Karapınar çevresinde gaz patlaması sonucu oluşan ve "Dünyanın Nazar Boncuğu" olarak tescillenen volkanik şekil türü hangisidir?',
    options: ['Kaldera', 'Krater', 'Mağar (Meke Gölü)', 'Lapya', 'Polye'],
    correctIndex: 2,
    targetCoords: [33.633, 37.683],
    explanation: 'Meke Gölü gaz patlamasıyla oluşan bir Mağar çukurudur.',
    osymTip: 'Mağar = Gaz patlama çukuru. Örnek: Konya Meke Gölü.'
  },
  {
    id: 'mc-24',
    category: 'Kıyı Şekilleri',
    region: 'Akdeniz',
    questionText: 'Kıyıya paralel uzanan dağların vadilerinin deniz suları altında kalmasıyla oluşan, adacıklı yapısıyla bilinen Dalmatça Kıyı Tipi nerede görülür?',
    options: ['İstanbul Boğazı', 'Finike - Kaş Kıyıları', 'Gökova Körfezi', 'Sinop Kıyıları', 'Silifke Kıyıları'],
    correctIndex: 1,
    targetCoords: [29.640, 36.200],
    explanation: 'Türkiye\'de Dalmatça Kıyı Tipi sadece Antalya Kaş - Finike kıyılarında görülür.',
    osymTip: 'Kaş-Finike = Dalmatça Kıyı Tipi.'
  },
  {
    id: 'mc-25',
    category: 'Kıyı Şekilleri',
    region: 'Akdeniz',
    questionText: 'Karstik kanyon vadilerin deniz seviyesine kadar ulaşması sonucu oluşan ve Mersin Silifke kıyılarında tipik olan kıyı tipi hangisidir?',
    options: ['Kalanklı Kıyı Tipi', 'Riya Kıyı Tipi', 'Boyuna Kıyı Tipi', 'Skayer Kıyı Tipi', 'Fiyort Kıyı Tipi'],
    correctIndex: 0,
    targetCoords: [33.930, 36.370],
    explanation: 'Silifke-Mersin hattındaki kanyonlu karstik kıyılar Kalanklı kıyı tipi olarak adlandırılır.',
    osymTip: 'Mersin/Silifke = Kalanklı Kıyı Tipi.'
  },
  {
    id: 'mc-26',
    category: 'Jeolojik Zamanlar',
    region: 'Marmara',
    questionText: 'Egeit Karasının çökmesi, Ege Denizi ve Boğazların oluşması, 4 Denizimizin deniz niteliği kazanması hangi Jeolojik Zamanda gerçekleşmiştir?',
    options: ['I. Zaman (Paleozoik)', 'II. Zaman (Mezozoik)', 'III. Zaman (Tersiyer)', 'IV. Zaman (Kuaterner)', 'Prekambriyen'],
    correctIndex: 3,
    targetCoords: [29.000, 41.000],
    explanation: 'IV. Jeolojik Zaman (Kuaterner) "4 Deniz" zamanıdır: Ege, Marmara, Karadeniz ve Akdeniz bugünkü deniz görünümünü kazanmıştır.',
    osymTip: '4 Deniz ve İstanbul-Çanakkale Boğazları = IV. Jeolojik Zaman.'
  },
  {
    id: 'mc-27',
    category: 'Jeolojik Zamanlar',
    region: 'Marmara',
    questionText: 'Aşağıdakilerden hangisi I. Jeolojik Zamana (Paleozoik) ait sert, yaşlı, depozit taşımayan Masif Arazilerden biri DEĞİLDİR?',
    options: ['Yıldız (Istıranca) Masifi', 'Anamur - Taşeli Masifi', 'Bitlis - Mardin Masifi', 'Erciyes Volkanik Kütlesi', 'Büyük Menderes Masifi'],
    correctIndex: 3,
    targetCoords: [35.448, 38.531],
    explanation: 'Erciyes Dağı III. ve IV. Zamanda oluşmuş genç bir volkanik kütledir, I. Zaman Masifi değildir.',
    osymTip: 'Masifler I. Zaman eskisidir; deprem riski genel olarak azdır.'
  },
  {
    id: 'mc-28',
    category: 'Dağlar',
    region: 'Karadeniz',
    questionText: 'Karadeniz dağları arasında ortalama 1000m civarındaki düşük yükseltisi sebebiyle denizel iklimin iç kesimlere sızmasına engel OLAMAYAN dağımız hangisidir?',
    options: ['Kaçkar Dağları', 'Küre Dağları', 'Canik Dağları (Samsun)', 'Giresun Dağları', 'Ilgaz Dağları'],
    correctIndex: 2,
    targetCoords: [36.330, 41.280],
    explanation: 'Samsun arkasındaki Canik Dağları alçak olduğu için hem ulaşımı hem de denizel etkiyi engellemez. Arkasında Çarşamba deltası oluşmuştur.',
    osymTip: 'Canik Dağları alçaktır ("Nanik"), bu yüzden iklim içeri rahatça sızar.'
  },
  {
    id: 'mc-29',
    category: 'Karstik Şekiller',
    region: 'Akdeniz',
    questionText: 'Türkiye\'de 1965 yılında turizme açılan İLK karstik mağara aşağıdakilerden hangisidir?',
    options: ['Karain Mağarası', 'Damlataş Mağarası', 'İnsuyu Mağarası (Burdur)', 'Karaca Mağarası', 'Ballıca Mağarası'],
    correctIndex: 2,
    targetCoords: [30.370, 37.650],
    explanation: 'Burdur İnsuyu Mağarası Türkiye\'de turizme açılan ilk mağaradır.',
    osymTip: 'İlk turizme açılan mağara = Burdur İnsuyu.'
  },
  {
    id: 'mc-30',
    category: 'Ovalar',
    region: 'İç Anadolu',
    questionText: 'Kayseri Erciyes Dağı\'ndan çıkan lav ve tüflerin çukurluğu doldurmasıyla oluşan Volkanik Ova örneği hangisidir?',
    options: ['Bursa Ovası', 'Develi Ovası', 'Ergene Ovası', 'Muş Ovası', 'Konya Ovası'],
    correctIndex: 1,
    targetCoords: [35.480, 38.390],
    explanation: 'Kayseri Develi Ovası lav dolgulu tipik bir Volkanik Ova örneğidir.',
    osymTip: 'Volkanik Ova = Develi Ovası (Kayseri).'
  },
  {
    id: 'mc-31',
    category: 'Akarsu Şekilleri',
    region: 'Akdeniz',
    questionText: 'Basamaklı yamaç yapısıyla karstik ve volkanik arazilerde görülen Saklıkent, Ihlara ve Köprülü gibi vadiler hangi vadi tipine örnektir?',
    options: ['Çentik Vadi', 'Boğaz Vadi', 'Kanyon Vadi', 'Geniş Tabanlı Vadi', 'Taşkın Yatağı'],
    correctIndex: 2,
    targetCoords: [31.100, 37.100],
    explanation: 'Farklı dirençteki kayaçların aşınmasıyla oluşan basamaklı yapılar Kanyon Vadi olarak adlandırılır.',
    osymTip: 'Karstik basamaklı yamaç = Kanyon Vadi.'
  },
  {
    id: 'mc-32',
    category: 'Buzul Şekilleri',
    region: 'Marmara',
    questionText: 'Türkiye deniz seviyesinde (0 metrede) orta kuşakta yer aldığı için hiçbir zaman buzul etkisi görmemiştir. Marmara Bölgesi\'nde sadece hangi dağda buzul izlerine rastlanır?',
    options: ['Yıldız Dağları', 'Samanlı Dağları', 'Uludağ', 'Kaz Dağları', 'Bolu Dağları'],
    correctIndex: 2,
    targetCoords: [29.130, 40.070],
    explanation: 'Uludağ (2.543m) Marmara Bölgesi\'nde üzerinde buzul aşınım şekilleri (Aynalı, Kilimli, Karagöl) barındıran tek dağdır.',
    osymTip: 'Marmara\'da sadece Uludağ\'da yüksek kısımda buzul izi vardır.'
  },
  {
    id: 'mc-34',
    category: 'Madenler & Enerji',
    region: 'İç Anadolu',
    questionText: 'Türkiye\'de Linyit ile çalışan ve Türkiye\'nin en büyük termik santrallerinden biri olan santral hangisidir?',
    options: ['Afşin - Elbistan', 'Hamitabat', 'Çatalağzı', 'Ambarlı', 'Ovaakça'],
    correctIndex: 0,
    targetCoords: [36.910, 38.250],
    explanation: 'Maraş Afşin-Elbistan Santrali Linyit kömürü ile çalışan Türkiye\'nin en büyük termik santrallerindendir.',
    osymTip: 'Afşin-Elbistan = Linyit; Hamitabat = Doğalgaz; Çatalağzı = Taşkömürü.'
  },
  {
    id: 'mc-35',
    category: 'Sınır Kapıları',
    region: 'Güneydoğu Anadolu',
    questionText: 'Türkiye\'nin Irak ile tek kara sınırı olan ve ticaret hacmi son derece yüksek olan sınır kapısı hangisidir?',
    options: ['Habur Sınır Kapısı', 'Sarp Sınır Kapısı', 'Kapıkule Sınır Kapısı', 'İpsala Sınır Kapısı', 'Dilucu Sınır Kapısı'],
    correctIndex: 0,
    targetCoords: [42.365, 37.150],
    explanation: 'Şırnak Silopi\'de bulunan Habur Sınır Kapısı Türkiye\'nin Irak ile olan tek sınır kapısıdır.',
    osymTip: 'Irak = Habur Sınır Kapısı.'
  },
  {
    id: 'mc-36',
    category: 'Geçitler',
    region: 'Karadeniz',
    questionText: 'Trabzon ile Gümüşhane arasında yer alan ve Doğu Karadeniz\'i İç Anadolu\'ya bağlayan tarihi geçit hangisidir?',
    options: ['Zigana (Kalkanlı) Geçidi', 'Gülek Boğazı', 'Sertavul Geçidi', 'Belen Geçidi', 'Ecevit Geçidi'],
    correctIndex: 0,
    targetCoords: [39.380, 40.640],
    explanation: 'Zigana Geçidi Trabzon-Gümüşhane hattında yer alan tarihi İpek Yolu üzerindeki stratejik geçittir.',
    osymTip: 'Trabzon - Gümüşhane = Zigana Geçidi.'
  },
  {
    id: 'mc-37',
    category: 'Toprak Tipleri',
    region: 'Doğu Anadolu',
    questionText: 'Erzurum-Kars Platosu\'nda çayır bitki örtüsü altında oluşan, organik madde bakımından en zengin "Kara Toprak" türü hangisidir?',
    options: ['Çernozyom', 'Terra Rossa', 'Podzol', 'Rendzina', 'Laterit'],
    correctIndex: 0,
    targetCoords: [42.100, 40.200],
    explanation: 'Çernozyom yüksek nemli dağ çayırları altında oluşan dünyanın en verimli toprağıdır; fakat sert iklimden dolayı tarımsal verim az değerlendirilir.',
    osymTip: 'Erzurum-Kars + Dağ Çayırı = Çernozyom (Dünyanın en zengin humusu).'
  },
  {
    id: 'mc-38',
    category: 'Akarsular & Deltalar',
    region: 'Karadeniz',
    questionText: 'Samsun\'da Kızılırmak nehri taşıdığı alüvyonlarla Türkiye\'nin Karadeniz kıyısındaki en büyük delta ovasını oluşturmuştur. Bu ova hangisidir?',
    options: ['Bafra Ovası', 'Çarşamba Ovası', 'Silifke Ovası', 'Gediz Ovası', 'Çukurova'],
    correctIndex: 0,
    targetCoords: [35.900, 41.570],
    explanation: 'Kızılırmak Samsun Bafra Ovası\'nı; Yeşilırmak ise Çarşamba Ovası\'nı oluşturur.',
    osymTip: 'Kızılırmak -> Bafra; Yeşilırmak -> Çarşamba.'
  },
  {
    id: 'mc-39',
    category: 'Fay Hatları & Deprem',
    region: 'Marmara',
    questionText: 'Bingöl Karlıova\'dan başlayıp Marmara Denizi altından geçerek Saros Körfezi\'ne ulaşan Türkiye\'nin en uzun doğrultu atımlı aktif fay hattı hangisidir?',
    options: ['Kuzey Anadolu Fay Hattı (KAF)', 'Doğu Anadolu Fay Hattı (DAF)', 'Batı Anadolu Fay Hattı (BAF)', 'Tavrıs Fay Hattı', 'Sundance Fayı'],
    correctIndex: 0,
    targetCoords: [29.000, 40.800],
    explanation: 'KAF (Kuzey Anadolu Fay Hattı) dünyadaki en hareketli doğrultu atımlı fay kuşaklarından biridir.',
    osymTip: 'KAF: Bingöl Karlıova - Saros Körfezi arası uzanır.'
  },
  {
    id: 'mc-40',
    category: 'Madenler',
    region: 'Ege',
    questionText: 'Dünya rezervinin yaklaşık %73\'üne Türkiye\'nin sahip olduğu; Balıkesir Bigadiç, Kütahya Emet ve Eskişehir Kırka\'da çıkarılan stratejik madenimiz hangisidir?',
    options: ['Bor Mineralleri', 'Krom', 'Boksit', 'Bakır', 'Fosfat'],
    correctIndex: 0,
    targetCoords: [28.150, 39.910],
    explanation: 'Türkiye Bor mineralleri rezervinde dünyada 1. sıradadır.',
    osymTip: 'Susurluk, Emet, Kırka, Bigadiç = Bor.'
  },
  {
    id: 'mc-41',
    category: 'Madenler',
    region: 'İç Anadolu',
    questionText: 'Türkiye\'nin tek entegre alüminyum tesisi bulunan ve elektriğini Oymapınar Barajı\'ndan alan Seydişehir Alüminyum Fabrikası hangi madeni işler?',
    options: ['Boksit', 'Demir', 'Krom', 'Bakır', 'Manganez'],
    correctIndex: 0,
    targetCoords: [31.850, 37.420],
    explanation: 'Alüminyumun hammaddesi Boksit madenidir. Konya Seydişehir tesislerinde işlenir.',
    osymTip: 'Seydişehir Alüminyum = Boksit madeni + Oymapınar Barajı elektriği.'
  },
  {
    id: 'mc-42',
    category: 'Madenler',
    region: 'Güneydoğu Anadolu',
    questionText: 'Suni gübre sanayisinin temel hammaddesi olan ve Türkiye\'de Mardin Mazıdağı tesislerinde çıkarılıp işlenen maden hangisidir?',
    options: ['Fosfat', 'Kükürt', 'Barit', 'Asfaltit', 'Volfram'],
    correctIndex: 0,
    targetCoords: [40.480, 37.520],
    explanation: 'Fosfat gübre sanayisinde kullanılır. Türkiye\'de Mardin Mazıdağı en önemli havzadır.',
    osymTip: 'Fosfat = Gübre hammaddesi = Mardin Mazıdağı.'
  },
  {
    id: 'mc-43',
    category: 'Madenler',
    region: 'Ege',
    questionText: 'Türkiye\'nin maden ihracat gelirinde yaklaşık %50 ile EN YÜKSEK GELİRİ SAĞLAYAN maden grubu hangisidir?',
    options: ['Mermer ve Doğaltaşlar', 'Bor Mineralleri', 'Krom', 'Bakır', 'Altın'],
    correctIndex: 0,
    targetCoords: [30.750, 38.870],
    explanation: 'Türkiye maden ihracat gelirinin lideri Mermerdir (Afyon, Marmara Adası, Bilecik, Muğla).',
    osymTip: 'İhracatta 1. sırada yer alan madenimiz Mermerdir.'
  },
  {
    id: 'mc-44',
    category: 'Madenler',
    region: 'Güneydoğu Anadolu',
    questionText: 'Türkiye\'de asfaltit adı verilen katı petrol türevi yakıtın çıkarıldığı ve asfaltitle çalışan tek termik santralin bulunduğu yer neresidir?',
    options: ['Şırnak Silopi', 'Batman Raman', 'Adıyaman Kahta', 'Mardin Nusaybin', 'Siirt Kurtalan'],
    correctIndex: 0,
    targetCoords: [42.480, 37.170],
    explanation: 'Şırnak Silopi Türkiye\'deki tek büyük asfaltit yatağı ve asfaltit termik santraline ev sahipliği yapar.',
    osymTip: 'Asfaltit = Şırnak Silopi Termik Santrali.'
  },
  {
    id: 'mc-45',
    category: 'Akarsular',
    region: 'Karadeniz',
    questionText: 'Türkiye sınırları içerisinde doğup yine Türkiye sınırları içerisinde Karadeniz\'e dökülen EN UZUN NEHRİMİZ hangisidir?',
    options: ['Kızılırmak (1.355 km)', 'Fırat Nehri', 'Yeşilırmak', 'Sakarya Nehri', 'Dicle Nehri'],
    correctIndex: 0,
    targetCoords: [35.950, 41.720],
    explanation: 'Kızılırmak (1.355 km) Türkiye sınırları içerisinde doğup denize dökülen en uzun nehirdir. (Fırat havza olarak daha uzundur ancak denize Basra Körfezi\'nde dökülür).',
    osymTip: 'Sınırlarımız içinde doğup dökülen en uzun nehir: Kızılırmak.'
  },
  {
    id: 'mc-46',
    category: 'Göller',
    region: 'Akdeniz',
    questionText: 'Gideğeni (Çarşamba Çayı) vasıtasıyla Konya Ovası Sulama Projesi\'ne (KOP - Mavi Tünel) can suyu sağlayan Türkiye\'nin en büyük tatlı su gölü hangisidir?',
    options: ['Beyşehir Gölü', 'Eğirdir Gölü', 'Tuz Gölü', 'Kovada Gölü', 'Çıldır Gölü'],
    correctIndex: 0,
    targetCoords: [31.500, 37.750],
    explanation: 'Beyşehir Gölü Türkiye\'nin en büyük tatlı su gölüdür. Gideğeni olan Çarşamba Çayı Konya Ovası\'nı sular.',
    osymTip: 'En büyük tatlı su gölü: Beyşehir Gölü (Gideğeni: Çarşamba Çayı).'
  },
  {
    id: 'mc-47',
    category: 'Göller',
    region: 'Doğu Anadolu',
    questionText: 'Kış aylarında yüzeyi tamamen donarak üzerinde atlı kızaklarla gezinti ve Eskimo usulü balıkçılık yapılan volkanik set gölü hangisidir?',
    options: ['Çıldır Gölü (Ardahan-Kars)', 'Van Gölü', 'Nemrut Kalderası', 'Nazik Gölü', 'Hazar Gölü'],
    correctIndex: 0,
    targetCoords: [43.250, 41.050],
    explanation: 'Çıldır Gölü kışın donmasıyla ünlü volkanik set gölüdür.',
    osymTip: 'Çıldır Gölü = Volkanik Set + Donan Göl + Atlı Kızak Turizmi.'
  },
  {
    id: 'mc-48',
    category: 'Madenler',
    region: 'İç Anadolu',
    questionText: 'Eskişehir Sivrihisar (Beylikova) sahasında bulunan ve Türkiye\'yi dünya rezervinde 2. sıraya taşıyan nükleer enerji hammaddesi hangisidir?',
    options: ['Toryum', 'Uranyum', 'Bor', 'Radyum', 'Plütonyum'],
    correctIndex: 0,
    targetCoords: [31.530, 39.450],
    explanation: 'Toryum rezervinde Türkiye dünyada 2. sıradadır. Başlıca rezerv Eskişehir Beylikova\'dadır.',
    osymTip: 'Toryum = Eskişehir Sivrihisar Beylikova (Dünyada 2.yiz).'
  },
  {
    id: 'mc-49',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    questionText: 'Karstik kalker yapısı sebebiyle yerleşim ve tarımın çok kısıtlı olduğu, kıl keçisi yetiştiriciliğinin yaygın yapıldığı Akdeniz platosu hangisidir?',
    options: ['Teke ve Taşeli Platoları', 'Haymana Platosu', 'Bozok Platosu', 'Çatalca Platosu', 'Yazılıkaya Platosu'],
    correctIndex: 0,
    targetCoords: [32.900, 36.500],
    explanation: 'Teke ve Taşeli Platoları karstik (kalkerli) yapılıdır, su tutma kapasitesi düşüktür ve kıl keçisi yetiştirilir.',
    osymTip: 'Karstik Plato = Teke & Taşeli (Kıl keçisi ve seyrek nüfus).'
  },
  {
    id: 'mc-50',
    category: 'Platolar & Ovalar',
    region: 'Doğu Anadolu',
    questionText: 'Lav örtüsüyle kaplı olan, zengin çayır bitki örtüsü ve Çernezyom (Kara Toprak) varlığı sayesinde BÜYÜKBAŞ MERA HAYVANCILIĞININ merkezi olan plato hangisidir?',
    options: ['Erzurum - Kars - Ardahan Platosu', 'Cihanbeyli Platosu', 'Şanlıurfa Platosu', 'Obruk Platosu', 'Gaziantep Platosu'],
    correctIndex: 0,
    targetCoords: [43.100, 40.600],
    explanation: 'Erzurum-Kars Platosu volkanik lav platosudur. Yaz yağışları, Alpin çayırlar, Çernezyom toprak ve büyükbaş mera hayvancılığı karakteristiktir.',
    osymTip: 'Volkanik Plato + Çernezyom + Yaz Yağışı + Büyükbaş = Erzurum-Kars.'
  },
  {
    id: 'mc-51',
    category: 'Platolar & Ovalar',
    region: 'Marmara',
    questionText: 'Aşınım (Peneplen) platosu özelliğinde olup Türkiye\'nin sanayi, nüfus, ticaret ve enerji tüketimi en yüksek platosu hangisidir?',
    options: ['Çatalca - Kocaeli Platosu', 'Haymana Platosu', 'Uzunyayla Platosu', 'Bozok Platosu', 'Teke Platosu'],
    correctIndex: 0,
    targetCoords: [29.100, 41.000],
    explanation: 'Çatalca-Kocaeli Platosu aşınım platosudur. Nüfus yoğunluğu ve sanayi faaliyetleri en yüksektir.',
    osymTip: 'Aşınım Platosu = Çatalca-Kocaeli (En yoğun nüfus ve sanayi).'
  },
  {
    id: 'mc-52',
    category: 'Ovalar',
    region: 'Akdeniz',
    questionText: 'Türkiye\'nin Akdeniz Bölgesi\'ndeki karstik kökenli polye ovalarını kodlayan "TAKKEM" kısaltmasındaki ovalardan hangisi yer almaz?',
    options: ['Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla', 'Çarşamba Ovası', 'Elmalı Ovası', 'Kestel Ovası', 'Acıpayam Ovası'],
    correctIndex: 1,
    targetCoords: [29.920, 36.730],
    explanation: 'TAKKEM: Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla ovaları Karstik (Polye) ovalardır. Çarşamba ise Karadeniz\'de bir delta ovasıdır.',
    osymTip: 'Karstik Polye Ovaları = TAKKEM (Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla).'
  },
  {
    id: 'mc-53',
    category: 'Geçitler',
    region: 'Karadeniz',
    questionText: 'Trabzon Limanı\'nı Gümüşhane - Bayburt üzerinden Erzurum ve İran Transit Ticaret Yolu\'na bağlayan tarihi ve stratejik geçit hangisidir?',
    options: ['Zigana (Kalkanlı) ve Kop Geçitleri', 'Gülek Boğazı', 'Belen Geçidi', 'Sertavul Geçidi', 'Çubuk Boğazı'],
    correctIndex: 0,
    targetCoords: [39.420, 40.630],
    explanation: 'Zigana ve Kop Geçitleri Doğu Karadeniz\'i (Trabzon) Doğu Anadolu\'ya ve İran transit yoluna bağlar.',
    osymTip: 'Trabzon - Gümüşhane - Erzurum = Zigana ve Kop Geçitleri.'
  },
  {
    id: 'mc-54',
    category: 'Geçitler',
    region: 'Akdeniz',
    questionText: 'İç Anadolu\'yu (Konya/Niğde) Akdeniz\'e (Adana/Çukurova) bağlayan, Toroslar üzerindeki en önemli tarihi boğaz geçit hangisidir?',
    options: ['Gülek Boğazı', 'Sertavul Geçidi', 'Belen Geçidi', 'Ilgaz Geçidi', 'Cankurtaran Geçidi'],
    correctIndex: 0,
    targetCoords: [34.780, 37.200],
    explanation: 'Gülek Boğazı İç Anadolu ile Çukurova (Adana) arasındaki ana ulaşım arteri ve tarihi kapıdır.',
    osymTip: 'İç Anadolu - Çukurova = Gülek Boğazı.'
  },
  {
    id: 'mc-55',
    category: 'Geçitler',
    region: 'Akdeniz',
    questionText: 'İç Anadolu\'yu (Karaman/Konya) Akdeniz\'de Mersin Silifke Limanı\'na bağlayan Toros geçidi hangisidir?',
    options: ['Sertavul Geçidi', 'Gülek Boğazı', 'Çubuk Boğazı', 'Belen Geçidi', 'Zigana Geçidi'],
    correctIndex: 0,
    targetCoords: [33.250, 36.900],
    explanation: 'Sertavul Geçidi Karaman ile Mersin/Silifke arasını birbirine bağlar.',
    osymTip: 'Karaman - Silifke/Mersin = Sertavul Geçidi.'
  },
  {
    id: 'mc-56',
    category: 'Geçitler',
    region: 'Akdeniz',
    questionText: 'İskenderun Demir-Çelik Limanı ile Amik Ovası ve Hatay\'ı birbirine bağlayan Amanos (Nur) Dağları geçidi hangisidir?',
    options: ['Belen Geçidi', 'Gülek Boğazı', 'Çubuk Boğazı', 'Ilgaz Geçidi', 'Ovit Tüneli'],
    correctIndex: 0,
    targetCoords: [36.200, 36.500],
    explanation: 'Belen Geçidi Amanos Dağları üzerinde İskenderun ile Hatay/Amik arasını bağlar.',
    osymTip: 'İskenderun - Antakya = Belen Geçidi.'
  },
  {
    id: 'mc-57',
    category: 'Geçitler',
    region: 'Karadeniz',
    questionText: 'Rize İkizdere ile Erzurum İspir arasında yer alan ve Türkiye\'nin en uzun çift tüplü karayolu tünellerinden biri olan tünel hangisidir?',
    options: ['Ovit Tüneli', 'Ilgaz 15 Temmuz Tüneli', 'Avrasya Tüneli', 'Sabuncubeli Tüneli', 'Nefise Akçelik Tüneli'],
    correctIndex: 0,
    targetCoords: [40.780, 40.620],
    explanation: 'Ovit Tüneli (14 km) Rize ile Erzurum arasındaki kış kapanmalarını önleyen devasa projedir.',
    osymTip: 'Rize - Erzurum = Ovit Tüneli.'
  },
  {
    id: 'mc-58',
    category: 'Rüzgarlar & İklim',
    region: 'Genel',
    questionText: 'Türkiye\'yi etkileyen yerel rüzgarların saat yönündeki kodlaması olan "KAYIP SAKAL"da kuzeydoğudan esen soğuk rüzgar hangisidir?',
    options: ['Poyraz', 'Karayel', 'Yıldız', 'Samyeli (Keşişleme)', 'Lodos'],
    correctIndex: 0,
    targetCoords: [29.000, 41.000],
    explanation: 'KAYIP SAKAL: Karayel (KB), Yıldız (K), Poyraz (KD), Samyeli/Keşişleme (GD), Kıble (G), Lodos (GB).',
    osymTip: 'KAYIP SAKAL = Karayel, Yıldız, Poyraz (Kuzeyden Soğuk) / Samyeli, Kıble, Lodos (Güneyden Sıcak).'
  },
  {
    id: 'mc-59',
    category: 'Rüzgarlar & İklim',
    region: 'Karadeniz',
    questionText: 'Dağ yamacından aşağıya doğru alçalırken her 100 metrede 1°C ısınan, Doğu Karadeniz Rize\'de turunçgil ve Artvin Yusufeli\'de zeytin yetişmesini sağlayan mikroklima rüzgarı hangisidir?',
    options: ['Föhn (Fön) Rüzgarı', 'Lodos', 'Etezyen', 'Bora', 'Krivetz'],
    correctIndex: 0,
    targetCoords: [40.520, 41.020],
    explanation: 'Fön rüzgarları alçalan havanın sürtünmeyle her 100 m\'de 1°C ısınması sonucu oluşur ve mikroklima cepleri yaratır.',
    osymTip: 'Rize\'de turunçgil, Iğdır ve Yusufeli\'de zeytin = Fön Rüzgarı & Mikroklima.'
  },
  {
    id: 'mc-60',
    category: 'Topraklar',
    region: 'Doğu Anadolu',
    questionText: 'Organik madde (humus) bakımından en zengin olmasına ve "Kara Toprak" olarak bilinmesine rağmen, yaz kuraklığı ve iklim soğukluğu nedeniyle tarımda kısıtlı kullanılan zonal toprak türü hangisidir?',
    options: ['Çernezyom Toprakları', 'Terra Rossa', 'Podzol', 'Kahverengi Bozkır', 'Laterit'],
    correctIndex: 0,
    targetCoords: [43.100, 40.600],
    explanation: 'Çernezyom dünyanın en verimli toprağıdır ancak Erzurum-Kars\'ta iklim sertliğinden ötürü büyükbaş mera alanı olarak kullanılır.',
    osymTip: 'En verimli Zonal Toprak = Çernezyom (Erzurum-Kars).'
  },
  {
    id: 'mc-61',
    category: 'Topraklar',
    region: 'Akdeniz',
    questionText: 'Kalkerli (kireçtaşı) araziler üzerinde kimyasal çözünmeyle oluşan ve bünyesindeki demir oksit nedeniyle kırmızı renkli olan Akdeniz iklim toprağı hangisidir?',
    options: ['Terra Rossa (Kırmızı Akdeniz Toprağı)', 'Podzol', 'Çernezyom', 'Regosol', 'Rendzina'],
    correctIndex: 0,
    targetCoords: [30.700, 36.900],
    explanation: 'Terra Rossa kalker arazideki demir oksit zenginliğiyle kırmızı renk alır. Akdeniz ikliminin karakteristik toprağıdır.',
    osymTip: 'Kırmızı renk + Kalker + Akdeniz = Terra Rossa.'
  },
  {
    id: 'mc-62',
    category: 'Topraklar',
    region: 'Karadeniz',
    questionText: 'Batı Karadeniz\'de (Bolu, Kastamonu, Zonguldak çevresinde) soğuk ve nemli iğne yapraklı orman sahalarında yıkanmış, kül renkli olan toprak tipi hangisidir?',
    options: ['Podzol Toprakları', 'Kahverengi Orman', 'Terra Rossa', 'Vertisol', 'Solonçak'],
    correctIndex: 0,
    targetCoords: [32.500, 41.400],
    explanation: 'Podzol, soğuk nemli iğne yapraklı tayga/orman altı kül renkli, aşırı yıkanmış topraktır.',
    osymTip: 'Batı Karadeniz + Soğuk Nemli İğne Yapraklı = Podzol.'
  },
  {
    id: 'mc-63',
    category: 'Topraklar',
    region: 'Marmara',
    questionText: 'Killi kireçli kireç taşlı ana materyal üzerinde oluşan, kurak dönemde çatlayıp taş doğuran / dönen toprak olarak bilinen ve Trakya Ergene ile Muş Ovası\'nda yaygın intrazonal toprak hangisidir?',
    options: ['Vertisol (Dönen Toprak / Taş Doğuran)', 'Rendzina', 'Solonçak', 'Halomorfik', 'Hidromorfik'],
    correctIndex: 0,
    targetCoords: [27.500, 41.300],
    explanation: 'Vertisoller killi yapıdadır, kuruyunca yarılır, ıslanınca şişer. Ayçiçeği tarımında (Ergene Havzası) yaygındır.',
    osymTip: 'Dönen Toprak / Taş Doğuran / Kepir / Ayçiçeği Toprağı = Vertisol (Ergene).'
  },
  {
    id: 'mc-64',
    category: 'Nüfus & Yerleşme',
    region: 'Ege',
    questionText: 'Ege Bölgesi\'nde yer almasına ve kıyıda bulunmasına rağmen dağlık-engebeli arazi yapısı ve ana ulaşım hatlarına sapa kalması sebebiyle SEYREK NÜFUSLU olan yöre hangisidir?',
    options: ['Menteşe Yöresi (Muğla)', 'Gediz Havzası', 'Büyük Menderes Ovası', 'İzmir Körfezi', 'Bakırçay Havzası'],
    correctIndex: 0,
    targetCoords: [28.360, 37.210],
    explanation: 'Muğla Menteşe Yöresi bol yağış almasına rağmen aşırı engebeli olduğundan ve ana yollardan sapa kaldığından tenhadır.',
    osymTip: 'Ege\'de tenhadır: Menteşe Yöresi (Engebe ve Ulaşım sapalığı).'
  },
  {
    id: 'mc-65',
    category: 'Nüfus & Yerleşme',
    region: 'Karadeniz',
    questionText: 'Karadeniz\'de doğal bir limana sahip olmasına rağmen, arkasındaki Küre Dağları\'nın ulaşımı engellemesi ve demiryolu bağlantısı olmaması (hinterlandı dar) nedeniyle gelişemeyen ilimiz hangisidir?',
    options: ['Sinop', 'Samsun', 'Trabzon', 'Zonguldak', 'Ordu'],
    correctIndex: 0,
    targetCoords: [35.150, 42.020],
    explanation: 'Sinop tek doğal limandır ancak hinterlandı (ard bölgesi) dağlar yüzünden dar olduğu için gelişememiştir.',
    osymTip: 'Doğal liman ama dar hinterland = Sinop.'
  },
  {
    id: 'mc-66',
    category: 'Nüfus & Yerleşme',
    region: 'Akdeniz',
    questionText: 'Akdeniz\'de kalkerli karstik arazisi, su tutmayan zemini ve tarım arazilerinin darlığı sebebiyle Türkiye\'nin EN SEYREK NÜFUSLU kıyı platoları hangileridir?',
    options: ['Teke ve Taşeli Platoları', 'Çukurova', 'Antalya Ovası', 'Asi Deltası', 'Bursa Ovası'],
    correctIndex: 0,
    targetCoords: [32.800, 36.600],
    explanation: 'Teke ve Taşeli platoları karstik erimeler, engebe ve zemin geçirgenliği yüzünden çok seyrek nüfusludur.',
    osymTip: 'Akdeniz\'in en tenha yerleri = Teke ve Taşeli Platoları.'
  },
  {
    id: 'mc-67',
    category: 'Tarım & Hayvancılık',
    region: 'Güneydoğu Anadolu',
    questionText: 'Güneydoğu Anadolu Projesi (GAP) ile sulamanın yaygınlaşması sonucu Türkiye PAMUK ÜRETİMİNİN yarıdan fazlasını tek başına karşılayan ilimiz hangisidir?',
    options: ['Şanlıurfa', 'Adana', 'Aydın', 'Diyarbakır', 'Hatay'],
    correctIndex: 0,
    targetCoords: [38.790, 37.160],
    explanation: 'GAP ile Şanlıurfa, Çukurova\'yı geçerek Türkiye pamuk üretiminde açık ara 1. sıraya yükselmiştir.',
    osymTip: 'Pamuk üretiminde 1. il = Şanlıurfa (GAP sulamasıyla).'
  },
  {
    id: 'mc-68',
    category: 'Tarım & Hayvancılık',
    region: 'İç Anadolu',
    questionText: 'Türkiye\'de bozkır (step) bitki örtüsünün geniş yer kaplaması, düzlük araziler ve küçükbaş hayvancılık kültürünün sonucu olarak EN ÇOK YETİŞTİRİLEN KOYUN IRKI hangisidir?',
    options: ['Karaman Koyunu', 'Merinos', 'Kıvırcık', 'Sakız', 'Dağlıç'],
    correctIndex: 0,
    targetCoords: [33.200, 38.000],
    explanation: 'Karaman koyunu (Akkaraman ve Morkaraman) kurak iklime ve bozkır otlaklarına en dayanıklı ırk olup Türkiye genelinde 1. sıradadır.',
    osymTip: 'En yaygın koyun ırkı: Karaman Koyunu (Bozkır uyumu).'
  },
  {
    id: 'mc-69',
    category: 'Tarım & Hayvancılık',
    region: 'İç Anadolu',
    questionText: 'Tiftik (Angora) Keçisi yetiştiriciliğinde tescilli ve tarihi olarak en önemli merkezimiz olan ilimiz hangisidir?',
    options: ['Ankara', 'Mersin', 'Antalya', 'Siirt', 'Hakkari'],
    correctIndex: 0,
    targetCoords: [32.850, 39.930],
    explanation: 'Ankara Keçisi (Tiftik Keçisi) yünü için yetiştirilir ve başkenti Ankara\'dır.',
    osymTip: 'Tiftik Keçisi = Ankara / Kıl Keçisi = Akdeniz Torosları.'
  },
  {
    id: 'mc-70',
    category: 'Tarım & Hayvancılık',
    region: 'Ege',
    questionText: 'Dünya kuru incir ve kuru zeytin ihracatında öncü olan, jeotermal kaynakları ve Büyük Menderes grabenindeki verimli alüvyonlarıyla bilinen ilimiz hangisidir?',
    options: ['Aydın', 'Manisa', 'İzmir', 'Denizli', 'Muğla'],
    correctIndex: 0,
    targetCoords: [27.840, 37.850],
    explanation: 'Aydın, incir ve kestane üretiminde 1. sıradadır. Zeytinyağı ve jeotermalde de öncüdür.',
    osymTip: 'İncir + Kestane + Jeotermal = Aydın.'
  },
  {
    id: 'mc-71',
    category: 'Madenler',
    region: 'Ege',
    questionText: 'Alüminyumun hammaddesi olan ve Antalya Akseki ile Konya Seydişehir tesislerinde işlenen maden hangisidir?',
    options: ['Boksit (Alüminyum)', 'Bakır', 'Krom', 'Manganez', 'Kurşun'],
    correctIndex: 0,
    targetCoords: [31.850, 37.420],
    explanation: 'Boksit alüminyum cevheridir. Seydişehir Alüminyum Tesisleri ve Akseki yatakları en önemlisidir.',
    osymTip: 'Boksit = Alüminyum = Konya Seydişehir & Antalya Akseki.'
  },
  {
    id: 'mc-72',
    category: 'Madenler',
    region: 'Doğu Anadolu',
    questionText: 'Elazığ Maden, Rize Çayeli, Artvin Murgul ve Kastamonu Küre\'de çıkarılan, iletkenliği yüksek stratejik maden hangisidir?',
    options: ['Bakır', 'Demir', 'Krom', 'Çinko', 'Kükürt'],
    correctIndex: 0,
    targetCoords: [39.220, 38.670],
    explanation: 'KADER kodlaması: Kastamonu Küre, Artvin Murgul, Diyarbakır Ergani, Elazığ Maden, Rize Çayeli başlıca Bakır yataklarıdır.',
    osymTip: 'Bakır = KADER (Küre, Artvin, Diyarbakır, Elazığ, Rize).'
  },
  {
    id: 'mc-73',
    category: 'Madenler',
    region: 'Doğu Anadolu',
    questionText: 'Paslanmaz çelik sanayisinde kullanılan, Elazığ Guleman ve Muğla Fethiye-Köyceğiz\'de çıkarılıp Antalya ve Elazığ Ferrokrom tesislerinde işlenen maden hangisidir?',
    options: ['Krom', 'Manganez', 'Volfram', 'Nikel', 'Titanyum'],
    correctIndex: 0,
    targetCoords: [39.900, 38.500],
    explanation: 'Krom sert ve paslanmaz çelik yapımında kullanılır. Elazığ Guleman ve Fethiye en büyük çıkarım alanlarıdır.',
    osymTip: 'Krom = Paslanmaz Çelik = Elazığ Guleman & Ferrokrom Tesisleri.'
  },
  {
    id: 'mc-74',
    category: 'Madenler',
    region: 'Marmara',
    questionText: 'Dünya rezervlerinin yaklaşık %73\'üne sahip olduğumuz, Balıkesir (Bigadiç, Susurluk), Bursa (Mustafakemalpaşa), Kütahya (Emet) ve Eskişehir (Kırka)\'da çıkarılan stratejik mineral hangisidir?',
    options: ['Bor Mineralleri', 'Toryum', 'Mermer', 'Asbest', 'Fosfat'],
    correctIndex: 0,
    targetCoords: [28.150, 39.400],
    explanation: 'Bor rezervlerinde Türkiye dünya 1.sidir. Bandırma ve Kırka\'da borik asit tesisleri bulunur.',
    osymTip: 'Dünya 1.si olduğumuz maden = BOR (Balıkesir, Kütahya, Bursa, Eskişehir).'
  },
  {
    id: 'mc-75',
    category: 'Madenler',
    region: 'İç Anadolu',
    questionText: 'Pipo, ağızlık ve süs eşyası yapımında kullanılan ve yalnızca Eskişehir ilimizde çıkarılan "Beyaz Altın" lakaplı mineral hangisidir?',
    options: ['Lületaşı', 'Oltu Taşı', 'Zultanit', 'Obsidyen', 'Ametist'],
    correctIndex: 0,
    targetCoords: [30.520, 39.770],
    explanation: 'Lületaşı Eskişehir\'e özgü, hafif ve gözenekli beyaz süs taşıdır.',
    osymTip: 'Lületaşı = Eskişehir / Oltu Taşı = Erzurum.'
  },
  {
    id: 'mc-76',
    category: 'Madenler',
    region: 'Doğu Anadolu',
    questionText: 'Siyah kehribar olarak bilinen, tespih ve takı üretiminde kullanılan ve Erzurum\'un aynı adlı ilçesinde çıkarılan süs taşı hangisidir?',
    options: ['Oltu Taşı', 'Lületaşı', 'Kuvars', 'Akik', 'Kalsit'],
    correctIndex: 0,
    targetCoords: [41.990, 40.550],
    explanation: 'Oltu Taşı Erzurum Oltu ilçesinde çıkarılan organik kökenli fosil linyit türevi taştır.',
    osymTip: 'Oltu Taşı = Erzurum.'
  },
  {
    id: 'mc-77',
    category: 'Enerji Kaynakları',
    region: 'Ege',
    questionText: 'Türkiye\'nin İLK jeotermal elektrik santrali hangi sahada kurulmuştur?',
    options: ['Denizli Sarayköy', 'Aydın Germencik', 'Çanakkale Tuzla', 'Manisa Alaşehir', 'Afyon Sandıklı'],
    correctIndex: 0,
    targetCoords: [28.920, 37.920],
    explanation: 'Denizli Sarayköy Jeotermal Santrali Türkiye\'nin ilk jeotermal elektrik üretim tesisidir.',
    osymTip: 'İlk Jeotermal Santral = Denizli Sarayköy.'
  },
  {
    id: 'mc-78',
    category: 'Enerji Kaynakları',
    region: 'Ege',
    questionText: 'Türkiye\'nin İLK rüzgar enerjisi santrali (RES) 1998 yılında hangi merkezde işletmeye açılmıştır?',
    options: ['İzmir Çeşme - Alaçatı', 'Çanakkale Bozcaada', 'Balıkesir Bandırma', 'Manisa Soma', 'Hatay Belen'],
    correctIndex: 0,
    targetCoords: [26.370, 38.280],
    explanation: 'İlk rüzgar santrali İzmir Çeşme Alaçatı beldesinde kurulmuştur.',
    osymTip: 'İlk Rüzgar Santrali (RES) = İzmir Alaçatı.'
  },
  {
    id: 'mc-79',
    category: 'Enerji Kaynakları',
    region: 'İç Anadolu',
    questionText: 'Avrupa\'nın ve Türkiye\'nin en büyük tek parça Güneş Enerjisi Santrali (GES) sahası hangi ilçemizde kurulmuştur?',
    options: ['Konya Karapınar', 'Şanlıurfa Viranşehir', 'Mersin Mut', 'Ankara Polatlı', 'Kayseri İncesu'],
    correctIndex: 0,
    targetCoords: [33.550, 37.710],
    explanation: 'Konya Karapınar Güneş Enerjisi İhtisas Endüstri Bölgesi Türkiye\'nin en devasa GES projesidir.',
    osymTip: 'En büyük Güneş Santrali = Konya Karapınar GES.'
  },
  {
    id: 'mc-80',
    category: 'Enerji Kaynakları',
    region: 'Karadeniz',
    questionText: 'Fatih Sondaj Gemisi tarafından Karadeniz\'de keşfedilen ve Türkiye\'nin en büyük doğalgaz rezervi olan gaz sahası hangisidir?',
    options: ['Sakarya Gaz Sahası (Tuna-1)', 'Hamitabat', 'Çamurlu', 'Akçakoca', 'Batı Raman'],
    correctIndex: 0,
    targetCoords: [31.200, 42.800],
    explanation: 'Sakarya Gaz Sahası Karadeniz açıklarında Türkiye tarihinin en büyük hidrokarbon keşfidir.',
    osymTip: 'Karadeniz Doğalgaz Keşfi = Sakarya Gaz Sahası (Filyos Limanı üzerinden sisteme bağlanmıştır).'
  },
  {
    id: 'mc-81',
    category: 'Enerji Kaynakları',
    region: 'Güneydoğu Anadolu',
    questionText: '1940 yılında Türkiye\'de İLK petrolün bulunduğu ve ilk petrol rafinerisinin açıldığı tarihi dağ ve merkez hangisidir?',
    options: ['Batman Raman Dağı', 'Adıyaman Kahta', 'Şırnak Gabar Dağı', 'Siirt Kurtalan', 'Mardin Nusaybin'],
    correctIndex: 0,
    targetCoords: [41.250, 37.800],
    explanation: 'Türkiye\'de ilk petrol Batman Raman Dağı\'nda bulunmuş ve Batman Rafinerisi kurulmuştur.',
    osymTip: 'İlk Petrol = Batman Raman Dağı.'
  },
  {
    id: 'mc-82',
    category: 'Sanayi',
    region: 'Karadeniz',
    questionText: 'Karabük ve İskenderun Demir-Çelik Fabrikaları kurulurken sırasıyla hangi temel faktörler belirleyici olmuştur?',
    options: ['Karabük: Enerji Kaynağına Yakınlık (Taşkömürü) / İskenderun: Ulaşım ve Liman Kolaylığı', 'Hammaddeye Yakınlık / Pazar', 'Pazar / Sermaye', 'İklim / Su', 'İşgücü / Maden Yatağı'],
    correctIndex: 0,
    targetCoords: [32.620, 41.200],
    explanation: 'Karabük ve Ereğli taşkömürüne (enerji kaynağına) yakınlık; İskenderun ise liman ve deniz ulaşımı sebebiyle seçilmiştir.',
    osymTip: 'Karabük = Taşkömürüne Yakınlık / İskenderun = Ulaşım ve Liman.'
  },
  {
    id: 'mc-83',
    category: 'Sanayi',
    region: 'Karadeniz',
    questionText: 'Türkiye\'de Kağıt Sanayisi tesislerinin (Giresun Aksu, Zonguldak Çaycuma, Kastamonu Taşköprü, Muğla Dalaman) genelde kıyı kesimlerde toplanmasının temel nedeni nedir?',
    options: ['Hammaddeye (Orman Varlığına) Yakınlık', 'Pazar Kolaylığı', 'Nitelikli İş Gücü', 'Demiryolu Ağı', 'Düşük Elektrik Maliyeti'],
    correctIndex: 0,
    targetCoords: [38.450, 40.900],
    explanation: 'Kağıt fabrikaları Türkiye ormanlarının %27\'sini barındıran Karadeniz ve Akdeniz ormanlarına (hammaddeye) yakın kurulmuştur.',
    osymTip: 'Kağıt Fabrikaları = Hammaddeye (Ormana) Yakınlık.'
  },
  {
    id: 'mc-84',
    category: 'Turizm & UNESCO',
    region: 'Doğu Anadolu',
    questionText: 'Ani Tarihi Arkeolojik Alanı (1001 Kiliseli Şehir) hangi serhat şehrimiz sınırları içinde yer almaktadır?',
    options: ['Kars', 'Ardahan', 'Iğdır', 'Erzurum', 'Ağrı'],
    correctIndex: 0,
    targetCoords: [43.570, 40.510],
    explanation: 'Ani Harabeleri Kars ili Arpaçay boyunda yer alan UNESCO Dünya Mirası arkeolojik kentidir.',
    osymTip: 'Ani Harabeleri = Kars.'
  },
  {
    id: 'mc-85',
    category: 'Turizm & UNESCO',
    region: 'Güneydoğu Anadolu',
    questionText: 'Tarihin sıfır noktası olarak adlandırılan, yaklaşık 12.000 yıllık T biçimli dikilitaşlarıyla bilinen UNESCO Dünya Mirası arkeolojik alan hangisidir?',
    options: ['Göbeklitepe (Şanlıurfa)', 'Çatalhöyük (Konya)', 'Alacahöyük (Çorum)', 'Karain (Antalya)', 'Yassıhöyük (Ankara)'],
    correctIndex: 0,
    targetCoords: [38.920, 37.220],
    explanation: 'Göbeklitepe Şanlıurfa\'da insanlık tarihinin bilinen en eski anıtsal kült merkezidir.',
    osymTip: 'Tarihin sıfır noktası = Şanlıurfa Göbeklitepe.'
  },
  {
    id: 'mc-86',
    category: 'Bölgesel Kalkınma Projeleri',
    region: 'Güneydoğu Anadolu',
    questionText: 'Fırat ve Dicle nehirleri üzerinde barajlar, hidroelektrik santralleri ve Şanlıurfa Sulama Tünelleri inşa ederek bölgeyi tarım ve sanayi merkezine dönüştüren en kapsamlı bölgesel kalkınma projemiz hangisidir?',
    options: ['GAP (Güneydoğu Anadolu Projesi)', 'DAP (Doğu Anadolu Projesi)', 'DOKAP (Doğu Karadeniz Projesi)', 'KOP (Konya Ovası Projesi)', 'ZBK (Zonguldak Bartın Karabük)'],
    correctIndex: 0,
    targetCoords: [38.500, 37.500],
    explanation: 'GAP Türkiye\'nin en büyük entegre bölgesel kalkınma projesidir. Atatürk Barajı ve sulama kanalları çekirdeğidir.',
    osymTip: 'En büyük kalkınma projesi: GAP (Güneydoğu Anadolu Projesi).'
  },
  {
    id: 'mc-87',
    category: 'Bölgesel Kalkınma Projeleri',
    region: 'İç Anadolu',
    questionText: 'Göksu Nehri\'nin sularını Bağbaşı Barajı ve Mavi Tünel vasıtasıyla Konya Kapalı Havzası\'na aktararak yeraltı suyunun çekilmesini ve obruk oluşumunu azaltmayı hedefleyen proje hangisidir?',
    options: ['KOP (Konya Ovası Projesi)', 'GAP', 'DAP', 'YHGP (Yeşilırmak Havzası Gelişim Projesi)', 'DOKAP'],
    correctIndex: 0,
    targetCoords: [32.500, 37.870],
    explanation: 'KOP kapsamında Mavi Tünel ile Akdeniz\'e dökülen Göksu Nehri suları Konya Ovası\'na taşınmıştır.',
    osymTip: 'Mavi Tünel + Göksu Nehri + Konya Havzası = KOP.'
  },
  {
    id: 'mc-88',
    category: 'Sınır Kapıları',
    region: 'Doğu Anadolu',
    questionText: 'Türkiye ile İran arasındaki EN İŞLEK ve en eski gümrük kapısı olup demiryolu hattı barındırmayan karayolu kapısı hangisidir?',
    options: ['Gürbulak Sınır Kapısı (Ağrı Doğubayazıt)', 'Kapıköy Sınır Kapısı (Van)', 'Esendere Sınır Kapısı (Hakkari)', 'Dilucu Sınır Kapısı (Iğdır)', 'Sarp Sınır Kapısı (Artvin)'],
    correctIndex: 0,
    targetCoords: [44.400, 39.420],
    explanation: 'Ağrı Gürbulak Türkiye-İran arasındaki en işlek ana transit sınır kapısıdır.',
    osymTip: 'Türkiye - İran En İşlek Kapı: Gürbulak (Ağrı Doğubayazıt).'
  },
  {
    id: 'mc-89',
    category: 'Sınır Kapıları',
    region: 'Doğu Anadolu',
    questionText: 'Van Gölü üzerinden feribotla gelen vagonların İran demiryolu ağına bağlandığı DEMİRYOLU SINIR KAPIMIZ hangisidir?',
    options: ['Kapıköy Sınır Kapısı (Van)', 'Gürbulak', 'Esendere', 'Nusbin', 'İslahiye'],
    correctIndex: 0,
    targetCoords: [44.380, 38.550],
    explanation: 'Van Kapıköy Sınır Kapısı İran\'a demiryolu bağlantısı sağlayan kapımızdır.',
    osymTip: 'İran ile Demiryolu Sınır Kapısı: Van Kapıköy.'
  },
  {
    id: 'mc-90',
    category: 'Sınır Kapıları',
    region: 'Marmara',
    questionText: 'Türkiye\'nin Avrupa\'ya (Bulgaristan) açılan ve yolcu ile TIR hacmi bakımından DÜNYANIN EN İŞLEK ikinci sınır kapısı olan kapımız hangisidir?',
    options: ['Kapıkule Sınır Kapısı (Edirne)', 'Hamzabeyli Sınır Kapısı', 'İpsala Sınır Kapısı', 'Dereköy Sınır Kapısı', 'Pazarkule'],
    correctIndex: 0,
    targetCoords: [26.350, 41.710],
    explanation: 'Kapıkule Sınır Kapısı Bulgaristan\'a açılan en yoğun gümrük kapımızdır (hem karayolu hem demiryolu vardır).',
    osymTip: 'En işlek Avrupa kapımız: Kapıkule (Edirne).'
  },
  {
    id: 'mc-91',
    category: 'Sınır Kapıları',
    region: 'Marmara',
    questionText: 'Türkiye ile Yunanistan arasındaki İpsala Sınır Kapısı hangi akarsuyun deltasının ve köprüsünün yakınında yer alır?',
    options: ['Meriç Nehri', 'Tunca Nehri', 'Arda Nehri', 'Ergene Nehri', 'Sakarya Nehri'],
    correctIndex: 0,
    targetCoords: [26.380, 40.920],
    explanation: 'İpsala Sınır Kapısı Meriç Nehri üzerinden Yunanistan\'a açılan ana kapımızdır.',
    osymTip: 'Yunanistan Sınır Kapısı = İpsala (Meriç Nehri).'
  },
  {
    id: 'mc-92',
    category: 'Akarsular',
    region: 'Doğu Anadolu',
    questionText: 'Erzurum Dumludağ\'dan doğan Karasu ile Bingöl\'den doğan Murat nehirlerinin birleşmesiyle oluşan ve Keban, Karakaya, Atatürk Barajları\'nı besleyen dev akarsu hangisidir?',
    options: ['Fırat Nehri', 'Dicle Nehri', 'Aras Nehri', 'Kura Nehri', 'Çoruh Nehri'],
    correctIndex: 0,
    targetCoords: [38.500, 38.800],
    explanation: 'Fırat Nehri Karasu ve Murat kollarının birleşmesiyle oluşur. Türkiye\'nin en yüksek hidroelektrik potansiyeline sahip nehridir.',
    osymTip: 'Karasu + Murat = Fırat Nehri (Keban, Karakaya, Atatürk Barajları).'
  },
  {
    id: 'mc-93',
    category: 'Akarsular',
    region: 'Doğu Anadolu',
    questionText: 'Türkiye sınırlarından doğarak Hazar Denizi\'ne (kapalı havza) dökülen ve sınır çizen akarsularımız hangi seçenekte doğru verilmiştir?',
    options: ['Aras ve Kura Nehirleri', 'Fırat ve Dicle', 'Çoruh ve Kelkit', 'Asi ve Seyhan', 'Meriç ve Tunca'],
    correctIndex: 0,
    targetCoords: [44.000, 40.000],
    explanation: 'Aras ve Kura nehirleri Hazar Denizi kapalı havzasına dökülürler. Ermenistan ve Azerbaycan sınırlarını oluştururlar.',
    osymTip: 'Hazar Denizi Kapalı Havzasına Dökülenler = Aras ve Kura.'
  },
  {
    id: 'mc-94',
    category: 'Göller',
    region: 'Akdeniz',
    questionText: 'Burdur Salda Gölü, beyaz magnezyum-hidromanyezit tortulları ve Mars yüzeyine benzer jeokimyasal yapısıyla bilinen hangi kökenli bir göldür?',
    options: ['Tektonik ve Karstik Göl', 'Volkanik Krater Gölü', 'Buzul Sirk Gölü', 'Lagün (Kıyı Set)', 'Alüvyal Set'],
    correctIndex: 0,
    targetCoords: [29.680, 37.550],
    explanation: 'Salda Gölü tektonik-karstik çanakta yer alan, hidromanyezit stromatolit yapılarıyla "Türkiye\'nin Maldivleri" sayılan derin bir göldür.',
    osymTip: 'Salda Gölü = Tektonik-Karstik + Magnezit Beyaz Tortu (Burdur).'
  },
  {
    id: 'mc-95',
    category: 'Göller',
    region: 'Karadeniz',
    questionText: 'Tortum (Erzurum), Abant ve Yedigöller (Bolu), Sera (Trabzon), Zinav (Tokat) ve Boraboy (Amasya) gölleri hangi ortak oluşum tipine sahiptir?',
    options: ['Heyelan Set Gölleri', 'Volkanik Set Gölleri', 'Alüvyal Set Gölleri', 'Karstik Göller', 'Kıyı Set Gölleri'],
    correctIndex: 0,
    targetCoords: [31.620, 40.600],
    explanation: 'Karadeniz Bölgesi\'ndeki eğimli yamaçlar ve aşırı yağışlar heyelanları tetiklemiş, vadilerin önünün tıkanmasıyla Heyelan Set Gölleri oluşmuştur.',
    osymTip: 'Heyelan Set Gölleri: Abant, Yedigöller, Tortum, Sera, Boraboy, Zinav.'
  },
  {
    id: 'mc-96',
    category: 'Göller',
    region: 'Ege',
    questionText: 'Muğla Köyceğiz Gölü, Aydın Bafa (Çamiçi) Gölü, Ankara Mogan ve Eymir Gölleri hangi oluşum türüne örnektir?',
    options: ['Alüvyal Set Gölleri', 'Heyelan Set Gölleri', 'Kıyı Set Gölleri', 'Buzul Gölleri', 'Krater Gölleri'],
    correctIndex: 0,
    targetCoords: [28.680, 36.950],
    explanation: 'Akarsuların taşıdığı alüvyonların vadi veya koy önünü kapatmasıyla Alüvyal Set Gölleri (Bafa, Köyceğiz, Mogan, Eymir, Marmara) oluşur.',
    osymTip: 'Alüvyal Set Gölleri = Bafa (Çamiçi), Köyceğiz, Mogan, Eymir, Gölmarmara.'
  },
  {
    id: 'mc-97',
    category: 'Göller',
    region: 'Marmara',
    questionText: 'Büyükçekmece, Küçükçekmece, Terkos (Durusu) ve Akyayan gölleri hangi göl oluşum tipine örnektir?',
    options: ['Kıyı Set Gölleri (Lagün / Denizkulağı)', 'Sirk Gölleri', 'Volkanik Kaldera', 'Polye Gölleri', 'Tektonik Göller'],
    correctIndex: 0,
    targetCoords: [28.580, 41.050],
    explanation: 'Kıyı kordonlarının bir koyun önünü kapatmasıyla Lagün (Kıyı Set Gölü) oluşur. En tipikleri Terkos ve Çekmece gölleridir.',
    osymTip: 'Kıyı Set Gölü (Lagün) = Terkos (Durusu), Büyükçekmece, Küçükçekmece.'
  },
  {
    id: 'mc-98',
    category: 'Göller',
    region: 'Doğu Anadolu',
    questionText: 'Van Gölü, Erçek, Nazik, Balık, Çıldır ve Haçlı gölleri hangi oluşum tipine örnektir?',
    options: ['Volkanik Set Gölleri', 'Karstik Göller', 'Buzul Sirk Gölleri', 'Kıyı Set Gölleri', 'Heyelan Set Gölleri'],
    correctIndex: 0,
    targetCoords: [43.000, 38.600],
    explanation: 'Nemrut Dağı ve çevresindeki volkanlardan çıkan lavların vadileri tıkamasıyla Doğu Anadolu\'da Volkanik Set Gölleri oluşmuştur.',
    osymTip: 'Volkanik Set Gölleri = Van, Erçek, Nazik, Balık, Çıldır, Haçlı.'
  },
  {
    id: 'mc-99',
    category: 'Dağlar',
    region: 'Ege',
    questionText: 'Ege Bölgesi\'nde orojenez (dağ oluşumu) sırasında kırılma ile yükselen "HORST" dağları kuzeyden güneye doğru hangi sırada dizilir?',
    options: ['Kaz Dağı, Madra Dağı, Yunt Dağları, Bozdağlar, Aydın Dağları, Menteşe Dağları', 'Aydın, Bozdağ, Yunt, Madra, Kaz', 'Bozdağ, Menteşe, Kaz, Madra, Yunt', 'Kaz, Bozdağ, Madra, Aydın, Yunt', 'Yunt, Kaz, Madra, Menteşe, Aydın'],
    correctIndex: 0,
    targetCoords: [27.000, 38.500],
    explanation: 'Ege Horstları (Kazma Yutmuş Boz Ayı Menteşe): Kaz, Madra, Yunt, Bozdağlar, Aydın, Menteşe.',
    osymTip: 'Ege Kırık Horst Dağları: Kaz -> Madra -> Yunt -> Bozdağlar -> Aydın -> Menteşe.'
  },
  {
    id: 'mc-100',
    category: 'Dağlar',
    region: 'İç Anadolu',
    questionText: 'İç Anadolu Bölgesi\'ndeki volkanik dağlar güneybatı-kuzeydoğu yönünde hangi hat üzerinde sıralanır?',
    options: ['Karadağ, Karacadağ, Hasandağı, Melendiz Dağı, Erciyes Dağı', 'Erciyes, Tendürek, Süphan, Ağrı, Nemrut', 'Hasandağı, Kazdağı, Erciyes, Nemrut, Spil', 'Karadağ, Cilo, Süphan, Nemrut, Tendürek', 'Melendiz, Ilgaz, Canik, Köroğlu, Erciyes'],
    correctIndex: 0,
    targetCoords: [34.500, 38.300],
    explanation: 'İç Anadolu Volkanları: Karadağ (Karaman), Karacadağ (Konya), Hasandağı (Aksaray), Melendiz (Niğde), Erciyes (Kayseri).',
    osymTip: 'İç Anadolu Volkanları: Karadağ -> Karacadağ -> Hasandağı -> Melendiz -> Erciyes.'
  },
  {
    id: 'mc-101',
    category: 'Madenler',
    region: 'Ege',
    questionText: 'Türkiye\'nin bor mineralleri yatakları hangi merkezlerde yoğunlaşmıştır?',
    options: ['Balıkesir (Bigadiç, Susurluk), Kütahya (Emet), Bursa (Mustafakemalpaşa), Eskişehir (Seyitgazi/Kırka)', 'Artvin (Murgul), Kastamonu (Küre), Elazığ (Maden)', 'Konya (Seydişehir), Antalya (Akseki)', 'Sivas (Divriği), Malatya (Hekimhan)', 'Batman (Raman), Adıyaman (Kahta)'],
    correctIndex: 0,
    targetCoords: [28.120, 39.400],
    explanation: 'Türkiye dünya bor rezervlerinin %73\'üne sahiptir. Yataklar Bigadiç, Susurluk, Emet, Mustafakemalpaşa ve Kırka\'dadır.',
    osymTip: 'Bor Yatakları = Bigadiç, Susurluk, Emet, Mustafakemalpaşa, Kırka (Seyitgazi).'
  },
  {
    id: 'mc-102',
    category: 'Madenler',
    region: 'Akdeniz',
    questionText: 'Alüminyumun hammaddesi olan boksit madeni ve bu madeni işleyen Türkiye\'nin tek alüminyum tesisi nerededir?',
    options: ['Konya (Seydişehir) ve Antalya (Akseki)', 'Balıkesir (Bandırma)', 'Elazığ (Keban)', 'Muğla (Yatağan)', 'Zonguldak (Ereğli)'],
    correctIndex: 0,
    targetCoords: [31.880, 37.420],
    explanation: 'Boksit yatakları Seydişehir (Konya) ve Akseki\'de (Antalya) bulunur; Seydişehir Entegre Alüminyum Tesisleri\'nde işlenir.',
    osymTip: 'Boksit = Alüminyum Hammaddesi = Seydişehir & Akseki.'
  },
  {
    id: 'mc-103',
    category: 'Madenler',
    region: 'Doğu Anadolu',
    questionText: 'Paslanmaz çelik sanayisinin temel girdisi olan FERROKROM tesisleri hangi iki ilimizde bulunmaktadır?',
    options: ['Elazığ ve Antalya', 'İzmir ve Mersin', 'Zonguldak ve Karabük', 'Sivas ve Malatya', 'Bursa ve Kocaeli'],
    correctIndex: 0,
    targetCoords: [39.220, 38.680],
    explanation: 'Krom yatakları Elazığ (Guleman), Fethiye-Köyceğiz ve Kop Dağı\'nda bulunur. Ferrokrom tesisleri Elazığ ve Antalya\'dadır.',
    osymTip: 'Ferrokrom Tesisleri = Elazığ (Hammaddeye yakınlık) ve Antalya (Liman/Ulaşım).'
  },
  {
    id: 'mc-104',
    category: 'Geçitler',
    region: 'Akdeniz',
    questionText: 'Akdeniz Bölgesi\'ni İç Anadolu\'ya bağlayan tarihi ve stratejik geçitler batıdan doğuya sırasıyla hangileridir?',
    options: ['Çubuk, Sertavul, Gülek, Belen', 'Zigana, Kop, Ovit, Ilgaz', 'Geyve, Bolu, Cankurtaran, Canik', 'Belen, Gülek, Sertavul, Çubuk', 'Gülek, Çubuk, Sertavul, Belen'],
    correctIndex: 0,
    targetCoords: [34.800, 37.200],
    explanation: 'Akdeniz Geçitleri (Çok Sayıda Gül Bulunur): Çubuk (Antalya-Göller), Sertavul (Silifke-Karaman), Gülek (Çukurova-İç Anadolu), Belen (İskenderun-Hatay).',
    osymTip: 'Akdeniz Geçitleri = Çubuk -> Sertavul -> Gülek -> Belen.'
  },
  {
    id: 'mc-105',
    category: 'Geçitler',
    region: 'Karadeniz',
    questionText: 'Doğu Karadeniz kıyısını Erzurum ve Doğu Anadolu\'ya bağlayan; üzerinde yeni Zigana ve Ovit tünellerinin bulunduğu geçitler hangileridir?',
    options: ['Zigana (Kalkanlı) ve Ovit Geçitleri', 'Çubuk ve Sertavul', 'Ilgaz ve Ecevit', 'Gülek ve Belen', 'Cankurtaran ve Sakar'],
    correctIndex: 0,
    targetCoords: [39.400, 40.600],
    explanation: 'Zigana Geçidi (Trabzon-Gümüşhane) ve Ovit Tüneli (Rize-İspir-Erzurum) Karadeniz\'i Doğu Anadolu\'ya bağlar.',
    osymTip: 'Zigana = Trabzon-Gümüşhane, Kop = Bayburt-Erzurum, Ovit = Rize-Erzurum.'
  },
  {
    id: 'mc-106',
    category: 'Fiziki',
    region: 'Ege',
    questionText: 'Dalga ve akıntıların taşıdığı kumların bir adayı karaya bağlamasıyla oluşan "SAPLI ADA / TOMBOLO" oluşumunun Türkiye\'deki en tipik iki örneği hangileridir?',
    options: ['Balıkesir Kapıdağ Yarımadası ve Sinop İnceburun Yarımadası', 'Çeşme ve Bodrum Yarımadaları', 'Datça ve Bozburun Yarımadaları', 'Gelibolu ve Biga Yarımadaları', 'Kocaeli ve Armutlu Yarımadaları'],
    correctIndex: 0,
    targetCoords: [27.850, 40.450],
    explanation: 'Tombolo (Saplı Ada): Dalga biriktirmesiyle bir ada karaya bağlanır. En belirgin örnekleri Kapıdağ Yarımadası (Marmara) ve Sinop Yarımadası\'dır.',
    osymTip: 'Tombolo (Saplı Ada) = Kapıdağ Yarımadası (Balıkesir) & Sinop Şehir Merkezi.'
  },
  {
    id: 'mc-107',
    category: 'Fiziki',
    region: 'Akdeniz',
    questionText: 'Türkiye\'de "DALMAÇYA KIYI TİPİ" ve "KALANKLI KIYI TİPİ" nerede görülür?',
    options: ['Dalmaçya: Antalya Kaş-Finike kıyıları; Kalanklı: Mersin-Silifke kıyıları', 'Dalmaçya: Rize-Hopa kıyıları; Kalanklı: İzmir-Çeşme', 'Dalmaçya: İstanbul Boğazı; Kalanklı: Sinop', 'Dalmaçya: Fethiye Körfezi; Kalanklı: İzmit Körfezi', 'Dalmaçya: Çanakkale; Kalanklı: Samsun'],
    correctIndex: 0,
    targetCoords: [29.640, 36.200],
    explanation: 'Dalmaçya Kıyı Tipi: Dağların kıyıya paralel olduğu yerlerde deniz basmasıyla adacıklar dizilmesi (Antalya Kaş-Finike). Kalanklı Kıyı: Kanyon vadilerin deniz suyuyla dolması (Mersin).',
    osymTip: 'Dalmaçya Kıyı Tipi = Antalya Kaş - Finike kıyıları.'
  },
  {
    id: 'mc-108',
    category: 'Fiziki',
    region: 'Marmara',
    questionText: 'İstanbul Boğazı, Çanakkale Boğazı ve Haliç hangi kıyı tipine örnektir?',
    options: ['Ria Tipi Kıyı', 'Dalmaçya Tipi Kıyı', 'Boyuna Kıyı Tipi', 'Enine Kıyı Tipi', 'Fiyort Tipi Kıyı'],
    correctIndex: 0,
    targetCoords: [29.050, 41.100],
    explanation: 'Eski akarsu vadilerinin deniz altında kalmasıyla oluşan kıyılara Ria Tipi Kıyı denir. İstanbul & Çanakkale Boğazları, Haliç ve GB Ege kıyıları örnektir.',
    osymTip: 'Ria Kıyı Tipi = İstanbul Boğazı, Çanakkale Boğazı, Haliç, Gökova.'
  },
  {
    id: 'mc-109',
    category: 'İklim',
    region: 'Karadeniz',
    questionText: 'Rize ve çevresinde mikroklima sayesinde mandalina, turunçgil ve çay tarımı yapılabilmesini; Artvin Çoruh Vadisi\'nde zeytin yetişmesini sağlayan temel klimatolojik etken nedir?',
    options: ['Kafkas ve Kaçkar Dağları\'ndan aşağı doğru esen FÖHN Rüzgarları', 'Muson Rüzgarları', 'Kutup kökenli Karayel', 'Lodos rüzgarının nemi', 'Samyeli rüzgarı'],
    correctIndex: 0,
    targetCoords: [40.520, 41.020],
    explanation: 'Dağlardan kıyıya inen havanın sürtünmeyle her 100 metrede 1°C ısınmasıyla Föhn rüzgarı oluşur ve Rize mikroklimasını meydana getirir.',
    osymTip: 'Rize Turunçgil / Artvin Zeytin Mikrokliması = Föhn Rüzgarları.'
  },
  {
    id: 'mc-110',
    category: 'Ekonomik',
    region: 'İç Anadolu',
    questionText: 'Türkiye\'de "Şeker Fabrikaları"nın ülkenin hemen her bölgesinde yaygın olmasının temel sebebi nedir?',
    options: ['Şeker pancarının hasattan sonra bekletilmeden hızla işlenmesi zorunluluğu (Çabuk bozulabilirlik)', 'Şekerin taşıma maliyetinin çok pahalı olması', 'Her bölgede pancar tüketiminin çok yüksek olması', 'Şeker fabrikalarının sadece küçük sermaye gerektirmesi', 'İklim şartlarının her yerde tropikal olması'],
    correctIndex: 0,
    targetCoords: [32.850, 39.920],
    explanation: 'Şeker pancarı hasat edildikten hemen sonra işlenmezse şeker oranını hızla kaybeder ve çürür. Bu yüzden fabrikalar tarım alanlarına çok yakın kurulur.',
    osymTip: 'Şeker Fabrikaları = Hammaddeye Yakınlık Zorunluluğu (Çabuk Bozulma).'
  }
];

