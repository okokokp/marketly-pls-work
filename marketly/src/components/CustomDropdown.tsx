import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  ariaLabel?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  variant?: 'auto' | 'dark';
  shape?: 'rounded' | 'pill';
  size?: 'sm' | 'md';
  align?: 'start' | 'end';
  fullWidth?: boolean;
  className?: string;
  menuClassName?: string;
  id?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  ariaLabel,
  placeholder = 'Select...',
  icon,
  variant = 'auto',
  shape = 'rounded',
  size = 'md',
  align = 'start',
  fullWidth = false,
  className = '',
  menuClassName = '',
  id,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoId = useId();
  const menuId = id ? `${id}-menu` : `${autoId}-menu`;

  const selected = options.find((opt) => opt.value === value);

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
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (options.length === 0) return;
        const idx = options.findIndex((o) => o.value === value);
        const nextIdx =
          e.key === 'ArrowDown'
            ? (idx + 1) % options.length
            : (idx - 1 + options.length) % options.length;
        onChange(options[nextIdx].value);
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
  }, [open, options, value, onChange]);

  const radiusClass = shape === 'pill' ? 'rounded-full' : 'rounded-xl';
  const paddingClass =
    size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-xs';

  const triggerThemeClass =
    variant === 'dark'
      ? 'border-[#2A283A] bg-[#15141E] text-white hover:border-[#9678CE]'
      : open
        ? 'border-[#4A3894] bg-white text-[#1E1438] dark:border-[#9678CE] dark:bg-[#0E0E13] dark:text-white'
        : 'border-[#E5DDF5] bg-white text-[#1E1438] hover:border-[#4A3894]/70 dark:border-[#22222C] dark:bg-[#0E0E13] dark:text-white dark:hover:border-[#9678CE]/70';

  const panelThemeClass =
    variant === 'dark'
      ? 'border-[#2A283A] bg-[#15141E] text-white shadow-[0_18px_40px_-10px_rgba(0,0,0,0.85)]'
      : 'border-[#E5DDF5] bg-white text-[#1E1438] shadow-[0_18px_40px_-12px_rgba(29,21,56,0.22)] dark:border-[#22222C] dark:bg-[#0E0E13] dark:text-white dark:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.85)]';

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`}
    >
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2 font-semibold border transition cursor-pointer select-none ${radiusClass} ${paddingClass} ${
          fullWidth ? 'w-full' : 'min-w-[128px]'
        } ${triggerThemeClass}`}
      >
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          {icon && <span className="shrink-0 opacity-85">{icon}</span>}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#4A3894] dark:text-[#9678CE]' : 'opacity-65'
          }`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="listbox"
          aria-label={ariaLabel}
          className={`marketly-dropdown-enter absolute top-full z-50 mt-1.5 min-w-full w-max max-w-[min(90vw,300px)] max-h-64 overflow-y-auto rounded-2xl border p-1.5 ${
            align === 'end' ? 'end-0' : 'start-0'
          } ${panelThemeClass} ${menuClassName}`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-start text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? variant === 'dark'
                      ? 'bg-[#4A3894] text-white font-semibold'
                      : 'bg-[#F5F0FC] text-[#4A3894] font-semibold dark:bg-[#1E1A2E] dark:text-[#E794C9]'
                    : variant === 'dark'
                      ? 'text-[#D6D3E6] hover:bg-[#1F1D2C] hover:text-white'
                      : 'text-[#1E1438] hover:bg-[#F9F5FD] dark:text-[#E5DDF5] dark:hover:bg-[#15151C]'
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                {isSelected && (
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 ${
                      variant === 'dark'
                        ? 'text-white'
                        : 'text-[#4A3894] dark:text-[#E794C9]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
