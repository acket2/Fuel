import React from 'react';
import { 
  Fuel, 
  ShieldCheck, 
  ExternalLink, 
  PhoneCall, 
  MapPin, 
  FileText, 
  CreditCard,
  Building,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { REGIONS_LIST } from '../data/regionsData';

interface FooterProps {
  onOpenVerificationModal?: (tab?: 'company' | 'passport' | 'arbitrage') => void;
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVerificationModal, onOpenAdminModal }) => {
  const phone1 = '89041480038';
  const phone1Display = '8 (904) 148-00-38';
  const phone2 = '89834149769';
  const phone2Display = '8 (983) 414-97-69';
  const inn = '3801146254';

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 text-xs transition-colors">
      
      {/* Prominent Payment Footnote Banner (As explicitly required) */}
      <div className="bg-slate-100/80 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-amber-500/40 p-6 sm:p-7 shadow-md dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-slate-950 dark:text-white font-extrabold text-base sm:text-lg flex items-center gap-2">
                  <span className="text-amber-700 dark:text-amber-400">💳 Оплата — безналичный расчёт</span>
                  <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/25 hidden sm:inline">
                    НДС 20% / без НДС
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  (Виды оплаты и индивидуальные условия взаиморасчетов уточняйте по номеру телефона отдела снабжения).
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  Предоставляем полный комплект закрывающих документов: УПД через Диадок/СБИС, товарно-транспортные накладные (ТТН), паспорта качества ГОСТ.
                </div>
              </div>
            </div>

            {/* Direct Call Numbers on Payment Strip */}
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
              <a
                href={`tel:${phone1}`}
                className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{phone1Display}</span>
              </a>
              <a
                href={`tel:${phone2}`}
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{phone2Display}</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Verification */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono font-black text-base text-slate-950 dark:text-white">ООО «СНК»</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Сибирская Нефтяная Компания</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Надежные оптовые и мелкооптовые поставки сертифицированного дизельного топлива Евро-5 стандарта ГОСТ 32511-2013.
            </p>

            <button
              type="button"
              onClick={() => onOpenVerificationModal?.('company')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[11px] transition-all cursor-pointer text-left"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>ИНН: {inn} • Проверка ФНС и ГОСТ</span>
            </button>
          </div>

          {/* Col 2: Regions Coverage */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-950 dark:text-white uppercase text-xs tracking-wider">
              Регионы доставки:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {REGIONS_LIST.map((reg) => (
                <li key={reg.id} className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{reg.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Fuel Specifications */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-950 dark:text-white uppercase text-xs tracking-wider">
              Поставляемые нефтепродукты:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li>• Дизельное топливо Летнее Класс 5</li>
              <li>• Дизельное топливо Межсезонное Класс 5</li>
              <li>• Дизельное топливо Зимнее Класс 5</li>
            </ul>
          </div>

          {/* Col 4: Contacts & Dispatch */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-950 dark:text-white uppercase text-xs tracking-wider">
              Телефоны для заявок:
            </h4>
            <div className="space-y-2">
              <a
                href={`tel:${phone1}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs hover:border-amber-500 transition-colors shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                <span>{phone1Display}</span>
              </a>
              <a
                href={`tel:${phone2}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs hover:border-amber-500 transition-colors shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                <span>{phone2Display}</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Приём заявок и консультации: круглосуточно, без выходных.
            </p>
          </div>

        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} ООО «СНК» (Сибирская Нефтяная Компания). ИНН {inn}. Все права защищены.
          </div>

          <div className="flex items-center gap-4">
            <span>Безналичный расчет</span>
            <span>ГОСТ 32511-2013</span>
            <span>Паспорта качества</span>
            {onOpenAdminModal && (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="text-slate-400 hover:text-amber-500 flex items-center gap-1 transition-colors cursor-pointer"
                title="Вход в панель администратора"
              >
                <Lock className="w-3 h-3" />
                <span>Панель диспетчера</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
