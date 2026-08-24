import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Building2, 
  ShieldCheck, 
  Fuel, 
  PhoneCall, 
  CheckCircle2,
  Download
} from 'lucide-react';
import { CalculationResult } from '../types';
import { DIESEL_FUEL_PRODUCTS, CURRENCY_RATES } from '../data/fuelData';

interface CommercialOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  calcResult?: CalculationResult | null;
}

export const CommercialOfferModal: React.FC<CommercialOfferModalProps> = ({
  isOpen,
  onClose,
  calcResult
}) => {
  const [recipientCompany, setRecipientCompany] = useState('ООО «Предприятие заказчика»');
  const [recipientPerson, setRecipientPerson] = useState('Руководителю отдела снабжения / Главному инженеру');
  
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('ru-RU');
  const fuel = calcResult?.fuel || DIESEL_FUEL_PRODUCTS[0];
  const volumeLiters = calcResult?.volumeInLiters || 5000;
  const volumeTons = calcResult?.volumeInTons || ((volumeLiters * fuel.density) / 1000);
  const locationName = calcResult?.location.name || 'Иркутск';
  const regionName = calcResult?.location.regionName || 'Иркутская область';
  const currency = calcResult?.currency || 'RUB';
  const currencyInfo = CURRENCY_RATES[currency];
  const totalCost = calcResult?.estimatedCostInSelectedCurrency || Math.round(volumeLiters * fuel.basePriceRubPerLiter * currencyInfo.rate);

  const phone1Display = '8 (904) 148-00-38';
  const phone2Display = '8 (983) 414-97-69';
  const inn = '3801146254';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <FileText className="w-5 h-5" />
            <span>Коммерческое предложение (КП № СНК-{Math.floor(1000 + Math.random() * 9000)})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печать КП</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet View */}
        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-inner text-xs sm:text-sm space-y-6 font-sans">
          
          {/* Header of CP */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                <span className="text-amber-600">ООО «СНК»</span>
                <span className="text-slate-800 text-sm font-semibold">(Сибирская Нефтяная Компания)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Поставки сертифицированного дизельного топлива Евро-5 (ГОСТ 32511-2013)
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                ИНН: {inn} | Доставка: Иркутская, Амурская обл., Забайкалье, Бурятия
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-900">Исх. № СНК-{Math.floor(100 + Math.random()*900)}</div>
              <div className="text-slate-500">от {today} г.</div>
              <div className="text-slate-700 font-mono font-bold mt-1">Тел: {phone1Display}</div>
              <div className="text-slate-700 font-mono font-bold">Тел: {phone2Display}</div>
            </div>
          </div>

          {/* Addressee */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Кому:</div>
            <div className="font-bold text-slate-900">{recipientCompany}</div>
            <div className="text-xs text-slate-600">{recipientPerson}</div>
          </div>

          <div className="text-center font-bold text-base text-slate-900 uppercase tracking-wide">
            Коммерческое предложение на поставку дизельного топлива
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            ООО «СНК» (Сибирская Нефтяная Компания) подтверждает готовность осуществить отгрузку и доставку дизельного топлива Евро-5 стандарта ГОСТ 32511-2013 на ваш объект со следующими параметрами:
          </p>

          {/* Table */}
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold">
                <th className="border border-slate-300 p-2 text-left">№</th>
                <th className="border border-slate-300 p-2 text-left">Наименование нефтепродукта</th>
                <th className="border border-slate-300 p-2 text-center">Объём (л / т)</th>
                <th className="border border-slate-300 p-2 text-left">Пункт назначения</th>
                <th className="border border-slate-300 p-2 text-right">Расчётная сумма ({currency})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 text-center">1</td>
                <td className="border border-slate-300 p-2">
                  <div className="font-bold">{fuel.name}</div>
                  <div className="text-[10px] text-slate-500">ГОСТ: {fuel.gost} • Плотность: {fuel.density} кг/л</div>
                </td>
                <td className="border border-slate-300 p-2 text-center font-mono font-bold">
                  {volumeLiters.toLocaleString('ru-RU')} л ({volumeTons.toFixed(2)} т)
                </td>
                <td className="border border-slate-300 p-2 font-medium">
                  г. {locationName} ({regionName})
                </td>
                <td className="border border-slate-300 p-2 text-right font-mono font-bold text-slate-900">
                  {currencyInfo.symbol} {totalCost.toLocaleString('ru-RU')}
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td colSpan={4} className="border border-slate-300 p-2 text-right">ИТОГО ориентировочно:</td>
                <td className="border border-slate-300 p-2 text-right font-mono text-sm text-amber-700">
                  {currencyInfo.symbol} {totalCost.toLocaleString('ru-RU')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Guarantees & Terms */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="font-bold text-slate-800">Условия поставки и расчетов:</div>
            <div>• <strong>Форма оплаты:</strong> безналичный расчет (с выделением НДС 20% или без НДС). Виды и индивидуальные условия оплаты уточняйте по телефонам отдела снабжения.</div>
            <div>• <strong>Качество:</strong> оригинальный заводской паспорт качества, опломбированные секции цистерны, возможность отбора арбитражной пробы на объекте.</div>
            <div>• <strong>Сливное оборудование:</strong> насос и рукава длиной до 40 м.</div>
            <div>• <strong>Срок действия предложения:</strong> 3 банковских дня.</div>
          </div>

          {/* Signatures & Stamps */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            <div>
              <div className="font-bold text-slate-900">Отдел снабжения и логистики</div>
              <div className="text-slate-600">ООО «СНК» (ИНН 3801146254)</div>
              <div className="font-serif italic text-slate-400 mt-2">/ Сибирская Нефтяная Компания /</div>
            </div>
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-[10px] text-amber-700 text-center font-bold rotate-[-10deg] opacity-85">
              ООО «СНК»<br/>ИНН 3801146254<br/>Отдел сбыта
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
