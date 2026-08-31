import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2, Copy, Check, ExternalLink, Building2, MapPin, PhoneCall } from 'lucide-react';

interface AboutContext {
  handleOpenVerification: (tab?: 'company' | 'passport' | 'arbitrage') => void;
}

export default function AboutPage() {
  const { handleOpenVerification } = useOutletContext<AboutContext>();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const companyData = {
    fullName: 'Общество с ограниченной ответственностью «Сибирская Нефтяная Компания»',
    shortName: 'ООО «СНК»',
    inn: '3801146254',
    kpp: '380101001',
    ogrn: '1183850027845',
    okved: '46.71 — Торговля оптовая твердым, жидким и газообразным топливом и подобными продуктами',
    status: 'Действующее юридическое лицо',
    region: 'Иркутская область, г. Ангарск / г. Иркутск',
    nds: 'ОСНО (с НДС 20%) и УСН (без НДС)',
    edo: 'Диадок (СКБ Контур), СБИС (Тензор)',
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4">
            О компании <span className="text-amber-500">СНК</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            Сибирская Нефтяная Компания (ООО «СНК») — надежный поставщик светлых нефтепродуктов на территории Сибири и Дальнего Востока.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="w-full text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Регионы доставки</div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              Иркутская область
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              Амурская область
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              Забайкальский край
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              Республика Бурятия
            </div>
          </div>
        </div>

        {/* Company Verification Block */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Проверка контрагента</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Официальные реквизиты и ссылки на государственные реестры</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Requisites Card */}
            <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="p-4 mb-6 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>Статус в ФНС: {companyData.status}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-emerald-300/80">
                      Отсутствуют налоговые претензии и задолженности.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(`${companyData.fullName}\nИНН: ${companyData.inn}\nКПП: ${companyData.kpp}\nОГРН: ${companyData.ogrn}`, 'all_req')}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/40 text-slate-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {copiedField === 'all_req' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedField === 'all_req' ? 'Реквизиты скопированы!' : 'Скопировать все'}</span>
                </button>
              </div>

              <div className="space-y-4 text-sm divide-y divide-slate-200 dark:divide-slate-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-4 first:pt-0">
                  <span className="text-slate-500 dark:text-slate-400 sm:w-1/3">Наименование:</span>
                  <strong className="text-slate-900 dark:text-white sm:w-2/3">{companyData.fullName}</strong>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-4">
                  <span className="text-slate-500 dark:text-slate-400 sm:w-1/3">ИНН:</span>
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-400 sm:w-2/3 flex items-center gap-3">
                    <span className="text-base">{companyData.inn}</span>
                    <button
                      onClick={() => handleCopy(companyData.inn, 'inn')}
                      className="text-slate-400 hover:text-amber-500 transition-colors"
                      title="Скопировать ИНН"
                    >
                      {copiedField === 'inn' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-4">
                  <span className="text-slate-500 dark:text-slate-400 sm:w-1/3">КПП / ОГРН:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 sm:w-2/3">КПП {companyData.kpp} • ОГРН {companyData.ogrn}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-4">
                  <span className="text-slate-500 dark:text-slate-400 sm:w-1/3">ОКВЭД:</span>
                  <span className="text-slate-800 dark:text-slate-200 sm:w-2/3">{companyData.okved}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-4">
                  <span className="text-slate-500 dark:text-slate-400 sm:w-1/3">Налоги и ЭДО:</span>
                  <div className="sm:w-2/3 space-y-1">
                    <div className="text-slate-800 dark:text-slate-200">{companyData.nds}</div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-mono">ЭДО: {companyData.edo}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Card */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-amber-500" />
                Официальные реестры
              </h3>
              
              <div className="space-y-3 text-sm">
                <a
                  href="https://pb.nalog.ru/search.html?mode=quick&query=3801146254"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all group"
                >
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-amber-500 flex items-center justify-between">
                    <span>ФНС России (Прозрачный бизнес)</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ИНН 3801146254</p>
                </a>
                
                <a
                  href="https://egrul.nalog.ru/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all group"
                >
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-amber-500 flex items-center justify-between">
                    <span>Реестр ЕГРЮЛ</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Официальная выписка ФНС РФ</p>
                </a>
                
                <a
                  href="https://www.rusprofile.ru/search?query=3801146254"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all group"
                >
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-amber-500 flex items-center justify-between">
                    <span>Rusprofile.ru</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Аудит контрагента</p>
                </a>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
