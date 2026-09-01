import { ALL_GEO_FEATURES, GeoFeature } from './turkeyData';
import { PROVINCES_81_DATA } from './provinces81Data';

export interface PinGameQuestion {
  id: string;
  title: string;
  questionText: string;
  category: 'Dağlar' | 'Akarsular' | 'Göller' | 'Sınır Kapıları' | 'Geçitler' | 'Platolar & Ovalar' | 'Madenler' | 'Karstik & Kıyı' | 'Antik Kentler' | 'Mağaralar' | 'Şehirler';
  region?: 'Marmara' | 'Ege' | 'Akdeniz' | 'İç Anadolu' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu';
  targetFeatureId: string;
  targetCoords: [number, number]; // [lng, lat]
  hint: string;
  explanation: string;
  kpssTip: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  category: string;
  region?: 'Marmara' | 'Ege' | 'Akdeniz' | 'İç Anadolu' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu';
  questionText: string;
  options: string[];
  correctIndex: number;
  focusFeatureId?: string;
  targetCoords?: [number, number];
  explanation: string;
  osymTip: string;
}

export function matchesCategory(itemCategory: string, filterCategory: string): boolean {
  if (!filterCategory || filterCategory === 'Genel' || filterCategory === 'Tümü') return true;
  if (!itemCategory) return false;

  const normItem = itemCategory.toLowerCase().trim();
  const normFilter = filterCategory.toLowerCase().trim();

  if (normItem === normFilter) return true;
  if (normItem.includes(normFilter) || normFilter.includes(normItem)) return true;

  // 81 İl / Şehirler
  if ((normFilter.includes('şehir') || normFilter.includes('81') || normFilter.includes('il')) && (normItem.includes('şehir') || normItem.includes('il'))) return true;

  // Split tokens like "Platolar & Ovalar", "Karstik & Kıyı", "Madenler / Enerji"
  const filterParts = normFilter.split(/[&,/+]/).map(s => s.trim()).filter(Boolean);
  const itemParts = normItem.split(/[&,/+]/).map(s => s.trim()).filter(Boolean);

  for (const fp of filterParts) {
    if (normItem.includes(fp)) return true;
    for (const ip of itemParts) {
      if (ip.includes(fp) || fp.includes(ip)) return true;
    }
  }

  // Common aliases
  if (normFilter.includes('plato') && (normItem.includes('plato') || normItem.includes('ova'))) return true;
  if (normFilter.includes('ova') && (normItem.includes('ova') || normItem.includes('delta') || normItem.includes('polye'))) return true;
  if (normFilter.includes('dağ') && (normItem.includes('dağ') || normItem.includes('volkan') || normItem.includes('zirve'))) return true;
  if (normFilter.includes('göl') && normItem.includes('göl')) return true;
  if (normFilter.includes('akarsu') && (normItem.includes('akarsu') || normItem.includes('nehir') || normItem.includes('çay'))) return true;
  if (normFilter.includes('geçit') && (normItem.includes('geçit') || normItem.includes('tünel') || normItem.includes('boğaz'))) return true;
  if (normFilter.includes('sınır') && (normItem.includes('sınır') || normItem.includes('kapı') || normItem.includes('gümrük'))) return true;
  if (normFilter.includes('maden') && (normItem.includes('maden') || normItem.includes('enerji') || normItem.includes('petrol') || normItem.includes('santral'))) return true;
  if (normFilter.includes('karst') && (normItem.includes('karst') || normItem.includes('kıyı') || normItem.includes('mağara') || normItem.includes('obruk') || normItem.includes('traverten') || normItem.includes('tombolo'))) return true;

  return false;
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
  if (category && category !== 'Genel' && category !== 'Tümü') {
    list = PIN_GAME_QUESTIONS.filter((q) => matchesCategory(q.category, category));
  }
  return shuffle ? shuffleArray(list) : list;
}

export function getFilteredQuizQuestions(category: string, shuffle: boolean = false): MultipleChoiceQuestion[] {
  let list = MULTIPLE_CHOICE_QUESTIONS;
  if (category && category !== 'Genel' && category !== 'Tümü') {
    list = MULTIPLE_CHOICE_QUESTIONS.filter((q) => matchesCategory(q.category, category));
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

export function cleanFeatureTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/\s*\((?!.*\d+\s*m)[^)]*\)/gi, '')
    .trim();
}

/**
 * Strips province, district and spoiler hints from multiple choice options
 */
export function cleanOptionName(option: string): string {
  if (!option) return '';
  let clean = option;

  // Remove parenthesized notes like (Bitlis), (Samsun), (Manisa), (Burdur), (Maar), (Badlands) etc.
  clean = clean.replace(/\s*\([^)]*\)/g, '');

  // Remove trailing or leading city attachments like " - Samsun", " / İzmir", "Bursa Uludağ"
  TURKEY_PROVINCES_AND_DISTRICTS.forEach(city => {
    const regTrailing = new RegExp(`\\s*[-/:]\\s*${city}\\b`, 'gi');
    clean = clean.replace(regTrailing, '');
    const regLeading = new RegExp(`^${city}\\s+`, 'gi');
    clean = clean.replace(regLeading, '');
  });

  return clean.replace(/\s+/g, ' ').trim();
}

/**
 * Derives province / city name from a GeoFeature or question for map display
 */
export function getFeatureCityName(
  featureOrCoords: {
    plate?: number;
    name?: string;
    id?: string;
    targetFeatureId?: string;
    province?: string;
    city?: string;
    title?: string;
    region?: string;
  } | null | undefined,
  name?: string,
  region?: string
): string {
  if (!featureOrCoords) return '';
  
  // If it's an 81 İl item
  if (featureOrCoords.plate) {
    return `${featureOrCoords.name} (Plaka: ${featureOrCoords.plate})`;
  }
  const fId = String(featureOrCoords.id || featureOrCoords.targetFeatureId || '');
  if (fId.startsWith('province-')) {
    const plateNum = parseInt(fId.replace('province-', ''), 10);
    const p = PROVINCES_81_DATA.find(prov => prov.plate === plateNum);
    if (p) return `${p.name} (Plaka: ${p.plate})`;
  }

  // If GeoFeature object has explicit province / city
  if (featureOrCoords.province) return featureOrCoords.province;
  if (featureOrCoords.city) return featureOrCoords.city;

  const targetName = (featureOrCoords.title || featureOrCoords.name || name || '').toLowerCase();
  
  // Direct province match
  const matchedProv = PROVINCES_81_DATA.find(p => targetName.startsWith(p.name.toLowerCase()) || targetName.includes(p.name.toLowerCase()));
  if (fId.startsWith('province-') || targetName.includes('il merkezi')) {
    if (matchedProv) return `${matchedProv.name} (Plaka: ${matchedProv.plate})`;
  }

  // Specific famous landmark mapping
  if (targetName.includes('ağrı dağı')) return 'Ağrı / Iğdır';
  if (targetName.includes('erciyes')) return 'Kayseri';
  if (targetName.includes('hasan dağ')) return 'Aksaray / Niğde';
  if (targetName.includes('nemrut')) return targetName.includes('adıyaman') || targetName.includes('heykel') || targetName.includes('tümülüs') ? 'Adıyaman' : 'Bitlis';
  if (targetName.includes('süphan')) return 'Bitlis / Van';
  if (targetName.includes('tendürek')) return 'Ağrı / Van';
  if (targetName.includes('cilo') || targetName.includes('uludoruk')) return 'Hakkari';
  if (targetName.includes('kaçkar')) return 'Rize / Artvin';
  if (targetName.includes('uludağ')) return 'Bursa';
  if (targetName.includes('kula')) return 'Manisa';
  if (targetName.includes('meke') || targetName.includes('karapınar')) return 'Konya';
  if (targetName.includes('salda')) return 'Burdur';
  if (targetName.includes('pamukkale')) return 'Denizli';
  if (targetName.includes('kapıkule') || targetName.includes('ipsala') || targetName.includes('hamzabeyli')) return 'Edirne';
  if (targetName.includes('sarp')) return 'Artvin';
  if (targetName.includes('habur')) return 'Şırnak';
  if (targetName.includes('gümüşdoğrayan') || targetName.includes('gürbulak')) return 'Ağrı';
  if (targetName.includes('dilucu')) return 'Iğdır';
  if (targetName.includes('gülek') || targetName.includes('çukurova')) return 'Adana / Mersin';
  if (targetName.includes('zigana')) return 'Trabzon / Gümüşhane';
  if (targetName.includes('kop')) return 'Bayburt / Erzurum';
  if (targetName.includes('sertavul')) return 'Karaman / Mersin';
  if (targetName.includes('belen')) return 'Hatay';
  if (targetName.includes('ovit')) return 'Rize / Erzurum';
  if (targetName.includes('bafra') || targetName.includes('çarşamba') || targetName.includes('canik')) return 'Samsun';
  if (targetName.includes('silifke')) return 'Mersin';
  if (targetName.includes('insuyu')) return 'Burdur';
  if (targetName.includes('damlataş') || targetName.includes('karain') || targetName.includes('düden') || targetName.includes('manavgat')) return 'Antalya';
  if (targetName.includes('tortum') || targetName.includes('palandöken')) return 'Erzurum';
  if (targetName.includes('muradiye') || targetName.includes('van gölü') || targetName.includes('akdamar')) return 'Van';
  if (targetName.includes('çıldır')) return 'Ardahan / Kars';
  if (targetName.includes('bozok') || targetName.includes('çamlık')) return 'Yozgat';
  if (targetName.includes('haymana') || targetName.includes('mogan') || targetName.includes('eymir')) return 'Ankara';
  if (targetName.includes('cihanbeyli') || targetName.includes('çatalhöyük') || targetName.includes('obruk')) return 'Konya';
  if (targetName.includes('teke')) return 'Antalya / Muğla';
  if (targetName.includes('taşeli')) return 'Mersin / Karaman';
  if (targetName.includes('erzurum-kars')) return 'Erzurum / Kars';
  if (targetName.includes('yazılıkaya') || targetName.includes('porsuk')) return 'Eskişehir';
  if (targetName.includes('kapıdağ') || targetName.includes('manyas')) return 'Balıkesir';
  if (targetName.includes('inceburun') || targetName.includes('hamsilos')) return 'Sinop';
  if (targetName.includes('menemen') || targetName.includes('efes') || targetName.includes('bergama')) return 'İzmir';
  if (targetName.includes('balat') || targetName.includes('afrodisias')) return 'Aydın';
  if (targetName.includes('dikili')) return 'İzmir';
  if (targetName.includes('göbeklitepe') || targetName.includes('harran') || targetName.includes('karahantepe')) return 'Şanlıurfa';
  if (targetName.includes('zeukma') || targetName.includes('zeugma') || targetName.includes('rumkale')) return 'Gaziantep';
  if (targetName.includes('ani harabeleri') || targetName.includes('sarıkamış')) return 'Kars';
  if (targetName.includes('hattuşa') || targetName.includes('alacahöyük')) return 'Çorum';
  if (targetName.includes('divriği')) return 'Sivas';
  if (targetName.includes('keban') || targetName.includes('hazar gölü')) return 'Elazığ';
  if (targetName.includes('munzur')) return 'Tunceli';
  if (targetName.includes('ulubey')) return 'Uşak';
  if (targetName.includes('filyos') || targetName.includes('çatalağzı') || targetName.includes('gökgöl')) return 'Zonguldak';
  if (targetName.includes('kardemir') || targetName.includes('safranbolu')) return 'Karabük';
  if (targetName.includes('botan')) return 'Siirt';
  if (targetName.includes('ihlara')) return 'Aksaray';
  if (targetName.includes('abant') || targetName.includes('yedigöller')) return 'Bolu';
  if (targetName.includes('ballıca')) return 'Tokat';
  if (targetName.includes('dupnisa') || targetName.includes('iğneada')) return 'Kırklareli';
  if (targetName.includes('karaca mağarası')) return 'Gümüşhane';
  if (targetName.includes('oylat')) return 'Bursa';
  if (targetName.includes('çal mağarası') || targetName.includes('sümela') || targetName.includes('uzungöl')) return 'Trabzon';
  if (targetName.includes('kaklık')) return 'Denizli';
  if (targetName.includes('cehennemağzı')) return 'Zonguldak';

  if (featureOrCoords.region || region) {
    return `${featureOrCoords.region || region} Bölgesi`;
  }
  return '';
}

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
    id: 'pin-22-tefenni',
    title: 'Tefenni Ovası (Karstik Polye)',
    questionText: 'TAKKEM şifresinin "T" harfini oluşturan, Burdur ilindeki karstik polye ovası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-tefenni',
    targetCoords: [29.780, 37.310],
    hint: 'Burdur ili sınırlarında yer alır.',
    explanation: 'Tefenni Ovası kireçtaşlarının erimesiyle oluşan karstik polye ovasıdır.',
    kpssTip: 'TAKKEM: T = Tefenni (Burdur)'
  },
  {
    id: 'pin-22-acipayam',
    title: 'Acıpayam Ovası (Karstik Polye)',
    questionText: 'TAKKEM şifresinin "A" harfini oluşturan, Denizli ilindeki karstik polye ovası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Ege',
    targetFeatureId: 'pl-acipayam',
    targetCoords: [29.350, 37.430],
    hint: 'Denizli ili sınırlarında yer alır.',
    explanation: 'Acıpayam Ovası kireçtaşlarının erimesiyle oluşan geniş karstik polye sahasıdır.',
    kpssTip: 'TAKKEM: A = Acıpayam (Denizli)'
  },
  {
    id: 'pin-22-korkuteli',
    title: 'Korkuteli Ovası (Karstik Polye)',
    questionText: 'TAKKEM şifresinin "K" harfi olan ve kültür mantarcılığında lider Antalya polye ovası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-korkuteli',
    targetCoords: [30.200, 37.060],
    hint: 'Antalya ili batısında yer alır.',
    explanation: 'Korkuteli Ovası karstik polye tabanında yer alır ve mantarcılığıyla meşhurdur.',
    kpssTip: 'TAKKEM: K = Korkuteli (Antalya)'
  },
  {
    id: 'pin-22-kestel',
    title: 'Kestel Ovası (Karstik Polye)',
    questionText: 'TAKKEM şifresinin ikinci "K" harfi olan Burdur/Bucak karstik polye ovası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-kestel',
    targetCoords: [30.400, 37.380],
    hint: 'Burdur Bucak sınırındadır.',
    explanation: 'Kestel Ovası karstik düdenlerle yeraltına su boşalımı gerçekleşen polye sahasıdır.',
    kpssTip: 'TAKKEM: K = Kestel (Burdur)'
  },
  {
    id: 'pin-22-elmali',
    title: 'Elmalı Ovası (Karstik Polye)',
    questionText: 'TAKKEM şifresinin "E" harfi olan, Avlan ve Karagöl gibi karstik gölleri barındıran Antalya polyesi nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-elmali',
    targetCoords: [29.920, 36.730],
    hint: 'Antalya ili Elmalı ilçesindedir.',
    explanation: 'Elmalı Ovası karstik polye havzasıdır ve elma bahçeleriyle tanınır.',
    kpssTip: 'TAKKEM: E = Elmalı (Antalya)'
  },
  {
    id: 'pin-22-mugla',
    title: 'Muğla Ovası (Menteşe Polyesi)',
    questionText: 'TAKKEM şifresinin son harfi "M"yi oluşturan Muğla il merkezinin kurulu olduğu polye ovası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Ege',
    targetFeatureId: 'pl-mugla',
    targetCoords: [28.370, 37.210],
    hint: 'Muğla il merkezinin kurulu olduğu çanaktır.',
    explanation: 'Muğla Ovası Menteşe yöresindeki tipik karstik polye çöküntüsüdür.',
    kpssTip: 'TAKKEM: M = Muğla Ovası'
  },
  {
    id: 'pin-23-bafra',
    title: 'Bafra Deltası',
    questionText: 'Kızılırmak Nehri\'nin Karadeniz\'e döküldüğü yerde oluşturduğu Türkiye\'nin en büyük delta ovalarından biri nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Karadeniz',
    targetFeatureId: 'pl-bafra',
    targetCoords: [35.950, 41.570],
    hint: 'Samsun ili batı kıyısındadır.',
    explanation: 'Bafra Ovası Kızılırmak\'ın taşıdığı alüvyonlarla oluşmuş zengin delta ovasıdır.',
    kpssTip: 'Bafra Deltası = Kızılırmak (Samsun)'
  },
  {
    id: 'pin-23-carsamba',
    title: 'Çarşamba Deltası',
    questionText: 'Yeşilırmak Nehri\'nin Karadeniz\'e ulaştığı sahada oluşturduğu devasa alüvyal delta ovası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Karadeniz',
    targetFeatureId: 'pl-carsamba',
    targetCoords: [36.700, 41.350],
    hint: 'Samsun ili doğu sahilindedir.',
    explanation: 'Çarşamba Ovası Yeşilırmak\'ın alüvyonlarıyla oluşturduğu Karadeniz\'in en büyük deltalarındandır.',
    kpssTip: 'Çarşamba Deltası = Yeşilırmak (Samsun)'
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
    id: 'pin-25-teke',
    title: 'Teke Platosu',
    questionText: 'Antalya ile Muğla arasında kireçtaşı (Kalker) yapılı, engebeli, kıl keçisi yetiştirilen karstik plato nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-teke',
    targetCoords: [29.800, 36.600],
    hint: 'Antalya batısı Teke Yarımadası\'ndadır.',
    explanation: 'Teke Platosu karstik kalkerli yapısı sebebiyle su tutmaz ve nüfusu çok seyrektir.',
    kpssTip: 'Teke = Karstik Kalker + Seyrek Nüfus + Kıl Keçisi'
  },
  {
    id: 'pin-25-taseli',
    title: 'Taşeli Platosu',
    questionText: 'Mersin ve Karaman sınırında Göksu kanyonlarıyla parçalanmış, karstik kireçtaşı yapılı plato nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    targetFeatureId: 'pl-taseli',
    targetCoords: [32.800, 36.600],
    hint: 'Mersin-Karaman-Antalya kesişimindedir.',
    explanation: 'Taşeli Platosu Göksu kanyonları ile derin yarılmış karstik platodur.',
    kpssTip: 'Taşeli = Göksu Kanyonları + Karstik Yapı + Kıl Keçisi'
  },
  {
    id: 'pin-25-haymana',
    title: 'Haymana Platosu',
    questionText: 'Ankara güneyinde yer alan, tiftik (Ankara) keçisi yetiştiriciliğinin merkezi tabaka düzlüğü platosu nerededir?',
    category: 'Platolar & Ovalar',
    region: 'İç Anadolu',
    targetFeatureId: 'pl-haymana',
    targetCoords: [32.500, 39.430],
    hint: 'Ankara ilindedir.',
    explanation: 'Haymana Platosu tabaka düzlüğü platosudur ve tiftik keçisiyle ünlüdür.',
    kpssTip: 'Haymana = Ankara Tiftik Keçisi + Tabaka Düzlüğü'
  },
  {
    id: 'pin-25-cihanbeyli',
    title: 'Cihanbeyli Platosu',
    questionText: 'Tuz Gölü batısında Konya kuzeyinde yer alan Türkiye\'nin tahıl ambarı tabaka düzlüğü platosu nerededir?',
    category: 'Platolar & Ovalar',
    region: 'İç Anadolu',
    targetFeatureId: 'pl-cihanbeyli',
    targetCoords: [32.900, 38.650],
    hint: 'Konya ilindedir.',
    explanation: 'Cihanbeyli Platosu buğday ve arpa tarımının yoğun olduğu tabaka düzlüğü platosudur.',
    kpssTip: 'Cihanbeyli = Konya Tahıl Ambarı Tabaka Düzlüğü'
  },
  {
    id: 'pin-25-obruk',
    title: 'Obruk Platosu',
    questionText: 'Konya ile Karapınar arasında yer alan ve yeraltı çökmeleriyle çok sayıda karstik obruk barındıran plato nerededir?',
    category: 'Platolar & Ovalar',
    region: 'İç Anadolu',
    targetFeatureId: 'pl-obruk',
    targetCoords: [33.300, 38.000],
    hint: 'Konya Karapınar hattındadır.',
    explanation: 'Obruk Platosu üzerinde Kızören, Meyil, Çıralı gibi dev karstik çöküntü obrukları yer alır.',
    kpssTip: 'Obruk Platosu = Yeraltı Çökmeleri + Kızören Obruğu'
  },
  {
    id: 'pin-25-bozok',
    title: 'Bozok Platosu',
    questionText: 'Yozgat çevresinde Kızılırmak yayı içerisinde kalan İç Anadolu\'nun en geniş tabaka düzlüğü platosu nerededir?',
    category: 'Platolar & Ovalar',
    region: 'İç Anadolu',
    targetFeatureId: 'pl-bozok',
    targetCoords: [35.000, 39.800],
    hint: 'Yozgat ilindedir.',
    explanation: 'Bozok Platosu Kızılırmak yayı içinde kalan geniş tabaka düzlüğü platosudur.',
    kpssTip: 'Bozok = Yozgat + Kızılırmak Yayı İçi + Koyun Yetiştiriciliği'
  },
  {
    id: 'pin-25-uzunyayla',
    title: 'Uzunyayla Platosu',
    questionText: 'Sivas Kangal ile Kayseri Pınarbaşı arasında yer alan İç Anadolu\'nun en yüksek ve en soğuk platosu nerededir?',
    category: 'Platolar & Ovalar',
    region: 'İç Anadolu',
    targetFeatureId: 'pl-uzunyayla',
    targetCoords: [36.500, 39.200],
    hint: 'Sivas-Kayseri sınırındadır.',
    explanation: 'Uzunyayla Platosu 1600 metre rakımlı yüksek tabaka düzlüğü platosudur.',
    kpssTip: 'Uzunyayla = Sivas-Kayseri Sınırı + Uzunyayla Atı + Yüksek Plato'
  },
  {
    id: 'pin-25-konya-ovasi',
    title: 'Konya Ovası',
    questionText: 'Kuvaterner göl tabanı üzerinde oluşan Türkiye\'nin en büyük iç tektonik ovası nerededir?',
    category: 'Platolar & Ovalar',
    region: 'İç Anadolu',
    targetFeatureId: 'pl-konya',
    targetCoords: [32.500, 37.870],
    hint: 'Konya merkez havzasındadır.',
    explanation: 'Konya Ovası eski göl tabanı ve tektonik çöküntüyle oluşan Türkiye\'nin en geniş iç ovasıdır.',
    kpssTip: 'Konya Ovası = En Büyük İç Ova + Mavi Tünel KOP Projesi'
  },
  {
    id: 'pin-25-harran',
    title: 'Harran (Altınbaşak) Ovası',
    questionText: 'GAP sulamasıyla Türkiye pamuk üretiminin kalbi haline gelen kırmızı killi ova nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Güneydoğu Anadolu',
    targetFeatureId: 'pl-harran',
    targetCoords: [39.020, 36.870],
    hint: 'Şanlıurfa ilindedir.',
    explanation: 'Harran Ovası Fırat Nehri sularıyla sulanarak pamuk üretiminde Türkiye birincisidir.',
    kpssTip: 'Harran = GAP Sulaması + Türkiye Pamuk Şampiyonu + Tuzlanma Riski'
  },
  {
    id: 'pin-25-igdir',
    title: 'Iğdır (Sürmeli) Ovası',
    questionText: 'Etrafı yüksek dağlarla çevrili çukurlukta fön rüzgarı etkisiyle pamuk ve kayısı yetiştirilen "Doğu\'nun Çukurovası" nerededir?',
    category: 'Platolar & Ovalar',
    region: 'Doğu Anadolu',
    targetFeatureId: 'pl-igdir',
    targetCoords: [44.050, 39.920],
    hint: 'Iğdır ilindedir.',
    explanation: 'Iğdır Ovası çukurda kaldığı için fön rüzgarlarıyla mikroklima özelliği kazanmıştır.',
    kpssTip: 'Iğdır Ovası = Doğu\'nun Çukurova\'sı + Fön Rüzgarı + Mikroklima Pamuk'
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
  if (type === 'ancient_city') return 'Antik Kentler';
  if (type === 'cave') return 'Mağaralar';

  if (categoryName) {
    if (categoryName.includes('Antik') || categoryName.includes('Ören') || categoryName.includes('Hitit') || categoryName.includes('Frig') || categoryName.includes('Lidya')) return 'Antik Kentler';
    if (categoryName.includes('Mağara') || categoryName.includes('Damlataş') || categoryName.includes('Sarkıt')) return 'Mağaralar';
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
    } else if (f.type === 'ancient_city') {
      qText = `Tarihi ve arkeolojik zenginliğimiz olan ${f.name} haritada nerededir?`;
    } else if (f.type === 'cave') {
      qText = `Önemli karstik mağaralarımızdan biri olan ${f.name} haritada nerededir?`;
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

export const PROVINCE_PIN_QUESTIONS: PinGameQuestion[] = PROVINCES_81_DATA.map((p) => ({
  id: `pin-province-${p.plate}`,
  title: `${p.name} (İl Merkezi - Plaka: ${p.plate < 10 ? '0' + p.plate : p.plate})`,
  questionText: `Haritada ${p.name} ilini bulun ve tam konumunu işaretleyin! (${p.famousFor})`,
  category: 'Şehirler' as const,
  region: p.region,
  targetFeatureId: `province-${p.plate}`,
  targetCoords: p.coordinates,
  hint: `${p.region} Bölgesi'nde yer alır. Plaka Kodu: ${p.plate}. Önemli özellikleri: ${p.famousFor}`,
  explanation: `${p.name} (Plaka: ${p.plate}, ${p.region} Bölgesi): ${p.famousFor}`,
  kpssTip: `KPSS & 81 İl Bilgisi: ${p.name} ili ${p.region} Bölgesi'ndedir. Anahtar kavramlar: ${p.kpssKeywords.join(', ')}`
}));

export const PIN_GAME_QUESTIONS: PinGameQuestion[] = [
  ...HANDCRAFTED_PIN_QUESTIONS,
  ...DYNAMIC_PIN_QUESTIONS,
  ...PROVINCE_PIN_QUESTIONS
];

const HANDCRAFTED_MULTIPLE_CHOICE_QUESTIONS: MultipleChoiceQuestion[] = [
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
    category: 'İklim & Bitki Örtüsü',
    region: 'Karadeniz',
    questionText: 'Doğu Karadeniz kıyılarında (Rize ve çevresi) kışların ılık geçmesi ve fön rüzgarlarının etkisiyle zeytin ve turunçgil yetiştirilmesi hangi coğrafi kavramla açıklanır?',
    options: ['Mikroklima Alanı', 'Karasallık Şiddeti', 'Termik Yüksek Basınç', 'Fiziksel Ayrışma', 'Kütle Hareketi'],
    correctIndex: 0,
    targetCoords: [40.520, 41.025],
    explanation: 'Rize ve Çoruh vadisinde çevreye göre farklı iklim koşulları görülmesi mikroklima özelliğiyle açıklanır.',
    osymTip: 'Rize zeytin/turunçgil ve Iğdır pamuk = Mikroklima.'
  },
  {
    id: 'mc-50',
    category: 'Dağlar',
    region: 'Ege',
    questionText: 'Aşağıdaki dağlardan hangisi Ege Bölgesi\'nde yer alan faylanma (kırılma) sonucu oluşmuş bir "Horst" dağı DEĞİLDİR?',
    options: ['Erciyes Dağı', 'Kaz Dağı', 'Madra Dağı', 'Yunt Dağı', 'Aydın Dağları'],
    correctIndex: 0,
    targetCoords: [35.450, 38.530],
    explanation: 'Erciyes Dağı İç Anadolu\'da yer alan bir volkanik dağdır; Ege\'deki kırık (horst) dağlarından biri değildir.',
    osymTip: 'Ege Kırık Dağları: Kaz, Madra, Yunt, Boz, Aydın, Menteşe Dağları.'
  },
  {
    id: 'mc-51',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    questionText: 'Kalkerli (kireçtaşı) arazinin yaygın olduğu ve karstik erime çukurluklarının birleşmesiyle oluşan Taşeli ve Teke platoları hangi coğrafi plato türüne örnektir?',
    options: ['Karstik Platolar', 'Volkanik / Lav Platoları', 'Aşınım Düzlüğü Platoları', 'Tabaka Düzlüğü Platoları', 'Alüvyal Platolar'],
    correctIndex: 0,
    targetCoords: [32.850, 36.650],
    explanation: 'Teke ve Taşeli platoları karstik erimelerle şekillenmiş Türkiye\'nin en tipik karstik platolarıdır.',
    osymTip: 'Teke ve Taşeli = Karstik Plato + Kıl Keçisi Yetiştiriciliği.'
  },
  {
    id: 'mc-52',
    category: 'Akarsular',
    region: 'Akdeniz',
    questionText: 'Manavgat, Aksu ve Köprüçay nehirleri yaz mevsiminde kuraklığa rağmen debilerini önemli ölçüde korurlar. Bu durumun temel nedeni nedir?',
    options: ['Karstik gür kaynaklarla (Voklüz) beslenmeleri', 'Buzul erimelerinin yazın artması', 'Yaz aylarında muson yağışları alması', 'Baraj kapaklarının sürekli açık tutulması', 'Karasal iklim kuşağında yer almaları'],
    correctIndex: 0,
    targetCoords: [31.450, 36.850],
    explanation: 'Akdeniz akarsuları karstik yer altı kaynaklarıyla (voklüz) beslendikleri için yaz kuraklığında bile kurumazlar.',
    osymTip: 'Manavgat/Köprüçay = Karstik kaynak (Voklüz) beslenmeli akarsulardır.'
  },
  {
    id: 'mc-53',
    category: 'Nüfus & Yerleşme',
    region: 'Doğu Anadolu',
    questionText: 'Türkiye\'de yükseltinin ve kış soğuklarının en fazla olduğu, buna bağlı olarak nüfus yoğunluğunun Türkiye ortalamasının çok altında kaldığı bölüm hangisidir?',
    options: ['Erzurum-Kars Bölümü', 'Yukarı Sakarya Bölümü', 'Çatalca-Kocaeli Bölümü', 'Ege Kıyı Bölümü', 'Antalya Bölümü'],
    correctIndex: 0,
    targetCoords: [42.100, 40.200],
    explanation: 'Erzurum-Kars Bölümü sert karasal iklim ve yüksek rakım sebebiyle tenhadır.',
    osymTip: 'Erzurum-Kars: Yüksek rakım + Sert Karasal + Büyükbaş Mera Hayvancılığı.'
  },
  {
    id: 'mc-54',
    category: 'Tarım & Hayvancılık',
    region: 'Güneydoğu Anadolu',
    questionText: 'Güneydoğu Anadolu Projesi (GAP) ile sulamanın yaygınlaşması sonucunda üretiminde Türkiye birincisi haline gelinen ve "Beyaz Altın" olarak adlandırılan sanayi bitkisi hangisidir?',
    options: ['Pamuk', 'Çay', 'Tütün', 'Şeker Pancarı', 'Haşhaş'],
    correctIndex: 0,
    targetCoords: [38.800, 37.150],
    explanation: 'Şanlıurfa ve Harran Ovası\'nın sulanmasıyla Türkiye pamuk üretiminin yarıdan fazlası GAP bölgesinden karşılanır.',
    osymTip: 'GAP sulamasıyla liderliğe yükselen ürün: Pamuk (Şanlıurfa).'
  },
  {
    id: 'mc-55',
    category: 'Sanayi & Enerji',
    region: 'Ege',
    questionText: 'Denizli Sarayköy ve Aydın Germencik sahalarında bulunan, yerin derinliklerindeki sıcak su buharından elektrik üreten ilk santrallerimiz hangi enerji türüyle çalışır?',
    options: ['Jeotermal Enerji', 'Biyokütle Enerjisi', 'Rüzgar Enerjisi', 'Dalga Enerjisi', 'Nükleer Enerji'],
    correctIndex: 0,
    targetCoords: [28.920, 37.910],
    explanation: 'Denizli Sarayköy ve Aydın Germencik Türkiye\'nin ilk ve en büyük jeotermal enerji santrallerine ev sahipliği yapar.',
    osymTip: 'Sarayköy ve Germencik = Jeotermal Enerji.'
  },
  {
    id: 'mc-56',
    category: 'Geçitler',
    region: 'Akdeniz',
    questionText: 'Çukurova\'yı İç Anadolu\'ya (Niğde/Konya) bağlayan ve Toros Dağları üzerinde yer alan en tarihi ve stratejik geçit hangisidir?',
    options: ['Gülek Boğazı / Geçidi', 'Sertavul Geçidi', 'Zigana Geçidi', 'Kop Geçidi', 'Belen Geçidi'],
    correctIndex: 0,
    targetCoords: [34.780, 37.200],
    explanation: 'Gülek Geçidi, Adana Çukurova ile İç Anadolu arasındaki ana ulaşım arteri ve tarihi kapıdır.',
    osymTip: 'Gülek = Adana / Çukurova - İç Anadolu bağlantısı.'
  },
  {
    id: 'mc-57',
    category: 'Sınır Kapıları',
    region: 'Marmara',
    questionText: 'Türkiye\'nin Avrupa\'ya açılan en işlek ve dünyada da araç trafiği bakımından en yoğun sınır kapılarından biri olan Bulgaristan sınır kapımız hangisidir?',
    options: ['Kapıkule Sınır Kapısı (Edirne)', 'Sarp Sınır Kapısı (Artvin)', 'Habur Sınır Kapısı (Şırnak)', 'Gürbulak Sınır Kapısı (Ağrı)', 'İpsala Sınır Kapısı (Edirne)'],
    correctIndex: 0,
    targetCoords: [26.350, 41.710],
    explanation: 'Kapıkule Sınır Kapısı Bulgaristan ile olan en yoğun gümrük kapımızdır. İpsala ise Yunanistan kapısıdır.',
    osymTip: 'Kapıkule = Bulgaristan; İpsala = Yunanistan.'
  },
  {
    id: 'mc-58',
    category: 'Madenler',
    region: 'Karadeniz',
    questionText: 'Karadeniz Ereğli ve Zonguldak havzasında çıkarılan ve yüksek kalorisi nedeniyle demir-çelik sanayisinde demirin eritilmesinde kullanılan 1. Jeolojik Zaman (Paleozoik) kömürü hangisidir?',
    options: ['Taş Kömürü', 'Linyit Kömürü', 'Asfaltit', 'Turba', 'Kok Kömürü'],
    correctIndex: 0,
    targetCoords: [31.800, 41.450],
    explanation: 'Taş kömürü 1. Jeolojik Zaman (Paleozoik) arazilerinde oluşmuştur ve Türkiye\'de yalnızca Zonguldak-Karadeniz havzasında bulunur.',
    osymTip: 'Taş Kömürü = 1. Zaman (Paleozoik) = Zonguldak & Demir-Çelik eritme enerjisi.'
  },
  {
    id: 'mc-59',
    category: 'Rüzgarlar & İklim',
    region: 'İç Anadolu',
    questionText: 'Türkiye\'de ilkbahar aylarında öğleden sonraları ısınan havanın yükselmesiyle oluşan ve halk arasında "Kırkikindi Yağışları" olarak bilinen yağış türü hangisidir?',
    options: ['Konveksiyonel (Yükselim) Yağışları', 'Orografik (Yamaç) Yağışları', 'Cephesel (Frontal) Yağışları', 'Siklonik Yağışlar', 'Muson Yağışları'],
    correctIndex: 0,
    targetCoords: [32.850, 39.920],
    explanation: 'İç Anadolu\'da ilkbaharda görülen Kırkikindi yağışları tipik konveksiyonel (yükselim) yağışıdır.',
    osymTip: 'İç Anadolu İlkbahar Kırkikindi = Konveksiyonel Yağış.'
  },
  {
    id: 'mc-60',
    category: 'Turizm & Miras',
    region: 'İç Anadolu',
    questionText: 'Volkanik tüflerin sel ve rüzgar aşındırmasıyla oluştuğu, peri bacaları ve yeraltı şehirleriyle UNESCO Dünya Mirası Listesi\'nde yer alan karma miras alanımız neresidir?',
    options: ['Kapadokya (Göreme Milli Parkı)', 'Pamukkale Travertenleri', 'Nemrut Dağı Heykelleri', 'Truva Antik Kenti', 'Safranbolu Evleri'],
    correctIndex: 0,
    targetCoords: [34.830, 38.640],
    explanation: 'Kapadokya ve Pamukkale, Türkiye\'deki hem doğal hem kültürel (karma) UNESCO dünya miras alanlarıdır.',
    osymTip: 'Kapadokya ve Pamukkale = Karma Miras (Doğal + Kültürel).'
  },
  {
    id: 'mc-61',
    category: 'Akarsular',
    region: 'Güneydoğu Anadolu',
    questionText: 'Türkiye\'de doğup Suriye ve Irak topraklarından geçerek Basra Körfezi\'ne dökülen ve üzerinde Atatürk Barajı bulunan nehir hangisidir?',
    options: ['Fırat Nehri', 'Dicle Nehri', 'Aras Nehri', 'Kura Nehri', 'Asi Nehri'],
    correctIndex: 0,
    targetCoords: [38.500, 37.400],
    explanation: 'Fırat Nehri Karasu ve Murat kollarının birleşmesiyle oluşur ve Atatürk Barajı bu nehir üzerindedir.',
    osymTip: 'Atatürk, Keban ve Karakaya barajları = Fırat Nehri üzerindedir.'
  },
  {
    id: 'mc-62',
    category: 'Göller',
    region: 'İç Anadolu',
    questionText: 'Türkiye\'nin yüzölçümü bakımından 2. büyük gölü olan, yazın buharlaşmayla alanı daralan ve Türkiye tuz ihtiyacının büyük kısmını karşılayan göl hangisidir?',
    options: ['Tuz Gölü', 'Van Gölü', 'Beyşehir Gölü', 'İznik Gölü', 'Uluabat Gölü'],
    correctIndex: 0,
    targetCoords: [33.350, 38.750],
    explanation: 'Tuz Gölü sığ bir tektonik göldür ve kapalı havza özelliğindedir.',
    osymTip: 'Tuz Gölü = Tektonik + Kapalı Havza + Tuz Üretimi.'
  },
  {
    id: 'mc-63',
    category: 'Platolar & Ovalar',
    region: 'Doğu Anadolu',
    questionText: 'Türkiye\'de lav örtüsü (bazaltik tüf) üzerinde gelişen, yaz yağışlarıyla yeşeren gür çayırları ve Çernezyom (Kara Toprak) örtüsü nedeniyle Büyükbaş Hayvancılığın en yaygın yapıldığı volkanik plato hangisidir?',
    options: ['Erzurum-Kars-Ardahan Platosu', 'Haymana Platosu', 'Teke Platosu', 'Taşeli Platosu', 'Çatalca-Kocaeli Platosu'],
    correctIndex: 0,
    targetCoords: [42.100, 40.500],
    explanation: 'Erzurum-Kars ve Ardahan platoları lav platolarıdır; Çernezyom toprak ve yaz yağışları mera hayvancılığını geliştirmiştir.',
    osymTip: 'Erzurum-Kars = Lav Platosu + Çernezyom + Yaz Yağışı + Büyükbaş Mera Hayvancılığı.'
  },
  {
    id: 'mc-64',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    questionText: 'Kireç taşı (kalker) arazisinin sular tarafından çözünmesiyle oluşan, lapya ve dolinlerle engebeli hale geldiğinden tarıma elverişsiz olan ve Kıl Keçisi yetiştiriciliğinin yapıldığı karstik platolarımız hangileridir?',
    options: ['Teke ve Taşeli Platoları', 'Bozok ve Cihanbeyli Platoları', 'Yazılıkaya ve Haymana Platoları', 'Şanlıurfa ve Gaziantep Platoları', 'Çatalca ve Kocaeli Platoları'],
    correctIndex: 0,
    targetCoords: [30.100, 36.600],
    explanation: 'Akdeniz Bölgesi\'nde yer alan Teke ve Taşeli platoları kalkerli karstik platolardır ve kıl keçisi yetiştiriciliği yaygındır.',
    osymTip: 'Teke & Taşeli = Karstik Plato + Nüfus Tenha + Kıl Keçisi.'
  },
  {
    id: 'mc-65',
    category: 'Platolar & Ovalar',
    region: 'Marmara',
    questionText: 'Yükseltisi en az olan (aşınım düzlüğü / peneplen), sanayi, ticaret ve nüfus yoğunluğunun Türkiye\'de en yüksek olduğu plato hangisidir?',
    options: ['Çatalca-Kocaeli Platosu', 'Obruk Platosu', 'Uzunyayla Platosu', 'Haymana Platosu', 'Bozok Platosu'],
    correctIndex: 0,
    targetCoords: [29.100, 41.000],
    explanation: 'Çatalca-Kocaeli platosu aşınım platosudur (peneplen); Türkiye\'nin en alçak ve en gelişmiş platosudur.',
    osymTip: 'Çatalca-Kocaeli = Aşınım Platosu + En alçak + En kalabalık sanayi platosu.'
  },
  {
    id: 'mc-66',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    questionText: 'Karstik çözünme sonucu oluşan polye tabanlarında biriken killi-kireçli topraklarla oluşan ve "TAKKE/TAKEM" (Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla) kodlamasıyla bilinen ova türü hangisidir?',
    options: ['Karstik (Polye) Ovaları', 'Delta Ovaları', 'Tektonik Ovalar', 'Lav Örtüsü Ovaları', 'Dağ Eteği Ovaları'],
    correctIndex: 0,
    targetCoords: [29.900, 37.050],
    explanation: 'Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı ve Muğla karstik kökenli polye ovalarıdır.',
    osymTip: 'TAKKE / TAKEM = Karstik / Polye Ovaları (Göller Yöresi & Akdeniz).'
  },
  {
    id: 'mc-67',
    category: 'Platolar & Ovalar',
    region: 'Akdeniz',
    questionText: 'Seyhan ve Ceyhan nehirlerinin Akdeniz\'e taşıdığı alüvyonları biriktirmesiyle oluşan Türkiye\'nin en büyük delta ovası hangisidir?',
    options: ['Çukurova (Adana)', 'Bafra Ovası (Samsun)', 'Çarşamba Ovası (Samsun)', 'Silifke Ovası (Mersin)', 'Menemen Ovası (İzmir)'],
    correctIndex: 0,
    targetCoords: [35.320, 36.900],
    explanation: 'Çukurova Seyhan ve Ceyhan nehirlerinin ortak oluşturduğu Türkiye\'nin en geniş delta ovasıdır.',
    osymTip: 'Seyhan + Ceyhan = Çukurova (En büyük delta).'
  },
  {
    id: 'mc-68',
    category: 'Karstik & Kıyı',
    region: 'Akdeniz',
    questionText: 'Karstik arazilerde kireç taşlarının yağış ve yer altı sularıyla kimyasal olarak çözünmesi sonucu oluşan EN KÜÇÜK karstik aşındırma şekli hangisidir?',
    options: ['Lapya', 'Dolin', 'Uvala', 'Polye', 'Obruk'],
    correctIndex: 0,
    targetCoords: [31.500, 37.100],
    explanation: 'Lapya birkaç santimetre ile birkaç metre arasında değişen en küçük karstik erime çukurcuklarıdır. Sıralama: Lapya < Dolin < Uvala < Polye.',
    osymTip: 'Karstik Aşınım Sıralaması: Lapya < Dolin < Uvala < Polye (Gölova).'
  },
  {
    id: 'mc-69',
    category: 'Karstik & Kıyı',
    region: 'İç Anadolu',
    questionText: 'Yer altı mağara tavanlarının çökmesi sonucu oluşan ve İç Anadolu\'da (Konya/Obruk Platosu) ve Akdeniz\'de (Cennet-Cehennem) görülen derin doğal kuyu/çukurluklara ne ad verilir?',
    options: ['Obruk', 'Traverten', 'Düden', 'Kanyon', 'Kırgıbayır'],
    correctIndex: 0,
    targetCoords: [33.150, 38.150],
    explanation: 'Obruklar yer altı boşluklarının çökmesiyle oluşan karstik çukurlardır (Kızören, Timraş, Cennet-Cehennem).',
    osymTip: 'Yer altı mağara tavanı çökmesi = Obruk.'
  },
  {
    id: 'mc-70',
    category: 'Karstik & Kıyı',
    region: 'Ege',
    questionText: 'Kalsiyum bikarbonat içeren yer altı sularının yüzeye çıkarak karbondioksitin uçmasıyla geriye kalsiyum karbonat çökelmesi sonucu oluşan, Denizli Pamukkale\'deki basamaklı karstik BİRİKTİRME şekli hangisidir?',
    options: ['Traverten', 'Lapya', 'Sarkıt ve Dikit', 'Dev Kazanı', 'Mantar Kaya'],
    correctIndex: 0,
    targetCoords: [29.120, 37.920],
    explanation: 'Pamukkale travertenleri karstik biriktirme (çökelme) şeklidir.',
    osymTip: 'Pamukkale = Karstik Çökelme / Traverten (UNESCO Mirası).'
  },
  {
    id: 'mc-71',
    category: 'Karstik & Kıyı',
    region: 'Akdeniz',
    questionText: 'Karstik sahalarda yer üstü sularını yer altına taşıyan veya yer altındaki suları yeryüzüne çıkaran doğal su yutan / su çıkan deliklerine ne ad verilir?',
    options: ['Düden (Voklüz / Su Batan)', 'Obruk', 'Lapya', 'Polye', 'Dolin'],
    correctIndex: 0,
    targetCoords: [30.700, 36.850],
    explanation: 'Düdenler (su batan/su çıkan) karstik suların yer altı ile yüzey arasındaki irtibat noktalarıdır.',
    osymTip: 'Su batan / Su çıkan = Düden.'
  },
  {
    id: 'mc-72',
    category: 'Akarsular',
    region: 'Karadeniz',
    questionText: 'Akarsuların çağlayan veya şelale yaparak yüksekten döküldüğü yerde düşen suların ve çakılların ana kayayı oyarak oluşturduğu derin çukurlara ne ad verilir?',
    options: ['Dev Kazanı', 'Kırgıbayır (Badlands)', 'Peneplen', 'Seki (Taraça)', 'Menderes'],
    correctIndex: 0,
    targetCoords: [30.750, 36.950],
    explanation: 'Dev kazanı şelalelerin tabanında suyun ve taşların döner hareketle aşındırdığı çukurluktur (Düden, Manavgat, Tortum, Muradiye şelaleleri).',
    osymTip: 'Şelale tabanındaki çukur = Dev Kazanı.'
  },
  {
    id: 'mc-73',
    category: 'Akarsular',
    region: 'İç Anadolu',
    questionText: 'Kurak ve yarı kurak bölgelerde bitki örtüsünden yoksun killi ve eğimli arazilerin sel suları tarafından yarılmasıyla oluşan engebeli ve pürüzlü aşınım yüzeylerine (Kötü Arazi) ne ad verilir?',
    options: ['Kırgıbayır (Badlands)', 'Lapya', 'Peneplen', 'Kumul', 'Yardang'],
    correctIndex: 0,
    targetCoords: [34.800, 38.600],
    explanation: 'Kırgıbayır (Badlands) sel sularının ve sağanak yağışların çıplak yamaçları derin oluklarla yarması sonucu oluşur (İç Anadolu & Kapadokya çevresi).',
    osymTip: 'Kötü arazi / Sel yarıntıları = Kırgıbayır (Badlands).'
  },
  {
    id: 'mc-74',
    category: 'Akarsular',
    region: 'İç Anadolu',
    questionText: 'Akarsuların araziyi milyonlarca yıl boyunca aşındırarak deniz seviyesine yakın hafif dalgalı düzlük haline getirdiği aşınmanın son evresi şekline ne ad verilir?',
    options: ['Peneplen (Yontukdüz)', 'Plato', 'Tabanlı Vadi', 'Delta', 'Moren'],
    correctIndex: 0,
    targetCoords: [29.000, 41.000],
    explanation: 'Peneplen (yontukdüz) akarsu aşındırmasının son safhasıdır. Türkiye 3. Zaman sonunda peneplenleşmiş, 4. Zamanda toptan yükselmiştir.',
    osymTip: 'Akarsu aşınımının son evresi = Peneplen (Yontukdüz).'
  },
  {
    id: 'mc-75',
    category: 'Akarsular',
    region: 'Ege',
    questionText: 'Akarsunun eğimin azaldığı düzlüklerde büklümler çizerek akmasıyla oluşan, hem aşındırma (çarpak) hem de biriktirme (yığınak) süreçlerinin birlikte gerçekleştiği yer şekli hangisidir?',
    options: ['Menderes (Büklüm)', 'Kanyon Vadi', 'Çentik Vadi', 'Dev Kazanı', 'Boğaz Vadi'],
    correctIndex: 0,
    targetCoords: [28.000, 37.850],
    explanation: 'Menderes ve Seki (Taraça), hem akarsu aşındırma hem de biriktirme şekilleridir. Menderes yapan akarsuyun boyu uzar, akış hızı ve aşındırma gücü azalır.',
    osymTip: 'HEM Aşındırma HEM Biriktirme = Menderes ve Seki (Taraça).'
  },
  {
    id: 'mc-76',
    category: 'Akarsular',
    region: 'Karadeniz',
    questionText: 'Akarsuların dağ sıralarını enine yararak geçtiği, genellikle dik yamaçlı ve "U" veya oluk profilli olan, doğal ulaşım geçidi olarak da kullanılan vadi türü hangisidir?',
    options: ['Boğaz (Yarma) Vadi', 'Çentik (V) Vadi', 'Kanyon Vadi', 'Tabanlı Vadi', 'Asılı Vadi'],
    correctIndex: 0,
    targetCoords: [35.500, 41.200],
    explanation: 'Boğaz (yarma) vadiler dağ sıralarını enine yaran akarsular tarafından oluşturulur ve doğal ulaşım geçitleridir.',
    osymTip: 'Dağları dik kesen ve geçit sağlayan vadi = Boğaz (Yarma) Vadi.'
  },
  {
    id: 'mc-77',
    category: 'Karstik & Kıyı',
    region: 'Marmara',
    questionText: 'Kıyı oklarının veya kıyı kordonunun bir koy veya körfezin önünü kapatmasıyla denizden ayrılan göllere (Lagün / Kıyı Set Gölü) Türkiye\'den en iyi örnek hangisidir?',
    options: ['Büyükçekmece, Küçükçekmece ve Durusu (Terkos)', 'Van Gölü ve Erçek Gölü', 'Nemrut ve Meke Gölleri', 'Beyşehir ve Eğirdir Gölleri', 'Çıldır ve Tortum Gölleri'],
    correctIndex: 0,
    targetCoords: [28.580, 41.030],
    explanation: 'Marmara Bölgesi\'ndeki Büyükçekmece, Küçükçekmece, Durusu (Terkos) ile Akdeniz\'deki Akyatan/Akyayan gölleri tipik lagün (kıyı set) gölleridir.',
    osymTip: 'Lagün (Kıyı Set Gölü) = Büyükçekmece, Küçükçekmece, Terkos.'
  },
  {
    id: 'mc-78',
    category: 'Karstik & Kıyı',
    region: 'Marmara',
    questionText: 'Bir adanın dalga ve akıntıların biriktirdiği kum kordonu (tombolo) ile karaya bağlanması sonucu oluşan "Saplı Ada / Yarımada" oluşumuna Türkiye\'deki en tipik iki örnek hangisidir?',
    options: ['Kapıdağ Yarımadası (Balıkesir) ve Sinop İnceburun', 'Gelibolu ve Biga Yarımadaları', 'Datça ve Bozburun Yarımadaları', 'Bodrum ve Çeşme Yarımadaları', 'Karaburun ve Dilek Yarımadaları'],
    correctIndex: 0,
    targetCoords: [27.850, 40.450],
    explanation: 'Kapıdağ Yarımadası ve Sinop İnceburun tombolo (saplı ada) oluşumunun Türkiye\'deki en net örnekleridir.',
    osymTip: 'Tombolo (Saplı Ada) = Kapıdağ Yarımadası & Sinop İnceburun.'
  },
  {
    id: 'mc-79',
    category: 'Karstik & Kıyı',
    region: 'Akdeniz',
    questionText: 'Dağların kıyıya paralel uzandığı sahalarda denizin yükselmesiyle dağlar arasındaki vadilerin sular altında kalması sonucu kıyıya paralel ada zincirlerinin oluştuğu (Antalya Kaş - Finike kıyıları) kıyı tipi hangisidir?',
    options: ['Dalmaçya Tipi Kıyı', 'Ria Tipi Kıyı', 'Enine Kıyı Tipi', 'Boyuna Kıyı Tipi', 'Limanlı Kıyı Tipi'],
    correctIndex: 0,
    targetCoords: [29.640, 36.200],
    explanation: 'Antalya Kaş-Finike kıyıları Türkiye\'de Dalmaçya tipi kıyının tek ve en belirgin örneğidir.',
    osymTip: 'Kaş - Finike kıyıları = Dalmaçya Tipi Kıyı.'
  },
  {
    id: 'mc-80',
    category: 'Karstik & Kıyı',
    region: 'Marmara',
    questionText: 'Eski akarsu vadilerinin deniz suları altında kalmasıyla oluşan, İstanbul Boğazı, Çanakkale Boğazı, Haliç ve Güneybatı Ege (Menteşe kıyıları) boyunca görülen kıyı tipi hangisidir?',
    options: ['Ria Tipi Kıyı', 'Dalmaçya Tipi Kıyı', 'Fiyort Tipi Kıyı', 'Kalanklı Kıyı Tipi', 'Boyuna Kıyı Tipi'],
    correctIndex: 0,
    targetCoords: [29.050, 41.100],
    explanation: 'İstanbul ve Çanakkale boğazları ile Menteşe kıyıları eski vadi basmasıyla oluşan Ria tipi kıyılardır.',
    osymTip: 'İstanbul Boğazı + Çanakkale Boğazı + Haliç = Ria Tipi Kıyı.'
  },
  {
    id: 'mc-81',
    category: 'Rüzgarlar & İklim',
    region: 'İç Anadolu',
    questionText: 'Rüzgarların taşıdığı kumların kayaların alt kısımlarını daha fazla aşındırması sonucu üstü geniş, altı dar kalarak mantar görünümü alan aşınım şekline (Nevşehir Kapadokya) ne ad verilir?',
    options: ['Mantarkaya (Şeytan Masası)', 'Tafoni', 'Yardang', 'Barkan', 'Sirk'],
    correctIndex: 0,
    targetCoords: [34.700, 38.650],
    explanation: 'Mantarkaya (şeytan masası) rüzgar aşındırması sonucu oluşur; rüzgarın yerden 1-2 metreye kadar taşıdığı kumlar kayanın altını daha hızlı oyar.',
    osymTip: 'Rüzgar Aşındırması: Mantarkaya, Şahitkaya, Tafoni (Kuşyuvası), Yardang.'
  },
  {
    id: 'mc-82',
    category: 'Rüzgarlar & İklim',
    region: 'İç Anadolu',
    questionText: 'Çöl ve kurak arazilerde rüzgar biriktirmesiyle oluşan yarımay veya hilal biçimindeki kumullara ne ad verilir?',
    options: ['Barkan', 'Lös', 'Moren', 'Drumlin', 'Sander'],
    correctIndex: 0,
    targetCoords: [33.500, 37.800],
    explanation: 'Barkan hilal şeklinde kumullardır. Rüzgar biriktirme şekilleridir (Barkan, Kumul, Lös).',
    osymTip: 'Hilal biçimli kumul = Barkan.'
  },
  {
    id: 'mc-83',
    category: 'Dağlar',
    region: 'İç Anadolu',
    questionText: 'Konya Karapınar\'da volkanik gaz patlaması sonucu oluşan, ortasında göl bulunan ve havadan bakıldığında nazar boncuğunu andırdığı için "Dünyanın Nazar Boncuğu" olarak bilinen volkanik maar çukuru hangisidir?',
    options: ['Meke Tuzlası (Maar)', 'Nemrut Kalderası', 'Gölcük Krateri', 'Acıgöl Maarı', 'Kula Cüruf Konileri'],
    correctIndex: 0,
    targetCoords: [33.640, 37.690],
    explanation: 'Meke Maar Gölü gaz patlamasıyla oluşan çukurlukta yer alır ve "Dünyanın Nazar Boncuğu" olarak anılır.',
    osymTip: 'Meke Tuzlası = Gaz Patlaması Çukuru = Maar (Dünyanın Nazar Boncuğu).'
  },
  {
    id: 'mc-84',
    category: 'Dağlar',
    region: 'Doğu Anadolu',
    questionText: 'Bitlis sınırlarında yer alan, patlamalar ve çökme sonucu zirvesinde devasa bir çanak ve Türkiye\'nin en büyük krater gölü bulunan volkanik oluşum hangisidir?',
    options: ['Nemrut Dağı ve Kalderası', 'Süphan Dağı', 'Tendürek Dağı', 'Erciyes Dağı', 'Hasan Dağı'],
    correctIndex: 0,
    targetCoords: [42.230, 38.620],
    explanation: 'Nemrut Dağı zirvesindeki Nemrut Kalderası dünyanın ikinci, Türkiye\'nin en büyük kalderasıdır.',
    osymTip: 'Nemrut Kalderası = Türkiye\'nin En Büyük Volkanik Kalderası (Bitlis).'
  },
  {
    id: 'mc-85',
    category: 'Dağlar',
    region: 'Ege',
    questionText: 'Türkiye\'nin EN GENÇ volkanik arazisi olan, yüzlerce cüruf konisi ve lav akıntısı nedeniyle "Yanık Ülke (Katakekaumene)" olarak anılan ve Türkiye\'nin İLK ve TEK UNESCO Jeoparkı olan saha neresidir?',
    options: ['Kula Volkanları (Manisa)', 'Erciyes Volkanı (Kayseri)', 'Karadağ Volkanı (Karaman)', 'Tendürek Volkanı (Ağrı)', 'Karacadağ Volkanı (Şanlıurfa)'],
    correctIndex: 0,
    targetCoords: [28.650, 38.580],
    explanation: 'Manisa Kula volkanları Türkiye\'nin en genç volkanik sahası ve ilk UNESCO Jeoparkıdır.',
    osymTip: 'Kula (Manisa) = En genç volkan sahası + İlk Jeopark + Yanık Ülke.'
  },
  {
    id: 'mc-86',
    category: 'Dağlar',
    region: 'Doğu Anadolu',
    questionText: 'Buzulların aşındırmasıyla oluşan ve içinde küçük buzul gölleri (Sirk Gölü) barındıran çanak veya buzul yalaklarına ne ad verilir?',
    options: ['Sirk (Buzul Yalağı)', 'Hörgüç Kaya', 'Moren', 'Drumlin', 'Kanyon'],
    correctIndex: 0,
    targetCoords: [43.900, 37.500],
    explanation: 'Sirk buzul aşındırmasıyla oluşan çanaklardır; içinde biriken sular sirk göllerini oluşturur (Cilo, Kaçkar, Hakkari vb.).',
    osymTip: 'Buzul Çanağı = Sirk; Buzul Taş Yığını = Moren; Deve Hörgücüne benzeyen kaya = Hörgüç Kaya.'
  },
  {
    id: 'mc-87',
    category: 'Dağlar',
    region: 'Doğu Anadolu',
    questionText: 'Türkiye\'de güncel aktif vadi buzullarının ve Türkiye\'nin en büyük vadi buzulunun (Uludoruk / Reşko) yer aldığı dağ silsilesi hangisidir?',
    options: ['Hakkari Cilo (Buzul) Dağları', 'Toros Dağları', 'Kaz Dağları', 'Yıldız Dağları', 'Köroğlu Dağları'],
    correctIndex: 0,
    targetCoords: [44.050, 37.480],
    explanation: 'Cilo (Buzul) Dağları Türkiye\'nin en büyük vadi buzullarına ve ikinci en yüksek zirvesi Uludoruk\'a ev sahipliği yapar.',
    osymTip: 'En büyük vadi buzulları = Cilo Dağları (Hakkari).'
  },
  {
    id: 'mc-88',
    category: 'Karstik & Kıyı',
    region: 'Karadeniz',
    questionText: 'Dağların denize paralel ve çok dik uzandığı Karadeniz ve Akdeniz kıyılarında, dalgaların kıyı tabanını oyarak oluşturduğu yüksek dik kıyı uçurumlarına (Yalıyar) ne ad verilir?',
    options: ['Falez (Yalıyar)', 'Tombolo', 'Lagün', 'Hörgüç Kaya', 'Traverten'],
    correctIndex: 0,
    targetCoords: [39.700, 41.000],
    explanation: 'Falezler (yalıyar) dalga aşındırmasıyla oluşan dik kıyı uçurumlarıdır (Doğu/Batı Karadeniz, Antalya-Teke kıyıları).',
    osymTip: 'Dalga Aşındırması = Falez (Yalıyar). Ege\'de falez az, Karadeniz ve Akdeniz\'de çoktur.'
  },
  {
    id: 'mc-89',
    category: 'Platolar & Ovalar',
    region: 'İç Anadolu',
    questionText: 'Kızılırmak\'ın geniş yayı içinde kalan, Yozgat topraklarının büyük bölümünü kaplayan ve Türkiye\'nin en geniş tabakalı plato alanlarından biri olan plato hangisidir?',
    options: ['Bozok Platosu', 'Haymana Platosu', 'Cihanbeyli Platosu', 'Teke Platosu', 'Taşeli Platosu'],
    correctIndex: 0,
    targetCoords: [35.000, 39.800],
    explanation: 'Bozok Platosu Yozgat ili sınırlarında Kızılırmak yayı içerisinde yer alır.',
    osymTip: 'Kızılırmak Yayı içi = Bozok Platosu (Yozgat).'
  },
  {
    id: 'mc-90',
    category: 'Karstik & Kıyı',
    region: 'Ege',
    questionText: 'Dağların kıyıya dik uzandığı Ege kıyılarında görülen, girinti-çıkıntının, koy, körfez ve doğal liman sayısının en fazla olduğu, kıta sahanlığının (şelf alanı) en geniş olduğu kıyı tipi hangisidir?',
    options: ['Enine Kıyı Tipi', 'Boyuna Kıyı Tipi', 'Dalmaçya Kıyı Tipi', 'Ria Kıyı Tipi', 'Fiyort Kıyı Tipi'],
    correctIndex: 0,
    targetCoords: [27.100, 38.400],
    explanation: 'Ege kıyılarında dağlar dik uzandığı için Enine Kıyı tipi görülür. Kıta sahanlığı geniş, falez az, koy ve körfez fazladır.',
    osymTip: 'Ege Kıyıları = Enine Kıyı Tipi + Geniş Kıta Sahanlığı + Bol Koy ve Körfez.'
  }
];

function getCategoryDistractors(target: GeoFeature, all: GeoFeature[]): string[] {
  const sameGroup = all.filter(f => f.id !== target.id && f.name !== target.name && (f.type === target.type || f.category === target.category));
  const pool = sameGroup.length >= 4 ? sameGroup : all.filter(f => f.id !== target.id && f.name !== target.name);
  const shuffled = shuffleArray(pool);
  const distractors: string[] = [];
  const nameSet = new Set<string>([target.name]);

  for (const item of shuffled) {
    if (!nameSet.has(item.name)) {
      nameSet.add(item.name);
      distractors.push(item.name);
      if (distractors.length === 4) break;
    }
  }
  return distractors;
}

const DYNAMIC_QUIZ_QUESTIONS: MultipleChoiceQuestion[] = ALL_GEO_FEATURES.flatMap((f, idx) => {
  const questions: MultipleChoiceQuestion[] = [];
  const distractors = getCategoryDistractors(f, ALL_GEO_FEATURES);
  if (distractors.length < 4) return questions;

  const rawOptions = [f.name, ...distractors].map(opt => cleanOptionName(opt));
  const cleanedTargetName = cleanOptionName(f.name);
  const shuffledOptions = shuffleArray(rawOptions);
  const correctIndex = shuffledOptions.indexOf(cleanedTargetName);
  const cat = mapTypeToPinCategory(f.type, f.category);

  // Question 1: Feature Characteristics / Genesis
  const cleanDesc = f.description ? sanitizeQuestionText(f.description) : '';
  let qText1 = '';
  if (cleanDesc && cleanDesc.length > 15) {
    qText1 = `"${cleanDesc}"\nYukarıda özellikleri açıklanan coğrafi unsur / yer şekli aşağıdakilerden hangisidir?`;
  } else if (f.kpssTips?.[0]) {
    qText1 = `KPSS Bilgisi: "${sanitizeQuestionText(f.kpssTips[0])}"\nBu bilgi aşağıdaki coğrafi unsurlardan hangisine aittir?`;
  } else {
    qText1 = `${f.region ? f.region + ' Bölgesi\'nde yer alan' : 'Türkiye\'de yer alan'} ve ${f.category || 'önemli bir oluşum'} olan coğrafi unsur hangisidir?`;
  }

  questions.push({
    id: `mc-dyn-${f.id}-desc-${idx}`,
    category: cat,
    region: f.region,
    questionText: qText1,
    options: shuffledOptions,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    focusFeatureId: f.id,
    targetCoords: f.coordinates,
    explanation: `${f.name}: ${f.description || f.category || ''}. İli/Bölgesi: ${getFeatureCityName(f, f.name, f.region)}.`,
    osymTip: f.kpssTips?.[0] ? `ÖSYM Notu: ${f.kpssTips[0]}` : `${f.name} - ${f.category || 'KPSS Coğrafya'}`
  });

  return questions;
});

export const MULTIPLE_CHOICE_QUESTIONS: MultipleChoiceQuestion[] = [
  ...HANDCRAFTED_MULTIPLE_CHOICE_QUESTIONS.map(q => ({
    ...q,
    options: q.options.map(opt => cleanOptionName(opt))
  })),
  ...DYNAMIC_QUIZ_QUESTIONS
];

export function getQuizQuestionsByIds(questionIds: string[]): MultipleChoiceQuestion[] {
  const map = new Map(MULTIPLE_CHOICE_QUESTIONS.map(q => [q.id, q]));
  const result: MultipleChoiceQuestion[] = [];
  for (let i = 0; i < questionIds.length; i++) {
    const id = questionIds[i];
    const q = map.get(id);
    if (q) {
      result.push(q);
    } else {
      result.push(MULTIPLE_CHOICE_QUESTIONS[i % MULTIPLE_CHOICE_QUESTIONS.length]);
    }
  }
  return result.length > 0 ? result : MULTIPLE_CHOICE_QUESTIONS.slice(0, 10);
}

