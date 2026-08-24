import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Fuel, 
  Truck, 
  MapPin, 
  ArrowRightLeft, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight,
  BadgePercent,
  Coins
} from 'lucide-react';
import { 
  FuelProduct, 
  DeliveryLocation, 
  CalculationResult, 
  CurrencyCode,
  RegionId,
  VolumeUnit
} from '../types';
import { 
  DIESEL_FUEL_PRODUCTS, 
  CURRENCY_RATES, 
  VOLUME_PRESETS_LITERS, 
  VOLUME_PRESETS_TONS,
  VOLUME_PRESETS_M3
} from '../data/fuelData';
import { DELIVERY_LOCATIONS, REGIONS_LIST } from '../data/regionsData';

interface FuelCalculatorProps {
  selectedFuel: FuelProduct;
  onSelectFuel: (fuel: FuelProduct) => void;
  selectedLocation: DeliveryLocation;
  onSelectLocation: (loc: DeliveryLocation) => void;
  onOpenOrderModalWithCalc: (calc: CalculationResult) => void;
}

export const FuelCalculator: React.FC<FuelCalculatorProps> = ({
  selectedFuel,
  onSelectFuel,
  selectedLocation,
  onSelectLocation,
  onOpenOrderModalWithCalc
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<VolumeUnit>('m3');
  const [currency, setCurrency] = useState<CurrencyCode>('RUB');
  const [activeRegionFilter, setActiveRegionFilter] = useState<RegionId>(selectedLocation.regionId);

  const phone1 = '89041480038';
  const phone1Display = '8 (904) 148-00-38';
  const phone2 = '89834149769';
  const phone2Display = '8 (983) 414-97-69';

  // Density factor (e.g. 0.840 kg/liter)
  const density = selectedFuel.density;

  // Convert entered quantity to m3, liters & tons
  const volumeInLiters = useMemo(() => {
    if (unit === 'm3') {
      return Math.max(100, Math.round(quantity * 1000));
    } else if (unit === 'liters') {
      return Math.max(100, quantity);
    } else {
      // 1 ton = 1000 kg / density
      return Math.max(100, Math.round((quantity * 1000) / density));
    }
  }, [quantity, unit, density]);

  const volumeInM3 = useMemo(() => {
    return Number((volumeInLiters / 1000).toFixed(2));
  }, [volumeInLiters]);

  const volumeInTons = useMemo(() => {
    if (unit === 'tons') {
      return Math.max(0.1, quantity);
    } else {
      // volume in liters * density / 1000
      return Math.max(0.1, Number(((volumeInLiters * density) / 1000).toFixed(2)));
    }
  }, [quantity, unit, density, volumeInLiters]);

  // Determine matching truck fleet and compartment specifications
  const truckSpecs = useMemo(() => {
    if (volumeInLiters <= 8000) {
      return {
        type: 'Малый бензовоз-вездеход (5 - 8 м³)',
        sections: 2,
        hose: 'Шланг 30-40 м с насосом',
        deliveryTime: `${selectedLocation.minDeliveryHours} ч`
      };
    } else if (volumeInLiters <= 18000) {
      return {
        type: 'Среднетоннажная автоцистерна (10 - 18 м³)',
        sections: 3,
        hose: 'Высокопроизводительный насос (350 л/мин)',
        deliveryTime: `${selectedLocation.minDeliveryHours} ч`
      };
    } else if (volumeInLiters <= 42000) {
      return {
        type: 'Магистральный автопоезд (30 - 42 м³)',
        sections: 4,
        hose: 'Донные клапаны, термоизолированная цистерна',
        deliveryTime: `${Math.max(selectedLocation.minDeliveryHours, 4)} ч`
      };
    } else {
      const trainCars = Math.ceil(volumeInTons / 60);
      return {
        type: `Крупнооптовая партия (${trainCars} Ж/Д цистерн по 60 т или колонна автопоездов)`,
        sections: trainCars * 4,
        hose: 'Прямая отгрузка с завода-изготовителя',
        deliveryTime: 'По графику согласования'
      };
    }
  }, [volumeInLiters, volumeInTons, selectedLocation]);

  // Volume discount logic for interactive benchmark
  const discountPerLiter = useMemo(() => {
    if (volumeInLiters >= 30000) return 2.30;
    if (volumeInLiters >= 10000) return 1.50;
    if (volumeInLiters >= 3000) return 0.80;
    return 0;
  }, [volumeInLiters]);

  // Calculate estimated cost
  const effectivePricePerLiterRub = Math.max(20, selectedFuel.basePriceRubPerLiter - discountPerLiter);
  const fuelCostRub = volumeInLiters * effectivePricePerLiterRub;
  
  // Approximate logistics benchmark based on distance
  const deliveryCostRub = Math.round(selectedLocation.distanceKm * 95);
  const totalCostRub = fuelCostRub + deliveryCostRub;

  // Convert to selected currency
  const currencyInfo = CURRENCY_RATES[currency];
  const totalCostInSelectedCurrency = Math.round(totalCostRub * currencyInfo.rate);

  // Filter locations by active region tab
  const filteredLocations = useMemo(() => {
    return DELIVERY_LOCATIONS.filter(loc => loc.regionId === activeRegionFilter);
  }, [activeRegionFilter]);

  const handleUnitToggle = (newUnit: VolumeUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'm3') {
      setQuantity(Math.max(1, Math.round(volumeInLiters / 1000)));
    } else if (newUnit === 'tons') {
      setQuantity(Math.max(1, Math.round((volumeInLiters * density) / 1000)));
    } else {
      setQuantity(volumeInLiters);
    }
    setUnit(newUnit);
  };

  const handleOrderClick = () => {
    const calcResult: CalculationResult = {
      fuel: selectedFuel,
      quantity,
      unit,
      currency,
      volumeInLiters,
      volumeInTons,
      volumeInM3,
      location: selectedLocation,
      estimatedCostInSelectedCurrency: totalCostInSelectedCurrency,
      estimatedCostRub: totalCostRub,
      truckType: truckSpecs.type,
      truckSections: truckSpecs.sections,
      estimatedDeliveryTime: truckSpecs.deliveryTime
    };
    onOpenOrderModalWithCalc(calcResult);
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Интерактивный калькулятор объёма и логистики
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight mb-4">
            Калькулятор партии дизтоплива
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Точный автоматический пересчёт кубических метров (м³), литров и массы в тоннах с учётом ГОСТ-плотности {density} кг/л. 
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-md dark:shadow-xl space-y-6 transition-colors">
              
              {/* Step 1: Unit & Quantity Input */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>1. Объём необходимого топлива:</span>
                  </label>

                  {/* Unit Switcher: m3 vs Liters vs Tons */}
                  <div className="inline-flex p-1 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('m3')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        unit === 'm3'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      В кубах (м³)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('liters')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        unit === 'liters'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      В литрах (л)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('tons')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        unit === 'tons'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      В тоннах (т)
                    </button>
                  </div>
                </div>

                {/* Direct Number Input */}
                <div className="relative">
                  <input
                    type="number"
                    min={unit === 'm3' ? 1 : unit === 'liters' ? 100 : 0.1}
                    max={unit === 'm3' ? 500 : unit === 'liters' ? 500000 : 500}
                    step={unit === 'm3' ? 1 : unit === 'liters' ? 100 : 0.5}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-2xl py-3.5 pl-5 pr-28 text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white focus:outline-none transition-all shadow-inner"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-base pointer-events-none">
                    {unit === 'm3' ? 'м³ (кубов)' : unit === 'liters' ? 'литров' : 'тонн'}
                  </div>
                </div>

                {/* Quick Volume Preset Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(unit === 'm3' ? VOLUME_PRESETS_M3 : unit === 'liters' ? VOLUME_PRESETS_LITERS : VOLUME_PRESETS_TONS).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantity(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        quantity === preset
                          ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 font-bold'
                          : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-950 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {preset.toLocaleString('ru-RU')} {unit === 'm3' ? 'м³' : unit === 'liters' ? 'л' : 'т'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Fuel Grade Selection */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>2. Сорт дизельного топлива (ГОСТ Евро-5):</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DIESEL_FUEL_PRODUCTS.map((fuel) => {
                    const isSelected = fuel.id === selectedFuel.id;
                    return (
                      <button
                        key={fuel.id}
                        type="button"
                        onClick={() => onSelectFuel(fuel)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-950 dark:text-white">{fuel.shortName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-amber-700 dark:text-amber-400 font-bold">
                            {fuel.minTemp}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {fuel.grade}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Destination Region & City */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>3. Пункт назначения поставки (4 региона присутствия):</span>
                </label>

                {/* Region Switcher Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  {REGIONS_LIST.map((region) => (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => {
                        setActiveRegionFilter(region.id);
                        const first = DELIVERY_LOCATIONS.find(l => l.regionId === region.id);
                        if (first) onSelectLocation(first);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center transition-all cursor-pointer ${
                        activeRegionFilter === region.id
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {region.shortName}
                    </button>
                  ))}
                </div>

                {/* City Select Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredLocations.map((loc) => {
                    const isSelected = loc.id === selectedLocation.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => onSelectLocation(loc)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-slate-950 dark:text-white font-bold'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-semibold">{loc.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          ~{loc.distanceKm} км • {loc.minDeliveryHours}ч
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currency Selector (RUB / USD / EUR) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Валюта расчёта:</span>
                </div>
                <div className="inline-flex gap-1.5">
                  {(['RUB', 'USD', 'EUR'] as CurrencyCode[]).map((curr) => {
                    const cInfo = CURRENCY_RATES[curr];
                    const isCur = currency === curr;
                    return (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setCurrency(curr)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          isCur
                            ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300 shadow-sm'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-base">{cInfo.symbol}</span>
                        <span>{curr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Right: Calculation Output Card & Fleet Matching (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-2 border-amber-500/40 p-6 sm:p-7 shadow-xl dark:shadow-2xl space-y-6 relative overflow-hidden transition-colors">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-950 dark:text-white font-bold text-sm">
                  <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>Параметры партии</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {selectedLocation.name}
                </span>
              </div>

              {/* Exact Density & Volume Re-calc Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Физический объём по ГОСТ (плотность {density} кг/л):
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Кубы (м³):</span>
                    <span className="font-mono font-black text-lg text-amber-600 dark:text-amber-400">
                      {volumeInM3.toFixed(1)} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">м³</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Литры:</span>
                    <span className="font-mono font-black text-lg text-slate-950 dark:text-white">
                      {volumeInLiters.toLocaleString('ru-RU')} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">л</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Тонны:</span>
                    <span className="font-mono font-black text-lg text-amber-700 dark:text-amber-300">
                      {volumeInTons.toFixed(2)} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">т</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Transport Specs */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Подобранная автоцистерна:
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-slate-950 dark:text-white text-sm text-amber-800 dark:text-amber-300">
                    {truckSpecs.type}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    {truckSpecs.hose}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                    <span>Изолированных секций: <strong className="text-slate-900 dark:text-white">{truckSpecs.sections}</strong></span>
                    <span>Подача: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{truckSpecs.deliveryTime}</strong></span>
                  </div>
                </div>
              </div>

              {/* Total Cost Display in Selected Currency */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-gradient-to-r dark:from-amber-500/10 dark:via-amber-500/5 dark:to-transparent border border-amber-500/30 space-y-1 text-center">
                <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  Ориентировочный расчёт партии ({currency}):
                </div>
                <div className="font-mono font-black text-3xl sm:text-4xl text-amber-600 dark:text-amber-400">
                  {currencyInfo.symbol} {totalCostInSelectedCurrency.toLocaleString('ru-RU')}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Включает топливо Евро-5, доставку калиброванным бензовозом и НДС 20%
                </div>
              </div>

              {/* Order / Submit Button */}
              <button
                onClick={handleOrderClick}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Оформить заявку на этот объём</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

            </div>

            {/* MANDATORY BEAUTIFUL PAYMENT NOTICE CARD */}
            <div id="payment" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/40 shadow-md dark:shadow-xl space-y-3 transition-colors">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Условия оплаты и расчётов</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Расчёт осуществляется <strong>исключительно безналичным путём</strong> по выставленному счёту и договору поставки нефтепродуктов с НДС 20% или без НДС.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div>• Предоставление полного пакета первичных документов (УПД, ТОРГ-12, ТТН, ЭДО Диадок / СБИС)</div>
                <div>• Заверенные паспорта качества завода-изготовителя с каждой автоцистерной</div>
                <div>• Отсрочка платежа для постоянных контрагентов и предприятий добычи</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
