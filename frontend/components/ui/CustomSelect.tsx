'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Package, Wine, Droplets, Box, FileText, Wrench } from 'lucide-react';
import { WasteCategory } from '@/types';

interface CustomSelectProps {
  value: string;
  categories: WasteCategory[];
  onChange: (categoryId: string) => void;
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  categories,
  onChange,
  placeholder = '-- Pilih Jenis Material --',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((c) => c.id === value);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('kardus') || lower.includes('karton')) return <Package className="w-4 h-4 text-amber-700" />;
    if (lower.includes('botol') || lower.includes('pet') || lower.includes('plastik')) return <Wine className="w-4 h-4 text-emerald-600" />;
    if (lower.includes('minyak') || lower.includes('jelantah')) return <Droplets className="w-4 h-4 text-amber-600" />;
    if (lower.includes('kaleng') || lower.includes('aluminium')) return <Box className="w-4 h-4 text-sky-600" />;
    if (lower.includes('kertas') || lower.includes('hvs') || lower.includes('buku')) return <FileText className="w-4 h-4 text-indigo-600" />;
    return <Wrench className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button (Explicit h-11 for pixel-perfect alignment) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 flex items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-left text-xs sm:text-sm font-semibold transition-all shadow-xs ${
          isOpen
            ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedCategory ? (
            <>
              <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                {getCategoryIcon(selectedCategory.name)}
              </div>
              <span className="text-slate-900 truncate">{selectedCategory.name}</span>
            </>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedCategory && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              {selectedCategory.unit}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full z-50 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto space-y-0.5" role="listbox">
            {categories.map((cat) => {
              const isSelected = cat.id === value;
              return (
                <div
                  key={cat.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(cat.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                      {cat.unit}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

