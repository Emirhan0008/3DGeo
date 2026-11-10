'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Compass,
  Layers,
  Gamepad2,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles
} from 'lucide-react';
import { TierMark } from '@/components/ui/wearables/WearableEmblem';
import { TIER_LABELS } from '@/lib/data/wearableGlyphs';

/* ==================================================================
   İlk giriş tanıtım turu — **opsiyonel**.

   Kurallar:
   1. Yalnızca ilk girişte, yalnızca veri yoksa açılır. Daha önce
      oynamış birine gösterilmez (bkz. `hasProgress`).
   2. Her adımda `Atla` var; X, Esc ve arka plan tıklaması da kapatır.
   3. Kapandıktan sonra bir daha kendiliğinden açılmaz — bayrak
      `localStorage`'a yazılır.
   4. İsteyen Navbar'daki pusula düğmesinden tekrar açabilir
      (`kpss3d:open-onboarding` olayı).
   ================================================================== */

const STORAGE_KEY = 'kpss3d_onboarding_v1';
export const OPEN_ONBOARDING_EVENT = 'kpss3d:open-onboarding';

type Step = {
  eyebrow: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
  points: { label: string; text: string }[];
  showTiers?: boolean;
};

const STEPS: Step[] = [
  {
    eyebrow: 'Hoş geldin',
    title: 'Türkiye’yi 3D haritada öğren',
    body: 'KPSS coğrafyası burada haritanın kendisi üzerinden çalışılır: dağ, ova, akarsu, geçit — hepsi yerinde durur. Okumak yerine görürsün.',
    Icon: Compass,
    points: [
      { label: 'Keşif', text: 'Haritayı döndür, yakınlaş, bir yeryüzü şekline tıkla.' },
      { label: 'Başlangıç', text: 'Hiçbir şey ezberletilmez; önce bakman yeter.' }
    ]
  },
  {
    eyebrow: 'Harita',
    title: 'Sol kenar katmanları, üst bar aramayı açar',
    body: 'Harita sade başlar. Katmanları açtıkça dağlar, platolar, akarsular ve geçitler haritaya işlenir. Bir ismi arayıp doğrudan üzerine uçabilirsin.',
    Icon: Layers,
    points: [
      { label: 'Katmanlar', text: 'Sol omurgadaki düğme; istediğin zaman aç/kapat.' },
      { label: 'Arama', text: 'Üst bardaki alan; yazdığın yer uçar ve kartı açılır.' }
    ]
  },
  {
    eyebrow: 'Oyunlar',
    title: 'Dört mod, tek amaç: hatırlamak',
    body: 'Öğrendiğini ölçmenin dört yolu var. İstediğin yerde başla, istediğin kadar oyna — hiçbiri zorunlu değil.',
    Icon: Gamepad2,
    points: [
      { label: 'Harita Testi', text: 'Sorulan yeri haritada işaretle, km cinsinden hata puanı al.' },
      { label: 'Düello', text: 'Canlı 1v1; aynı soruyu aynı anda yarışarak çöz.' },
      { label: 'KPSS Testi', text: 'Klasik çoktan seçmeli sorular, açıklamalı çözüm.' },
      { label: 'Ezber', text: 'Akılda kalıcı kodlama kartları; kısa tekrar.' }
    ]
  },
  {
    eyebrow: 'Birikim',
    title: 'Rozet kademeyi, kademe görünümü açar',
    body: 'Her tamamladığın hedef bir rozet verir. Rozetler kademeni yükseltir, kademe yeni avatar, ünvan ve çerçeve açar. Profilde dördü ayrı ayrı seçilir.',
    Icon: Award,
    points: [
      { label: 'Rozet', text: 'Kanıt — hedefi tamamladığının işareti.' },
      { label: 'Ünvan', text: 'Kimlik — adının altında görünen isim.' },
      { label: 'Avatar', text: 'Görünüm — yalnızca seni temsil eder, puan vermez.' }
    ],
    showTiers: true
  }
];

/** Kayıtlı veriden yalnızca "oynamış" anlamına gelen alanlar. */
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

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const primaryRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    rememberSeen();
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
      timer = window.setTimeout(() => setIsOpen(true), 1100);
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

  /* Tur açıkken sayfa kaymasın (mobilde arka plan titremesi). */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
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
        setStep((s) => Math.min(STEPS.length - 1, s + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStep((s) => Math.max(0, s - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) primaryRef.current?.focus();
  }, [isOpen, step]);

  if (!isOpen) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const { Icon } = current;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {/* Arka plan: haritayı karartır, tıklama turu kapatır */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />

      <div className="hf-panel relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,.8)]">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a24a]/60 to-transparent" />

        {/* Üst şerit */}
        <div className="flex items-center justify-between gap-2 border-b border-[#c9a24a]/15 px-3.5 py-2.5 sm:px-4">
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
        <div className="px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c9a24a]/45 bg-[#c9a24a]/12 text-[#e2c485]">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="hf-label text-[9.5px] uppercase tracking-[0.18em] text-[#b8a068]">
                {current.eyebrow}
              </div>
              <h2
                id="onboarding-title"
                className="hf-serif mt-0.5 text-[17px] font-semibold leading-snug text-[#f7f2e3] sm:text-xl"
              >
                {current.title}
              </h2>
            </div>
          </div>

          <p className="mt-3 text-[12px] leading-relaxed text-[#c9c2a6] sm:text-[12.5px]">
            {current.body}
          </p>

          <ul className="mt-3 space-y-1.5">
            {current.points.map((p) => (
              <li
                key={p.label}
                className="flex items-start gap-2 rounded-lg border border-[#c9a24a]/15 bg-black/25 px-2.5 py-1.5"
              >
                <span className="mt-[3px] h-1 w-1 shrink-0 rotate-45 bg-[#c9a24a]/80" />
                <span className="text-[11px] leading-snug text-[#c9c2a6]">
                  <strong className="font-semibold text-[#e8dcbb]">{p.label}:</strong>{' '}
                  {p.text}
                </span>
              </li>
            ))}
          </ul>

          {current.showTiers && (
            <div className="mt-3 rounded-lg border border-[#c9a24a]/20 bg-black/30 p-2">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#dcc07d]" />
                <span className="hf-label text-[9px] uppercase tracking-[0.16em] text-[#b8a068]">
                  Kademe merdiveni
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                {[1, 2, 3, 4, 5].map((t) => (
                  <div key={t} className="flex min-w-0 flex-col items-center gap-0.5">
                    <TierMark tier={t} className="h-6 w-6 sm:h-7 sm:w-7" />
                    <span className="text-[8.5px] font-semibold uppercase tracking-wide text-[#9a9070]">
                      {TIER_LABELS[t].name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Alt şerit: noktalar + eylemler */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#c9a24a]/15 px-3.5 py-3 sm:px-4">
          <button
            onClick={close}
            className="cursor-pointer rounded-full px-2 py-1 text-[10.5px] font-medium text-[#8b8f7f] underline decoration-[#5f5c47] transition-colors hover:text-[#c9c2a6]"
            title="Turu atla — bir daha gösterilmez"
          >
            Atla
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex" aria-hidden="true">
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
              onClick={() => (isLast ? close() : setStep((s) => s + 1))}
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
