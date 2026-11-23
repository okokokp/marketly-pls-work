import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronRight, Menu, RotateCcw } from 'lucide-react';
import type { Category, LanguageCode } from '../../shared/types.ts';
import {
  CANONICAL_CATEGORIES,
  CATEGORY_SUBPARTS,
  normalizeCategoryId,
} from '../../shared/taxonomy.ts';
import { t } from '../lib/i18n.ts';

interface UnifiedCategoryMenuProps {
  lang: LanguageCode;
  selectedCategory: string;
  selectedSubPart: string;
  onSelectSubPart: (subPartId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  categories?: Category[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  openOnly: boolean;
  onToggleOpenOnly: () => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  hasLocation: boolean;
  maxDistanceKm: string;
  onMaxDistanceChange: (km: string) => void;
  onResetFilters?: () => void;
  align?: 'start' | 'end';
}

export const UnifiedCategoryMenu: React.FC<UnifiedCategoryMenuProps> = ({
  lang,
  selectedCategory,
  selectedSubPart,
  onSelectSubPart,
  onSelectCategory,
  categories = CANONICAL_CATEGORIES,
  sortBy,
  onSortChange,
  openOnly,
  onToggleOpenOnly,
  inStockOnly,
  onToggleInStock,
  hasLocation,
  maxDistanceKm,
  onMaxDistanceChange,
  onResetFilters,
  align = 'end',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const isAr = lang === 'ar';
  const dict = t(lang);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const sortOptions = [
    { value: 'relevance', label: dict.sortRelevance },
    { value: 'lowest_price', label: dict.sortLowestPrice },
    { value: 'closest', label: dict.sortClosest },
    { value: 'highest_price', label: dict.sortHighestPrice },
    { value: 'rating', label: dict.sortRating },
    { value: 'popular', label: dict.sortPopular },
  ];

  const distanceOptions = [
    { value: '', label: isAr ? 'أي مسافة' : 'Any distance' },
    { value: '1', label: isAr ? 'ضمن 1 كم' : 'Within 1 km' },
    { value: '5', label: isAr ? 'ضمن 5 كم' : 'Within 5 km' },
    { value: '10', label: isAr ? 'ضمن 10 كم' : 'Within 10 km' },
    { value: '20', label: isAr ? 'ضمن 20 كم' : 'Within 20 km' },
  ];

  const canonicalCategory =
    selectedCategory !== 'all' ? normalizeCategoryId(selectedCategory) : null;
  const quickParts = canonicalCategory ? CATEGORY_SUBPARTS[canonicalCategory] || [] : [];

  const activeCount =
    (sortBy !== 'relevance' ? 1 : 0) +
    (openOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (maxDistanceKm ? 1 : 0) +
    (selectedSubPart !== 'all' ? 1 : 0);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={isAr ? 'الفلاتر والأقسام' : 'Filters & Quick Parts'}
        title={isAr ? 'الفلاتر والأقسام' : 'Filters & Quick Parts'}
        onClick={() => setOpen((prev) => !prev)}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition cursor-pointer select-none ${
          open || activeCount > 0
            ? 'border-[#4A3894] bg-[#4A3894] text-white shadow-sm dark:border-[#9678CE] dark:bg-[#9678CE] dark:text-[#0E0E13]'
            : 'border-[#E5DDF5] bg-white text-[#1E1438] hover:border-[#4A3894] dark:border-[#22222C] dark:bg-[#0E0E13] dark:text-white dark:hover:border-[#9678CE]'
        }`}
      >
        <Menu className="h-5 w-5 shrink-0" />
        {activeCount > 0 && (
          <span
            className="absolute -end-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#E794C9] px-1 text-[10px] font-extrabold text-[#1E1438] ring-2 ring-white tabular-nums dark:ring-[#050507]"
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={`marketly-dropdown-enter absolute top-full z-50 mt-2 w-[320px] sm:w-[360px] max-w-[calc(100vw-1.5rem)] max-h-[75vh] overflow-y-auto rounded-2xl border border-[#E5DDF5] bg-white p-4 text-[#1E1438] shadow-[0_24px_60px_-12px_rgba(29,21,56,0.28)] dark:border-[#22222C] dark:bg-[#0E0E13] dark:text-white dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.88)] space-y-4 ${
            align === 'end' ? 'end-0' : 'start-0'
          }`}
        >
          {/* Section 1: Filters (Sort + Open Now / In Stock toggles) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E5C70] dark:text-[#B9B0D8]">
                {isAr ? 'الفلاتر والترتيب' : 'Filters & Sort'}
              </span>
              {activeCount > 0 && onResetFilters && (
                <button
                  type="button"
                  onClick={() => {
                    onResetFilters();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4A3894] hover:underline dark:text-[#9678CE] cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              {sortOptions.map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => onSortChange(opt.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#F5F0FC] text-[#4A3894] dark:bg-[#1E1A2E] dark:text-[#E794C9]'
                        : 'text-[#1E1438] hover:bg-[#F9F5FD] dark:text-[#E5DDF5] dark:hover:bg-[#15151C]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-[#4A3894] dark:text-[#E794C9]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Togglable Options down the Filters list: Open Now & In Stock */}
            <div className="mt-2 space-y-1.5 border-t border-[#E5DDF5] pt-2.5 dark:border-[#22222C]">
              <button
                type="button"
                role="switch"
                aria-checked={openOnly}
                onClick={onToggleOpenOnly}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-semibold text-[#1E1438] transition hover:bg-[#F9F5FD] dark:text-white dark:hover:bg-[#15151C] cursor-pointer"
              >
                <span>{dict.openNow}</span>
                <span
                  aria-hidden="true"
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    openOnly ? 'bg-[#4A3894] dark:bg-[#9678CE]' : 'bg-[#DDD6EE] dark:bg-[#2A2938]'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      openOnly
                        ? 'ltr:translate-x-[18px] rtl:-translate-x-[18px]'
                        : 'ltr:translate-x-[3px] rtl:-translate-x-[3px]'
                    }`}
                  />
                </span>
              </button>

              <button
                type="button"
                role="switch"
                aria-checked={inStockOnly}
                onClick={onToggleInStock}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-semibold text-[#1E1438] transition hover:bg-[#F9F5FD] dark:text-white dark:hover:bg-[#15151C] cursor-pointer"
              >
                <span>{dict.inStockOnly}</span>
                <span
                  aria-hidden="true"
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    inStockOnly ? 'bg-[#4A3894] dark:bg-[#9678CE]' : 'bg-[#DDD6EE] dark:bg-[#2A2938]'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      inStockOnly
                        ? 'ltr:translate-x-[18px] rtl:-translate-x-[18px]'
                        : 'ltr:translate-x-[3px] rtl:-translate-x-[3px]'
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: Distance */}
          {hasLocation && (
            <div className="space-y-2 border-t border-[#E5DDF5] pt-3 dark:border-[#22222C]">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E5C70] dark:text-[#B9B0D8]">
                {isAr ? 'نطاق المسافة' : 'Distance'}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {distanceOptions.map((opt) => {
                  const isSelected = maxDistanceKm === opt.value;
                  return (
                    <button
                      key={opt.value || 'any'}
                      type="button"
                      onClick={() => onMaxDistanceChange(opt.value)}
                      className={`rounded-xl px-3 py-2 text-start text-xs font-semibold transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#4A3894] text-white dark:bg-[#9678CE] dark:text-[#0E0E13]'
                          : 'border border-[#E5DDF5] bg-white text-[#5E5C70] hover:border-[#4A3894] dark:border-[#22222C] dark:bg-[#15151C] dark:text-[#B9B0D8]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Category-Specific Quick Parts (strictly scoped to current category) */}
          {canonicalCategory && quickParts.length > 0 ? (
            <div className="space-y-2 border-t border-[#E5DDF5] pt-3 dark:border-[#22222C]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E5C70] dark:text-[#B9B0D8]">
                  {isAr ? 'أجزاء سريعة' : 'Quick Parts'}
                </span>
                {selectedSubPart !== 'all' && (
                  <button
                    type="button"
                    onClick={() => onSelectSubPart('all')}
                    className="text-[11px] font-bold text-[#4A3894] hover:underline dark:text-[#9678CE] cursor-pointer"
                  >
                    {isAr ? 'عرض كل القطع' : 'Clear part'}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickParts.map((sp) => {
                  const isActive = selectedSubPart === sp.id;
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => onSelectSubPart(isActive ? 'all' : sp.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#4A3894] text-white dark:bg-[#9678CE] dark:text-[#0E0E13]'
                          : 'border border-[#E5DDF5] bg-[#F9F5FD] text-[#1E1438] hover:border-[#4A3894] dark:border-[#22222C] dark:bg-[#15151C] dark:text-[#E5DDF5]'
                      }`}
                    >
                      {isAr ? sp.labelAr : sp.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            onSelectCategory && (
              <div className="space-y-2 border-t border-[#E5DDF5] pt-3 dark:border-[#22222C]">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E5C70] dark:text-[#B9B0D8]">
                  {isAr ? 'اختر الفئة' : 'Categories'}
                </div>
                <div className="space-y-1">
                  {(categories.length > 0 ? categories : CANONICAL_CATEGORIES).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-semibold text-[#1E1438] transition hover:bg-[#F9F5FD] dark:text-white dark:hover:bg-[#15151C] cursor-pointer"
                    >
                      <span>{isAr ? cat.nameAr : cat.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#9678CE] rtl:rotate-180" />
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
