export function ReceiptBranding() {
  return (
    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center justify-center gap-1.5 opacity-80 print:opacity-100">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Powered by</span>
        <img
          src="/assets/ayusetu_logo.png"
          alt="AyuSetu"
          className="h-4.5 w-auto object-contain inline-block"
        />
        <span className="text-emerald-700 font-bold">AyuSetu</span>
      </div>
      <p className="text-[9px] text-slate-400 font-medium italic">
        Care That Stays Connected &bull; AyuSetu Clinical OS
      </p>
    </div>
  );
}
