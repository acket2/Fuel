/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FuelCalculator } from './components/FuelCalculator';
import { FuelCatalog } from './components/FuelCatalog';
import { RegionsCoverageSection } from './components/RegionsCoverageSection';
import { OrderSection } from './components/OrderSection';
import { BentoFeatures } from './components/BentoFeatures';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { CommercialOfferModal } from './components/CommercialOfferModal';
import { TelegramSettingsModal } from './components/TelegramSettingsModal';
import { CompanyVerificationModal } from './components/CompanyVerificationModal';
import { REGIONS_LIST, DELIVERY_LOCATIONS } from './data/regionsData';
import { DIESEL_FUEL_PRODUCTS } from './data/fuelData';
import { RegionInfo, DeliveryLocation, FuelProduct, CalculationResult } from './types';
import { PhoneCall, Calculator, Send, BellRing } from 'lucide-react';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo>(REGIONS_LIST[0]); // Default: Irkutsk Oblast
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation>(DELIVERY_LOCATIONS[0]); // Default: Irkutsk
  const [selectedFuel, setSelectedFuel] = useState<FuelProduct>(DIESEL_FUEL_PRODUCTS[0]); // Default: DT Summer
  
  // Modals state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [telegramSettingsOpen, setTelegramSettingsOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationTab, setVerificationTab] = useState<'company' | 'passport' | 'arbitrage'>('company');
  const [activeCalcResult, setActiveCalcResult] = useState<CalculationResult | null>(null);

  const phone1 = '89041480038';

  const handleOpenVerification = (tab: 'company' | 'passport' | 'arbitrage' = 'company') => {
    setVerificationTab(tab);
    setVerificationModalOpen(true);
  };

  const handleRegionChange = (region: RegionInfo) => {
    setSelectedRegion(region);
    // Find default location for this region
    const firstLocInRegion = DELIVERY_LOCATIONS.find(l => l.regionId === region.id);
    if (firstLocInRegion) {
      setSelectedLocation(firstLocInRegion);
    }
  };

  const handleOpenOrderModal = () => {
    setOrderModalOpen(true);
  };

  const handleOpenOrderWithFuel = (fuel: FuelProduct) => {
    setSelectedFuel(fuel);
    setOrderModalOpen(true);
  };

  const handleOpenOrderWithCalc = (calc: CalculationResult) => {
    setActiveCalcResult(calc);
    setSelectedFuel(calc.fuel);
    setSelectedLocation(calc.location);
    setOrderModalOpen(true);
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToOrderSection = () => {
    const el = document.getElementById('order');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans antialiased transition-colors duration-200">
      
      {/* 1. Sticky Navigation & Verified Header */}
      <Header
        selectedRegion={selectedRegion}
        onSelectRegion={handleRegionChange}
        onOpenOrderModal={handleOpenOrderModal}
        onScrollToCalculator={scrollToCalculator}
        onOpenTelegramSettings={() => setTelegramSettingsOpen(true)}
        onOpenVerificationModal={handleOpenVerification}
      />

      {/* Main Page Layout */}
      <main className="flex-grow">
        
        {/* 2. Hero Section: ООО СНК, 4 Regions, Verified INN 3801146254, Dual Phones */}
        <Hero
          selectedRegion={selectedRegion}
          onSelectRegion={handleRegionChange}
          onOpenOrderModal={handleOpenOrderModal}
          onScrollToCalculator={scrollToCalculator}
          onOpenVerificationModal={handleOpenVerification}
        />

        {/* 3. Interactive Multi-Currency Fuel & Volume Calculator (Liters/Tons/m3, RUB/USD/EUR) */}
        <FuelCalculator
          selectedFuel={selectedFuel}
          onSelectFuel={setSelectedFuel}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          onOpenOrderModalWithCalc={handleOpenOrderWithCalc}
        />

        {/* 4. Fuel Specifications Catalog (WITHOUT PRICES - PURE TECHNICAL SPECIFICATIONS) */}
        <FuelCatalog
          selectedFuel={selectedFuel}
          onSelectFuel={setSelectedFuel}
          onScrollToCalculator={scrollToCalculator}
          onOpenOrderModalWithFuel={handleOpenOrderWithFuel}
          onOpenVerificationModal={handleOpenVerification}
        />

        {/* 5. Geographic Logistics & Fleet across 4 Regions */}
        <RegionsCoverageSection
          selectedRegion={selectedRegion}
          onSelectRegion={handleRegionChange}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
            const reg = REGIONS_LIST.find(r => r.id === loc.regionId);
            if (reg) setSelectedRegion(reg);
          }}
          onScrollToCalculator={scrollToCalculator}
        />

        {/* 6. DEDICATED ON-PAGE ORDER SECTION: Phone, Region, Destination, Volume in m3, Name, Email, Payment */}
        <OrderSection
          onOpenTelegramSettings={() => setTelegramSettingsOpen(true)}
        />

        {/* 7. Bento Grid Company Advantages & Trust Verification */}
        <BentoFeatures onOpenVerificationModal={handleOpenVerification} />

        {/* 8. FAQ Section */}
        <FaqSection />

      </main>

      {/* 9. Footer with Payment Notice, Verified INN, and Dual Phones */}
      <Footer onOpenVerificationModal={handleOpenVerification} />

      {/* Floating Mobile Quick Contact / Calc Bar */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2 sm:hidden">
        <a
          href={`tel:${phone1}`}
          className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 active:scale-95 border border-amber-300"
          title="Позвонить в ООО «СНК»"
        >
          <PhoneCall className="w-5 h-5 stroke-[2.5]" />
        </a>
        <button
          onClick={scrollToOrderSection}
          className="px-4 py-3 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Заявка</span>
        </button>
      </div>

      {/* Modals */}
      <CompanyVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        initialTab={verificationTab}
      />

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        initialFuel={selectedFuel}
        initialLocation={selectedLocation}
        calculationData={activeCalcResult}
        onOpenTelegramSettings={() => setTelegramSettingsOpen(true)}
      />

      <CommercialOfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        calcResult={activeCalcResult}
      />

      <TelegramSettingsModal
        isOpen={telegramSettingsOpen}
        onClose={() => setTelegramSettingsOpen(false)}
      />

    </div>
  );
}
