import React, { useState, useRef, useEffect } from 'react';
import { 
  Fuel, 
  PhoneCall, 
  ShieldCheck, 
  ExternalLink, 
  MapPin, 
  Calculator, 
  FileText,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { RegionInfo } from '../types';
import { REGIONS_LIST } from '../data/regionsData';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  selectedRegion: RegionInfo;
  onSelectRegion: (region: RegionInfo) => void;
  onOpenOrderModal: () => void;
  onScrollToCalculator: () => void;
  onOpenTelegramSettings?: () => void;
  onOpenVerificationModal?: (tab?: 'company' | 'passport' | 'arbitrage') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRegion,
  onSelectRegion,
  onOpenOrderModal,
  onScrollToCalculator,
  onOpenTelegramSettings,
  onOpenVerificationModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const phone1 = '89041480038';
  const phone1Display = '8 (904) 148-00-38';
  const phone2 = '89834149769';
  const phone2Display = '8 (983) 414-97-69';
  const inn = '3801146254';

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRegionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      
      {/* Top Utility Verification & Contact Bar */}
      <div className="w-full bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs py-1 px-3 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Company Verification & Operating Regions */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onOpenVerificationModal?.('company')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-all font-mono font-bold text-[11px] shrink-0 cursor-pointer whitespace-nowrap"
              title="Проверить ООО «СНК» в официальном реестре ФНС и паспорта качества ГОСТ"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>ИНН: {inn}</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-sans font-medium hidden sm:inline">
                • Проверено ФНС / ГОСТ
              </span>
              <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
            </button>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate hidden lg:inline whitespace-nowrap">
              Поставки: Иркутская, Амурская обл., Бурятия, Забайкалье
            </span>
          </div>

          {/* Right: Direct Dispatch Phones */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] sm:text-xs shrink-0">
            <span className="text-slate-500 dark:text-slate-400 hidden xl:inline font-sans text-xs">
              Диспетчерская служба:
            </span>
            
            <a
              href={`tel:${phone1}`}
              className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors whitespace-nowrap"
              title="Позвонить дежурному логисту"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 shrink-0" />
              <span>{phone1Display}</span>
            </a>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

            <a
              href={`tel:${phone2}`}
              className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors hidden sm:flex whitespace-nowrap"
              title="Позвонить в отдел договоров и сбыта"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 shrink-0" />
              <span>{phone2Display}</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 lg:gap-4">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-300/40 shrink-0">
              <Fuel className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-mono whitespace-nowrap">
                  ООО «СНК»
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-900 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap">
                  ЕВРО-5
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 tracking-wide font-medium whitespace-nowrap hidden min-[360px]:block">
                Сибирская Нефтяная Компания
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links — Strictly One-Line with whitespace-nowrap */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            <a 
              href="#calculator" 
              onClick={(e) => {
                e.preventDefault();
                onScrollToCalculator();
              }}
              className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 transition-colors whitespace-nowrap"
            >
              <Calculator className="w-3.5 h-3.5 shrink-0" />
              <span>Калькулятор</span>
            </a>

            <a 
              href="#catalog" 
              className="px-2.5 py-1.5 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              Сорта ДТ
            </a>

            <a 
              href="#regions" 
              className="px-2.5 py-1.5 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              География
            </a>

            <a 
              href="#order" 
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Заявка</span>
            </a>

            <a 
              href="#payment" 
              className="px-2.5 py-1.5 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              Оплата
            </a>

            <a 
              href="#about" 
              className="px-2.5 py-1.5 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              О компании
            </a>

            <a 
              href="#faq" 
              className="px-2.5 py-1.5 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              Вопросы
            </a>
          </nav>

          {/* Right Action Cluster: Theme Toggle + Region Selector + CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Theme Toggle Button (Light/Dark switch) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              aria-label="Toggle light/dark theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0" />
              )}
            </button>

            {/* Region Selector Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-amber-500/50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="max-w-[120px] truncate">{selectedRegion.shortName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {regionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-2 py-1">
                    Выберите регион доставки:
                  </div>
                  {REGIONS_LIST.map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => {
                        onSelectRegion(reg);
                        setRegionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        selectedRegion.id === reg.id
                          ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-semibold">{reg.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{reg.deliveryTimeRange}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Order CTA Button */}
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Заказать топливо
            </button>

            {/* Mobile / Tablet Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer lg:hidden shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          
          {/* Verification Link in Mobile */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenVerificationModal?.('company');
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-400 font-mono font-bold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>ИНН: {inn} (ООО «СНК»)</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans underline flex items-center gap-1">
              Проверить <ExternalLink className="w-3 h-3" />
            </span>
          </button>

          {/* Mobile Region Selector */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Регион поставки:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {REGIONS_LIST.map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => {
                    onSelectRegion(reg);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                    selectedRegion.id === reg.id
                      ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>{reg.shortName}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{reg.deliveryTimeRange}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Direct Phone Calls */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              Прямая связь с отделом снабжения:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={`tel:${phone1}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-amber-400 font-mono font-bold text-xs border border-slate-200 dark:border-slate-800"
              >
                <span>{phone1Display}</span>
                <PhoneCall className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              </a>
              <a
                href={`tel:${phone2}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-amber-400 font-mono font-bold text-xs border border-slate-200 dark:border-slate-800"
              >
                <span>{phone2Display}</span>
                <PhoneCall className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              </a>
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1 pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-semibold">
            <a
              href="#calculator"
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToCalculator();
              }}
              className="p-2.5 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-400 flex items-center gap-2 font-bold"
            >
              <Calculator className="w-4 h-4" />
              <span>Калькулятор объёма топлива</span>
            </a>
            <a
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              Сорта дизельного топлива
            </a>
            <a
              href="#regions"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              География поставок
            </a>
            <a
              href="#order"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              Оформить заявку
            </a>
            <a
              href="#payment"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              Оплата — безнал
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              О компании
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              Вопросы и ответы
            </a>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderModal();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-md cursor-pointer"
          >
            Оформить заявку на бензовоз
          </button>
        </div>
      )}
    </header>
  );
};

