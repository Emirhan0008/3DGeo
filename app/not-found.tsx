import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0c07] p-4 text-[#eee5cd]">
      <div className="hf-modal hf-modal-rule w-full max-w-md rounded-2xl p-8 text-center">
        <p className="hf-label mb-1 text-[10px] text-[#a98f4e]">Hata 404</p>
        <h2 className="hf-serif mb-2 text-2xl font-semibold text-[#e8d7ab]">
          Sayfa Bulunamadı
        </h2>
        <div className="hf-divider mb-4 text-[8px]">◆</div>
        <p className="mb-6 text-sm text-[#9a9276]">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link href="/" className="hf-btn-brass inline-block px-5 py-2.5 text-sm">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
