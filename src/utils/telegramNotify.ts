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
  formspreeUrl: string;
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

export const DEFAULT_FORMSPREE_URL = 'https://formspree.io/f/myegqygq';

// --- EMAIL CONFIG ---
export function getEmailConfig(): EmailConfig {
  try {
    const saved = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        adminEmail: parsed.adminEmail || '',
        formspreeUrl: parsed.formspreeUrl !== undefined ? parsed.formspreeUrl : DEFAULT_FORMSPREE_URL,
        isEnabled: parsed.isEnabled !== undefined ? parsed.isEnabled : true
      };
    }
  } catch (e) {
    console.error('Failed to read email config', e);
  }
  return {
    adminEmail: 'Danilgolenko2008@gmail.com',
    formspreeUrl: DEFAULT_FORMSPREE_URL,
    isEnabled: true
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
 * Send email notification to Admin via Formspree Endpoint
 */
export async function sendLeadToEmail(
  lead: OrderLeadData,
  customConfig?: EmailConfig
): Promise<{ success: boolean; message: string }> {
  const emailConfig = customConfig || getEmailConfig();

  if (!emailConfig.isEnabled) {
    return {
      success: true,
      message: 'Email-уведомление отключено в настройках.'
    };
  }

  const endpoint = (emailConfig.formspreeUrl || DEFAULT_FORMSPREE_URL).trim();

  if (!endpoint) {
    return {
      success: false,
      message: 'Укажите ссылку на форму Formspree в панели администратора.'
    };
  }

  const paymentLabels: Record<string, string> = {
    cashless_vat: 'Безналичный расчёт с НДС (20%)',
    cashless_no_vat: 'Безналичный расчёт без НДС (УСН/ИП)',
    consultation: 'Уточнить по телефону'
  };

  try {
    const messageText = `Детали заявки:
• Телефон: ${lead.phone}
• Контактное лицо: ${lead.fullName || 'Не указано'}
• Организация: ${lead.companyName || 'Не указано'}
• Сорт топлива: ${lead.fuelName}
• Объём партии: ${lead.volumeM3} м³ (~${lead.volumeLiters.toLocaleString('ru-RU')} л / ~${lead.volumeTons.toFixed(2)} т)
• Регион доставки: ${lead.regionName}
• Пункт назначения: ${lead.destination}
• Оплата: ${paymentLabels[lead.paymentType] || lead.paymentType}
• Комментарий: ${lead.comment || 'Нет'}
• Номер заявки: № ${lead.id}
• Дата: ${lead.createdAt}`;

    const clientEmail = (lead.email && lead.email.includes('@')) ? lead.email.trim() : (emailConfig.adminEmail || 'client@snk-oil.ru');

    const payload: Record<string, any> = {
      _subject: `Заявка на ДТ № ${lead.id} (${lead.volumeM3} м³) — ${lead.regionName}`,
      name: lead.fullName || lead.companyName || 'Заказчик топлива (СНК)',
      email: clientEmail,
      phone: lead.phone,
      message: messageText,
      destination: lead.destination,
      region: lead.regionName,
      fuel_grade: lead.fuelName,
      volume: `${lead.volumeM3} м³`,
      order_id: lead.id,
      _gotcha: '', // Formspree honeypot field - must be empty to pass Formspree anti-spam
      _captcha: 'false'
    };

    let targetUrl = endpoint;
    if (targetUrl.includes('formsubmit.co') && !targetUrl.includes('/ajax/')) {
      targetUrl = targetUrl.replace('formsubmit.co/', 'formsubmit.co/ajax/');
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Заявка успешно отправлена на почту!'
      };
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn('Formspree/Email dispatch error:', errData);
      return {
        success: false,
        message: `Ошибка отправки: ${errData.error || errData.message || 'Проверьте эндпоинт'}`
      };
    }
  } catch (e: any) {
    console.error('Email dispatch error:', e);
    return {
      success: false,
      message: 'Сетевая ошибка при отправке на почтовый сервис.'
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
