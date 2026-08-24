import React from 'react';
import { 
  ShieldCheck, 
  Fuel, 
  Truck, 
  Clock, 
  Award, 
  CheckCircle2, 
  FileCheck2, 
  ExternalLink,
  Flame,
  Snowflake,
  Layers,
  Sparkles
} from 'lucide-react';

interface BentoFeaturesProps {
  onOpenVerificationModal?: (tab?: 'company' | 'passport' | 'arbitrage') => void;
}

export const BentoFeatures: React.FC<BentoFeaturesProps> = ({ onOpenVerificationModal }) => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-50/60 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            Преимущества сотрудничества с ООО «СНК»
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Сибирская Нефтяная Компания — надёжный поставщик дизельного топлива
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Прямые контракты с производителями, собственный парк спецтранспорта и гарантия сохранения качества нефтепродуктов на каждом этапе транспортировки.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Verified Company & Direct Refinery Shipments (2 cols on md) */}
          <div className="md:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 shadow-md dark:shadow-xl space-y-4 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Fuel className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>ИНН: 3801146254 • ПРЯМЫЕ ДОГОВОРЫ С НПЗ</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                Прямой налив с заводов АО «АНХК» и НПЗ Сибири
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Мы исключаем перекупщиков и сторонние перевалки. Топливо наливается напрямую в опломбированные автоцистерны на сертифицированных эстакадах заводов-изготовителей, что гарантирует сохранение заводской плотности, цетанового числа и чистоты.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                ✓ Паспорт качества на каждую секцию
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                ✓ Арбитражная проба при клиенте
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                ✓ Электронные пломбы
              </span>
            </div>
          </div>

          {/* Card 2: Winter & Arctic Resilience */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 shadow-md dark:shadow-xl space-y-4 relative overflow-hidden group hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Snowflake className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-mono text-sky-700 dark:text-sky-400 font-bold block mb-1">
                МОРОЗОСТОЙКОСТЬ ДО -50°C
              </span>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                Сибирский & Арктический стандарт
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Поставляем проверенное зимнее и арктическое дизтопливо Евро-5 с предельной температурой фильтруемости (ПТФ) до -50°C. Гарантированный запуск тяжёлой спецтехники в суровые сибирские морозы.
              </p>
            </div>
          </div>

          {/* Card 3: Calibrated Fleet & Long Hoses */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 shadow-md dark:shadow-xl space-y-4 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Truck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold block mb-1">
                СПЕЦОБОРУДОВАНИЕ И РУКАВА ДО 40 М
              </span>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                Калиброванный слив и сливные насосы
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Бензовозы оснащены поверенными электронными счётчиками ППО с погрешностью не более 0.25%, высокопроизводительными насосами и длинными шлангами для заправки техники прямо на стройплощадках и в карьерах.
              </p>
            </div>
          </div>

          {/* Card 4: Official Verification & Security Link (2 cols on md) */}
          <div className="md:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 shadow-md dark:shadow-xl space-y-4 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                ЮРИДИЧЕСКАЯ ЧИСТОТА И НАЛОГОВАЯ БЕЗОПАСНОСТЬ
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                Официальная проверка ООО «СНК» по ИНН 3801146254
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Полная прозрачность для бухгалтерии и службы безопасности: работаем с НДС 20%, предоставляем закрывающие документы через ЭДО или бумажными оригиналами, своевременная налоговая отчетность.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenVerificationModal?.('company')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Открыть карточку реквизитов и проверку ФНС</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenVerificationModal?.('passport')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Паспорта качества ГОСТ</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
