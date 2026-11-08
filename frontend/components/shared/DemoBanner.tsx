import React from 'react';

interface DemoBannerProps {
  compact?: boolean;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
        DATA DEMO / SIMULASI
      </span>
    );
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4 rounded-r-md text-amber-900 text-sm">
      <div className="flex items-center gap-2 font-semibold">
        <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>Mode Demonstrasi & Simulasi</span>
      </div>
      <p className="mt-1 text-xs text-amber-800">
        Data pengelola berlabel <strong>DEMO</strong> adalah data tiruan untuk pengujian alur sistem. Harga dan penerimaan material merupakan estimasi dan bukan komitmen transaksi riil.
      </p>
    </div>
  );
};

