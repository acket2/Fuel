/**
 * Приём заявок с сайта ООО «СНК» -> сообщение в Telegram + копия на почту.
 * Работает в Google Apps Script (script.google.com), круглосуточно, бесплатно.
 *
 * Настройки (Параметры проекта -> Свойства скрипта):
 *   TG_TOKEN   — токен бота от @BotFather
 *   TG_CHAT_ID — куда слать заявки (узнать: запустить getChatId после /start боту)
 *   MAIL_TO    — копия на почту, например Worldbaikal@mail.ru (можно не задавать)
 */

const MAX_LEN = 200; // обрезаем каждое поле, чтобы в бота не прилетали простыни

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.company) return reply({ ok: true }); // ловушка для ботов: людям это поле не видно

    const lead = {
      phone: clean(d.phone),
      region: clean(d.region),
      place: clean(d.place),
      coords: clean(d.coords),
      volume: clean(d.volume),
    };
    if (lead.phone.replace(/\D/g, '').length < 10) return reply({ ok: false, error: 'phone' });

    const props = PropertiesService.getScriptProperties();
    const when = Utilities.formatDate(new Date(), 'Asia/Irkutsk', 'dd.MM.yyyy HH:mm');
    const map = /^-?\d+(\.\d+)?, ?-?\d+(\.\d+)?$/.test(lead.coords)
      ? 'https://yandex.ru/maps/?pt=' + lead.coords.split(/, ?/).reverse().join(',') + '&z=13&l=map'
      : '';

    const text = [
      '<b>Новая заявка с сайта</b>',
      'Телефон: ' + esc(lead.phone),
      'Регион: ' + esc(lead.region || 'не указан'),
      'Населённый пункт: ' + esc(lead.place || 'не указан'),
      'Объём: ' + esc(lead.volume ? lead.volume + ' м³' : 'не указан'),
      map ? 'Точка: <a href="' + map + '">открыть на карте</a> (' + esc(lead.coords) + ')' : 'Точка на карте: не отмечена',
      when + ' (Иркутск)',
    ].join('\n');

    const tg = UrlFetchApp.fetch('https://api.telegram.org/bot' + props.getProperty('TG_TOKEN') + '/sendMessage', {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify({ chat_id: props.getProperty('TG_CHAT_ID'), text: text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });

    const mailTo = props.getProperty('MAIL_TO');
    if (mailTo) {
      MailApp.sendEmail(mailTo, 'Заявка с сайта: ' + lead.phone, text.replace(/<[^>]+>/g, '') + (map ? '\n' + map : ''));
    }

    // Заявку не теряем: если Telegram не ответил, но письмо ушло, сайт всё равно скажет «принято»
    return reply({ ok: tg.getResponseCode() === 200 || !!mailTo });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: 'server' });
  }
}

function clean(v) { return String(v == null ? '' : v).trim().slice(0, MAX_LEN); }
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function reply(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

/** Шаг настройки: напишите боту /start, запустите эту функцию и посмотрите chat_id в журнале выполнения. */
function getChatId() {
  const token = PropertiesService.getScriptProperties().getProperty('TG_TOKEN');
  const res = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/getUpdates').getContentText());
  (res.result || []).forEach(function (u) {
    const chat = (u.message || u.my_chat_member || {}).chat;
    if (chat) console.log('chat_id: ' + chat.id + '  (' + (chat.title || chat.first_name || '') + ')');
  });
  if (!(res.result || []).length) console.log('Пусто: сначала напишите боту /start и запустите снова.');
}

/** Проверка: отправляет тестовую заявку тем же путём, что и сайт. Должно прийти сообщение в Telegram. */
function testDoPost() {
  const out = doPost({ postData: { contents: JSON.stringify({
    phone: '+7 900 000-00-00', region: 'Иркутская область', place: 'Братск', coords: '56.15171, 101.63349', volume: '10',
  }) } });
  console.log(out.getContent());
}
