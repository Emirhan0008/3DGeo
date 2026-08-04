'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4">
      <h2 className="text-2xl font-bold mb-2">Bir Hata Oluştu</h2>
      <p className="text-slate-400 mb-6">{error.message || 'Bir hata meydana geldi.'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
