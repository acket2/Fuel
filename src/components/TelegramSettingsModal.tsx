import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  CheckCircle2, 
  Smartphone, 
  HelpCircle, 
  ExternalLink, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { getTelegramConfig, saveTelegramConfig, TelegramConfig, sendLeadToTelegram } from '../utils/telegramNotify';
import { OrderLeadData } from '../types';

interface TelegramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramSettingsModal: React.FC<TelegramSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [config, setConfig] = useState<TelegramConfig>({
    botToken: '',
    chatId: '',
    isEnabled: false
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const current = getTelegramConfig();
      setConfig(current);
      setTestStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...config,
      isEnabled: Boolean(config.botToken && config.chatId)
    };
    saveTelegramConfig(updated);
    setStatusMessage('Настройки успешно сохранены!');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleTestNotification = async () => {
    if (!config.botToken || !config.chatId) {
      setTestStatus('error');
      setStatusMessage('Пожалуйста, укажите Token бота и ваш Chat ID');
      return;
    }

    setTestStatus('testing');
    setStatusMessage('Отправка тестового сообщения в ваш Telegram...');

    const dummyLead: OrderLeadData = {
      id: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toLocaleString('ru-RU'),
      phone: '+7 (904) 148-00-38',
      regionName: 'Иркутская область',
      destination: 'г. Иркутск, База снабжения №1',
      volumeM3: 15,
      volumeLiters: 15000,
      volumeTons: 12.6,
      selectedUnit: 'm3',
      fuelName: 'ДТ Зимнее Евро-5 (до -32°C)',
      fullName: 'Тестовый Заказчик (Иван)',
      companyName: 'ООО «Байкал-Строй»',
      email: 'snab@company.ru',
      paymentType: 'cashless_vat',
      needHosePump: true,
      comment: 'Тестовая проверка мгновенного оповещения с сайта'
    };

    const res = await sendLeadToTelegram(dummyLead, {
      botToken: config.botToken,
      chatId: config.chatId,
      isEnabled: true
    });

    if (res.success) {
      setTestStatus('success');
      setStatusMessage('Уведомление пришло в ваш Telegram! Проверьте телефон.');
      saveTelegramConfig({
        ...config,
        isEnabled: true
      });
    } else {
      setTestStatus('error');
      setStatusMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Мгновенные уведомления в Telegram
              </h3>
              <p className="text-xs text-slate-400">
                Заявки с сайта приходят прямо на ваш телефон за 1 секунду
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
          
          {/* Quick 3-Step Guide */}
          <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-800/40 text-slate-300 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-sky-400 text-xs">
              <Smartphone className="w-4 h-4" />
              <span>Как настроить получение за 2 минуты (бесплатно):</span>
            </div>
            
            <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed text-[11px]">
              <li>
                Откройте в Telegram бота <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-400 underline font-bold inline-flex items-center gap-0.5">@BotFather <ExternalLink className="w-2.5 h-2.5" /></a> и отправьте команду <code>/newbot</code>.
              </li>
              <li>
                Придумайте имя бота и скопируйте полученный <b>HTTP API Token</b> в поле ниже.
              </li>
              <li>
                Нажмите <b>/start</b> в вашем созданном боте, а чтобы узнать свой <b>Chat ID</b>, напишите боту <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-sky-400 underline font-bold inline-flex items-center gap-0.5">@userinfobot <ExternalLink className="w-2.5 h-2.5" /></a> (он сразу покажет ваш Id).
              </li>
            </ol>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Токен бота (Bot Token из @BotFather):
              </label>
              <input
                type="text"
                placeholder="Например: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                value={config.botToken}
                onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Ваш Chat ID или ID группы (из @userinfobot):
              </label>
              <input
                type="text"
                placeholder="Например: 987654321 или -100123456789 (для чата с логистами)"
                value={config.chatId}
                onChange={(e) => setConfig({ ...config, chatId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none font-mono text-xs"
              />
            </div>
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${
              testStatus === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : testStatus === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
            }`}>
              {testStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
              )}
              <span className="text-xs">{statusMessage}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleTestNotification}
              disabled={testStatus === 'testing'}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testStatus === 'testing' ? 'Отправляем...' : 'Отправить тест на телефон'}</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
            >
              Сохранить и включить
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center">
            🔒 Токен хранится безопасно в вашем браузере. Данные заявок отправляются напрямую по защищенному протоколу Telegram API.
          </p>

        </form>

      </div>
    </div>
  );
};
