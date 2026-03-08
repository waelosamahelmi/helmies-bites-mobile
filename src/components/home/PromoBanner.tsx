import { ArrowRight } from 'lucide-react';

export function PromoBanner() {
  return (
    <div className="mx-4 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary-600 p-5 text-white relative">
      <div className="relative z-10">
        <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
          NEW USER
        </span>
        <h3 className="text-xl font-black mt-2 leading-tight">
          Get 20% off your<br/>first order!
        </h3>
        <p className="text-sm text-white/80 mt-1">
          Use code: HELMIES20
        </p>
        <button className="mt-3 flex items-center gap-1 text-sm font-bold bg-white text-primary rounded-full px-4 py-2">
          Order now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
      <div className="absolute -right-2 -bottom-8 w-24 h-24 bg-white/5 rounded-full" />
    </div>
  );
}
