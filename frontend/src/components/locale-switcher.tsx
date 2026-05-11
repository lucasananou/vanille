'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from '@/lib/locale-context';
import { getLocaleLabel, type Locale, withLocale } from '@/lib/i18n';

const localeOptions: Array<{ value: Locale; flag: string; code: string }> = [
  { value: 'fr', flag: '🇫🇷', code: 'FR' },
  { value: 'en', flag: '🇬🇧', code: 'EN' },
];

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const active = localeOptions.find((option) => option.value === locale)!;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-vanilla-100/12 bg-vanilla-50/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-vanilla-50"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span aria-hidden="true">{active.flag}</span>
        <span>{active.code}</span>
        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m5 7 5 5 5-5" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 min-w-[11rem] overflow-hidden rounded-2xl border border-vanilla-100/12 bg-jungle-900 shadow-2xl" role="menu">
          {localeOptions.map((option) => {
            const target = withLocale(pathname || '/', option.value);
            const isActive = option.value === locale;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setLocale(option.value);
                  setOpen(false);
                  router.push(target);
                  router.refresh();
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-sm transition-colors ${
                  isActive ? 'bg-vanilla-50/10 text-gold-500' : 'text-vanilla-50 hover:bg-vanilla-50/5'
                }`}
                role="menuitem"
              >
                <span className="flex items-center gap-2 font-bold uppercase tracking-[0.18em]">
                  <span aria-hidden="true">{option.flag}</span>
                  <span>{option.code}</span>
                </span>
                <span className="text-xs opacity-80">{getLocaleLabel(option.value)}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
