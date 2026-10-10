"""Собирает страницы городов и регионов для mockups/a-mazut/.

Запуск из корня проекта:  python tools/build_pages.py
Тексты правятся здесь, в PAGES; общий вид страницы в TEMPLATE. Главная (index.html) пишется руками.
"""
import json
import re
from pathlib import Path
from string import Template

OUT = Path(__file__).resolve().parent.parent / 'mockups' / 'a-mazut'

REGIONS = {
    'irkutsk': {'slug': 'irkutskaya-oblast', 'name': 'Иркутская область', 'in': 'в Иркутской области',
                'towns': ['Иркутск', 'Ангарск', 'Братск', 'Усть-Кут', 'Бодайбо', 'Черемхово', 'Тайшет', 'Шелехов', 'Усолье-Сибирское', 'Саянск', 'Тулун', 'Нижнеудинск', 'Усть-Илимск', 'Железногорск-Илимский']},
    'amur': {'slug': 'amurskaya-oblast', 'name': 'Амурская область', 'in': 'в Амурской области',
             'towns': ['Благовещенск', 'Свободный', 'Белогорск', 'Тында', 'Зея', 'Сковородино', 'Шимановск', 'Райчихинск', 'Завитинск']},
    'zabaykalsky': {'slug': 'zabaykalskiy-kray', 'name': 'Забайкальский край', 'in': 'в Забайкальском крае',
                    'towns': ['Чита', 'Краснокаменск', 'Борзя', 'Забайкальск', 'Могоча', 'Нерчинск', 'Петровск-Забайкальский', 'Шилка', 'Агинское']},
    'buryatia': {'slug': 'buryatiya', 'name': 'Республика Бурятия', 'in': 'в Республике Бурятия',
                 'towns': ['Улан-Удэ', 'Северобайкальск', 'Гусиноозёрск', 'Кяхта', 'Закаменск', 'Бабушкин', 'Таксимо', 'Кижинга', 'Баргузин']},
}

CITIES = [
    {'slug': 'irkutsk', 'name': 'Иркутск', 'in': 'в Иркутске', 'region': 'irkutsk', 'center': '52.2870,104.3050',
     'area': 'в Иркутске и Иркутском районе',
     'h2': 'Поставки в Иркутск<br>и Иркутский район',
     'p1': 'Иркутск — областной центр и крупнейший транспортный узел Восточной Сибири. Дизельное топливо здесь нужно строительным компаниям, автопаркам и перевозчикам, коммунальным службам и предприятиям, у которых есть своя техника или резервные генераторы.',
     'p2': 'Привезём топливо на объект, базу или стоянку техники в Иркутске, Иркутском районе и соседних посёлках. Объём, срок и цену менеджер рассчитает под вашу заявку: укажите адрес или отметьте точку на карте ниже.',
     'season': 'Зимы в Иркутске морозные, поэтому с ноября по март обычно берут зимнее ДТ. Весной и осенью подходит межсезонное.'},
    {'slug': 'angarsk', 'name': 'Ангарск', 'in': 'в Ангарске', 'region': 'irkutsk', 'center': '52.5440,103.8880',
     'area': 'в Ангарске и Ангарском округе',
     'h2': 'Поставки в Ангарск<br>и Ангарский округ',
     'p1': 'Ангарск — один из главных промышленных городов Иркутской области: нефтехимия, машиностроение, много подрядных организаций. Дизельное топливо здесь нужно для спецтехники, грузового транспорта, строительства и обслуживания производственных площадок.',
     'p2': 'ООО «СНК» зарегистрировано в Ангарске, так что город для нас домашний. Привезём топливо на предприятие, стройплощадку или базу техники в Ангарске и окрестностях. Цену и срок назовём по телефону или после заявки.',
     'season': 'В зимний сезон подойдёт зимнее ДТ до −32 °C, весной и осенью межсезонное.'},
    {'slug': 'bratsk', 'name': 'Братск', 'in': 'в Братске', 'region': 'irkutsk', 'center': '56.1517,101.6335',
     'area': 'в Братске и Братском районе',
     'h2': 'Поставки в Братск<br>и Братский район',
     'p1': 'Братск — центр лесопромышленного комплекса на севере Иркутской области, город крупных производств и энергетики. Дизельное топливо здесь расходуют лесозаготовители, лесовозы и спецтехника, перевозчики и строительные организации.',
     'p2': 'Доставим топливо в Братск, на делянки и производственные площадки района. Для удалённых участков отметьте точку на карте: так менеджер точнее посчитает расстояние и стоимость доставки.',
     'season': 'Морозы ниже −30 °C в Братске бывают каждую зиму, поэтому зимой берут зимнее ДТ. Для работы в сильные морозы есть арктическое ДТ до −44 °C.'},
    {'slug': 'chita', 'name': 'Чита', 'in': 'в Чите', 'region': 'zabaykalsky', 'center': '52.0332,113.5009',
     'area': 'в Чите и Читинском районе',
     'h2': 'Поставки в Читу<br>и Читинский район',
     'p1': 'Чита — столица Забайкальского края и узел на Транссибе. Топливо здесь нужно автопаркам и перевозчикам, строительным и дорожным организациям, а по краю — горнодобывающим предприятиям и старательским артелям.',
     'p2': 'Привезём дизельное топливо в Читу и Читинский район, а по заявке и в другие города края. Отметьте место разгрузки на карте, чтобы мы рассчитали доставку.',
     'season': 'Забайкальская зима холодная и сухая: с ноября по март нужно зимнее ДТ. Для сильных морозов есть арктическое ДТ до −44 °C.'},
    {'slug': 'ulan-ude', 'name': 'Улан-Удэ', 'in': 'в Улан-Удэ', 'region': 'buryatia', 'center': '51.8336,107.5840',
     'area': 'в Улан-Удэ и пригородах',
     'h2': 'Поставки в Улан-Удэ<br>и Иволгинский район',
     'p1': 'Улан-Удэ — столица Бурятии, промышленный и транспортный центр на Транссибе. Дизельное топливо здесь нужно автопаркам, строительным компаниям, промышленным предприятиям и хозяйствам со своей техникой.',
     'p2': 'Доставим топливо в Улан-Удэ, пригородные посёлки и по республике. Укажите населённый пункт и отметьте точку на карте, менеджер рассчитает цену и срок.',
     'season': 'Зимой в Улан-Удэ сильные морозы, поэтому с ноября по март берут зимнее ДТ, а весной и осенью межсезонное.'},
    {'slug': 'blagoveshchensk', 'name': 'Благовещенск', 'in': 'в Благовещенске', 'region': 'amur', 'center': '50.2907,127.5272',
     'area': 'в Благовещенске и Благовещенском районе',
     'h2': 'Поставки в Благовещенск<br>и Благовещенский район',
     'p1': 'Благовещенск — столица Амурской области на границе с Китаем. Топливо здесь расходуют перевозчики и логистические компании, строительные организации, сельхозпредприятия и коммунальные службы.',
     'p2': 'Привезём дизельное топливо в Благовещенск, Благовещенский район и другие города области. Отметьте точку разгрузки на карте или укажите адрес, и менеджер свяжется с вами.',
     'season': 'Амурская зима долгая и морозная, поэтому с ноября по март нужно зимнее ДТ, а в межсезонье подходит межсезонное.'},
]

REGION_TEXT = {
    'irkutsk': {'h2': 'Поставки по всей<br>Иркутской области',
                'p1': 'Иркутская область — один из крупнейших регионов Сибири: промышленные города на юге, лесозаготовка и добыча на севере, трассы и железная дорога, по которым идёт основной грузопоток. Дизельное топливо здесь нужно почти каждому предприятию с техникой.',
                'p2': 'Поставляем ДТ в города и посёлки области. Для удалённых участков отметьте точку на карте: менеджер посчитает расстояние и назовёт цену с доставкой.'},
    'amur': {'h2': 'Поставки по всей<br>Амурской области',
             'p1': 'Амурская область — это сельское хозяйство на юге, золотодобыча и лесозаготовка на севере, БАМ и Транссиб, крупные стройки в районе Свободного. Топливо здесь нужно аграриям, горнякам, перевозчикам и строителям.',
             'p2': 'Привезём дизельное топливо в Благовещенск и другие города области. Укажите населённый пункт и отметьте точку на карте, и менеджер рассчитает доставку.'},
    'zabaykalsky': {'h2': 'Поставки по всему<br>Забайкальскому краю',
                    'p1': 'Забайкальский край — горнодобыча, золото и уголь, погранпереход в Забайкальске, автотрассы и Транссиб. Большие расстояния и суровая зима делают надёжные поставки топлива особенно важными.',
                    'p2': 'Доставим ДТ в Читу и другие города и посёлки края. Для приисков и удалённых площадок отметьте точку на карте, чтобы менеджер рассчитал маршрут.'},
    'buryatia': {'h2': 'Поставки по всей<br>Республике Бурятия',
                 'p1': 'Бурятия — это Улан-Удэ с промышленными предприятиями, угольные разрезы, БАМ на севере республики, сельское хозяйство и туристические объекты на побережье Байкала. Дизельное топливо нужно и производствам, и небольшим хозяйствам с техникой.',
                 'p2': 'Привезём топливо в Улан-Удэ, Северобайкальск, Гусиноозёрск и другие населённые пункты. Отметьте место разгрузки на карте или укажите адрес.'},
}

SHORT = r'в|во|на|с|со|к|у|о|об|и|а|но|из|за|по|до|от|для|не'


def nbsp(s):
    """Типографика: короткие слова и числа с единицами не отрываются от соседнего слова (BRK-05)."""
    s = re.sub(rf'(?<![\w-])({SHORT})\s', r'\1&nbsp;', s, flags=re.I)
    s = s.replace(' — ', '&nbsp;— ')
    return re.sub(r'(\d)\s(°C|м³|мг/кг)', r'\1&nbsp;\2', s)


def city_by_name(name):
    return next((c for c in CITIES if c['name'] == name), None)


ROWS = ''.join(f'''
        <li class="row rise"{f' style="--d:{i * 100}ms"' if i else ''}>
          <a href="#order">
            <span class="row__n">0{i + 1}</span>
            <span class="row__name">{name}<small>Экологический класс&nbsp;К5, ГОСТ&nbsp;32511-2013</small></span>
            <span class="row__t"><small>до</small>{t}&nbsp;°C</span>
            <svg class="row__a" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </li>''' for i, (name, t) in enumerate([('Летнее', '−5'), ('Межсезонное', '−20'), ('Зимнее', '−32'), ('Арктическое', '−44')]))

FOOT_CITIES = ' / '.join(f'<a href="../{c["slug"]}/">{c["name"]}</a>' for c in CITIES)
FOOT_REGIONS = ' / '.join(f'<a href="../{r["slug"]}/">{r["name"]}</a>' for r in REGIONS.values())

TEMPLATE = Template('''<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title</title>
  <meta name="description" content="$desc">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="$title">
  <meta property="og:description" content="$desc">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400&family=Golos+Text:wght@400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <script>try { if (localStorage.getItem('snk-theme') === 'light') document.documentElement.dataset.theme = 'light'; } catch (e) {}</script>
  <link rel="stylesheet" href="../styles.css">
  <script type="application/ld+json">$jsonld</script>
</head>
<body>
<!-- Страница собрана tools/build_pages.py. Правки вносить там, иначе перезапишутся. -->

<header class="top" id="top">
  <a class="logo rise" style="--d:300ms" href="../" aria-label="ООО «СНК», на главную">СНК</a>
  <nav class="nav rise" style="--d:420ms" aria-label="Основная навигация">
    <a href="#fuel">Топливо</a>
    <a href="#calc">Калькулятор</a>
    <a href="../#regions">Регионы</a>
    <a href="#verify">Проверка</a>
    <a href="#order">Заявка</a>
    <a class="nav__tel" href="tel:89041480038">8 (904) 148-00-38</a>
    <button class="theme" id="theme" type="button" aria-label="Светлая тема" aria-pressed="false">
      <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
    </button>
  </nav>
</header>

<main>
  <section class="hero" id="hero">
    <div class="hero__media">
      <img src="https://images.unsplash.com/photo-1708577580884-e23b50d4a205?w=1600&q=75&auto=format&fit=crop"
           srcset="https://images.unsplash.com/photo-1708577580884-e23b50d4a205?w=900&q=70&auto=format&fit=crop 900w,
                   https://images.unsplash.com/photo-1708577580884-e23b50d4a205?w=1600&q=75&auto=format&fit=crop 1600w,
                   https://images.unsplash.com/photo-1708577580884-e23b50d4a205?w=2400&q=75&auto=format&fit=crop 2400w"
           sizes="100vw" alt="Бензовоз-цистерна у навеса нефтебазы" width="2400" height="1600">
      <div class="hero__veil"></div>
    </div>
    <div class="hero__content">
      <h1 class="rise" style="--d:900ms">Дизельное топливо<br>$h1in</h1>
      <p class="hero__sub rise" style="--d:1040ms">$sub</p>
      <div class="hero__cta rise" style="--d:1200ms">
        <a class="btn btn--solid" href="#order"><span class="btn__fill"></span><span class="btn__label">Забрать расчёт<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span></a>
        <a class="btn btn--line" href="tel:89041480038"><span class="btn__fill"></span><span class="btn__label">Позвонить менеджеру</span></a>
        <span class="note">Цену и&nbsp;условия уточним по&nbsp;телефону</span>
      </div>
    </div>
  </section>

  <div class="flow">

    <section class="sec place">
      <nav class="crumbs rise" aria-label="Навигация по сайту">$crumbs</nav>
      <h2 class="rise">$h2</h2>
      <div class="place__text">
        <p class="lead rise">$p1</p>
        <p class="rise" style="--d:100ms">$p2</p>
      </div>
      $extra
    </section>

    <section class="sec sec--alt fuel" id="fuel">
      <h2 class="rise">Дизельное топливо<br>на каждый сезон</h2>
      <ul class="rows">$rows
      </ul>
      $season
      <p class="ask rise">Цена зависит от&nbsp;объёма и&nbsp;места доставки. Позвоните или напишите, назовём актуальную:
        <a href="tel:89041480038">8 (904) 148-00-38</a>, <a href="https://wa.me/79041480038" target="_blank" rel="noopener">WhatsApp</a>, <a href="https://t.me/+79041480038" target="_blank" rel="noopener">Telegram</a> или <a href="mailto:Worldbaikal@mail.ru">Worldbaikal@mail.ru</a></p>
    </section>

$calc

$verify

    <section class="sec order" id="order">
      <div class="order__side">
        <h2 class="rise">Рассчитаем цену<br>и&nbsp;срок поставки</h2>
        <p class="lead rise" style="--d:100ms">Укажите телефон, населённый пункт и&nbsp;объём. Обязательно отметьте точку разгрузки на&nbsp;карте: по&nbsp;ней менеджер посчитает километраж.</p>
        <p class="contacts rise" style="--d:200ms">
          <a href="tel:89041480038">8 (904) 148-00-38</a>
          <a href="tel:89834149769">8 (983) 414-97-69</a>
          <span class="contacts__msg"><a href="https://wa.me/79041480038" target="_blank" rel="noopener">WhatsApp</a> / <a href="https://t.me/+79041480038" target="_blank" rel="noopener">Telegram</a></span>
          <a class="contacts__mail" href="mailto:Worldbaikal@mail.ru">Worldbaikal@mail.ru</a>
        </p>
      </div>

      <form class="form rise" style="--d:100ms" id="orderForm" novalidate data-region="$region"$formdata>
        <label>Телефон<input name="phone" type="tel" autocomplete="tel" placeholder="+7" required></label>
        <label>Регион
          <select name="region" id="region">
            <option value="irkutsk">Иркутская область</option>
            <option value="amur">Амурская область</option>
            <option value="zabaykalsky">Забайкальский край</option>
            <option value="buryatia">Республика Бурятия</option>
          </select>
        </label>
        <label class="wide">Населённый пункт<input name="place" id="place" type="text" list="places" placeholder="Начните вводить или выберите из&nbsp;списка"></label>
        <datalist id="places"></datalist>

        <div class="wide mapbox">
          <span class="mapbox__label">Точка разгрузки на&nbsp;карте<em class="req">обязательно</em></span>
          <div id="map" class="map" role="application" aria-label="Карта: нажмите, чтобы отметить место доставки"></div>
          <p class="mapbox__info" id="mapInfo">Двигайте карту мышью, колесо приближает. Нажмите, чтобы отметить место разгрузки.</p>
          <input type="hidden" name="coords" id="coords">
        </div>

        <label class="hp" aria-hidden="true">Компания<input name="company" type="text" tabindex="-1" autocomplete="off"></label>
        <label class="wide">Объём, м³<input name="volume" type="text" inputmode="decimal" placeholder="Например, 10"></label>
        <div class="form__cta wide">
          <button class="btn btn--solid" type="submit"><span class="btn__fill"></span><span class="btn__label">Забрать расчёт<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span></button>
          <span class="note">Цену и&nbsp;условия уточним по&nbsp;телефону</span>
        </div>
        <p class="status wide" id="formStatus" role="status" aria-live="polite"></p>
      </form>
    </section>

  </div>
</main>

<footer class="foot">
  <div>
    <p class="foot__brand">ООО&nbsp;«СНК»</p>
    <p>Сибирская Нефтяная Компания<br>Иркутская область, г.&nbsp;Ангарск</p>
  </div>
  <div>
    <p><a href="tel:89041480038">8 (904) 148-00-38</a></p>
    <p><a href="tel:89834149769">8 (983) 414-97-69</a></p>
    <p><a href="mailto:Worldbaikal@mail.ru">Worldbaikal@mail.ru</a></p>
    <p><a href="https://wa.me/79041480038" target="_blank" rel="noopener">WhatsApp</a> / <a href="https://t.me/+79041480038" target="_blank" rel="noopener">Telegram</a></p>
  </div>
  <div class="foot__req">
    <p>ИНН&nbsp;3801146254 / КПП&nbsp;380101001</p>
    <p>ОГРН&nbsp;1183850023950</p>
  </div>
  <div class="foot__geo">
    <p>Регионы: $footregions</p>
    <p>Города: $footcities</p>
  </div>
</footer>

<div class="callbar" aria-label="Быстрая связь">
  <a class="btn btn--solid" href="tel:89041480038"><span class="btn__fill"></span><span class="btn__label">Позвонить</span></a>
  <a class="btn btn--line" href="https://wa.me/79041480038" target="_blank" rel="noopener"><span class="btn__fill"></span><span class="btn__label">WhatsApp</span></a>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="../script.js"></script>
</body>
</html>
''')

PROVIDER = {'@type': 'Organization', 'name': 'ООО «СНК»', 'legalName': 'ООО «Сибирская Нефтяная Компания»',
            'taxID': '3801146254', 'telephone': ['+79041480038', '+79834149769'], 'email': 'Worldbaikal@mail.ru'}


def jsonld(area_type, area_name, title):
    return json.dumps({'@context': 'https://schema.org', '@type': 'Service', 'name': title,
                       'serviceType': 'Поставка дизельного топлива',
                       'areaServed': {'@type': area_type, 'name': area_name}, 'provider': PROVIDER}, ensure_ascii=False)


def render(slug, **kw):
    path = OUT / slug / 'index.html'
    path.parent.mkdir(exist_ok=True)
    path.write_text(TEMPLATE.substitute(rows=ROWS, footcities=FOOT_CITIES, footregions=FOOT_REGIONS, calc=CALC, verify=VERIFY, **kw), encoding='utf-8')
    return path


def shared_sections():
    """Калькулятор и проверку компании берём с главной, чтобы не держать две копии разметки."""
    main = (OUT / 'index.html').read_text(encoding='utf-8')
    calc = re.search(r'    <section class="sec calc" id="calc">.*?</section>', main, re.S).group(0)
    verify = re.search(r'    <section class="sec verify" id="verify">.*?</section>', main, re.S).group(0)
    verify = verify.replace('class="sec verify"', 'class="sec sec--alt verify"')  # чередование фона на странице города
    tomain = ('''      <div class="tomain rise">
        <p>Регионы доставки, реквизиты и&nbsp;всё о&nbsp;компании на&nbsp;главной странице.</p>
        <a class="btn btn--line" href="../"><span class="btn__fill"></span><span class="btn__label">Перейти на&nbsp;главную<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span></a>
      </div>
    </section>''')
    verify = verify[:verify.rfind('    </section>')] + tomain
    return calc, verify


def build():
    made = []
    global CALC, VERIFY
    CALC, VERIFY = shared_sections()
    for c in CITIES:
        r = REGIONS[c['region']]
        title = f'Дизельное топливо {c["in"]} с доставкой оптом | ООО «СНК»'
        desc = f'Оптовые поставки дизельного топлива Евро-5 (класс К5) {c["area"]}: летнее, межсезонное, зимнее и арктическое ДТ. Цену уточняйте по телефону 8 (904) 148-00-38.'
        near = [x for x in CITIES if x['region'] == c['region'] and x is not c]
        near_links = ' / '.join([f'<a href="../{r["slug"]}/">{r["in"].replace("в ", "по ", 1)}</a>']
                                + [f'<a href="../{x["slug"]}/">{x["name"]}</a>' for x in near])
        made.append(render(
            c['slug'], title=title, desc=desc, jsonld=jsonld('City', c['name'], title),
            h1in=nbsp(c['in']), sub=nbsp(f'Оптовые поставки для автопарков, строительства и производств {c["area"]}.'),
            crumbs=f'<a href="../">Главная</a> / <a href="../{r["slug"]}/">{r["name"]}</a> / <span aria-current="page">{c["name"]}</span>',
            h2=nbsp(c['h2']), p1=nbsp(c['p1']), p2=nbsp(c['p2']),
            extra=f'<p class="near rise">Возим и&nbsp;рядом: {near_links}</p>',
            season=f'<p class="season rise">{nbsp(c["season"])}</p>',
            region=c['region'], formdata=f' data-place="{c["name"]}" data-center="{c["center"]}"'))

    for key, r in REGIONS.items():
        t = REGION_TEXT[key]
        title = f'Дизельное топливо {r["in"]} оптом с доставкой | ООО «СНК»'
        desc = f'Поставки дизельного топлива Евро-5 (класс К5) {r["in"]}: {", ".join(r["towns"][:4])} и другие города. Цену уточняйте по телефону 8 (904) 148-00-38.'
        towns = ' / '.join(f'<a href="../{city_by_name(n)["slug"]}/">{n}</a>' if city_by_name(n) else n for n in r['towns'])
        made.append(render(
            r['slug'], title=title, desc=desc, jsonld=jsonld('AdministrativeArea', r['name'], title),
            h1in=nbsp(r['in']), sub=nbsp(f'Оптовые поставки для автопарков, строительства и производств {r["in"]}.'),
            crumbs=f'<a href="../">Главная</a> / <span aria-current="page">{r["name"]}</span>',
            h2=nbsp(t['h2']), p1=nbsp(t['p1']), p2=nbsp(t['p2']),
            extra=f'<div class="towns rise"><h3>Города и&nbsp;посёлки</h3><p>{towns}</p></div>',
            season='', region=key, formdata=''))
    return made


if __name__ == '__main__':
    pages = build()
    # самопроверка: каждая страница собралась, без незаменённых $-полей, с формой и нужным регионом
    for p in pages:
        html = p.read_text(encoding='utf-8')
        assert '$' not in html.replace('$(', ''), f'незаменённое поле в {p}'
        assert 'id="orderForm"' in html and 'data-region="' in html, p
    print(f'Собрано страниц: {len(pages)}')
    for p in pages:
        print(' ', p.relative_to(OUT.parent.parent))
