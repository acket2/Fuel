import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Compass,
  Train,
  Building
} from 'lucide-react';
import { RegionInfo, DeliveryLocation } from '../types';
import { REGIONS_LIST, DELIVERY_LOCATIONS, TANK_TRUCK_FLEET } from '../data/regionsData';

interface RegionsCoverageProps {
  selectedRegion: RegionInfo;
  onSelectRegion: (region: RegionInfo) => void;
  onSelectLocation: (location: DeliveryLocation) => void;
  onScrollToCalculator: () => void;
}

export const RegionsCoverageSection: React.FC<RegionsCoverageProps> = ({
  selectedRegion,
  onSelectRegion,
  onSelectLocation,
  onScrollToCalculator
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedRegion.id);

  const currentRegion = REGIONS_LIST.find(r => r.id === activeTab) || REGIONS_LIST[0];
  const regionCities = DELIVERY_LOCATIONS.filter(l => l.regionId === activeTab);

  return (
    <section id="regions" className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            География логистики и поставок
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Доставка дизельного топлива в 4 регионах Сибири и Дальнего Востока
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Компания ООО «СНК» осуществляет бесперебойное снабжение объектов в Иркутской и Амурской областях, Забайкальском крае и Республике Бурятия.
          </p>
        </div>

        {/* 4 Regions Tab Switcher */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {REGIONS_LIST.map((reg) => {
            const isTab = activeTab === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => {
                  setActiveTab(reg.id);
                  onSelectRegion(reg);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                  isTab
                    ? 'bg-amber-500/15 border-amber-500 text-slate-950 dark:text-white shadow-md dark:shadow-xl dark:shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-950 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <MapPin className={`w-4 h-4 ${isTab ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-950 text-amber-800 dark:text-amber-400 border border-slate-200 dark:border-slate-800">
                    Спецпарк СНК
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base text-slate-950 dark:text-white">{reg.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{reg.description}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Region Detailed Panel */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md dark:shadow-2xl space-y-8 transition-colors">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Region Info Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                  Региональный логистический хаб:
                </span>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white mt-1">
                  {currentRegion.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {currentRegion.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Опорные нефтебазы и терминалы отгрузки:
                </span>
                <div className="space-y-1.5">
                  {currentRegion.depotHubs.map((hub, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-900 dark:text-white">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{hub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Автоналив 5–42 м³</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Ж/Д цистерны 60 т</span>
                </div>
              </div>
            </div>

            {/* Cities in Region Grid (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Ключевые пункты доставки и логистические хабы:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {regionCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onSelectLocation(city);
                      onScrollToCalculator();
                    }}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left transition-all group flex flex-col justify-between shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {city.name}
                      </span>
                      <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1 font-semibold">
                        ~{city.distanceKm} км
                      </span>
                    </div>
                    
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Партии: {city.popularVolume}
                    </div>

                    <div className="text-[10px] text-amber-700 dark:text-amber-400/90 font-mono mt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60 pt-1.5 font-semibold">
                      <span>Хаб: {city.depotHub}</span>
                      <span className="group-hover:translate-x-1 transition-transform">Выбрать →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Tank Truck Fleet Showcase */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Парк спецтехники ООО «СНК» для бесперебойной доставки:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TANK_TRUCK_FLEET.map((fleet, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                  <div className="font-bold text-xs text-amber-800 dark:text-amber-300">
                    {fleet.type}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {fleet.description}
                  </p>
                  <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400/90 pt-1 border-t border-slate-100 dark:border-slate-900 font-semibold">
                    {fleet.meterType}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
