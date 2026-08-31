import React, { useState } from 'react';
import { 
  Fuel, 
  PhoneCall, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Building2, 
  User, 
  Mail, 
  Layers, 
  Clock, 
  AlertCircle,
  BellRing,
  RotateCcw
} from 'lucide-react';
import { FuelProduct, DeliveryLocation, VolumeUnit, OrderLeadData } from '../types';
import { DIESEL_FUEL_PRODUCTS } from '../data/fuelData';
import { REGIONS_LIST, DELIVERY_LOCATIONS } from '../data/regionsData';
import { processNewLead, getTelegramConfig, getEmailConfig } from '../utils/telegramNotify';

interface OrderSectionProps {
  onOpenTelegramSettings: () => void;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  onOpenTelegramSettings
}) => {
  // Required Fields in optimal order
  const [phone, setPhone] = useState('');
  const [regionName, setRegionName] = useState(REGIONS_LIST[0].name);
  const [destination, setDestination] = useState('');
  const [volumeInput, setVolumeInput] = useState<number>(10); // default 10 m³
  const [selectedUnit, setSelectedUnit] = useState<VolumeUnit>('m3');
  const [fuelId, setFuelId] = useState(DIESEL_FUEL_PRODUCTS[0].id);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentType, setPaymentType] = useState<'cashless_vat' | 'cashless_no_vat' | 'consultation'>('cashless_vat');
  const [comment, setComment] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState<OrderLeadData | null>(null);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState('');

  const selectedFuel = DIESEL_FUEL_PRODUCTS.find(f => f.id === fuelId) || DIESEL_FUEL_PRODUCTS[0];

  // Live conversion calculations
  let volumeInM3 = 10;
  let volumeInLiters = 10000;
  let volumeInTons = 8.4;

  if (selectedUnit === 'm3') {
    volumeInM3 = Number(volumeInput) || 0;
    volumeInLiters = volumeInM3 * 1000;
    volumeInTons = (volumeInLiters * selectedFuel.density) / 1000;
  } else if (selectedUnit === 'liters') {
    volumeInLiters = Number(volumeInput) || 0;
    volumeInM3 = volumeInLiters / 1000;
    volumeInTons = (volumeInLiters * selectedFuel.density) / 1000;
  } else {
    // tons
    volumeInTons = Number(volumeInput) || 0;
    volumeInLiters = selectedFuel.density > 0 ? (volumeInTons * 1000) / selectedFuel.density : volumeInTons * 1190;
    volumeInM3 = volumeInLiters / 1000;
  }

  const phone1 = '89041480038';
  const phone1Display = '8 (904) 148-00-38';
  const phone2 = '89834149769';
  const phone2Display = '8 (983) 414-97-69';
  const inn = '3801146254';

  const tgConfig = getTelegramConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsSubmitting(true);

    const lead: OrderLeadData = {
      id: 'SNK-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toLocaleString('ru-RU'),
      phone: phone.trim(),
      regionName: regionName,
      destination: destination.trim() || 'По согласованию с диспетчером',
      volumeM3: Number(volumeInM3.toFixed(2)),
      volumeLiters: Math.round(volumeInLiters),
      volumeTons: Number(volumeInTons.toFixed(2)),
      selectedUnit: selectedUnit,
      fuelName: `${selectedFuel.shortName} (${selectedFuel.gost})`,
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      paymentType: paymentType,
      comment: comment.trim()
    };

    setLastSubmittedLead(lead);

    // Process lead: saves locally for Admin, sends to Telegram, sends to Email
    const result = await processNewLead(lead);
    
    let statusMsg = '';
    if (result.telegramResult?.message) {
      statusMsg = result.telegramResult.message;
    }
    if (result.emailResult?.message) {
      statusMsg += ` • ${result.emailResult.message}`;
    }
    setTelegramStatusMsg(statusMsg || 'Заявка передана в диспетчерскую службу');

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setLastSubmittedLead(null);
    setComment('');
  };

  return (
    <section id="order" className="py-16 sm:py-24 bg-slate-100/70 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden border-t border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Send className="w-3.5 h-3.5" />
            <span>Официальная диспетчерская служба ООО «СНК»</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
            Оформить заявку на поставку топлива
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Заполните параметры партии — дежурный логист свяжется с вами в течение 5 минут для согласования точного графика налива и маршрута бензовоза.
          </p>

          {/* Direct Phone & Telegram Alerts Pill */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              onClick={onOpenTelegramSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-800 dark:text-sky-300 border border-sky-500/30 transition-all font-medium cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>
                {tgConfig.isEnabled ? '⚡ Telegram-уведомления диспетчеру подключены' : '🔔 Настроить Telegram-бота и Email для диспетчера'}
              </span>
            </button>

            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>

            <div className="text-slate-600 dark:text-slate-400">
              Срочный налив: <a href={`tel:${phone1}`} className="text-amber-600 dark:text-amber-400 font-bold hover:underline font-mono">{phone1Display}</a>
            </div>
          </div>
        </div>

        {/* Main Order Form Card */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors">
          
          {isSuccess && lastSubmittedLead ? (
            /* Success View */
            <div className="text-center py-8 space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-3">
                <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-900 dark:text-amber-300 text-sm font-mono font-black uppercase tracking-wider">
                  НОМЕР ВАШЕГО ЗАКАЗА: {lastSubmittedLead.id}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                  Спасибо за заявку! В скором времени с вами свяжутся.
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ваша заявка принята в работу дежурной сменой ООО «СНК». Номер заказа <strong className="font-mono text-amber-600 dark:text-amber-400 font-bold">{lastSubmittedLead.id}</strong> присвоен вашей партии. Дежурный логист уже готовит расчёт и свяжется с вами по номеру <strong className="font-mono text-slate-950 dark:text-white">{lastSubmittedLead.phone}</strong>.
                </p>
              </div>

              {/* Status Message from Telegram */}
              {telegramStatusMsg && (
                <div className="p-3.5 rounded-2xl bg-sky-100 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800/50 text-xs text-sky-900 dark:text-sky-200 flex items-center justify-center gap-2">
                  <BellRing className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>{telegramStatusMsg}</span>
                </div>
              )}

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2.5">
                <div className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between">
                  <span>Параметры зарегистрированной заявки:</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{lastSubmittedLead.createdAt}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div><strong>Телефон:</strong> <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{lastSubmittedLead.phone}</span></div>
                  <div><strong>Регион:</strong> {lastSubmittedLead.regionName}</div>
                  <div><strong>Место назначения:</strong> {lastSubmittedLead.destination}</div>
                  <div><strong>Объём:</strong> <span className="font-mono font-bold text-slate-950 dark:text-white">{lastSubmittedLead.volumeM3} м³</span> ({lastSubmittedLead.volumeTons} т)</div>
                  <div><strong>Сорт ДТ:</strong> {lastSubmittedLead.fuelName}</div>
                  <div><strong>Организация:</strong> {lastSubmittedLead.companyName || 'Не указана'}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Отправить ещё одну заявку</span>
                </button>

                <a
                  href={`tel:${phone1}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Позвонить дежурному логисту</span>
                </a>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* 1. БЛОК: СВЯЗЬ И КОНТАКТЫ (Первостепенно) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    Контактные данные контрагента
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Номер телефона (Критически важный фокус) */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Номер телефона для связи (Обязательно)*:</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-amber-500 focus:border-amber-400 rounded-xl px-4 py-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all shadow-inner"
                    />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                      Логист перезвонит для подтверждения налива
                    </span>
                  </div>

                  {/* Имя контактного лица */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ваше Имя / Контакт*:</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Иван Иванович"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none transition-all"
                    />
                  </div>

                  {/* Организация / ИП */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Организация / ИП:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ООО «СибСтрой» или ИП"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none transition-all"
                    />
                  </div>

                  {/* Email для счёта/договора */}
                  <div className="lg:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Электронная почта (Email) для счёта и спецификации:</span>
                    </label>
                    <input
                      type="email"
                      placeholder="snab@company.ru (на этот адрес вышлем договор и расчёт)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none transition-all"
                    />
                  </div>

                </div>
              </div>

              {/* 2. БЛОК: РЕГИОН И МЕСТО НАЗНАЧЕНИЯ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    Логистика: Область и Место назначения
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Область / Регион */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Область / Субъект РФ*:</span>
                    </label>
                    <select
                      value={regionName}
                      onChange={(e) => setRegionName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl p-3 text-slate-950 dark:text-white font-medium text-xs focus:outline-none transition-all cursor-pointer"
                    >
                      {REGIONS_LIST.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name} ({r.depotHubs.join(', ')})
                        </option>
                      ))}
                      <option value="Другой регион Сибири / ДВ">Другой регион Сибири / Дальнего Востока</option>
                    </select>
                  </div>

                  {/* Место назначения / Адрес объекта */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Место назначения (город, посёлок, карьер, координаты)*:</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Например: г. Иркутск, база на Трактовой / Карьер уч. 2"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl p-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none transition-all"
                    />
                  </div>

                </div>
              </div>

              {/* 3. БЛОК: ОБЪЁМ В КУБАХ (м³) И СОРТ ТОПЛИВА */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    Объём в кубах (м³) и сорт дизельного топлива
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  
                  {/* Объём с выбором м³ / литры / тонны */}
                  <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Требуемый объём партии:</span>
                      </label>

                      {/* Единица измерения (Кубы / Литры / Тонны) */}
                      <div className="flex rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedUnit('m3')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            selectedUnit === 'm3'
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          м³ (Кубы)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedUnit('liters')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            selectedUnit === 'liters'
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          Литры
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedUnit('tons')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            selectedUnit === 'tons'
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          Тонны
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        step={selectedUnit === 'tons' ? '0.1' : '1'}
                        value={volumeInput}
                        onChange={(e) => setVolumeInput(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-950 dark:text-white font-mono text-xl font-bold focus:outline-none transition-all"
                      />
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-base whitespace-nowrap">
                        {selectedUnit === 'm3' ? 'м³ (куб.)' : selectedUnit === 'liters' ? 'литров' : 'тонн'}
                      </span>
                    </div>

                    {/* Живой конвертер величин */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center font-mono text-[11px]">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">В кубах (м³):</span>
                        <strong className="text-amber-600 dark:text-amber-400 font-bold text-xs">{volumeInM3.toFixed(2)} м³</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">В литрах:</span>
                        <strong className="text-slate-950 dark:text-white font-bold text-xs">{Math.round(volumeInLiters).toLocaleString('ru-RU')} л</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">В тоннах:</span>
                        <strong className="text-slate-950 dark:text-white font-bold text-xs">{volumeInTons.toFixed(2)} т</strong>
                      </div>
                    </div>
                  </div>

                  {/* Сорт дизельного топлива */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2 flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Сорт дизельного топлива:</span>
                      </label>

                      <div className="space-y-1.5">
                        {DIESEL_FUEL_PRODUCTS.map((f) => (
                          <label
                            key={f.id}
                            className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                              fuelId === f.id
                                ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300 font-bold'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="fuelRadio"
                                checked={fuelId === f.id}
                                onChange={() => setFuelId(f.id)}
                                className="text-amber-500 focus:ring-amber-500"
                              />
                              <span>{f.shortName}</span>
                            </div>
                            <span className="text-[10px] font-mono opacity-80">{f.minTemp || 'Евро-5'}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Паспорт качества и арбитражная проба</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* 4. БЛОК: ОПЛАТА, ОБОРУДОВАНИЕ И КОММЕНТАРИЙ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    Форма безналичного расчёта и доп. условия
                  </h3>
                </div>

                {/* Выбор формы безнала */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentType('cashless_vat')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentType === 'cashless_vat'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300 shadow-md ring-1 ring-amber-500/50 font-medium'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-slate-950 dark:text-white text-xs">Безналичный расчёт с НДС 20%</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Полный пакет закрывающих документов (УПД, ТТН)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('cashless_no_vat')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentType === 'cashless_no_vat'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300 shadow-md ring-1 ring-amber-500/50 font-medium'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-slate-950 dark:text-white text-xs">Безналичный расчёт без НДС</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Для предприятий на УСН и индивидуальных предпринимателей</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('consultation')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentType === 'consultation'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300 shadow-md ring-1 ring-amber-500/50 font-medium'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-slate-950 dark:text-white text-xs">Уточнить по телефону</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Индивидуальный график платежей / отсрочка</div>
                  </button>
                </div>

                {/* Комментарий */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Дополнительные пожелания к поставке (время слива, пропускной режим, номер секции):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Например: слив возможен после 18:00, нужен пропуск на въезд через КПП"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl p-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs focus:outline-none transition-all"
                  />
                </div>

              </div>

              {/* Action Submit Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base shadow-xl active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-5 h-5 stroke-[2.5]" />
                  <span>
                    {isSubmitting ? 'Регистрация и отправка...' : 'Отправить заявку дежурному логисту'}
                  </span>
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>ООО «СНК» гарантирует конфиденциальность и обработку по ГОСТ</span>
                  </div>
                  <div>
                    ИНН: <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{inn}</span>
                  </div>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
