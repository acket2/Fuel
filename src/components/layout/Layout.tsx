import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { TelegramSettingsModal } from '../TelegramSettingsModal';
import { CompanyVerificationModal } from '../CompanyVerificationModal';
import { AdminPanelModal } from '../AdminPanelModal';
import { RegionInfo } from '../../types';
import { REGIONS_LIST } from '../../data/regionsData';
import { getSavedLeads } from '../../utils/telegramNotify';
import { PhoneCall, Send } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo>(REGIONS_LIST[0]);
  
  const [telegramSettingsOpen, setTelegramSettingsOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationTab, setVerificationTab] = useState<'company' | 'passport' | 'arbitrage'>('company');
  const [ordersCount, setOrdersCount] = useState<number>(() => getSavedLeads().length);

  const phone1 = '89041480038';

  const refreshOrdersCount = () => {
    setOrdersCount(getSavedLeads().length);
  };

  const handleOpenVerification = (tab: 'company' | 'passport' | 'arbitrage' = 'company') => {
    setVerificationTab(tab);
    setVerificationModalOpen(true);
  };

  const scrollToOrderSection = () => {
    navigate('/order');
    setTimeout(() => {
      const el = document.getElementById('order');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans antialiased transition-colors duration-200">
      <Header
        onOpenOrderModal={scrollToOrderSection}
        onScrollToCalculator={scrollToOrderSection}
        onOpenTelegramSettings={() => setTelegramSettingsOpen(true)}
        onOpenVerificationModal={handleOpenVerification}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        newOrdersCount={ordersCount}
      />

      <main className="flex-grow pt-20">
        <Outlet context={{
          selectedRegion,
          handleOpenVerification,
          setTelegramSettingsOpen,
        }} />
      </main>

      <Footer 
        onOpenVerificationModal={handleOpenVerification} 
        onOpenAdminModal={() => setAdminModalOpen(true)}
      />

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

      <CompanyVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        initialTab={verificationTab}
      />

      <TelegramSettingsModal
        isOpen={telegramSettingsOpen}
        onClose={() => setTelegramSettingsOpen(false)}
      />

      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => {
          setAdminModalOpen(false);
          refreshOrdersCount();
        }}
        onOrdersUpdated={refreshOrdersCount}
      />
    </div>
  );
}
