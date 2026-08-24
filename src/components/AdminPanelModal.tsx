import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  BellRing, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check, 
  PhoneCall, 
  MapPin, 
  Truck, 
  Layers, 
  Calendar, 
  Key, 
  UserCheck, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Download
} from 'lucide-react';
import { OrderLeadData, OrderStatus } from '../types';
import { 
  getSavedLeads, 
  updateOrderStatus, 
  deleteOrder, 
  clearAllOrders, 
  getTelegramConfig, 
  saveTelegramConfig, 
  getEmailConfig, 
  saveEmailConfig, 
  getAdminAuthConfig, 
  saveAdminAuthConfig, 
  isAdminLoggedIn, 
  setAdminLoginSession, 
  verifyAdminPassword, 
  registerOrUpdateAdmin, 
  sendLeadToTelegram, 
  TelegramConfig, 
  EmailConfig 
} from '../utils/telegramNotify';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrdersUpdated?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onOrdersUpdated
}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loginInput, setLoginInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // New admin password fields (for registration/change)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Admin Navigation Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'telegram' | 'email' | 'security'>('orders');

  // Orders State
  const [orders, setOrders] = useState<OrderLeadData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderLeadData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Telegram & Email Settings Form
  const [tgBotToken, setTgBotToken] = useState('');
  const [tgChatId, setTgChatId] = useState('');
  const [tgEnabled, setTgEnabled] = useState(true);
  const [tgTestStatus, setTgTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isTestingTg, setIsTestingTg] = useState(false);

  const [adminEmail, setAdminEmail] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailTestStatus, setEmailTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Load initial data on open
  useEffect(() => {
    if (isOpen) {
      const logged = isAdminLoggedIn();
      setIsAuth(logged);
      
      const authConfig = getAdminAuthConfig();
      if (!authConfig.isRegistered) {
        setIsRegisterMode(true);
      }

      refreshOrders();
      loadSettings();
    }
  }, [isOpen]);

  const refreshOrders = () => {
    const list = getSavedLeads();
    setOrders(list);
    onOrdersUpdated?.();
  };

  const loadSettings = () => {
    const tg = getTelegramConfig();
    setTgBotToken(tg.botToken);
    setTgChatId(tg.chatId);
    setTgEnabled(tg.isEnabled);

    const em = getEmailConfig();
    setAdminEmail(em.adminEmail);
    setEmailEnabled(em.isEnabled);
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (verifyAdminPassword(passwordInput)) {
      setAdminLoginSession(true);
      setIsAuth(true);
      setPasswordInput('');
      refreshOrders();
    } else {
      setAuthError('Неверный пароль администратора. Попробуйте снова.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setRegSuccessMsg('');

    if (!newPassword || newPassword.length < 4) {
      setAuthError('Пароль должен быть не менее 4 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAuthError('Пароли не совпадают');
      return;
    }

    registerOrUpdateAdmin(loginInput || 'admin', newPassword);
    setIsAuth(true);
    setIsRegisterMode(false);
    setRegSuccessMsg('Пароль администратора успешно сохранён!');
    refreshOrders();
  };

  const handleLogout = () => {
    setAdminLoginSession(false);
    setIsAuth(false);
    setPasswordInput('');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    onOrdersUpdated?.();
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Удалить заявку № ${orderId}?`)) {
      const updated = deleteOrder(orderId);
      setOrders(updated);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      onOrdersUpdated?.();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю заявок? Это действие необратимо.')) {
      clearAllOrders();
      setOrders([]);
      setSelectedOrder(null);
      onOrdersUpdated?.();
    }
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    const config: TelegramConfig = {
      botToken: tgBotToken.trim(),
      chatId: tgChatId.trim(),
      isEnabled: tgEnabled
    };
    saveTelegramConfig(config);
    setSaveSuccessMsg('Настройки Telegram успешно сохранены!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleTestTelegram = async () => {
    setIsTestingTg(true);
    setTgTestStatus(null);
    const testLead: OrderLeadData = {
      id: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toLocaleString('ru-RU'),
      phone: '+7 (904) 148-00-38',
      regionName: 'Иркутская область',
      destination: 'г. Иркутск (Тестовая проверка связи)',
      volumeM3: 15,
      volumeLiters: 15000,
      volumeTons: 12.6,
      selectedUnit: 'm3',
      fuelName: 'ДТ ЕВРО-5 (Тестовое уведомление)',
      fullName: 'Администратор СНК',
      companyName: 'ООО «СНК»',
      email: adminEmail || 'test@snk-oil.ru',
      paymentType: 'cashless_vat',
      needHosePump: true,
      comment: 'Проверка работы Telegram бота и мгновенных оповещений.'
    };

    const res = await sendLeadToTelegram(testLead, {
      botToken: tgBotToken.trim(),
      chatId: tgChatId.trim(),
      isEnabled: true
    });

    setIsTestingTg(false);
    setTgTestStatus(res);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const config: EmailConfig = {
      adminEmail: adminEmail.trim(),
      isEnabled: emailEnabled
    };
    saveEmailConfig(config);
    setSaveSuccessMsg('Настройки Email успешно сохранены!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleTestEmail = () => {
    if (!adminEmail.trim()) {
      setEmailTestStatus({ success: false, message: 'Укажите email адрес' });
      return;
    }
    setEmailTestStatus({
      success: true,
      message: `Уведомления будут дублироваться на ${adminEmail.trim()}`
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Номер заказа', 'Дата', 'Телефон', 'Имя', 'Компания', 'Email', 'Регион', 'Пункт назначения', 'Объем (м3)', 'Объем (л)', 'Сорт ДТ', 'Оплата', 'Насос', 'Статус', 'Комментарий'];
    const rows = orders.map(o => [
      o.id,
      `"${o.createdAt}"`,
      `"${o.phone}"`,
      `"${o.fullName || ''}"`,
      `"${o.companyName || ''}"`,
      `"${o.email || ''}"`,
      `"${o.regionName}"`,
      `"${o.destination}"`,
      o.volumeM3,
      o.volumeLiters,
      `"${o.fuelName}"`,
      `"${o.paymentType}"`,
      o.needHosePump ? 'Да' : 'Нет',
      `"${o.status || 'new'}"`,
      `"${(o.comment || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SNK_Заявки_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.fullName && o.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.companyName && o.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || (o.status || 'new') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusBadges: Record<OrderStatus, { label: string; color: string }> = {
    new: { label: 'Новая заявка', color: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40' },
    processing: { label: 'В обработке логистом', color: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40' },
    shipped: { label: 'Бензовоз на маршруте', color: 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/40' },
    completed: { label: 'Топливо слито (Выполнено)', color: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/40' },
    cancelled: { label: 'Отменено', color: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 transition-colors flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
                  Панель администратора ООО «СНК»
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-[10px] font-bold font-mono">
                  Спец-доступ
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Управление входящими заявками, Telegram-ботом и почтовыми оповещениями
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuth && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Выйти из аккаунта администратора"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unauthenticated View: Login / Register Form */}
        {!isAuth ? (
          <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Key className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-slate-950 dark:text-white">
                  {isRegisterMode ? 'Регистрация учётной записи администратора' : 'Вход в диспетчерскую панель'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isRegisterMode 
                    ? 'Задайте логин и пароль администратора. Вход предусмотрен только для 1 владельца/диспетчера (клиентам регистрироваться не нужно).'
                    : 'Введите пароль администратора для просмотра всех номеров заказов и настройки бота.'}
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {regSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{regSuccessMsg}</span>
                </div>
              )}

              {isRegisterMode ? (
                /* Registration Form */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Логин администратора:
                    </label>
                    <input
                      type="text"
                      required
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Новый пароль:
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Придумайте пароль (от 4 символов)"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Повторите пароль:
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Повторите пароль"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    Зарегистрировать аккаунт админа
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold"
                    >
                      Уже есть пароль? Войти
                    </button>
                  </div>
                </form>
              ) : (
                /* Login Form */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Пароль администратора:
                    </label>
                    <input
                      type="password"
                      autoFocus
                      required
                      placeholder="Введите пароль..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl p-3.5 text-slate-950 dark:text-white text-sm font-mono focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    Войти в систему
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2 text-slate-500 dark:text-slate-400">
                    <span>По умолчанию: пароль <code>admin</code></span>
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(true)}
                      className="text-amber-700 dark:text-amber-400 hover:underline font-semibold"
                    >
                      Сменить/задать пароль
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Admin Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 pt-2 gap-2 text-xs shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`py-2.5 px-4 rounded-t-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-t-2 border-t-amber-500 border-x border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Журнал заявок ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('telegram')}
                className={`py-2.5 px-4 rounded-t-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'telegram'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-t-2 border-t-amber-500 border-x border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Send className="w-4 h-4 text-sky-500" />
                <span>Настройка Telegram-бота</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`py-2.5 px-4 rounded-t-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'email'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-t-2 border-t-amber-500 border-x border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>Дублирование на Email</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`py-2.5 px-4 rounded-t-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-t-2 border-t-amber-500 border-x border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Key className="w-4 h-4 text-amber-500" />
                <span>Пароль администратора</span>
              </button>
            </div>

            {/* Notification alert toast if any */}
            {saveSuccessMsg && (
              <div className="bg-emerald-500/15 border-b border-emerald-500/30 p-2.5 text-center text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Tab Contents */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              
              {/* TAB 1: ORDERS JOURNAL & DETAILED SPECS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  
                  {/* Top Bar: Search, Filters & Export */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    
                    {/* Search Field */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Поиск по номеру заказа, телефону, имени, городу..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Filter by Status */}
                    <div className="flex items-center gap-2">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                      >
                        <option value="all">Все статусы ({orders.length})</option>
                        <option value="new">Новые</option>
                        <option value="processing">В обработке</option>
                        <option value="shipped">На маршруте</option>
                        <option value="completed">Выполнены</option>
                        <option value="cancelled">Отменены</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleExportCSV}
                        disabled={orders.length === 0}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                        title="Экспортировать заявки в Excel/CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={refreshOrders}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Обновить список"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      {orders.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                          title="Очистить все заявки"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Orders List / Empty State */}
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {searchQuery || statusFilter !== 'all' ? 'Заявки по вашему фильтру не найдены' : 'Пока нет входящих заявок'}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Как только клиент отправит заявку на сайте через форму или калькулятор, она мгновенно отобразится здесь и будет отправлена в ваш Telegram.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* Left: Orders Table List (5 cols) */}
                      <div className="lg:col-span-5 space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
                        {filteredOrders.map((ord) => {
                          const isSelected = selectedOrder?.id === ord.id;
                          const badge = statusBadges[ord.status || 'new'];
                          return (
                            <div
                              key={ord.id}
                              onClick={() => setSelectedOrder(ord)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                                isSelected
                                  ? 'bg-amber-500/15 border-amber-500 dark:border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                                  : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-xs text-amber-700 dark:text-amber-400">
                                    № {ord.id}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {ord.createdAt}
                                  </span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                                  {badge.label}
                                </span>
                              </div>

                              <div className="text-xs font-bold text-slate-950 dark:text-white flex items-center justify-between">
                                <span className="font-mono text-slate-900 dark:text-amber-300">{ord.phone}</span>
                                <span className="font-mono text-amber-600 dark:text-amber-400">{ord.volumeM3} м³</span>
                              </div>

                              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between truncate">
                                <span className="truncate">{ord.fullName || ord.companyName || 'Частный заказ'}</span>
                                <span className="text-slate-500 truncate ml-2">{ord.destination}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right: Full Order Card Details (7 cols) */}
                      <div className="lg:col-span-7">
                        {selectedOrder ? (
                          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                            
                            {/* Order Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Карточка заказа:
                                  </span>
                                  <span className="font-mono font-black text-base text-amber-600 dark:text-amber-400">
                                    № {selectedOrder.id}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                  Поступил: {selectedOrder.createdAt}
                                </span>
                              </div>

                              {/* Status Selector */}
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-slate-500 font-semibold">Статус:</label>
                                <select
                                  value={selectedOrder.status || 'new'}
                                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none cursor-pointer"
                                >
                                  <option value="new">🟢 Новая заявка</option>
                                  <option value="processing">🟡 В обработке</option>
                                  <option value="shipped">🚚 Назначен бензовоз</option>
                                  <option value="completed">✅ Топливо слито (Выполнено)</option>
                                  <option value="cancelled">❌ Отменено</option>
                                </select>
                              </div>
                            </div>

                            {/* Full Detailed Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              
                              {/* Phone */}
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Номер телефона:</span>
                                <div className="flex items-center justify-between mt-1">
                                  <a href={`tel:${selectedOrder.phone}`} className="font-mono font-black text-sm text-amber-600 dark:text-amber-400 hover:underline">
                                    {selectedOrder.phone}
                                  </a>
                                  <button
                                    onClick={() => handleCopy(selectedOrder.phone, 'phone')}
                                    className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    title="Скопировать телефон"
                                  >
                                    {copiedId === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* Volume */}
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Объём партии:</span>
                                <div className="font-mono font-black text-sm text-slate-900 dark:text-white mt-1">
                                  {selectedOrder.volumeM3} м³ <span className="text-xs font-normal text-slate-500">(~{selectedOrder.volumeLiters.toLocaleString('ru-RU')} л / ~{selectedOrder.volumeTons} т)</span>
                                </div>
                              </div>

                              {/* Client Name */}
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Контактное лицо:</span>
                                <div className="font-bold text-slate-900 dark:text-white mt-1">
                                  {selectedOrder.fullName || 'Не указано'}
                                </div>
                              </div>

                              {/* Company */}
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Организация / ИП:</span>
                                <div className="font-bold text-slate-900 dark:text-white mt-1">
                                  {selectedOrder.companyName || 'Частное лицо'}
                                </div>
                              </div>

                              {/* Email */}
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Email для счёта:</span>
                                <div className="text-slate-900 dark:text-white mt-1 font-mono">
                                  {selectedOrder.email || 'Не указан'}
                                </div>
                              </div>

                              {/* Fuel Grade */}
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Сорт дизельного топлива:</span>
                                <div className="font-bold text-amber-700 dark:text-amber-400 mt-1">
                                  {selectedOrder.fuelName}
                                </div>
                              </div>

                              {/* Destination Address */}
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:col-span-2">
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Регион и Пункт доставки:</span>
                                <div className="font-bold text-slate-900 dark:text-white mt-1">
                                  {selectedOrder.regionName} • {selectedOrder.destination}
                                </div>
                              </div>

                              {/* Payment & Pump */}
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:col-span-2 flex flex-wrap justify-between gap-2">
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Форма оплаты:</span>
                                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                                    {selectedOrder.paymentType === 'cashless_vat' ? 'Безналичный расчёт с НДС (20%)' : selectedOrder.paymentType === 'cashless_no_vat' ? 'Безналичный расчёт без НДС (УСН)' : 'По согласованию с логистом'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Сливной насос и шланг:</span>
                                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                                    {selectedOrder.needHosePump ? '✅ Требуется (до 40м)' : '❌ Не требуется'}
                                  </span>
                                </div>
                              </div>

                              {/* Comment */}
                              {selectedOrder.comment && (
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 sm:col-span-2">
                                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block uppercase">
                                    Комментарий заказчика к наливу:
                                  </span>
                                  <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                                    {selectedOrder.comment}
                                  </p>
                                </div>
                              )}

                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                              <a
                                href={`tel:${selectedOrder.phone}`}
                                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Позвонить клиенту</span>
                              </a>

                              <button
                                onClick={() => handleDeleteOrder(selectedOrder.id)}
                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                                title="Удалить эту заявку"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Удалить заявку</span>
                              </button>
                            </div>

                          </div>
                        ) : (
                          <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                            Выберите любую заявку слева для просмотра всех деталей и управления статусом.
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: TELEGRAM BOT INTEGRATION SETTINGS */}
              {activeTab === 'telegram' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sky-800 dark:text-sky-300 text-sm">
                      <Send className="w-4 h-4 text-sky-500" />
                      <span>Мгновенные уведомления о заявках в Telegram</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      При каждой новой заявке на сайте вам в Telegram моментально придёт сообщение с номером заказа, номером телефона клиента, объёмом в кубах/тоннах и адресом доставки.
                    </p>
                  </div>

                  <form onSubmit={handleSaveTelegram} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                        1. Telegram Bot Token:
                      </label>
                      <input
                        type="text"
                        placeholder="Например: 7123456789:AAFxxx... (создаётся в @BotFather)"
                        value={tgBotToken}
                        onChange={(e) => setTgBotToken(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Откройте <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 underline font-semibold">@BotFather</a> в Telegram и отправьте команду <code>/newbot</code>
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                        2. Ваш Telegram Chat ID (или ID группы):
                      </label>
                      <input
                        type="text"
                        placeholder="Например: 123456789 или -1001234567890"
                        value={tgChatId}
                        onChange={(e) => setTgChatId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Узнать свой Chat ID можно у бота <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 underline font-semibold">@userinfobot</a> (нажмите Start). Обязательно нажмите Start и вашему новому боту!
                      </span>
                    </div>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tgEnabled}
                        onChange={(e) => setTgEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Включить автоматическую отправку уведомлений в Telegram
                      </span>
                    </label>

                    {tgTestStatus && (
                      <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                        tgTestStatus.success 
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
                          : 'bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-300'
                      }`}>
                        {tgTestStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{tgTestStatus.message}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer transition-all"
                      >
                        Сохранить настройки Telegram
                      </button>

                      <button
                        type="button"
                        onClick={handleTestTelegram}
                        disabled={isTestingTg || !tgBotToken || !tgChatId}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isTestingTg ? 'Отправка теста...' : 'Тестовое уведомление'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: EMAIL NOTIFICATION SETTINGS */}
              {activeTab === 'email' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span>Дублирование заявок на ваш Email</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Укажите ваш рабочий или личный почтовый ящик. Все заявки будут автоматически дублироваться на этот адрес с полной спецификацией и контактами клиента.
                    </p>
                  </div>

                  <form onSubmit={handleSaveEmail} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Адрес электронной почты для приёма заявок:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="snab@snk-oil.ru или ваша личная почта"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailEnabled}
                        onChange={(e) => setEmailEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Включить дублирование уведомлений на указанный Email
                      </span>
                    </label>

                    {emailTestStatus && (
                      <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                        emailTestStatus.success 
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
                          : 'bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-300'
                      }`}>
                        {emailTestStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{emailTestStatus.message}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer transition-all"
                      >
                        Сохранить настройки Email
                      </button>

                      <button
                        type="button"
                        onClick={handleTestEmail}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Проверить почту</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: ADMIN SECURITY & PASSWORD CHANGE */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 text-sm">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span>Безопасность единственного аккаунта администратора</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Управление доступом к диспетчерской панели. Здесь вы можете изменить свой пароль в любой момент.
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Логин администратора:
                      </label>
                      <input
                        type="text"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Новый пароль администратора:
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Подтверждение нового пароля:
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Повторите новый пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-950 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                    >
                      Сохранить новый пароль
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
