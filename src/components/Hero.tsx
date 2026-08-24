import React from 'react';
import { 
  Fuel, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  Calculator, 
  ExternalLink, 
  Award, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  Flame,
  Building2,
  Layers,
  Sparkles
} from 'lucide-react';
import { RegionInfo } from '../types';
import { REGIONS_LIST } from '../data/regionsData';

interface HeroProps {
  selectedRegion: RegionInfo;
  onSelectRegion: (region: RegionInfo) => void;
  onOpenOrderModal: () => void;
  onScrollToCalculator: () => void;
  onOpenVerificationModal?: (tab?: 'company' | 'passport' | 'arbitrage') => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedRegion,
  onSelectRegion,
  onOpenOrderModal,
  onScrollToCalculator,
  onOpenVerificationModal
}) => {
  const phone1 = '89041480038';
  const phone1Display = '8 (904) 148-00-38';
  const phone2 = '89834149769';
  const phone2Display = '8 (983) 414-97-69';
  const inn = '3801146254';

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Visual Ambient Petroleum Lighting Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-slate-200/50 dark:bg-slate-900/60 rounded-full blur-2xl"></div>
        {/* Subtle geometric grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b0a_1px,transparent_1px),linear-gradient(to_bottom,#64748b0a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition & Headings (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* Top Verified Identity Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenVerificationModal?.('company')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all shadow-sm group cursor-pointer"
                title="Официальная верификация ООО «СНК» в ФНС и паспорта качества ГОСТ"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-mono font-bold text-slate-900 dark:text-white">ИНН: {inn}</span>
                <span className="text-emerald-700 dark:text-emerald-400/90 text-[11px] font-sans">• Проверено в ФНС / Паспорта ГОСТ</span>
                <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400 opacity-80" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-semibold">
                <Fuel className="w-3.5 h-3.5" />
                <span>Прямой налив с НПЗ</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <div className="text-amber-600 dark:text-amber-500 font-mono font-extrabold text-sm sm:text-base uppercase tracking-widest flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-500 inline animate-bounce" />
                <span>ООО «СНК» • Сибирская Нефтяная Компания</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.1]">
                Поставки дизельного топлива <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
                  Евро-5 по Сибири и ДВ
                </span>
              </h1>
            </div>

            {/* Regional Delivery Subtitle */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md dark:shadow-xl transition-colors">
              <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Осуществляем доставку дизельного топлива в 4 ключевых регионах:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {REGIONS_LIST.map((reg) => {
                  const isSelected = selectedRegion.id === reg.id;
                  return (
                    <button
                      key={reg.id}
                      onClick={() => onSelectRegion(reg)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-slate-950 dark:text-white font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-[11px] sm:text-xs leading-snug">{reg.name}</div>
                      <div className="text-[10px] text-amber-700 dark:text-amber-400/90 font-mono mt-1">{reg.deliveryTimeRange}</div>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                Собственный автопарк калиброванных автоцистерн и бензовозов с насосами и рукавами до 40 м. Прямые железнодорожные поставки цистернами 60–66 т.
              </p>
            </div>

            {/* Dual Contact Phone Numbers Banner */}
            <div className="p-4 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-amber-500/30 space-y-2.5 shadow-md dark:shadow-xl transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Прямые телефоны отдела поставок и снабжения:
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  На связи
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`tel:${phone1}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-900 dark:text-white group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Линия 1 (Основная):</div>
                      <div className="font-mono font-bold text-sm text-slate-900 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                        {phone1Display}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href={`tel:${phone2}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-900 dark:text-white group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Линия 2 (Диспетчер):</div>
                      <div className="font-mono font-bold text-sm text-slate-900 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                        {phone2Display}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                onClick={onScrollToCalculator}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-5 h-5 stroke-[2.5]" />
                <span>Рассчитать объём топлива (л / т)</span>
              </button>

              <button
                onClick={onOpenOrderModal}
                className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Заказать доставку бензовоза</span>
              </button>
            </div>

          </div>

          {/* Right Column: High-Trust Verified Company Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xl dark:shadow-2xl space-y-6 relative overflow-hidden transition-colors">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-950 dark:text-white leading-tight">
                      ООО «СНК»
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Сибирская Нефтяная Компания
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Действующая
                  </span>
                </div>
              </div>

              {/* Corporate Legal Requisites */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">ИНН организации:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm tracking-wider">{inn}</span>
                </div>
                
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Специализация:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Оптовые поставки ДТ Евро-5</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">География отгрузок:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">4 региона Сибири и ДВ</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Форма расчетов:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Безнал (с НДС 20% / без НДС)</span>
                </div>
              </div>

              {/* Official Registry Check Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenVerificationModal?.('company')}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all group shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Проверить ООО «СНК» (ИНН 3801146254) и ГОСТ</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                  Полная карточка предприятия: выписка ЕГРЮЛ, проверка ФНС «Прозрачный бизнес», паспорта качества ГОСТ и арбитражные пробы.
                </p>
              </div>

              {/* Quick Guarantees Footer */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Паспорт качества ГОСТ</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Подача от 1 часа</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
