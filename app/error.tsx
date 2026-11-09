'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0c07] p-4 text-[#f7f2e3]">
      <div className="hf-modal hf-modal-rule w-full max-w-md rounded-2xl p-8 text-center">
        <h2 className="hf-serif mb-2 text-2xl font-semibold text-[#e8d7ab]">
          Bir Hata Oluştu
        </h2>
        <div className="hf-divider mb-4 text-[8px]">◆</div>
        <p className="mb-6 text-sm text-[#a9a894]">
          {error.message || 'Bir hata meydana geldi.'}
        </p>
        <button
          onClick={() => reset()}
          className="hf-btn-brass px-5 py-2.5 text-sm"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
