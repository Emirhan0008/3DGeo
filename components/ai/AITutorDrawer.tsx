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
 className={`hf-plaque hf-double-rule absolute right-0 top-0 bottom-0 flex max-h-full flex-col overflow-hidden rounded-l-xl text-[#f7f2e3] transition-all duration-300 ease-in-out sm:right-2 sm:top-2 sm:bottom-2 sm:rounded-2xl sm:h-[calc(100%-1rem)] ${
 isExpanded ? 'z-45' : 'z-20'
 } ${
 isExpanded
 ? isHovered || isPinned
 ? 'w-[85vw] max-w-sm sm:w-96 bg-[#0d1614]/95 opacity-100'
 : 'w-[85vw] max-w-sm sm:w-96 bg-[#0d1614]/88 opacity-85 hover:opacity-100'
 : isHovered
 ? 'w-5 sm:w-9 bg-[#0d1614]/95 opacity-100'
 : 'w-5 sm:w-9 bg-[#0d1614]/80 opacity-80 hover:opacity-100'
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
 <div className="rounded-md border border-[#c9a24a]/40 bg-[#c9a24a]/12 p-0.5 text-[#dcc07d] sm:rounded-lg sm:p-1.5">
 <Bot className="h-3 w-3 text-[#dcc07d] sm:h-4 sm:w-4" />
 </div>
 <div className="p-0.5 rounded-full bg-[#c9a24a]/10 text-[#c9a24a] text-[8px]">
 <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
 </div>
 </div>

 <div className="flex-1 flex items-center justify-center my-1 overflow-hidden select-none pointer-events-none">
 <span className="[writing-mode:vertical-rl] rotate-180 hf-label text-[7.5px] sm:text-[9px] font-semibold tracking-[0.1em] text-[#cdb878] hover:text-[#f2e8cf] transition-colors whitespace-nowrap max-h-36 overflow-hidden sm:tracking-normal">AI EĞİTMEN
 </span>
 </div>

 <div className="flex flex-col items-center gap-1 pointer-events-none">
 <ChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-bounce text-[#c9a24a]" />
 <button
 onClick={(e) => {
 e.stopPropagation();
 setAiDrawerOpen(true);
 setIsPinned(true);
 }}
 title="Sohbeti Ekrana Sabitle"
 className="pointer-events-auto rounded p-0.5 text-[#b5a06a] transition-all hover:bg-[#c9a24a]/12 hover:text-[#e6c784]"
>
 <Pin className="w-3 h-3" />
 </button>
 </div>
 </div>
 ) : (
 /* Expanded Content State */
 <div className="w-full h-full flex flex-col animate-in fade-in duration-200">
 {/* Header */}
 <div className="hf-parchment flex items-center justify-between gap-2 border-b border-[#8a6a1d]/45 p-2.5 sm:p-3">
 <div className="flex min-w-0 items-center gap-2">
 <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#8a6a1d]/60 bg-[#2b2413] sm:h-9 sm:w-9">
 <Bot className="h-3.5 w-3.5 text-[#e0c37f] sm:h-4 sm:w-4" />
 </div>
 <div className="min-w-0">
 <div className="flex min-w-0 items-center gap-1.5">
 {/* Title + pill shared one row with no `min-w-0`, so on a 390px
 drawer the two stacked into three wrapped lines. */}
 <h3 className="hf-serif truncate text-[11px] font-bold tracking-[0.06em] text-[#2a2314] sm:text-[13px]">
 <span className="sm:hidden">AI COĞRAFYA EĞİTMENİ</span>
 <span className="hidden sm:inline">KPSS AI COĞRAFYA EĞİTMENİ</span>
 </h3>
 <span className="shrink-0 rounded-full border border-[#8a6a1d]/55 bg-[#f4e6bd] px-1.5 py-0.5 text-[8px] font-bold tracking-[0.1em] text-[#5a4413] sm:px-2 sm:text-[9px]">YAKINDA
 </span>
 </div>
 <p className="truncate text-[9px] font-medium text-[#6f5c33] sm:text-[10px]">Yakında Hizmetinizde Olacaktır
 </p>
 </div>
 </div>

 <div className="flex shrink-0 items-center gap-1">
 <button
 onClick={() => setIsPinned(!isPinned)}
 title={isPinned ? 'Sabitlemeyi Kaldır (Hover Modu)' : 'Ekrana Sabitle'}
 className={`p-1.5 rounded-lg transition-all ${
 isPinned
 ? 'border border-[#8a6a1d]/50 bg-[#2a2314]/12 text-[#5a4413]'
 : 'text-[#6f5c33] hover:bg-[#2a2314]/10 hover:text-[#2a2314]'
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
 className="p-1.5 rounded-lg text-[#6f5c33] hover:bg-[#2a2314]/10 hover:text-[#2a2314] transition-all"
>
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Coming Soon Notice Banner */}
 <div className="flex items-center gap-2 border-b border-[#c9a24a]/18 bg-[#c9a24a]/8 p-2.5 text-xs text-[#e6d9b6]">
 <Sparkles className="h-4 w-4 shrink-0 text-[#c9a24a]" />
 <span className="text-[11px] font-bold leading-snug">
 <span className="sm:hidden">Modül geliştirilmektedir — çok yakında soru çözümü ve kişisel koçluk.</span>
 <span className="hidden sm:inline">Yapay Zeka KPSS Asistanı modülü geliştirilmektedir. Çok yakında soru çözümleri ve kişiselleştirilmiş coğrafya koçluğu ile aktif olacaktır!</span>
 </span>
 </div>

 {/* Quick Prompts — wraps instead of scrolling. A horizontal strip put 4 of
 the 6 examples off-screen at 390px with nothing hinting they existed. */}
 <div className="flex flex-wrap items-center gap-1.5 border-b border-[#c9a24a]/15 bg-black/20 p-2 text-[10px] sm:p-2.5">
 <span className="flex shrink-0 items-center gap-1 font-bold text-[#c9a24a]">
 <Lightbulb className="w-3 h-3" /> Örnek:
 </span>
 {QUICK_QUESTIONS.map((q, idx) => (
 <button
 key={idx}
 onClick={() => handleSend(q)}
 disabled={loading}
 className={`whitespace-nowrap rounded-lg border border-[#c9a24a]/22 bg-[#c9a24a]/6 px-2 py-1 font-medium text-[#d8c8a2] transition-all hover:border-[#c9a24a]/45 hover:bg-[#c9a24a]/12 hover:text-[#f2e8cf] ${idx >= 3 ? 'hidden sm:inline-flex' : ''}`}
>
 {q}
 </button>
 ))}
 </div>

 {/* Chat History */}
 <div className="hf-scroll relative flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
 <div
 aria-hidden="true"
 className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
 style={{
 backgroundImage: "url('/assets/theme/ai-landscape.jpg')",
 backgroundSize: 'cover',
 backgroundPosition: 'center bottom',
 opacity: 0.6,
 }}
 />
 <div
 aria-hidden="true"
 className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0d1614] via-[#0d1614]/40 to-transparent"
 />
 {chatMessages.map((msg, idx) => (
 <div
 key={idx}
 className={`relative z-10 flex items-start gap-2 ${
 msg.sender === 'user' ? 'justify-end' : 'justify-start'
 }`}
>
 {msg.sender === 'ai' && (
 <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/12 font-bold text-[#dcc07d]">
 <Bot className="h-3.5 w-3.5" />
 </div>
 )}

 <div
 className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
 msg.sender === 'user'
 ? 'rounded-tr-none bg-[#8a6a1d] font-medium text-[#fdf8e9] shadow-md'
 : 'rounded-tl-none border border-[#c9a24a]/18 bg-[#1b2b28]/90 text-[#e8e2d0] whitespace-pre-line'
 }`}
>
 {msg.text}
 </div>

 {msg.sender === 'user' && (
 <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#c9a24a]/22 bg-black/30 font-bold text-[#b5a06a]">
 <User className="w-3.5 h-3.5" />
 </div>
 )}
 </div>
 ))}

 {loading && (
 <div className="relative z-10 flex items-center gap-2 p-2 text-xs font-medium text-[#dcc07d]">
 <Loader2 className="h-4 w-4 animate-spin text-[#c9a24a]" />
 <span>AI Eğitmen KPSS hafıza tekniklerini hazırlıyor...</span>
 </div>
 )}
 </div>

 {/* Input Form */}
 <div className="flex items-center gap-2 border-t border-[#c9a24a]/18 bg-black/30 p-3">
 <input
 type="text"
 value={inputPrompt}
 onChange={(e) => setInputPrompt(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
 placeholder="KPSS Coğrafya sorunu yaz..."
 className="hf-input flex-1 text-xs"
 />

 <button
 onClick={() => handleSend()}
 disabled={loading || !inputPrompt.trim()}
 className="hf-btn-brass rounded-xl p-2"
>
 <Send className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}
 </aside>
 );
}
