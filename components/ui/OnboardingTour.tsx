'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Compass,
  Layers,
  Gamepad2,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Search,
  Bot,
  MousePointerClick,
  SlidersHorizontal,
  BarChart3,
  Trophy,
  Check
} from 'lucide-react';
import { TierMark } from '@/components/ui/wearables/WearableEmblem';
import { TIER_LABELS } from '@/lib/data/wearableGlyphs';
import { useAppStore } from '@/lib/store/useStore';

/* ==================================================================
   İlk giriş tanıtım turu — **opsiyonel spotlight turu**, 13 adım.

   Kart sadece yazmaz: her adım arayüzdeki gerçek bir öğeyi hedefler,
   etrafındaki her şey karartılıp bulanıklaştırılır, kart hedefin
   yanına konumlanır. Katman bölümünde panel gerçekten açılır ve
   kullanıcı katman açıp kapatabilir (interactive adım).

   Kurallar:
   1. Yalnızca ilk girişte, yalnızca veri yoksa açılır (hasProgress).
   2. Her adımda `Atla`; X, Esc ve örtü tıklaması da kapatır.
   3. Kapandıktan sonra kendiliğinden açılmaz (kpss3d_onboarding_v1).
   4. Navbar pusula düğmesi `kpss3d:open-onboarding` ile tekrar açar.
   ================================================================== */

const STORAGE_KEY = 'kpss3d_onboarding_v1';
export const OPEN_ONBOARDING_EVENT = 'kpss3d:open-onboarding';

type Placement = 'bottom' | 'top' | 'left' | 'right' | 'center';

type Bullet = { label: string; text: string };

type Step = {
  chapter: string;
  eyebrow: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
  bullets?: Bullet[];
  /** Aday seçiciler — ilk *görünür* olan hedef seçilir. */
  selectors?: string[];
  placement?: Placement;
  hint?: string;
  showTiers?: boolean;
  /** Tur bu adımda katman panelini açar (masaüstü). */
  openSidebar?: boolean;
  /** Dar ekranda hedef gizliyse adımı açıklamayla göster. */
  desktopOnly?: boolean;
  /** true ise hedefin üstünde tıklama katmanı olmaz — kullanıcı deneyebilir. */
  interactive?: boolean;
  /** Kapanış adımında gösterilen kısa dizin. */
  recap?: string[];
};

const STEPS: Step[] = [
  {
    chapter: 'Başlangıç',
    eyebrow: 'Hoş geldin',
    title: 'Türkiye’yi 3D haritada öğren',
    body: '13 adımda arayüzü gezeceğiz. Her adımda bir öğe aydınlanır, gerisi bulanıklaşır — okumak yerine görürsün.',
    Icon: Compass,
    placement: 'center',
    bullets: [
      { label: 'Süre', text: 'Yaklaşık 2 dakika. Zorunlu değil; × ya da Esc ile hemen çıkabilirsin.' },
      { label: 'Gezinme', text: '← ve → tuşları adımlar arasında gezinir; alttaki noktalara tıklayabilirsin.' },
      { label: 'Tekrar', text: 'Tur kapandıktan sonra üst bardaki pusula düğmesiyle yeniden açılır.' }
    ]
  },
  {
    chapter: 'Harita',
    eyebrow: 'Sahne',
    title: 'Harita bir sahne, bir sayfa değil',
    body: 'Türkiye kabartma olarak yüklenir. Sürükleyerek döndür, tekerlekle yakınlaş; eğimi artırınca dağların profili belirginleşir.',
    Icon: MousePointerClick,
    selectors: ['.maplibregl-ctrl-bottom-right .maplibregl-ctrl-group'],
    placement: 'left',
    bullets: [
      { label: 'Kontroller', text: 'Artı/eksi yakınlaştırır, pusula kuzeye döndürür, köşedeki düğme tam ekran yapar.' },
      { label: 'Tıklama', text: 'Bir yeryüzü şekline tıkla; adı, bölgesi ve KPSS notu kart olarak açılır.' }
    ]
  },
  {
    chapter: 'Harita',
    eyebrow: 'Katman girişi',
    title: 'Haritayı pusuladan katmanlandır',
    body: 'Harita sade başlar. Üst soldaki pusula hem logo hem katman düğmesidir; katman panelini açar.',
    Icon: Layers,
    selectors: ['button[title="Harita katmanlarını aç / kapat"]'],
    placement: 'bottom',
    bullets: [
      { label: 'Kapalıyken', text: 'Sol kenarda ince bir şerit olarak durur; “Katmanlar” yazısı dikey görünür.' },
      { label: 'Rozet', text: 'Açık katman sayısı düğmenin köşesinde sayı olarak çıkar.' }
    ]
  },
  {
    chapter: 'Katmanlar',
    eyebrow: 'Panel',
    title: 'Panel üç katmandan oluşur',
    body: 'Üstte harita stili ve toplu seçim, ortada katman grupları, altta bölge filtresi. Panel açıkken harita arkada çalışmaya devam eder.',
    Icon: SlidersHorizontal,
    selectors: ['#kpss-layer-sidebar'],
    placement: 'right',
    openSidebar: true,
    interactive: true,
    bullets: [
      { label: 'Altlık', text: 'Topoğrafya · Siyasi · Uydu — haritanın dokusunu değiştirir.' },
      { label: 'Toplu işlem', text: 'Tümünü Aç · Kapat · Dilsiz modu tek tıkla.' },
      { label: 'Telefonda', text: 'Panel yerine bu ince şerit durur; dokununca aynı panel açılır.' }
    ]
  },
  {
    chapter: 'Katmanlar',
    eyebrow: 'Gruplar',
    title: 'Katmanlar altı gruba ayrılır',
    body: 'Her grup katlanabilir; başlıktaki sayı o gruptan kaç katmanın açık olduğunu gösterir. İstediğin kadarını aç — gerisi kapalı kalır.',
    Icon: Layers,
    selectors: ['#kpss-layer-sidebar .hf-scroll'],
    placement: 'right',
    openSidebar: true,
    desktopOnly: true,
    interactive: true,
    hint: 'Buradan bir katman açıp kapatabilirsin — tur bekliyor.',
    bullets: [
      { label: 'Fiziki', text: 'Dağ sistemleri, su kaynakları, ovalar ve platolar.' },
      { label: 'Beşeri', text: 'Antik kentler, karstik şekiller, kıyı tipleri, sınır kapıları ve madenler.' }
    ]
  },
  {
    chapter: 'Katmanlar',
    eyebrow: 'Filtre',
    title: 'Bölge filtresi ve dilsiz mod',
    body: 'Bölge seçince yalnız o bölgenin verisi kalır. Dilsiz mod etiketleri kapatır; haritayı kendin doldurarak çalışırsın.',
    Icon: BarChart3,
    selectors: ['#kpss-layer-sidebar .hf-scroll section:last-of-type'],
    placement: 'right',
    openSidebar: true,
    desktopOnly: true,
    interactive: true,
    bullets: [
      { label: 'Sınav provası', text: 'Önce dilsiz modu aç, sonra katmanı aç, adı sen söyle.' },
      { label: 'Odak', text: 'Karadeniz, Ege gibi tek bölgeye indirerek tekrar yap.' }
    ]
  },
  {
    chapter: 'Keşif',
    eyebrow: 'Arama',
    title: 'Bir isim yaz, harita oraya uçsun',
    body: 'Dağ, ova, göl ya da geçit adı yazdığında sonuç listesi açılır; seçtiğin yer haritada uçar ve bilgi kartı gelir.',
    Icon: Search,
    selectors: ['input[placeholder="Ara..."]'],
    placement: 'bottom',
    bullets: [
      { label: 'Sonuç', text: 'Her satırda yerin bölgesi de yazar; yanlış eşleşmeyi ayırt edersin.' },
      { label: 'Telefonda', text: 'Arama alanı gizlidir; ilgili katmanı açıp haritadan bulursun.' }
    ]
  },
  {
    chapter: 'Oyunlar',
    eyebrow: 'Mod rayı',
    title: 'Dört mod, tek amaç: hatırlamak',
    body: 'Üstteki ray modlar arasında geçiş yapar. Hiçbiri zorunlu değil — istediğin yerde başla, istediğin kadar oyna.',
    Icon: Gamepad2,
    selectors: ['header nav', 'header .hf-scroll'],
    placement: 'bottom',
    bullets: [
      { label: 'Harita Testi', text: 'Sorulan yeri haritada işaretle; km cinsinden hatan puanı belirler.' },
      { label: 'Düello', text: 'Canlı 1v1; aynı soru, aynı süre. Rakip bot da olabilir.' },
      { label: 'KPSS Testi · Ezber', text: 'Çoktan seçmeli açıklamalı sorular ve kodlama kartları.' }
    ]
  },
  {
    chapter: 'Analiz',
    eyebrow: 'Hata defteri',
    title: 'Yanlışların deftere düşer',
    body: 'Analiz sekmesi hata defterini açar: yanlış işaretlediğin yerler, kaçırdığın sorular ve zayıf bölgeler burada birikir.',
    Icon: BarChart3,
    selectors: ['button[title="Analiz"]'],
    placement: 'bottom',
    bullets: [
      { label: 'Temizlenir', text: 'Aynı soruyu doğru cevaplayınca kayıt defterden düşer.' },
      { label: 'Sınav öncesi', text: 'Defterde açık kalan başlıklar son tekrar listendir.' }
    ]
  },
  {
    chapter: 'Topluluk',
    eyebrow: 'Sıralama',
    title: 'Sıralama ve takma ad',
    body: 'Sıralama tablosu toplam puanı gösterir. Nick girersen ilerlemen hesaba bağlanır; girmezsen yalnız bu cihazda kalır.',
    Icon: Trophy,
    selectors: ['button[title="Global sıralama tablosu"]'],
    placement: 'bottom',
    bullets: [
      { label: 'Taşıma', text: 'Nick ile geçmiş yükleme, başka cihazdaki ilerlemeni buraya getirir.' },
      { label: 'Zorunlu değil', text: 'Hiçbir mod giriş istemez; anonim oynayabilirsin.' }
    ]
  },
  {
    chapter: 'Yardım',
    eyebrow: 'AI öğretmen',
    title: 'Takıldığın yeri asistana sor',
    body: 'AI asistanı KPSS coğrafya öğretmeni gibi çalışır; haritadaki seçimi ve soru geçmişini bağlam olarak okur.',
    Icon: Bot,
    selectors: ['button[title="Yapay zeka KPSS asistanı"]'],
    placement: 'bottom',
    bullets: [
      { label: 'Soru', text: '“Bu geçit neden önemli?”, “Karadeniz’de neden bu kadar yağış var?”' },
      { label: 'Sıra', text: 'Önce haritada şekle tıkla, sonra asistana sor — daha isabetli yanıt verir.' }
    ]
  },
  {
    chapter: 'Birikim',
    eyebrow: 'Rozet & kademe',
    title: 'Rozet kademeyi, kademe görünümü açar',
    body: 'Her tamamlanan hedef bir rozet verir. Rozetler kademe puanıdır; kademe yükseldikçe yeni avatar, ünvan ve çerçeve açılır.',
    Icon: Award,
    selectors: [
      'button[title="Nick Gir veya Geçmiş Yükle"]',
      'button[title="Profili Düzenle, Avatarını Değiştir veya Hesabı Yönet"]'
    ],
    placement: 'bottom',
    showTiers: true,
    bullets: [
      { label: 'Üç ayrı katman', text: 'Rozet kanıttır, ünvan kimliktir, avatar yalnız görünümdür.' },
      { label: 'Puan', text: 'Görünüm seçimi puanı değiştirmez; sıralamayı etkilemez.' }
    ]
  },
  {
    chapter: 'Bitti',
    eyebrow: 'Özet',
    title: 'Hazırsın — nerede ne var',
    body: 'Tur bitti. Aşağıdaki kısa dizin aklında kalsın; istediğin an pusula düğmesinden turu tekrar açabilirsin.',
    Icon: Check,
    placement: 'center',
    recap: [
      'Harita: sürükle-döndür, tıkla-öğren',
      'Sol şerit: katmanlar ve bölge filtresi',
      'Üst ray: Keşif · Harita Testi · Düello · KPSS Testi · Ezber · Analiz',
      'Sağ üst: arama · sıralama · AI · profil',
      'Pusula düğmesi: turu yeniden aç'
    ]
  }
];

type StoredProgressShape = {
  score?: number;
  quizScore?: number;
  totalQuestionsAnswered?: number;
  correctAnswersCount?: number;
  pinGuessCount?: number;
  duelStats?: { duelWins?: number };
  unlockedBadges?: string[];
};

/** Daha önce oynamış mı? Varsayılan alanlar (avatar, ünvan) sayılmaz —
 *  ilk açılışta da yazılırlar, "eski kullanıcı" sanılmamalı. */
function hasProgress(): boolean {
  try {
    const raw = localStorage.getItem('kpss3d_user_stats');
    if (!raw) return false;
    const s = JSON.parse(raw) as StoredProgressShape;
    return Boolean(
      (s.score ?? 0) > 0 ||
        (s.quizScore ?? 0) > 0 ||
        (s.totalQuestionsAnswered ?? 0) > 0 ||
        (s.correctAnswersCount ?? 0) > 0 ||
        (s.pinGuessCount ?? 0) > 0 ||
        (s.duelStats?.duelWins ?? 0) > 0 ||
        (Array.isArray(s.unlockedBadges) && s.unlockedBadges.length > 1)
    );
  } catch {
    return false;
  }
}

function rememberSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, 'seen');
  } catch {
    /* storage kapalıysa tur her açılışta çıkar; kullanıcı Atla'ya basar */
  }
}

type Hole = { top: number; left: number; width: number; height: number };

function sameHole(a: Hole | null, b: Hole | null) {
  if (!a || !b) return a === b;
  return (
    Math.abs(a.top - b.top) < 0.6 &&
    Math.abs(a.left - b.left) < 0.6 &&
    Math.abs(a.width - b.width) < 0.6 &&
    Math.abs(a.height - b.height) < 0.6
  );
}

const DESKTOP_BREAKPOINT = 768;

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [hole, setHole] = useState<Hole | null>(null);
  const [card, setCard] = useState<{ top: number; left: number } | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const primaryRef = useRef<HTMLButtonElement | null>(null);
  const sidebarBeforeTour = useRef(false);

  /* Dar ekranda yalnız-masaüstü adımlar (panel grupları, bölge
     filtresi) listeden çıkarılır: aynı "geniş ekranda görünür"
     notunu üç kez göstermek turu yavaşlatıyordu.
     useMemo şart: her render'da yeni dizi üretilirse aşağıdaki
     effect'ler her render'da tetiklenip store'u yazıyor ve sonsuz
     döngüye giriyor (mobilde tur hiç açılmadı — ölçüldü). */
  const steps = useMemo(
    () => (isNarrow ? STEPS.filter((s) => !s.desktopOnly) : STEPS),
    [isNarrow]
  );
  const total = steps.length;
  const safeStep = Math.min(step, total - 1);

  const restoreSidebar = useCallback(() => {
    useAppStore.getState().setSidebarOpen(sidebarBeforeTour.current);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    rememberSeen();
    restoreSidebar();
    /* Tur katman omurgasını zaten anlattı: aynı anda açılan
       LayerHintBanner turdan sonra tekrar "katmanları aç" demesin. */
    try {
      localStorage.setItem('kpss3d_layer_hint_seen_v2', 'true');
    } catch {
      /* storage kapalıysa banner yine çıkar; zararsız */
    }
  }, [restoreSidebar]);

  const next = useCallback(() => {
    setStep((s) => (s >= total - 1 ? s : s + 1));
  }, [total]);

  /* Ekran genişliği takibi — adım listesi buna göre filtrelenir. */
  useEffect(() => {
    const sync = () => setIsNarrow(window.innerWidth < DESKTOP_BREAKPOINT);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  /* İlk giriş kontrolü — harita boyansın diye kısa gecikmeyle. */
  useEffect(() => {
    let timer: number | undefined;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      if (hasProgress()) {
        rememberSeen();
        return;
      }
      timer = window.setTimeout(() => {
        sidebarBeforeTour.current = useAppStore.getState().isSidebarOpen;
        setStep(0);
        setIsOpen(true);
      }, 1100);
    } catch {
      /* localStorage erişilemezse tur gösterilmez */
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  /* Navbar / başka bir yerden tekrar açma. */
  useEffect(() => {
    const reopen = () => {
      sidebarBeforeTour.current = useAppStore.getState().isSidebarOpen;
      setStep(0);
      setIsOpen(true);
    };
    window.addEventListener(OPEN_ONBOARDING_EVENT, reopen);
    return () => window.removeEventListener(OPEN_ONBOARDING_EVENT, reopen);
  }, []);

  /* Tur açıkken sayfa kaymasın. */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  /* Tur açılınca katman ipucu banner'ı susar. */
  useEffect(() => {
    if (!isOpen) return;
    window.dispatchEvent(new CustomEvent('kpss3d:dismiss-layer-hint'));
  }, [isOpen]);

  /* Katman paneli yalnız o bölümde açık kalır; bölüm bitince eski
     duruma döner. Böylece kullanıcı turdan sonra paneli kapalı bulur. */
  useEffect(() => {
    if (!isOpen) return;
    const wantOpen =
      Boolean(steps[safeStep].openSidebar) && window.innerWidth >= DESKTOP_BREAKPOINT;
    const store = useAppStore.getState();
    if (wantOpen) store.setSidebarOpen(true);
    else store.setSidebarOpen(sidebarBeforeTour.current);
  }, [isOpen, step, safeStep, steps]);

  /* Klavye: Esc kapatır, oklar gezinir. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStep((s) => Math.max(0, s - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close, next]);

  /* Odak tuzağı: Tab ile arkadaki karartılmış arayüze kaçış olmasın. */
  useEffect(() => {
    if (!isOpen) return;
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const root = cardRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((n) => !n.hasAttribute('disabled') && n.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !root.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onTab);
    return () => window.removeEventListener('keydown', onTab);
  }, [isOpen]);

  /* Hedefi ölç: görünür olan ilk aday seçilir, viewport'a kırpılır. */
  useEffect(() => {
    if (!isOpen) {
      setHole(null);
      return;
    }

    let frame = 0;
    const measure = () => {
      const s = steps[safeStep];
      const narrow = window.innerWidth < DESKTOP_BREAKPOINT;
      if (!s.selectors?.length || (s.desktopOnly && narrow)) {
        setHole((prev) => (prev === null ? prev : null));
        return;
      }

      const vh = window.innerHeight;
      let el: Element | null = null;
      for (const sel of s.selectors) {
        const found = Array.from(document.querySelectorAll(sel)).find((n) => {
          const r = n.getBoundingClientRect();
          return r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < vh;
        });
        if (found) {
          el = found;
          break;
        }
      }

      if (!el) {
        setHole(null);
        return;
      }

      const r = el.getBoundingClientRect();
      /* Hedef ekran dışındaysa getir; görünürse scrollIntoView hiç
         kaydırmaz, bu yüzden döngü oluşmaz. */
      if (r.top < 0 || r.bottom > vh) {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }

      const pad = 8;
      const vw = window.innerWidth;
      const top = Math.max(4, r.top - pad);
      const left = Math.max(4, r.left - pad);
      const right = Math.min(vw - 4, r.right + pad);
      const bottom = Math.min(vh - 4, r.bottom + pad);
      const nextHole: Hole = {
        top,
        left,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top)
      };
      setHole((prev) => (sameHole(prev, nextHole) ? prev : nextHole));
    };

    measure();
    /* Panel 300ms'de açılıyor: ölçüm tek seferlik zamanlayıcıya
       bırakılırsa animasyon ortasında yakalanıp eski genişlikte
       donuyor (ölçüldü). Bu yüzden ~1s boyunca her karede ölçülür;
       sameHole aynı değerleri yuttuğu için maliyeti yok. */
    let stopped = false;
    const loopStart = performance.now();
    const tick = () => {
      if (stopped) return;
      measure();
      if (performance.now() - loopStart < 1000) {
        frame = window.requestAnimationFrame(tick);
      }
    };
    frame = window.requestAnimationFrame(tick);

    let once = 0;
    const onViewport = () => {
      window.cancelAnimationFrame(once);
      once = window.requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onViewport);
    window.addEventListener('scroll', onViewport, true);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(once);
      window.removeEventListener('resize', onViewport);
      window.removeEventListener('scroll', onViewport, true);
    };
  }, [isOpen, step, safeStep, steps]);

  /* Kart genişliği ve zorunlu kenar. Hedef ince ve tam yükseklikte bir
     şeritse (telefonda katman omurgası) üst/alt boşluk kalmaz; kart
     hedefi örter (ölçüldü). O durumda kart yana geçer ve kalan
     genişliğe sığacak şekilde daralır. */
  const layout = useMemo(() => {
    const vw = typeof window === 'undefined' ? 1440 : window.innerWidth;
    const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
    let widthPx = Math.min(400, vw - 24);
    let forceSide: 'left' | 'right' | null = null;

    if (hole) {
      const rightRoom = vw - (hole.left + hole.width) - 24;
      const leftRoom = hole.left - 24;
      const bottomRoom = vh - (hole.top + hole.height) - 24;
      const topRoom = hole.top - 24;
      const narrowTarget = hole.width < Math.min(140, vw * 0.35);
      const sideRoom = Math.max(rightRoom, leftRoom);
      if (Math.max(bottomRoom, topRoom) < 300 && narrowTarget && sideRoom >= 240) {
        widthPx = Math.min(400, Math.max(240, sideRoom - 14));
        forceSide = rightRoom >= leftRoom ? 'right' : 'left';
      }
    }
    return { widthPx, forceSide };
  }, [hole]);

  /* Kartı hedefin yanına yerleştir: sığmayan tarafı tersine çevir. */
  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = cardRef.current;
    if (!el) return;

    const cw = el.offsetWidth;
    const ch = el.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 14;
    const m = 12;

    if (!hole) {
      setCard({ top: Math.max(m, (vh - ch) / 2), left: Math.max(m, (vw - cw) / 2) });
      return;
    }

    const space: Record<'bottom' | 'top' | 'left' | 'right', number> = {
      bottom: vh - (hole.top + hole.height),
      top: hole.top,
      left: hole.left,
      right: vw - (hole.left + hole.width)
    };
    const fits = (p: 'bottom' | 'top' | 'left' | 'right') =>
      p === 'bottom' || p === 'top' ? space[p] >= ch + gap + m : space[p] >= cw + gap + m;

    const pref = steps[safeStep].placement;
    const order: Array<'bottom' | 'top' | 'left' | 'right'> = layout.forceSide
      ? [layout.forceSide, layout.forceSide === 'right' ? 'left' : 'right']
      : [
          ...(pref && pref !== 'center' ? [pref] : []),
          'bottom',
          'top',
          'right',
          'left'
        ];
    const chosen: 'bottom' | 'top' | 'left' | 'right' =
      order.find(fits) ?? (space.bottom >= space.top ? 'bottom' : 'top');

    let top = 0;
    let left = 0;
    if (chosen === 'bottom') {
      top = hole.top + hole.height + gap;
      left = hole.left + hole.width / 2 - cw / 2;
    } else if (chosen === 'top') {
      top = hole.top - gap - ch;
      left = hole.left + hole.width / 2 - cw / 2;
    } else if (chosen === 'left') {
      top = hole.top + hole.height / 2 - ch / 2;
      left = hole.left - gap - cw;
    } else {
      top = hole.top + hole.height / 2 - ch / 2;
      left = hole.left + hole.width + gap;
    }

    const clampedTop = Math.min(Math.max(m, top), Math.max(m, vh - ch - m));
    const clampedLeft = Math.min(Math.max(m, left), Math.max(m, vw - cw - m));
    setCard((prev) =>
      prev && Math.abs(prev.top - clampedTop) < 0.6 && Math.abs(prev.left - clampedLeft) < 0.6
        ? prev
        : { top: clampedTop, left: clampedLeft }
    );
  }, [isOpen, hole, step, safeStep, steps, layout]);

  useEffect(() => {
    if (isOpen) primaryRef.current?.focus();
  }, [isOpen, step, safeStep, steps]);

  if (!isOpen) return null;

  const current = steps[safeStep];
  const isLast = safeStep === total - 1;
  const { Icon } = current;
  const hiddenTarget = !hole && Boolean(current.selectors?.length);

  const shade = 'pointer-events-auto absolute bg-[rgba(3,5,10,0.78)] backdrop-blur-[3px]';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {/* ---------- Örtü: hedefin dışındaki her yer karartılır + bulanır ---------- */}
      {hole ? (
        <>
          <div
            className={shade}
            style={{ left: 0, right: 0, top: 0, height: hole.top }}
            onClick={close}
            aria-hidden="true"
          />
          <div
            className={shade}
            style={{ left: 0, right: 0, top: hole.top + hole.height, bottom: 0 }}
            onClick={close}
            aria-hidden="true"
          />
          <div
            className={shade}
            style={{ left: 0, width: hole.left, top: hole.top, height: hole.height }}
            onClick={close}
            aria-hidden="true"
          />
          <div
            className={shade}
            style={{
              left: hole.left + hole.width,
              right: 0,
              top: hole.top,
              height: hole.height
            }}
            onClick={close}
            aria-hidden="true"
          />

          {/* Spotlight halkası — hedefin sınırını çizer */}
          <div
            className="pointer-events-none absolute z-[72] rounded-[10px] border-2 border-[#e2c485] shadow-[0_0_0_1px_rgba(0,0,0,.55),0_0_32px_rgba(226,196,133,.35)]"
            style={{
              top: hole.top,
              left: hole.left,
              width: hole.width,
              height: hole.height
            }}
            aria-hidden="true"
          />

          {/* Gezilebilir adımlarda hedef gerçekten tıklanabilir kalır:
              katman açıp kapatmayı tur içinde deneyebilirsin. */}
          {!current.interactive && (
            <div
              className="pointer-events-auto absolute z-[71] cursor-pointer"
              style={{
                top: hole.top,
                left: hole.left,
                width: hole.width,
                height: hole.height
              }}
              onClick={next}
              title="Devam et"
              aria-hidden="true"
            />
          )}
        </>
      ) : (
        <div
          className="pointer-events-auto absolute inset-0 bg-[rgba(3,5,10,0.78)] backdrop-blur-[3px]"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ---------- Kart ---------- */}
      <div
        ref={cardRef}
        className="hf-panel pointer-events-auto absolute z-[73] overflow-y-auto rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,.85)]"
        style={{
          top: card?.top ?? 12,
          left: card?.left ?? 12,
          width: layout.widthPx,
          maxHeight: 'calc(100vh - 24px)',
          visibility: card ? 'visible' : 'hidden'
        }}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a24a]/60 to-transparent" />

        {/* Üst şerit */}
        <div className="border-b border-[#c9a24a]/15 px-3.5 pb-0 pt-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="hf-label shrink-0 rounded border border-[#c9a24a]/35 px-1.5 py-0.5 text-[9px] text-[#dcc07d]">
                Tanıtım Turu
              </span>
              <span className="truncate text-[10px] font-semibold text-[#b5a06a]">
                {current.chapter}
              </span>
              <span className="shrink-0 text-[10px] font-semibold text-[#8f8a72]">
                {safeStep + 1}/{total}
              </span>
            </div>

            <button
              onClick={close}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#c9a24a]/20 text-[#a89f7e] transition-colors hover:border-[#c9a24a]/60 hover:text-[#f5ecd4]"
              title="Turu kapat"
              aria-label="Turu kapat"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Bölüm ilerlemesi */}
          <div className="mt-1.5 h-[2px] w-full overflow-hidden rounded-full bg-[#c9a24a]/15">
            <div
              className="h-full rounded-full bg-[#dcc07d] transition-[width] duration-300"
              style={{ width: `${((safeStep + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Gövde */}
        <div className="px-4 pb-1 pt-3">
          <div className="flex items-start gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#c9a24a]/45 bg-[#c9a24a]/12 text-[#e2c485]">
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="hf-label text-[9px] uppercase tracking-[0.18em] text-[#b8a068]">
                {current.eyebrow}
              </div>
              <h2
                id="onboarding-title"
                className="hf-serif mt-0.5 text-[15.5px] font-semibold leading-snug text-[#f7f2e3]"
              >
                {current.title}
              </h2>
            </div>
          </div>

          <p className="mt-2.5 text-[12px] leading-relaxed text-[#c9c2a6]">
            {current.body}
          </p>

          {current.bullets && current.bullets.length > 0 && (
            <ul className="mt-2.5 space-y-1">
              {current.bullets.map((b) => (
                <li
                  key={b.label}
                  className="flex items-start gap-2 rounded-lg border border-[#c9a24a]/15 bg-black/25 px-2.5 py-1.5"
                >
                  <span className="mt-[3px] h-1 w-1 shrink-0 rotate-45 bg-[#c9a24a]/80" />
                  <span className="text-[11px] leading-snug text-[#c9c2a6]">
                    <strong className="font-semibold text-[#e8dcbb]">{b.label}:</strong>{' '}
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {current.hint && (
            <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-[#dcc07d]">
              <span className="h-1 w-1 rotate-45 bg-[#dcc07d]" />
              {current.hint}
            </p>
          )}

          {current.recap && (
            <ul className="mt-2.5 space-y-1">
              {current.recap.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-1.5 text-[11px] leading-snug text-[#c9c2a6]"
                >
                  <Check className="mt-[2px] h-3 w-3 shrink-0 text-[#b9c99a]" />
                  {r}
                </li>
              ))}
            </ul>
          )}

          {/* Hedef bu ekran genişliğinde yoksa turu kesmek yerine neden
              aydınlatma olmadığını söyle. */}
          {hiddenTarget ? (
            <p className="mt-2 rounded-md border border-[#c9a24a]/20 bg-black/30 px-2 py-1.5 text-[10.5px] leading-snug text-[#a9a184]">
              Bu öğe bu ekran genişliğinde gizli — geniş ekranda üst barda görünür.
            </p>
          ) : null}

          {current.showTiers && (
            <div className="mt-2.5 rounded-lg border border-[#c9a24a]/20 bg-black/30 p-2">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#dcc07d]" />
                <span className="hf-label text-[9px] uppercase tracking-[0.16em] text-[#b8a068]">
                  Kademe merdiveni
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                {[1, 2, 3, 4, 5].map((t) => (
                  <div key={t} className="flex min-w-0 flex-col items-center gap-0.5">
                    <TierMark tier={t} className="h-6 w-6" />
                    <span className="text-[8.5px] font-semibold uppercase tracking-wide text-[#9a9070]">
                      {TIER_LABELS[t].name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Alt şerit */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#c9a24a]/15 px-3.5 py-2.5">
          <button
            onClick={close}
            className="cursor-pointer rounded-full px-2 py-1 text-[10.5px] font-medium text-[#8b8f7f] underline decoration-[#5f5c47] transition-colors hover:text-[#c9c2a6]"
            title="Turu atla — bir daha gösterilmez"
          >
            Atla
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" aria-hidden="true">
              {steps.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setStep(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-4 bg-[#dcc07d]' : 'w-1.5 bg-[#c9a24a]/30 hover:bg-[#c9a24a]/55'
                  }`}
                  tabIndex={-1}
                  title={`${i + 1}. adım — ${s.chapter}`}
                />
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="hf-btn-ghost flex items-center gap-1 px-2.5 py-1.5 text-[11px]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Geri
              </button>
            )}

            <button
              ref={primaryRef}
              onClick={() => (isLast ? close() : next())}
              className="hf-btn-brass flex items-center gap-1.5 px-3 py-1.5 text-[11.5px]"
            >
              {isLast ? 'Başla' : 'İleri'}
              {!isLast && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
