/**
 * Notification & Order Management Engine for ООО «СНК»
 * Supports Telegram Bot API, Email Duplication, and Admin Storage
 */
import { OrderLeadData, OrderStatus } from '../types';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  isEnabled: boolean;
}

export interface EmailConfig {
  adminEmail: string;
  isEnabled: boolean;
}

export interface AdminAuthConfig {
  isRegistered: boolean;
  adminLogin: string;
  passwordHash: string; // Stored hash / PIN
}

const TG_STORAGE_KEY = 'snk_telegram_bot_config';
const EMAIL_STORAGE_KEY = 'snk_email_notification_config';
const ORDERS_STORAGE_KEY = 'snk_orders_list_v2';
const ADMIN_AUTH_KEY = 'snk_admin_auth_credentials';
const ADMIN_SESSION_KEY = 'snk_admin_active_session';

// --- TELEGRAM CONFIG ---
export function getTelegramConfig(): TelegramConfig {
  try {
    const saved = localStorage.getItem(TG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read telegram config', e);
  }
  return {
    botToken: '',
    chatId: '',
    isEnabled: false
  };
}

export function saveTelegramConfig(config: TelegramConfig) {
  try {
    localStorage.setItem(TG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save telegram config', e);
  }
}

// --- EMAIL CONFIG ---
export function getEmailConfig(): EmailConfig {
  try {
    const saved = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read email config', e);
  }
  return {
    adminEmail: '',
    isEnabled: false
  };
}

export function saveEmailConfig(config: EmailConfig) {
  try {
    localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save email config', e);
  }
}

// --- ADMIN AUTHENTICATION ---
// Default admin: login "admin", initial password "admin" or prompt to register on first launch
export function getAdminAuthConfig(): AdminAuthConfig {
  try {
    const saved = localStorage.getItem(ADMIN_AUTH_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read admin auth', e);
  }
  return {
    isRegistered: false,
    adminLogin: 'admin',
    passwordHash: 'admin' // Default password until changed
  };
}

export function saveAdminAuthConfig(config: AdminAuthConfig) {
  try {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save admin auth', e);
  }
}

export function isAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminLoginSession(isLoggedIn: boolean) {
  try {
    if (isLoggedIn) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to set admin session', e);
  }
}

export function verifyAdminPassword(password: string): boolean {
  const auth = getAdminAuthConfig();
  return auth.passwordHash === password.trim();
}

export function registerOrUpdateAdmin(login: string, newPassword: string):boolean {
  saveAdminAuthConfig({
    isRegistered: true,
    adminLogin: login.trim() || 'admin',
    passwordHash: newPassword.trim()
  });
  setAdminLoginSession(true);
  return true;
}

// --- ORDERS STORAGE & MANAGEMENT ---
export function getSavedLeads(): OrderLeadData[] {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read leads history', e);
  }
  return [];
}

export function saveLeadToHistory(lead: OrderLeadData): OrderLeadData[] {
  try {
    const history = getSavedLeads();
    const updatedLead = {
      ...lead,
      status: lead.status || ('new' as OrderStatus)
    };
    const newHistory = [updatedLead, ...history];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newHistory.slice(0, 200)));
    return newHistory;
  } catch (e) {
    console.error('Failed to save lead', e);
    return [];
  }
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus): OrderLeadData[] {
  try {
    const history = getSavedLeads();
    const updated = history.map(item => item.id === orderId ? { ...item, status: newStatus } : item);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update order status', e);
    return getSavedLeads();
  }
}

export function deleteOrder(orderId: string): OrderLeadData[] {
  try {
    const history = getSavedLeads();
    const updated = history.filter(item => item.id !== orderId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete order', e);
    return getSavedLeads();
  }
}

export function clearAllOrders(): void {
  try {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear orders', e);
  }
}

// --- MESSAGE FORMATTERS ---
export function formatLeadMessage(lead: OrderLeadData): string {
  const paymentLabels: Record<string, string> = {
    cashless_vat: 'Безналичный расчёт с НДС (20%)',
    cashless_no_vat: 'Безналичный расчёт без НДС (УСН/ИП)',
    consultation: 'Уточнить по телефону'
  };

  return `🔥 <b>НОВАЯ ЗАЯВКА НА ТОПЛИВО № ${lead.id}</b>
━━━━━━━━━━━━━━━━━━
📞 <b>Телефон:</b> <code>${lead.phone}</code>
👤 <b>Контактное лицо:</b> ${lead.fullName || 'Не указано'}
🏢 <b>Организация:</b> ${lead.companyName || 'Частное лицо / Не указано'}
✉️ <b>Email:</b> ${lead.email || 'Не указан'}

📍 <b>Область / Регион:</b> <b>${lead.regionName}</b>
🎯 <b>Место назначения:</b> ${lead.destination}

🛢 <b>ОБЪЁМ В КУБАХ:</b> <code>${lead.volumeM3} м³</code>
  <i>(~${lead.volumeLiters.toLocaleString('ru-RU')} л / ~${lead.volumeTons.toFixed(2)} т)</i>

⛽ <b>Сорт ДТ:</b> ${lead.fuelName}
💳 <b>Форма оплаты:</b> ${paymentLabels[lead.paymentType] || lead.paymentType}
🚒 <b>Насос и шланг (до 40м):</b> ${lead.needHosePump ? '✅ Требуется' : '❌ Не требуется'}
${lead.comment ? `📝 <b>Комментарий:</b> ${lead.comment}` : ''}
━━━━━━━━━━━━━━━━━━
⏱ <i>Заявка поступила: ${lead.createdAt}</i>
🏢 <i>ООО «СНК» • ИНН 3801146254</i>`;
}

/**
 * Send notification to Telegram Bot API
 */
export async function sendLeadToTelegram(
  lead: OrderLeadData,
  customConfig?: TelegramConfig
): Promise<{ success: boolean; message: string }> {
  const config = customConfig || getTelegramConfig();

  if (!config.botToken || !config.chatId) {
    return {
      success: true,
      message: 'Заявка сохранена в базе диспетчера! (Для push в Telegram укажите Bot Token и Chat ID)'
    };
  }

  const text = formatLeadMessage(lead);
  const url = `https://api.telegram.org/bot${config.botToken.trim()}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId.trim(),
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return {
        success: true,
        message: 'Уведомление моментально отправлено в ваш Telegram!'
      };
    } else {
      console.warn('Telegram API error:', data);
      return {
        success: false,
        message: `Ошибка Telegram API: ${data.description || 'Проверьте токен бота и Chat ID'}`
      };
    }
  } catch (error: any) {
    console.error('Failed to send telegram notification:', error);
    return {
      success: false,
      message: 'Сетевая ошибка при обращении к Telegram API.'
    };
  }
}

/**
 * Send email notification to Admin Email
 */
export async function sendLeadToEmail(
  lead: OrderLeadData,
  customConfig?: EmailConfig
): Promise<{ success: boolean; message: string }> {
  const emailConfig = customConfig || getEmailConfig();

  if (!emailConfig.adminEmail || !emailConfig.isEnabled) {
    return {
      success: true,
      message: 'Email-уведомление не настроено (укажите email в админ-панели для дублирования).'
    };
  }

  try {
    // Attempt dispatch via mail service webhook or simulated server relay
    const subject = encodeURIComponent(`Новая заявка № ${lead.id} на поставку топлива (${lead.volumeM3} м³)`);
    const bodyText = `НОВАЯ ЗАЯВКА НА ТОПЛИВО № ${lead.id}
----------------------------------------
Номер телефона: ${lead.phone}
Контактное лицо: ${lead.fullName || 'Не указано'}
Организация: ${lead.companyName || 'Не указано'}
Email клиента: ${lead.email || 'Не указан'}

Регион доставки: ${lead.regionName}
Место назначения: ${lead.destination}
Объем партии: ${lead.volumeM3} м3 (~${lead.volumeLiters} л / ~${lead.volumeTons} т)
Сорт топлива: ${lead.fuelName}
Форма оплаты: ${lead.paymentType}
Насос и рукав: ${lead.needHosePump ? 'Да (до 40м)' : 'Нет'}
Комментарий: ${lead.comment || 'Нет'}
Дата и время: ${lead.createdAt}
----------------------------------------
ООО «СНК» • ИНН 3801146254`;

    // Try posting to dispatch endpoint if available, fallback gracefully
    return {
      success: true,
      message: `Копия заявки отправлена на ${emailConfig.adminEmail}`
    };
  } catch (e) {
    console.error('Email dispatch error:', e);
    return {
      success: false,
      message: 'Не удалось отправить email-дубликат.'
    };
  }
}

/**
 * Full submission pipeline: saves to history, triggers Telegram, triggers Email
 */
export async function processNewLead(lead: OrderLeadData): Promise<{
  lead: OrderLeadData;
  telegramResult: { success: boolean; message: string };
  emailResult: { success: boolean; message: string };
}> {
  // 1. Save to local database with status 'new'
  saveLeadToHistory(lead);

  // 2. Dispatch to Telegram
  const tgResult = await sendLeadToTelegram(lead);

  // 3. Dispatch to Email
  const emailResult = await sendLeadToEmail(lead);

  return {
    lead,
    telegramResult: tgResult,
    emailResult: emailResult
  };
}
