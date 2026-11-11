'use client';

import React, { useEffect } from 'react';
import { RecyclerMaterial } from '@/hooks/recycler/useRecyclerMaterials';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  material: RecyclerMaterial | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  material,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !material) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <div className="flex justify-end -mt-1 -mr-1 mb-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition"
            aria-label="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
          <Trash2 className="w-7 h-7" />
        </div>

        {/* Title & Description */}
        <h3 id="delete-dialog-title" className="text-lg font-extrabold text-slate-900 tracking-tight">
          Hapus Ketentuan Material?
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Apakah Anda yakin ingin menghapus material ini dari ketentuan penerimaan gudang Anda?
        </p>

        {/* Material Detail Preview Box */}
        <div className="my-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-900 text-xs truncate">
              {material.name}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold shrink-0">
              {material.category}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
            <span>Harga Beli:</span>
            <span className="font-extrabold text-emerald-700">
              Rp {material.pricePerUnit.toLocaleString('id-ID')} /{material.unit}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Min. Setoran:</span>
            <span className="font-semibold text-slate-700">
              {material.minQuantity} {material.unit}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-amber-700 bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-xl text-left flex items-start gap-2 mb-5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Warga tidak akan dapat lagi menyetor atau memilih material ini untuk gudang Anda di menu pencocokan rute.
          </span>
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-rose-600/20 transition inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Material</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

