'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
  X,
  MessageSquarePlus,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bug,
  Lightbulb,
  MapPin,
  HeartHandshake
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEEDBACK_TYPES = [
  { id: 'suggestion', label: 'Yeni Özellik / Öneri', icon: Lightbulb, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  { id: 'bug', label: 'Hata / Sorun Bildirimi', icon: Bug, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  { id: 'question_issue', label: 'Harita / Soru Hatası', icon: MapPin, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' },
  { id: 'appreciation', label: 'Görüş & Memnuniyet', icon: HeartHandshake, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const activeRumuz = typeof window !== 'undefined' ? localStorage.getItem('kpss3d_active_rumuz') || '' : '';

  const [category, setCategory] = useState<string>('suggestion');
  const [rumuz, setRumuz] = useState<string>(activeRumuz);
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Lütfen görüş veya geri bildiriminizi yazınız.');
      return;
    }
    if (message.trim().length < 5) {
      setErrorMsg('Geri bildirim en az 5 karakter olmalıdır.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await addDoc(collection(db, 'feedbacks'), {
        rumuz: rumuz.trim() || activeRumuz || 'Anonim Gezgin',
        email: email.trim() || null,
        category,
        message: message.trim(),
        rating,
        deviceInfo: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          width: typeof window !== 'undefined' ? window.innerWidth : 0,
          height: typeof window !== 'undefined' ? window.innerHeight : 0,
        },
        createdAt: new Date().toISOString()
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage('');
        onClose();
      }, 1800);
    } catch (err) {
      console.warn('Feedback submit error:', err);
      // Fallback: save to localStorage if offline
      try {
        const existing = JSON.parse(localStorage.getItem('kpss3d_offline_feedbacks') || '[]');
        existing.push({
          rumuz: rumuz.trim() || 'Anonim Gezgin',
          category,
          message: message.trim(),
          rating,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('kpss3d_offline_feedbacks', JSON.stringify(existing));
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMessage('');
          onClose();
        }, 1800);
      } catch {
        setErrorMsg('Geri bildirim kaydedilemedi. Lütfen bağlantınızı kontrol ediniz.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#09090b] border-2 border-indigo-500/40 rounded-2xl max-w-lg w-full p-4 sm:p-5 text-slate-100 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-base text-white tracking-wide flex items-center gap-1.5">
              <span>Geri Bildirim &amp; Öneri Gönder</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">
              Görüşlerin, bulduğun hatalar ve yeni fikirlerin uygulamayı geliştirmemize yardımcı olur.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-white">Geri Bildiriminiz Alındı!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Değerli katkınız için teşekkür ederiz. KPSS 3D Harita deneyimini birlikte mükemmelleştiriyoruz.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/70 text-rose-300 flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300">Geri Bildirim Türü:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {FEEDBACK_TYPES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = category === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCategory(t.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? `${t.color} border-current ring-2 ring-indigo-400 font-black shadow-md`
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-[11px] truncate">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>Deneyim Puanınız:</span>
                <span className="text-amber-400 font-extrabold">{rating} / 5 Yıldız</span>
              </label>
              <div className="flex items-center gap-1.5 p-2 bg-white/5 border border-white/10 rounded-xl justify-around">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-xl sm:text-2xl transition-transform hover:scale-125 cursor-pointer ${
                      rating >= star ? 'opacity-100 grayscale-0 scale-110' : 'opacity-30 grayscale'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Rumuz & Email Optional Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Rumuzunuz:</label>
                <input
                  type="text"
                  value={rumuz}
                  onChange={(e) => setRumuz(e.target.value)}
                  placeholder="İsminiz veya Rumuz"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">E-posta (İsteğe Bağlı):</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="iletisim@ornek.com"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Açıklama / Mesajınız:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Önerinizi, karşılaştığınız sorunu veya geliştirmesini istediğiniz detayları yazın..."
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-indigo-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:brightness-110 text-white font-black rounded-xl text-xs shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Geri Bildirimi İlet</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
