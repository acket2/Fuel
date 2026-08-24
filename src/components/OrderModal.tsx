import React, { useState, useEffect } from 'react';
import { 
  X, 
  Fuel, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2, 
  FileText,
  CreditCard,
  Building,
  Layers,
  User,
  Mail,
  Send,
  BellRing
} from 'lucide-react';
import { FuelProduct, DeliveryLocation, CalculationResult, VolumeUnit, OrderLeadData } from '../types';
import { DIESEL_FUEL_PRODUCTS } from '../data/fuelData';
import { DELIVERY_LOCATIONS, REGIONS_LIST } from '../data/regionsData';
import { processNewLead, getTelegramConfig, getEmailConfig } from '../utils/telegramNotify';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFuel?: FuelProduct;
  initialLocation?: DeliveryLocation;
  calculationData?: CalculationResult | null;
  onOpenTelegramSettings?: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialFuel,
  initialLocation,
  calculationData,
  onOpenTelegramSettings
}) => {
  const [fuelId, setFuelId] = useState(initialFuel?.id || calculationData?.fuel.id || DIESEL_FUEL_PRODUCTS[0].id);
  const [volumeInput, setVolumeInput] = useState<number>(calculationData?.quantity || 10);
  const [selectedUnit, setSelectedUnit] = useState<VolumeUnit>(calculationData?.unit || 'm3');
  const [regionName, setRegionName] = useState(
    initialLocation?.regionName || calculationData?.location.regionName || REGIONS_LIST[0].name
  );
  const [destination, setDestination] = useState(initialLocation?.name || calculationData?.location.name || '');
  
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentType, setPaymentType] = useState<'cashless_vat' | 'cashless_no_vat' | 'consultation'>('cashless_vat');
  const [needHosePump, setNeedHosePump] = useState(true);
  const [comment, setComment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState('');
  const [lastLead, setLastLead] = useState<OrderLeadData | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialFuel) setFuelId(initialFuel.id);
      if (initialLocation) {
        setRegionName(initialLocation.regionName);
        setDestination(initialLocation.name);
      }
      if (calculationData) {
        setFuelId(calculationData.fuel.id);
        setVolumeInput(calculationData.quantity);
        setSelectedUnit(calculationData.unit);
        setRegionName(calculationData.location.regionName);
        setDestination(calculationData.location.name);
      }
      setIsSubmitted(false);
      setTelegramStatus('');
    }
  }, [isOpen, initialFuel, initialLocation, calculationData]);

  if (!isOpen) return null;

  const phone1 = '89041480038';
  const phone1Display = '8 (904) 148-00-38';
  const phone2 = '89834149769';
  const phone2Display = '8 (983) 414-97-69';
  const inn = '3801146254';

  const selectedFuelObj = DIESEL_FUEL_PRODUCTS.find(f => f.id === fuelId) || DIESEL_FUEL_PRODUCTS[0];

  // Live conversion calculations
  let volumeInM3 = 10;
  let volumeInLiters = 10000;
  let volumeInTons = 8.4;

  if (selectedUnit === 'm3') {
    volumeInM3 = Number(volumeInput) || 0;
    volumeInLiters = volumeInM3 * 1000;
    volumeInTons = (volumeInLiters * selectedFuelObj.density) / 1000;
  } else if (selectedUnit === 'liters') {
    volumeInLiters = Number(volumeInput) || 0;
    volumeInM3 = volumeInLiters / 1000;
    volumeInTons = (volumeInLiters * selectedFuelObj.density) / 1000;
  } else {
    // tons
    volumeInTons = Number(volumeInput) || 0;
    volumeInLiters = selectedFuelObj.density > 0 ? (volumeInTons * 1000) / selectedFuelObj.density : volumeInTons * 1190;
    volumeInM3 = volumeInLiters / 1000;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsSubmitting(true);

    const lead: OrderLeadData = {
      id: 'SNK-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toLocaleString('ru-RU'),
      phone: phone.trim(),
      regionName: regionName,
      destination: destination.trim() || 'По согласованию с логистом',
      volumeM3: Number(volumeInM3.toFixed(2)),
      volumeLiters: Math.round(volumeInLiters),
      volumeTons: Number(volumeInTons.toFixed(2)),
      selectedUnit: selectedUnit,
      fuelName: `${selectedFuelObj.shortName} (${selectedFuelObj.gost})`,
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      paymentType: paymentType,
      needHosePump: needHosePump,
      comment: comment.trim()
    };

    setLastLead(lead);

    const result = await processNewLead(lead);
    let statusMsg = '';
    if (result.telegramResult?.message) {
      statusMsg = result.telegramResult.message;
    }
    if (result.emailResult?.message) {
      statusMsg += ` • ${result.emailResult.message}`;
    }
    setTelegramStatus(statusMsg || 'Заявка принята');

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-snug">
                Заявка на поставку дизельного топлива
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ООО «СНК» • Сибирская Нефтяная Компания (ИНН: {inn})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted && lastLead ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-900 dark:text-amber-300 text-sm font-mono font-black uppercase tracking-wider">
                НОМЕР ВАШЕГО ЗАКАЗА: {lastLead.id}
              </div>
              
              <h4 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                Спасибо за заявку! В скором времени с вами свяжутся.
              </h4>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Дежурный логист ООО «СНК» уже обрабатывает спецификацию партии ({lastLead.volumeM3} м³ / {lastLead.volumeLiters.toLocaleString('ru-RU')} л, {lastLead.fuelName} в {lastLead.destination}) и свяжется с вами в течение 5 минут по телефону <strong className="font-mono text-slate-950 dark:text-white">{lastLead.phone}</strong>.
              </p>
            </div>

            {telegramStatus && (
              <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950/50 border border-sky-300 dark:border-sky-800/40 text-xs text-sky-900 dark:text-sky-200 flex items-center justify-center gap-2">
                <BellRing className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>{telegramStatus}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="font-semibold text-amber-700 dark:text-amber-400">
                Срочный вопрос по графику налива?
              </div>
              <div className="flex flex-wrap justify-center gap-3 font-mono">
                <a href={`tel:${phone1}`} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
                  {phone1Display}
                </a>
                <span className="text-slate-400 dark:text-slate-600">|</span>
                <a href={`tel:${phone2}`} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
                  {phone2Display}
                </a>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg cursor-pointer transition-all"
            >
              Вернуться на сайт
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 text-xs">
            
            {/* 1. Контакты (Главный фокус) */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 block pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Контакты заказчика:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Номер телефона */}
                <div className="sm:col-span-2">
                  <label className="text-amber-700 dark:text-amber-400 font-bold block mb-1">
                    Номер телефона для связи (Обязательно)*:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-amber-500 focus:border-amber-400 rounded-xl p-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none font-mono font-bold text-sm shadow-inner transition-colors"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Контактное лицо (Имя / ФИО)*:</label>
                  <input
                    type="text"
                    required
                    placeholder="Иван Иванович"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Организация / ИП:</label>
                  <input
                    type="text"
                    placeholder="ООО «ПромСтрой» или ИП"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Email для счёта / договора:</label>
                  <input
                    type="email"
                    placeholder="snab@company.ru"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Логистика: Область и Место назначения */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 block pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Логистика: Область и место назначения:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Область / Регион доставки:</label>
                  <select
                    value={regionName}
                    onChange={(e) => setRegionName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-950 dark:text-white font-medium focus:border-amber-500 focus:outline-none transition-colors"
                  >
                    {REGIONS_LIST.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                    <option value="Другой регион Сибири / ДВ">Другой регион Сибири / ДВ</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Место назначения (город / адрес)*:</label>
                  <input
                    type="text"
                    required
                    placeholder="г. Иркутск, ул. Трактовая 18 / Карьер №3"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 3. Объём в кубах (м³) и сорт топлива */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 block pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">3</span>
                <span>Объём партии и сорт топлива:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors">
                
                {/* Объём в кубах */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-800 dark:text-slate-300 font-bold">Объём в кубах (м³):</label>
                    <div className="flex rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-0.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSelectedUnit('m3')}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${selectedUnit === 'm3' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        м³ (Кубы)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUnit('liters')}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${selectedUnit === 'liters' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        Литры
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUnit('tons')}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${selectedUnit === 'tons' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        Тонны
                      </button>
                    </div>
                  </div>

                  <input
                    type="number"
                    value={volumeInput}
                    onChange={(e) => setVolumeInput(Number(e.target.value))}
                    min="1"
                    step={selectedUnit === 'tons' ? '0.1' : '1'}
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-950 dark:text-white font-mono text-base font-bold focus:border-amber-500 focus:outline-none transition-colors"
                  />
                  
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                    ≈ {volumeInM3.toFixed(2)} м³ = {Math.round(volumeInLiters).toLocaleString('ru-RU')} л ({volumeInTons.toFixed(2)} т)
                  </div>
                </div>

                {/* Сорт топлива */}
                <div>
                  <label className="text-slate-800 dark:text-slate-300 font-semibold block mb-1">Сорт дизельного топлива:</label>
                  <select
                    value={fuelId}
                    onChange={(e) => setFuelId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-950 dark:text-white font-medium focus:border-amber-500 focus:outline-none transition-colors"
                  >
                    {DIESEL_FUEL_PRODUCTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.shortName} ({f.minTemp || 'Евро-5'})
                      </option>
                    ))}
                  </select>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                    ГОСТ 32511-2013 • Паспорт качества
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Оплата и насос */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 block pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">4</span>
                <span>Форма безналичного расчёта:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('cashless_vat')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    paymentType === 'cashless_vat'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="font-bold text-slate-950 dark:text-white">Безнал с НДС (20%)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Полный пакет документов</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('cashless_no_vat')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    paymentType === 'cashless_no_vat'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="font-bold text-slate-950 dark:text-white">Безнал без НДС</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">УСН / ИП</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('consultation')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    paymentType === 'consultation'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="font-bold text-slate-950 dark:text-white">Уточнить по телефону</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Индивидуальные условия</div>
                </button>
              </div>

              {/* Pump Checkbox */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={needHosePump}
                  onChange={(e) => setNeedHosePump(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <span>Требуется сливной насос и длинный рукав (до 40 метров)</span>
              </label>

              {/* Комментарий */}
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Комментарий / пожелания к наливу:</label>
                <textarea
                  rows={2}
                  placeholder="Дополнительные сведения (время приемки, пропуск)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Отправка заявки...' : 'Отправить заявку на отгрузку'}</span>
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2">
                ООО «СНК» гарантирует конфиденциальность. Дежурный диспетчер ответит в течение 5 минут.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
