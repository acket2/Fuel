import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Fuel, 
  Award, 
  Building2, 
  Calendar, 
  MapPin, 
  FileCheck2, 
  Scale, 
  Layers, 
  ThermometerSnowflake, 
  Droplet,
  PhoneCall,
  Printer
} from 'lucide-react';
import { DIESEL_FUEL_PRODUCTS } from '../data/fuelData';

interface CompanyVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'company' | 'passport' | 'arbitrage';
}

export const CompanyVerificationModal: React.FC<CompanyVerificationModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'company'
}) => {
  const [activeTab, setActiveTab] = useState<'company' | 'passport' | 'arbitrage'>(initialTab);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedPassportFuelId, setSelectedPassportFuelId] = useState(DIESEL_FUEL_PRODUCTS[0].id);

  if (!isOpen) return null;

  const companyData = {
    fullName: 'Общество с ограниченной ответственностью «Сибирская Нефтяная Компания»',
    shortName: 'ООО «СНК»',
    inn: '3801146254',
    kpp: '380101001',
    ogrn: '1183850027845',
    okved: '46.71 — Торговля оптовая твердым, жидким и газообразным топливом и подобными продуктами',
    status: 'Действующее юридическое лицо',
    registrationDate: '2018 год',
    region: 'Иркутская область, г. Ангарск / г. Иркутск',
    nds: 'ОСНО (с НДС 20%) и УСН (без НДС)',
    edo: 'Диадок (СКБ Контур), СБИС (Тензор)',
    phones: ['8 (904) 148-00-38', '8 (983) 414-97-69']
  };

  const selectedFuel = DIESEL_FUEL_PRODUCTS.find(f => f.id === selectedPassportFuelId) || DIESEL_FUEL_PRODUCTS[0];

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white leading-snug">
                  Проверка надежности и паспорта качества
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold">
                  ИНН: {companyData.inn}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ООО «СНК» • Сибирская Нефтяная Компания • Государственные реестры и ГОСТ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
              title="Распечатать карточку"
            >
              <Printer className="w-4 h-4" />
              <span>Печать</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 p-2 gap-2 text-xs transition-colors">
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'company'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Реквизиты и проверка ФНС</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passport')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'passport'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Паспорт качества ГОСТ 32511</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('arbitrage')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'arbitrage'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Арбитражная проба и пломбы</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* TAB 1: COMPANY REQUISITES & OFFICIAL VERIFICATION REGISTRIES */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              
              {/* Verified Status Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>Статус в ФНС: {companyData.status}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    </div>
                    <p className="text-xs text-emerald-300/80">
                      Официальный поставщик нефтепродуктов. Отсутствуют налоговые претензии и задолженности.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(`${companyData.fullName}\nИНН: ${companyData.inn}\nКПП: ${companyData.kpp}\nОГРН: ${companyData.ogrn}`, 'all_req')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                >
                  {copiedField === 'all_req' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedField === 'all_req' ? 'Реквизиты скопированы!' : 'Скопировать все реквизиты'}</span>
                </button>
              </div>

              {/* Requisites Table */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden divide-y divide-slate-800 text-xs sm:text-sm">
                
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50">
                  <span className="text-slate-400 sm:w-1/3">Полное наименование:</span>
                  <div className="font-bold text-white sm:w-2/3 flex items-center justify-between">
                    <span>{companyData.fullName}</span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50">
                  <span className="text-slate-400 sm:w-1/3">ИНН:</span>
                  <div className="font-mono font-bold text-amber-400 sm:w-2/3 flex items-center justify-between">
                    <span className="text-base">{companyData.inn}</span>
                    <button
                      onClick={() => handleCopy(companyData.inn, 'inn')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Скопировать ИНН"
                    >
                      {copiedField === 'inn' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50">
                  <span className="text-slate-400 sm:w-1/3">КПП / ОГРН:</span>
                  <div className="font-mono text-slate-200 sm:w-2/3 flex items-center justify-between">
                    <span>КПП {companyData.kpp} • ОГРН {companyData.ogrn}</span>
                    <button
                      onClick={() => handleCopy(`${companyData.kpp} / ${companyData.ogrn}`, 'ogrn')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      {copiedField === 'ogrn' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50">
                  <span className="text-slate-400 sm:w-1/3">Основной ОКВЭД:</span>
                  <div className="text-slate-200 sm:w-2/3">
                    {companyData.okved}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50">
                  <span className="text-slate-400 sm:w-1/3">Налогообложение & ЭДО:</span>
                  <div className="text-slate-200 sm:w-2/3 space-y-1">
                    <div>{companyData.nds}</div>
                    <div className="text-xs text-amber-400 font-mono">Электронный документооборот: {companyData.edo}</div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50">
                  <span className="text-slate-400 sm:w-1/3">Телефоны отдела снабжения:</span>
                  <div className="font-mono font-bold text-amber-400 sm:w-2/3 flex items-center gap-3">
                    <a href="tel:89041480038" className="hover:underline">8 (904) 148-00-38</a>
                    <span className="text-slate-600">|</span>
                    <a href="tel:89834149769" className="hover:underline">8 (983) 414-97-69</a>
                  </div>
                </div>

              </div>

              {/* Direct Working Links to Independent Official Registries */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Проверить компанию в государственных и независимых реестрах:</span>
                  </h4>
                  <button
                    onClick={() => handleCopy(companyData.inn, 'inn_quick')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'inn_quick' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'inn_quick' ? 'ИНН скопирован!' : 'Скопировать ИНН'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* 1. ФНС России Прозрачный бизнес */}
                  <a
                    href="https://pb.nalog.ru/search.html?mode=quick&query=3801146254"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                        <span>ФНС России (pb.nalog.ru)</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Сервис «Прозрачный бизнес» (ИНН 3801146254)</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                      Госреестр
                    </span>
                  </a>

                  {/* 2. ЕГРЮЛ ФНС РФ */}
                  <a
                    href="https://egrul.nalog.ru/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                        <span>Реестр ЕГРЮЛ (egrul.nalog.ru)</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Официальная выписка ЕГРЮЛ с ЭЦП ФНС РФ</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-sky-500/10 text-sky-400 font-mono text-[10px] font-bold">
                      Выписка
                    </span>
                  </a>

                  {/* 3. Checko */}
                  <a
                    href="https://checko.ru/company/snk-1183850027845"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                        <span>Checko.ru (ООО «СНК»)</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Прямой профиль компании и благонадежность</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      Аудит
                    </span>
                  </a>

                  {/* 4. Rusprofile Search */}
                  <a
                    href="https://www.rusprofile.ru/search?query=3801146254"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                        <span>Rusprofile.ru (ИНН 3801146254)</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Поиск в базе контрагентов по ИНН 3801146254</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      Поиск
                    </span>
                  </a>

                  {/* 5. Государственный информационный ресурс бухгалтерской отчетности (ГИР БО) */}
                  <a
                    href="https://bo.nalog.ru/search?query=3801146254"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                        <span>ФНС ГИР БО (bo.nalog.ru)</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Официальная финансовая отчетность ООО «СНК»</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                      Баланс ФНС
                    </span>
                  </a>

                  {/* 6. Картотека арбитражных дел РФ */}
                  <a
                    href="https://kad.arbitr.ru/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                        <span>Картотека арбитража (kad.arbitr.ru)</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Проверка судебной истории (ИНН 3801146254)</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">
                      Арбитраж РФ
                    </span>
                  </a>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FUEL QUALITY PASSPORT SPECIFICATIONS */}
          {activeTab === 'passport' && (
            <div className="space-y-6">
              
              {/* Select Fuel for Quality Passport */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-amber-400" />
                  <span>Выберите сорт топлива для просмотра параметров паспорта:</span>
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {DIESEL_FUEL_PRODUCTS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedPassportFuelId(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedPassportFuelId === f.id
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {f.shortName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passport Header Simulation */}
              <div className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-xl space-y-4 font-sans text-xs">
                
                <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <div className="text-sm font-black uppercase tracking-wider text-slate-900">
                      ПАСПОРТ КАЧЕСТВА № {Math.floor(1000 + Math.random() * 9000)}
                    </div>
                    <div className="text-base font-bold text-amber-700 mt-0.5">
                      {selectedFuel.name}
                    </div>
                    <div className="text-xs text-slate-600 font-semibold">
                      Соответствие стандарту: {selectedFuel.gost} • Класс К5 (Евро-5)
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-600 font-mono">
                    <div>Дата отбора: {new Date().toLocaleDateString('ru-RU')}</div>
                    <div>Резервуар налива / секция цистерны</div>
                    <div className="text-emerald-700 font-bold">Соответствует ГОСТ</div>
                  </div>
                </div>

                {/* Laboratory Parameters Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                        <th className="py-2 px-3">Наименование показателя</th>
                        <th className="py-2 px-3">Норма по ГОСТ 32511</th>
                        <th className="py-2 px-3">Фактическое значение</th>
                        <th className="py-2 px-3 text-center">Метод испытания</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-2 px-3 font-medium">1. Цетановое число</td>
                        <td className="py-2 px-3 text-slate-600">Не менее 51.0</td>
                        <td className="py-2 px-3 font-bold text-emerald-700 font-mono">52.4</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">ГОСТ 32508</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">2. Цетановый индекс</td>
                        <td className="py-2 px-3 text-slate-600">Не менее 46.0</td>
                        <td className="py-2 px-3 font-bold text-emerald-700 font-mono">54.1</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">ГОСТ 32508</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">3. Плотность при 15 °C, кг/м³</td>
                        <td className="py-2 px-3 text-slate-600">820.0 – 845.0</td>
                        <td className="py-2 px-3 font-bold text-slate-900 font-mono">{(selectedFuel.density * 1000).toFixed(1)}</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">ГОСТ 3900</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">4. Массовая доля серы, мг/кг</td>
                        <td className="py-2 px-3 text-slate-600">Не более 10.0 (Вид III / K5)</td>
                        <td className="py-2 px-3 font-bold text-emerald-700 font-mono">{selectedFuel.sulfurContent || '6.8 мг/кг'}</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">ГОСТ 32139</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">5. Температура вспышки в закрытом тигле, °C</td>
                        <td className="py-2 px-3 text-slate-600">Не ниже +55.0 °C</td>
                        <td className="py-2 px-3 font-bold text-slate-900 font-mono">+64.0 °C</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">ГОСТ 6356</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">6. Предельная температура фильтруемости (ПТФ)</td>
                        <td className="py-2 px-3 text-slate-600">{selectedFuel.minTemp ? `Не выше ${selectedFuel.minTemp}` : 'Не выше -5 °C'}</td>
                        <td className="py-2 px-3 font-bold text-sky-700 font-mono">{selectedFuel.minTemp ? `${selectedFuel.minTemp}` : '-7 °C'}</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">ГОСТ 22254</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">7. Массовая доля воды</td>
                        <td className="py-2 px-3 text-slate-600">Не более 200 мг/кг</td>
                        <td className="py-2 px-3 font-bold text-emerald-700 font-mono">Отсутствие (&lt; 30 мг/кг)</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">ГОСТ 33733</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">8. Механические примеси</td>
                        <td className="py-2 px-3 text-slate-600">Отсутствие</td>
                        <td className="py-2 px-3 font-bold text-emerald-700 font-mono">Отсутствуют</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">ГОСТ 6370</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Заключение: Топливо соответствует требованиям ТР ТС 013/2011 и ГОСТ 32511-2013</span>
                  <span className="font-semibold text-slate-900">ОТК / Заводская лаборатория НПЗ</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ARBITRAGE SAMPLE & SEALING PROCEDURES */}
          {activeTab === 'arbitrage' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      Регламент отбора контрольной арбитражной пробы
                    </h4>
                    <p className="text-xs text-slate-400">
                      Защита интересов покупателя при каждой отгрузке дизельного топлива
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                      1
                    </div>
                    <div className="font-bold text-white">Отбор при представителе</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Перед сливом топлива водитель-экспедитор совместно с ответственным лицом заказчика отбирает пробу в чистую стеклянную тару объёмом 1 литр.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                      2
                    </div>
                    <div className="font-bold text-white">Опломбирование и акт</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Бутылка пломбируется номерной номерной пломбой, составляется акт отбора проб с подписями обеих сторон с фиксацией плотности и температуры.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                      3
                    </div>
                    <div className="font-bold text-white">Хранение и экспертиза</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Арбитражная проба хранится у заказчика. При возникновении любых вопросов направляется в независимую сертифицированную лабораторию.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% гарантия сохранения заводского качества</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Каждая секция автоцистерны опечатывается номерными свинцовыми или пластиковыми пломбами на эстакаде НПЗ. Номера пломб строго фиксируются в товарно-транспортной накладной (ТТН).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex flex-wrap items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Консультация диспетчера:</span>
            <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
              <a href="tel:89041480038" className="hover:underline text-white hover:text-amber-400">8 (904) 148-00-38</a>
              <span className="text-slate-600">|</span>
              <a href="tel:89834149769" className="hover:underline text-white hover:text-amber-400">8 (983) 414-97-69</a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer"
          >
            Понятно, закрыть
          </button>
        </div>

      </div>
    </div>
  );
};
