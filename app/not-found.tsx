import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4">
      <h2 className="text-2xl font-bold mb-2">Sayfa Bulunamadı (404)</h2>
      <p className="text-slate-400 mb-6">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
