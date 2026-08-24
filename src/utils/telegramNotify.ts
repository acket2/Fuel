/**
 * Telegram Instant Notification Engine for ООО «СНК» Leads
 */
import { OrderLeadData } from '../types';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  isEnabled: boolean;
}

const STORAGE_KEY = 'snk_telegram_bot_config';
const LEADS_STORAGE_KEY = 'snk_saved_leads_history';

// Default / saved settings
export function getTelegramConfig(): TelegramConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save telegram config', e);
  }
}

export function saveLeadToHistory(lead: OrderLeadData) {
  try {
    const history = getSavedLeads();
    history.unshift(lead);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save lead', e);
  }
}

export function getSavedLeads(): OrderLeadData[] {
  try {
    const saved = localStorage.getItem(LEADS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read leads history', e);
  }
  return [];
}

/**
 * Format telegram message in clean, readable HTML format
 */
export function formatLeadMessage(lead: OrderLeadData): string {
  const paymentLabels = {
    cashless_vat: 'Безналичный расчёт с НДС (20%)',
    cashless_no_vat: 'Безналичный расчёт без НДС (УСН/ИП)',
    consultation: 'Уточнить по телефону'
  };

  return `🔥 <b>НОВАЯ ЗАЯВКА НА ТОПЛИВО (ООО «СНК»)</b>
━━━━━━━━━━━━━━━━━━
📞 <b>Телефон:</b> <code>${lead.phone}</code>
👤 <b>Имя:</b> ${lead.fullName || 'Не указано'}
🏢 <b>Организация:</b> ${lead.companyName || 'Частное лицо / Не указано'}
✉️ <b>Email:</b> ${lead.email || 'Не указан'}

📍 <b>Область / Регион:</b> <b>${lead.regionName}</b>
🎯 <b>Место назначения:</b> ${lead.destination}

🛢 <b>ОБЪЁМ В КУБАХ:</b> <code>${lead.volumeM3} м³</code>
  <i>(~${lead.volumeLiters.toLocaleString('ru-RU')} литров / ~${lead.volumeTons.toFixed(2)} тонн)</i>

⛽ <b>Сорт ДТ:</b> ${lead.fuelName}
💳 <b>Форма оплаты:</b> ${paymentLabels[lead.paymentType]}
🚒 <b>Насос и длинный шланг:</b> ${lead.needHosePump ? '✅ Требуется (до 40м)' : '❌ Не требуется'}
${lead.comment ? `📝 <b>Комментарий:</b> ${lead.comment}` : ''}
━━━━━━━━━━━━━━━━━━
⏱ <i>Заявка поступила: ${lead.createdAt}</i>
🏢 <i>ООО «СНК» • ИНН 3801146254</i>`;
}

/**
 * Send lead notification to Telegram Bot API
 */
export async function sendLeadToTelegram(
  lead: OrderLeadData,
  customConfig?: TelegramConfig
): Promise<{ success: boolean; message: string }> {
  const config = customConfig || getTelegramConfig();

  // Save locally first
  saveLeadToHistory(lead);

  if (!config.botToken || !config.chatId) {
    // If no custom token provided, simulate successful dispatch in dev mode
    return {
      success: true,
      message: 'Заявка сохранена в журнале диспетчера! (Для мгновенных push на телефон подключите Telegram Bot в настройках)'
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
        message: 'Заявка моментально отправлена в ваш Telegram!'
      };
    } else {
      console.warn('Telegram API error:', data);
      return {
        success: false,
        message: `Ошибка Telegram API: ${data.description || 'Проверьте токен и Chat ID'}`
      };
    }
  } catch (error: any) {
    console.error('Failed to send telegram notification:', error);
    return {
      success: false,
      message: 'Сетевая ошибка при отправке в Telegram. Заявка сохранена локально.'
    };
  }
}
