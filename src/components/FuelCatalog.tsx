import React from 'react';
import { 
  Fuel, 
  ShieldCheck, 
  Snowflake, 
  Flame, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck2, 
  Award,
  Sparkles
} from 'lucide-react';
import { FuelProduct } from '../types';
import { DIESEL_FUEL_PRODUCTS } from '../data/fuelData';

interface FuelCatalogProps {
  selectedFuel: FuelProduct;
  onSelectFuel: (fuel: FuelProduct) => void;
  onScrollToCalculator: () => void;
  onOpenOrderModalWithFuel: (fuel: FuelProduct) => void;
  onOpenVerificationModal?: (tab?: 'company' | 'passport' | 'arbitrage') => void;
}

export const FuelCatalog: React.FC<FuelCatalogProps> = ({
  selectedFuel,
  onSelectFuel,
  onScrollToCalculator,
  onOpenOrderModalWithFuel,
  onOpenVerificationModal
}) => {
  return (
    <section id="catalog" className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Fuel className="w-3.5 h-3.5" />
            Каталог дизельного топлива Евро-5
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Сорта дизельного топлива высшего качества
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Прямой налив с нефтеперерабатывающих заводов Сибири (АО «АНХК» и партнёрские НПЗ). 
            Каждая партия сопровождается официальным паспортом качества и арбитражной пробой.
          </p>
        </div>

        {/* Diesel Fuel Cards Grid - STRICTLY WITHOUT STATIC PRICE TAGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DIESEL_FUEL_PRODUCTS.map((fuel) => {
            const isSelected = selectedFuel.id === fuel.id;
            return (
              <div
                key={fuel.id}
                className={`rounded-3xl bg-white dark:bg-slate-900/90 border p-6 sm:p-7 transition-all flex flex-col justify-between relative overflow-hidden group shadow-sm dark:shadow-lg ${
                  isSelected
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Top Badge & ГОСТ */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30 text-xs font-bold">
                      <Sparkles className="w-3 h-3" />
                      {fuel.badge}
                    </span>

                    {fuel.minTemp && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 text-xs font-mono font-bold">
                        <Snowflake className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        {fuel.minTemp}
                      </span>
                    )}
                  </div>

                  {/* Title & ГОСТ */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {fuel.name}
                    </h3>
                    <p className="text-xs text-amber-700 dark:text-amber-400/90 font-mono mt-1 font-semibold">
                      {fuel.gost}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {fuel.description}
                  </p>

                  {/* Technical Specifications Grid (NO PRICES) */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Класс топлива:</span>
                      <span className="text-slate-950 dark:text-white font-semibold">Евро-5 (К5)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Плотность при +15°C:</span>
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">{fuel.density} кг/л</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Цетановое число:</span>
                      <span className="text-slate-950 dark:text-white font-semibold">≥ {fuel.cetaneNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Содержание серы:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{fuel.sulfurContent}</span>
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Рекомендуемые сферы применения:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fuel.applications.map((app, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 text-[11px]"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Factory / Origin & Quality Passport */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Производитель: <strong className="text-slate-900 dark:text-slate-200">{fuel.producer}</strong></span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenVerificationModal?.('passport')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Паспорт качества ГОСТ</span>
                    </button>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectFuel(fuel);
                      onScrollToCalculator();
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span>Рассчитать объём в калькуляторе</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenOrderModalWithFuel(fuel)}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  >
                    Запросить расчёт
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
