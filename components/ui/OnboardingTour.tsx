'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
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
  Bot
} from 'lucide-react';
import { TierMark } from '@/components/ui/wearables/WearableEmblem';
import { TIER_LABELS } from '@/lib/data/wearableGlyphs';

/* ==================================================================
   İlk giriş tanıtım turu — **opsiyonel spotlight turu**.

   Kart sadece yazmaz: her adım arayüzdeki gerçek bir öğeyi hedefler,
   etrafındaki her şey karartılıp bulanıklaştırılır, kart hedefin
   yanına konumlanır. Hedef görünmüyorsa (ör. telefonda gizli arama
   alanı) o adım ortalanmış tam örtüyle gösterilir — tur kesilmez.

   Kurallar:
   1. Yalnızca ilk girişte, yalnızca veri yoksa açılır (hasProgress).
   2. Her adımda `Atla`; X, Esc ve örtü tıklaması da kapatır.
   3. Kapandıktan sonra kendiliğinden açılmaz (kpss3d_onboarding_v1).
   4. Navbar pusula düğmesi `kpss3d:open-onboarding` ile tekrar açar.
   ================================================================== */

const STORAGE_KEY = 'kpss3d_onboarding_v1';
export const OPEN_ONBOARDING_EVENT = 'kpss3d:open-onboarding';

type Placement = 'bottom' | 'top' | 'left' | 'right' | 'center';

type Step = {
  eyebrow: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
  /** Aday seçiciler — ilk *görünür* olan hedef seçilir. */
  selectors?: string[];
  placement?: Placement;
  hint?: string;
  showTiers?: boolean;
};

const STEPS: Step[] = [
  {
    eyebrow: 'Hoş geldin',
    title: 'Türkiye’yi 3D haritada öğren',
    body: 'Bu tur, arayüzü gezdirecek: her adımda bir öğe aydınlanacak, gerisi bulanıklaşacak. Zorunlu değil — istediğin an çıkabilirsin.',
    Icon: Compass,
    placement: 'center',
    hint: 'Klavye: ← → gezin, Esc çıkar'
  },
  {
    eyebrow: 'Katman omurgası',
    title: 'Haritayı pusuladan katmanlandır',
    body: 'Harita sade başlar. Bu düğme katman panelini açar; dağ, plato, akarsu ve geçitleri tek tek haritaya işlersin.',
    Icon: Layers,
    selectors: ['button[title="Harita katmanlarını aç / kapat"]'],
    placement: 'bottom'
  },
  {
    eyebrow: 'Oyun modları',
    title: 'Dört mod — dördü de isteğe bağlı',
    body: 'Bu ray modlar arasında geçiş yapar. Harita Testi yeri işaretletir, Düello canlı 1v1’dir, KPSS Testi klasik sorudur, Ezber kısa tekrardır.',
    Icon: Gamepad2,
    selectors: ['button[title="Harita Testi"]'],
    placement: 'bottom'
  },
  {
    eyebrow: 'Arama',
    title: 'Bir isim yaz, harita oraya uçsun',
    body: 'Dağ, ova, göl adı yazdığında sonuç listesi açılır; seçtiğin yer haritada uçar ve bilgi kartı gelir.',
    Icon: Search,
    selectors: ['input[placeholder="Ara..."]'],
    placement: 'bottom'
  },
  {
    eyebrow: 'AI öğretmen',
    title: 'Takıldığın yeri asistana sor',
    body: 'Bu düğme KPSS coğrafya asistanını açar. “Neden bu geçit önemli?” gibi soruları haritadaki bağlamıyla yanıtlar.',
    Icon: Bot,
    selectors: ['button[title="Yapay zeka KPSS asistanı"]'],
    placement: 'bottom'
  },
  {
    eyebrow: 'Birikim',
    title: 'Rozet kademeyi, kademe görünümü açar',
    body: 'Her tamamlanan hedef bir rozet verir. Rozetler kademeni yükseltir; kademe yeni avatar, ünvan ve çerçeve açar. Hepsi buradaki profil düğmesinde seçilir.',
    Icon: Award,
    selectors: [
      'button[title="Nick Gir veya Geçmiş Yükle"]',
      'button[title="Profili Düzenle, Avatarını Değiştir veya Hesabı Yönet"]'
    ],
    placement: 'bottom',
    showTiers: true
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

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [hole, setHole] = useState<Hole | null>(null);
  const [card, setCard] = useState<{ top: number; left: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const primaryRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    rememberSeen();
    /* Tur katman omurgasını zaten anlattı: aynı anda açılan
       LayerHintBanner turdan sonra tekrar "katmanları aç" demesin. */
    try {
      localStorage.setItem('kpss3d_layer_hint_seen_v2', 'true');
    } catch {
      /* storage kapalıysa banner yine çıkar; zararsız */
    }
  }, []);

  const next = useCallback(() => {
    setStep((s) => (s >= STEPS.length - 1 ? s : s + 1));
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

  /* Tur açılınca katman ipucu banner'ı susar: tur aynı konuyu
     anlatıyor, ikisi üst üste binmesin. */
  useEffect(() => {
    if (!isOpen) return;
    window.dispatchEvent(new CustomEvent('kpss3d:dismiss-layer-hint'));
  }, [isOpen]);

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

  /* Odak tuzağı: Tab ile arkadaki karartılmış arayüze kaçış olmasın.
     Tur bir dialog; odak kartın içinde dönmeli. */
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
      const s = STEPS[step];
      if (!s.selectors?.length) {
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
    /* Yazı tipleri / harita geç yüklenirse ikinci ölçüm. */
    const settle = window.setTimeout(measure, 260);

    const onViewport = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onViewport);
    window.addEventListener('scroll', onViewport, true);
    return () => {
      window.clearTimeout(settle);
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onViewport);
      window.removeEventListener('scroll', onViewport, true);
    };
  }, [isOpen, step]);

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

    const pref = STEPS[step].placement;
    const order: Array<'bottom' | 'top' | 'left' | 'right'> = [
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
  }, [isOpen, hole, step]);

  useEffect(() => {
    if (isOpen) primaryRef.current?.focus();
  }, [isOpen, step]);

  if (!isOpen) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const { Icon } = current;

  const shade = 'absolute bg-[rgba(3,5,10,0.78)] backdrop-blur-[3px]';

  return (
    <div
      className="fixed inset-0 z-[70]"
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

          {/* Halkaya tıklamak turu ilerletir (alt öğeye kazara dokunulmasın) */}
          <div
            className="absolute z-[71] cursor-pointer"
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
        </>
      ) : (
        <div
          className="absolute inset-0 bg-[rgba(3,5,10,0.78)] backdrop-blur-[3px]"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ---------- Kart ---------- */}
      <div
        ref={cardRef}
        className="hf-panel absolute z-[73] overflow-y-auto rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,.85)]"
        style={{
          top: card?.top ?? 12,
          left: card?.left ?? 12,
          width: 'min(400px, calc(100vw - 24px))',
          maxHeight: 'calc(100vh - 24px)',
          visibility: card ? 'visible' : 'hidden'
        }}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a24a]/60 to-transparent" />

        {/* Üst şerit */}
        <div className="flex items-center justify-between gap-2 border-b border-[#c9a24a]/15 px-3.5 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="hf-label rounded border border-[#c9a24a]/35 px-1.5 py-0.5 text-[9px] text-[#dcc07d]">
              Tanıtım Turu
            </span>
            <span className="text-[10px] font-semibold text-[#8f8a72]">
              {step + 1} / {STEPS.length}
            </span>
          </div>

          <button
            onClick={close}
            className="grid h-7 w-7 place-items-center rounded-full border border-[#c9a24a]/20 text-[#a89f7e] transition-colors hover:border-[#c9a24a]/60 hover:text-[#f5ecd4]"
            title="Turu kapat"
            aria-label="Turu kapat"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Gövde */}
        <div className="px-4 pb-1 pt-3.5">
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

          {current.hint && (
            <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-[#8f8a72]">
              <span className="h-1 w-1 rotate-45 bg-[#c9a24a]/70" />
              {current.hint}
            </p>
          )}

          {/* Hedef bu ekran genişliğinde yoksa (ör. telefonda arama alanı
              gizli) turu kesmek yerine neden aydınlatma olmadığını söyle. */}
          {!hole && current.selectors?.length ? (
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
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setStep(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-4 bg-[#dcc07d]' : 'w-1.5 bg-[#c9a24a]/30 hover:bg-[#c9a24a]/55'
                  }`}
                  tabIndex={-1}
                  title={`${i + 1}. adım`}
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
