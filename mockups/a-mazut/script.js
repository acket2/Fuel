// Появление: герой сразу, остальное при входе в экран
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.rise').forEach((el) => io.observe(el));

// Шапка получает фон после героя-экрана
const header = document.getElementById('top');
const onScroll = () => header.classList.toggle('is-solid', scrollY > innerHeight * 0.6);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Калькулятор: ₽/л = ₽/т × плотность ÷ 1000 ----------
const num = (s) => parseFloat(String(s).replace(/\s/g, '').replace(',', '.'));
const fmt = (n, d) => n.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
const cTon = document.getElementById('cTon');
const cDen = document.getElementById('cDen');
const cLit = document.getElementById('cLit');

function fromTon() {
  const t = num(cTon.value), d = num(cDen.value);
  if (t > 0 && d > 0) cLit.value = fmt(t * d / 1000, 2);
}
function fromLit() {
  const l = num(cLit.value), d = num(cDen.value);
  if (l > 0 && d > 0) cTon.value = fmt(l * 1000 / d, 0);
}
cTon.addEventListener('input', fromTon);
cDen.addEventListener('input', fromTon);
cLit.addEventListener('input', fromLit);
// После ввода приводим числа к виду «120 000» и «0,850»
[[cTon, 0], [cDen, 3], [cLit, 2]].forEach(([el, d]) => el.addEventListener('blur', () => { const v = num(el.value); if (v > 0) el.value = fmt(v, d); }));
console.assert(Math.abs(100000 * 0.85 / 1000 - 85) < 1e-9, 'калькулятор: 100 000 ₽/т при 0,85 должно быть 85 ₽/л');

// ---------- Заявка: регион, населённый пункт, точка на карте ----------
const REGIONS = {
  irkutsk:     { center: [55.5, 105.0], zoom: 5, places: ['Иркутск', 'Ангарск', 'Братск', 'Усть-Кут', 'Бодайбо', 'Черемхово', 'Тайшет', 'Шелехов', 'Усолье-Сибирское', 'Саянск', 'Тулун', 'Нижнеудинск', 'Усть-Илимск', 'Железногорск-Илимский'] },
  amur:        { center: [53.6, 127.5], zoom: 6, places: ['Благовещенск', 'Свободный', 'Белогорск', 'Тында', 'Зея', 'Сковородино', 'Шимановск', 'Райчихинск', 'Завитинск'] },
  zabaykalsky: { center: [52.2, 116.5], zoom: 6, places: ['Чита', 'Краснокаменск', 'Борзя', 'Забайкальск', 'Могоча', 'Нерчинск', 'Петровск-Забайкальский', 'Шилка', 'Агинское'] },
  buryatia:    { center: [53.4, 109.0], zoom: 6, places: ['Улан-Удэ', 'Северобайкальск', 'Гусиноозёрск', 'Кяхта', 'Закаменск', 'Бабушкин', 'Таксимо', 'Кижинга', 'Баргузин'] },
};
const regionSel = document.getElementById('region');
const placeInp = document.getElementById('place');
const placesList = document.getElementById('places');
const coordsInp = document.getElementById('coords');
const mapInfo = document.getElementById('mapInfo');
let placeAuto = false; // населённый пункт подставлен с карты, а не введён руками

const map = L.map('map', { scrollWheelZoom: false, attributionControl: true }).setView(REGIONS.irkutsk.center, REGIONS.irkutsk.zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
}).addTo(map);
map.attributionControl.setPrefix(false);
const pin = L.divIcon({ className: '', html: '<div class="pin"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
let marker = null;

function setPoint(lat, lon, note) {
  if (marker) marker.setLatLng([lat, lon]); else marker = L.marker([lat, lon], { icon: pin }).addTo(map);
  coordsInp.value = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  const ya = `https://yandex.ru/maps/?pt=${lon.toFixed(5)},${lat.toFixed(5)}&z=13&l=map`;
  mapInfo.innerHTML = `${note ? note + ' ' : ''}Точка: ${coordsInp.value} / <a href="${ya}" target="_blank" rel="noopener">открыть в Яндекс.Картах</a>`;
}

function fillPlaces() {
  const r = REGIONS[regionSel.value];
  placesList.innerHTML = r.places.map((p) => `<option value="${p}">`).join('');
  map.setView(r.center, r.zoom);
}
regionSel.addEventListener('change', () => { if (placeAuto) placeInp.value = ''; fillPlaces(); });
fillPlaces();

// Ввели населённый пункт: находим его и ставим точку в центр
// ponytail: публичный Nominatim (до 1 запроса в секунду); в рабочей версии заменить на геокодер Яндекса с ключом
placeInp.addEventListener('change', async () => {
  placeAuto = false;
  const q = placeInp.value.trim();
  if (!q) return;
  const region = regionSel.options[regionSel.selectedIndex].text;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ru&accept-language=ru&q=${encodeURIComponent(q + ', ' + region)}`;
    const [hit] = await fetch(url).then((r) => r.json());
    if (!hit) { mapInfo.textContent = 'Не нашли этот пункт на карте. Отметьте место вручную.'; return; }
    map.setView([+hit.lat, +hit.lon], 12);
    setPoint(+hit.lat, +hit.lon, 'Центр населённого пункта, уточните место разгрузки кликом.');
  } catch { mapInfo.textContent = 'Карта не ответила. Отметьте место вручную или опишите его словами.'; }
});

// Клик по карте: ставим точку и, если поле пустое, подставляем название пункта
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;
  setPoint(lat, lng);
  if (placeInp.value.trim() && !placeAuto) return;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&zoom=14&accept-language=ru&lat=${lat}&lon=${lng}`;
    const a = (await fetch(url).then((r) => r.json())).address || {};
    const name = a.city || a.town || a.village || a.hamlet || a.municipality || '';
    if (name) { placeInp.value = name; placeAuto = true; }
  } catch { /* без названия, координат достаточно */ }
});

// Макет: отправка отключена
document.getElementById('orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const status = document.getElementById('formStatus');
  if (f.phone.value.replace(/\D/g, '').length < 10) { status.textContent = 'Укажите телефон, чтобы менеджер мог перезвонить.'; f.phone.focus(); return; }
  if (!f.place.value.trim() && !coordsInp.value) { status.textContent = 'Укажите населённый пункт или отметьте точку на карте.'; f.place.focus(); return; }
  status.textContent = 'Макет: заявка не отправляется. В рабочей версии она уйдёт менеджеру вместе с координатами точки.';
});
