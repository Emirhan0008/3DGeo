'use client';

import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { useAppFullscreen } from '@/lib/utils';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  Loader2, 
  Lightbulb, 
  Pin, 
  PinOff, 
  ChevronLeft 
} from 'lucide-react';

const QUICK_QUESTIONS = [
  'Ege Kırık Dağları kodlaması nedir?',
  'Türkiye\'de demiryolu olan sınır kapıları hangileridir?',
  'Karstik ovalar için TAKKE formülü nedir?',
  'Güneydoğu Anadolu ovaları KPSS\'de nasıl çıkar?',
  'Volkanik set gölleri kodlaması söyler misin?'
];

export default function AITutorDrawer() {
  const { isFullscreen } = useAppFullscreen();
  const { activeTab, isAiDrawerOpen, setAiDrawerOpen, selectedFeature } = useAppStore();

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when store closes AI drawer
  React.useEffect(() => {
    if (!isAiDrawerOpen) {
      setIsHovered(false);
      setIsPinned(false);
    }
  }, [isAiDrawerOpen]);

  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string }>
  >([
    {
      sender: 'ai',
      text: 'Merhaba KPSS adayı! Ben senin 3D Coğrafya Eğitmeninim. Dağlar, akarsular, gümrük kapıları veya hafıza şifreleri (kodlamalar) hakkında ne sormak istersin?'
    }
  ]);

  const isExpanded = isHovered || isPinned || isAiDrawerOpen;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          featureName: selectedFeature?.name,
          category: selectedFeature?.category || selectedFeature?.type
        })
      });

      const data = await res.json();
      if (data.text) {
        setChatMessages((prev) => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'Üzgünüm, yanıt oluşturulurken bir aksaklık oldu.' }
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Bağlantı hatası yaşandı. Lütfen tekrar deneyin.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // In fullscreen mode, or when active tab is not exploration map, hide the collapsed edge strip so it NEVER overlaps games or modals
  if ((isFullscreen || activeTab !== 'map') && !isExpanded) {
    return null;
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute right-1 sm:right-2 top-1 sm:top-2 bottom-1 sm:bottom-2 backdrop-blur-2xl border border-indigo-500/40 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all duration-300 ease-in-out h-[calc(100%-0.5rem)] sm:h-[calc(100%-1rem)] max-h-full ${
        isExpanded ? 'z-45' : 'z-20'
      } ${
        isExpanded
          ? isHovered || isPinned
            ? 'w-[85vw] max-w-sm sm:w-96 bg-[#09090b]/95 opacity-100'
            : 'w-[85vw] max-w-sm sm:w-96 bg-[#09090b]/85 opacity-85 hover:opacity-100'
          : isHovered
          ? 'w-7 sm:w-9 bg-[#09090b]/95 opacity-100'
          : 'w-7 sm:w-9 bg-[#09090b]/75 opacity-80 hover:opacity-100'
      }`}
    >
      {/* Collapsed Strip State */}
      {!isExpanded ? (
        <div 
          onClick={() => {
            setAiDrawerOpen(true);
            setIsPinned(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setAiDrawerOpen(true);
            setIsPinned(true);
          }}
          className="w-full h-full flex flex-col items-center justify-between py-2 sm:py-3 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-all select-none touch-manipulation"
        >
          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
            <div className="p-1 sm:p-1.5 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-indigo-300">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 animate-pulse" />
            </div>
            <div className="p-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[8px]">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center my-1 overflow-hidden select-none pointer-events-none">
            <span className="[writing-mode:vertical-rl] rotate-180 text-[8px] sm:text-[9px] font-black tracking-wider uppercase text-indigo-300 hover:text-white transition-colors whitespace-nowrap max-h-36 overflow-hidden">
              AI EĞİTMEN
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 pointer-events-none">
            <ChevronLeft className="w-3 h-3 text-indigo-400 animate-bounce" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAiDrawerOpen(true);
                setIsPinned(true);
              }}
              title="Sohbeti Ekrana Sabitle"
              className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-all pointer-events-auto"
            >
              <Pin className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Content State */
        <div className="w-full h-full flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-950 via-[#09090b] to-purple-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-300">
                <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs sm:text-sm text-white">
                    KPSS AI COĞRAFYA EĞİTMENİ
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-[9px]">
                    YAKINDA
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Yakında Hizmetinizde Olacaktır</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? 'Sabitlemeyi Kaldır (Hover Modu)' : 'Ekrana Sabitle'}
                className={`p-1.5 rounded-lg transition-all ${
                  isPinned
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setIsPinned(false);
                  setIsHovered(false);
                  setAiDrawerOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Coming Soon Notice Banner */}
          <div className="p-2.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
            <span className="font-bold text-[11px]">
              🚀 Yapay Zeka KPSS Asistanı modülü geliştirilmektedir. Çok yakında soru çözümleri ve kişiselleştirilmiş coğrafya koçluğu ile aktif olacaktır!
            </span>
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white/5 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="font-bold text-indigo-400 shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Örnek:
            </span>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-200 whitespace-nowrap transition-all font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300 font-bold mt-1">
                    🤖
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none font-medium shadow-md'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-slate-400 font-bold mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium p-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>AI Eğitmen KPSS hafıza tekniklerini hazırlıyor...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="KPSS Coğrafya sorunu yaz..."
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !inputPrompt.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-lg transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
