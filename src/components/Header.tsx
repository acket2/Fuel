import React, { useState, useRef, useEffect } from 'react';
import { 
  Fuel, 
  PhoneCall, 
  ShieldCheck, 
  ExternalLink, 
  MapPin, 
  Calculator, 
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Lock,
  Flame,
  Truck
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
  onOpenAdminModal?: () => void;
  newOrdersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRegion,
  onSelectRegion,
  onOpenOrderModal,
  onScrollToCalculator,
  onOpenVerificationModal,
  onOpenAdminModal,
  newOrdersCount = 0
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
      
      {/* 1. TOP UTILITY BAR (Requisites, INN Verification & Dispatch Phones) */}
      <div className="w-full bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Official INN Verification */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenVerificationModal?.('company')}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all font-mono font-bold text-[10px] sm:text-[11px] shrink-0 cursor-pointer whitespace-nowrap"
              title="Проверить реквизиты ООО «СНК» в реестре ФНС России"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>ИНН: {inn}</span>
              <span className="text-[10px] text-emerald-200/90 font-sans font-medium hidden sm:inline">
                • ФНС
              </span>
              <ExternalLink className="w-2.5 h-2.5 text-emerald-400/80 shrink-0 ml-0.5" />
            </button>

            <span className="text-[11px] text-slate-400 font-medium hidden lg:inline whitespace-nowrap">
              Прямые наливы с НПЗ • Иркутская, Амурская обл., Бурятия, Забайкалье
            </span>
          </div>

          {/* Right: Dual Direct Dispatch Contacts & Admin Quick Link */}
          <div className="flex items-center gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={`tel:${phone1}`}
                className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap"
                title="Позвонить дежурному логисту"
              >
                <PhoneCall className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{phone1Display}</span>
              </a>

              <span className="text-slate-700 hidden md:inline">•</span>

              <a
                href={`tel:${phone2}`}
                className="items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition-colors hidden md:flex whitespace-nowrap"
                title="Отдел договоров и сбыта"
              >
                <PhoneCall className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{phone2Display}</span>
              </a>
            </div>

            {onOpenAdminModal && (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition-colors cursor-pointer border-l border-slate-800 pl-3"
                title="Вход в диспетчерскую панель"
              >
                <Lock className="w-3 h-3 text-amber-500" />
                <span>Диспетчер</span>
                {newOrdersCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
                )}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Corporate Title */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-300/40 shrink-0">
              <Fuel className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-[2.5]" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-mono whitespace-nowrap">
                  ООО «СНК»
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1 sm:px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-900 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap">
                  ЕВРО-5
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 tracking-wide font-medium whitespace-nowrap hidden sm:block">
                Сибирская Нефтяная Компания
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            <a 
              href="#calculator" 
              onClick={(e) => {
                e.preventDefault();
                onScrollToCalculator();
              }}
              className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold px-3 py-2 rounded-xl hover:bg-amber-500/10 transition-colors whitespace-nowrap"
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>Калькулятор</span>
            </a>

            <a 
              href="#catalog" 
              className="px-3 py-2 rounded-xl hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              Сорта ДТ
            </a>

            <a 
              href="#regions" 
              className="px-3 py-2 rounded-xl hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              География
            </a>

            <a 
              href="#payment" 
              className="px-3 py-2 rounded-xl hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              Оплата
            </a>

            <a 
              href="#about" 
              className="px-3 py-2 rounded-xl hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              О компании
            </a>

            <a 
              href="#faq" 
              className="px-3 py-2 rounded-xl hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              Вопросы
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Region Selector Dropdown (Desktop & Tablet) */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-amber-500/50 transition-colors cursor-pointer whitespace-nowrap"
                title="Выбрать регион доставки"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="max-w-[130px] truncate">{selectedRegion.shortName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {regionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-2 py-1">
                    Регион поставки топлива:
                  </div>
                  {REGIONS_LIST.map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => {
                        onSelectRegion(reg);
                        setRegionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        selectedRegion.id === reg.id
                          ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-semibold">{reg.name}</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold">СНК</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle (Dark / Light) - Visible on tablet/desktop */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Admin Panel Access Button - Visible on tablet/desktop */}
            {onOpenAdminModal && (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="hidden sm:flex relative items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer shrink-0"
                title="Панель администратора / диспетчера"
                aria-label="Admin panel"
              >
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                {newOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 animate-pulse"></span>
                )}
              </button>
            )}

            {/* Direct Quick Call Button on Mobile */}
            <a
              href={`tel:${phone1}`}
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-400 active:scale-95 transition-transform"
              title="Позвонить диспетчеру"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </a>

            {/* Primary CTA Button: Заказать топливо */}
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold sm:font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden sm:inline" />
              <span>Заказать</span>
              <span className="hidden sm:inline">топливо</span>
            </button>

            {/* Mobile / Tablet Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer xl:hidden shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. MOBILE & TABLET DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          
          {/* Quick Settings Bar in Mobile Menu (Theme + Admin) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Светлая тема</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span>Тёмная тема</span>
                </>
              )}
            </button>

            {onOpenAdminModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminModal();
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-amber-500/40 text-xs font-bold text-amber-600 dark:text-amber-400"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Панель админа</span>
                {newOrdersCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>
            )}
          </div>

          {/* Verification & INN in Mobile */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenVerificationModal?.('company');
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 font-mono font-bold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>ИНН: {inn} (ООО «СНК»)</span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-sans underline flex items-center gap-1">
              Проверить реквизиты <ExternalLink className="w-3 h-3" />
            </span>
          </button>

          {/* Mobile Region Selector */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Выберите ваш регион поставки:</span>
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
                  className={`p-3 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                    selectedRegion.id === reg.id
                      ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="font-bold truncate">{reg.shortName}</div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono mt-0.5">Спецпарк СНК</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Direct Phone Calls */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              Прямая связь с дежурным диспетчером:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={`tel:${phone1}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-amber-400 font-mono font-bold text-xs border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <span>{phone1Display}</span>
                <PhoneCall className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              </a>
              <a
                href={`tel:${phone2}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-amber-400 font-mono font-bold text-xs border border-slate-200 dark:border-slate-800 shadow-sm"
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
              className="p-3 rounded-xl bg-amber-500/15 text-amber-900 dark:text-amber-300 flex items-center gap-2 font-bold"
            >
              <Calculator className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Калькулятор объёма топлива</span>
            </a>
            <a
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              Сорта дизельного топлива
            </a>
            <a
              href="#regions"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              География поставок
            </a>
            <a
              href="#payment"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              Оплата (Безналичный расчёт с НДС)
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              О компании
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Оформить заявку на бензовоз</span>
          </button>
        </div>
      )}
    </header>
  );
};


