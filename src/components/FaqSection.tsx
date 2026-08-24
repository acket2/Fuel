import React, { useState } from 'react';
import { HelpCircle, ChevronDown, PhoneCall, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'В какие регионы осуществляет доставку ООО «СНК»?',
    answer: 'Мы доставляем дизельное топливо Евро-5 по 4 ключевым регионам: Иркутская область, Амурская область, Забайкальский край и Республика Бурятия (Бурятский автономный округ). Доставка выполняется автоцистернами от 5 до 42 м³ и железнодорожными цистернами 60–66 тонн.'
  },
  {
    question: 'Как осуществляется оплата и какие условия расчёта?',
    answer: 'Оплата производится по безналичному расчёту на расчётный счёт ООО «СНК». Мы работаем с выделением НДС 20% или без НДС. Для постоянных партнёров и крупных заказчиков возможны индивидуальные графики расчётов и отсрочка платежа. Точные виды и условия оплаты уточняйте по телефонам: 8 (904) 148-00-38 и 8 (983) 414-97-69.'
  },
  {
    question: 'Как проверить юридическую благонадежность компании ООО «СНК»?',
    answer: 'ИНН компании: 3801146254. Вы можете проверить ООО «СНК» в официальных реестрах ФНС России или на независимом сервисе Rusprofile по прямой ссылке, размещённой на нашем сайте. Компания является действующей организацией с безупречной деловой репутацией.'
  },
  {
    question: 'Предоставляются ли паспорта качества и сертификаты на дизтопливо?',
    answer: 'Да, к каждой отгрузке бензовоза или цистерны обязательно прилагается оригинальный заводской паспорт качества с указанием фактической плотности при наливе, цетанового числа, содержания серы и температуры фильтруемости. При сливе водитель-экспедитор может отобрать арбитражную пробу в присутствии представителя заказчика.'
  },
  {
    question: 'Какое оборудование установлено на бензовозах ООО «СНК»?',
    answer: 'Все бензовозы компании оборудованы калиброванными расходомерами (счётчиками ППО) с госповеркой, насосными станциями для перекачки в наземные и заглубленные емкости, а также гибкими топливными рукавами длиной до 40 метров.'
  },
  {
    question: 'Как быстро подается бензовоз после оформления заявки?',
    answer: 'По Иркутску, Ангарску и близлежащим районам подача бензовоза возможна от 1 до 2 часов. В отдаленные районы Иркутской, Амурской областей, Забайкалья и Бурятии подача осуществляется по согласованному графику в интервале от 4 до 24 часов.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const phone1 = '89041480038';
  const phone1Display = '8 (904) 148-00-38';
  const phone2 = '89834149769';
  const phone2Display = '8 (983) 414-97-69';

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Часто задаваемые вопросы
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Ответы на вопросы о поставках дизельного топлива
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Всё об условиях доставки, оплате по безналу, проверке качества и юридической чистоте ООО «СНК».
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Strip Below FAQ */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md transition-colors">
          <div>
            <div className="font-bold text-slate-950 dark:text-white text-sm">
              Остались вопросы по поставке дизельного топлива?
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Свяжитесь с дежурным специалистом отдела снабжения ООО «СНК»:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${phone1}`}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{phone1Display}</span>
            </a>
            <a
              href={`tel:${phone2}`}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{phone2Display}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
