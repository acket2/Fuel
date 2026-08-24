import { DeliveryLocation, RegionInfo } from '../types';

export const REGIONS_LIST: RegionInfo[] = [
  {
    id: 'irkutsk',
    name: 'Иркутская область',
    shortName: 'Иркутская обл.',
    description: 'Прямой налив с нефтебазы АО «АНХК» (Ангарск) и распределительных узлов ВСЖД.',
    depotHubs: ['Ангарский НПЗ (АНХК)', 'Иркутская нефтебаза', 'Усть-Кутский хаб'],
    expressAvailable: true,
    deliveryTimeRange: 'от 1 до 24 ч',
    iconName: 'Building'
  },
  {
    id: 'amur',
    name: 'Амурская область',
    shortName: 'Амурская обл.',
    description: 'Поставки для горнорудных предприятий, строительных объектов (Амурский ГПЗ/ГХК) и транспортных узлов.',
    depotHubs: ['Благовещенский терминал', 'Белогорская нефтебаза', 'Тындинский узел'],
    expressAvailable: true,
    deliveryTimeRange: 'от 3 до 36 ч',
    iconName: 'Compass'
  },
  {
    id: 'zabaykalsky',
    name: 'Забайкальский край',
    shortName: 'Забайкальский край',
    description: 'Снабжение автоколонн, карьеров, приисков, золотодобычи и пограничных логистических терминалов.',
    depotHubs: ['Читинский нефтетерминал', 'Борзинский узел', 'Краснокаменск'],
    expressAvailable: true,
    deliveryTimeRange: 'от 4 до 36 ч',
    iconName: 'Mountain'
  },
  {
    id: 'buryatia',
    name: 'Республика Бурятия (Бурятский АО)',
    shortName: 'Бурятия',
    description: 'Доставка по Улан-Удэ, побережью Байкала, промышленным и добывающим комплексам республики.',
    depotHubs: ['Улан-Удэнская нефтебаза', 'Северобайкальский хаб'],
    expressAvailable: true,
    deliveryTimeRange: 'от 2 до 28 ч',
    iconName: 'MapPin'
  }
];

export const DELIVERY_LOCATIONS: DeliveryLocation[] = [
  // 1. Иркутская область
  {
    id: 'irkutsk-main',
    name: 'Иркутск',
    regionId: 'irkutsk',
    regionName: 'Иркутская область',
    distanceKm: 42,
    minDeliveryHours: 2,
    popularVolume: 'от 1 000 до 40 000 л',
    depotHub: 'Ангарский НПЗ'
  },
  {
    id: 'angarsk',
    name: 'Ангарск',
    regionId: 'irkutsk',
    regionName: 'Иркутская область',
    distanceKm: 8,
    minDeliveryHours: 1,
    popularVolume: 'от 500 л (Прямой налив)',
    depotHub: 'Нефтебаза АНХК'
  },
  {
    id: 'bratsk',
    name: 'Братск',
    regionId: 'irkutsk',
    regionName: 'Иркутская область',
    distanceKm: 590,
    minDeliveryHours: 12,
    popularVolume: 'от 20 000 л / Автопоезда 38м³',
    depotHub: 'Братский филиал'
  },
  {
    id: 'ust-kut',
    name: 'Усть-Кут (Северный завоз)',
    regionId: 'irkutsk',
    regionName: 'Иркутская область',
    distanceKm: 940,
    minDeliveryHours: 20,
    popularVolume: 'от 30 000 л / Ж/Д цистерны',
    depotHub: 'Усть-Кут Речпорт / ВСЖД'
  },
  {
    id: 'bodaibo',
    name: 'Бодайбо (Золотодобыча)',
    regionId: 'irkutsk',
    regionName: 'Иркутская область',
    distanceKm: 1450,
    minDeliveryHours: 36,
    popularVolume: 'Партии от 100 т (ДТ Арктика)',
    depotHub: 'Северный тракт'
  },
  {
    id: 'cheremkhovo',
    name: 'Черемхово',
    regionId: 'irkutsk',
    regionName: 'Иркутская область',
    distanceKm: 105,
    minDeliveryHours: 3.5,
    popularVolume: 'от 5 000 до 35 000 л',
    depotHub: 'Ангарский НПЗ'
  },
  {
    id: 'taishet',
    name: 'Тайшет',
    regionId: 'irkutsk',
    regionName: 'Иркутская область',
    distanceKm: 650,
    minDeliveryHours: 14,
    popularVolume: 'от 20 000 л',
    depotHub: 'Тайшетский хаб'
  },

  // 2. Амурская область
  {
    id: 'blagoveshchensk',
    name: 'Благовещенск',
    regionId: 'amur',
    regionName: 'Амурская область',
    distanceKm: 180,
    minDeliveryHours: 4,
    popularVolume: 'от 5 000 до 40 000 л',
    depotHub: 'Благовещенская нефтебаза'
  },
  {
    id: 'svobodny',
    name: 'Свободный (Амурский ГПЗ/ГХК)',
    regionId: 'amur',
    regionName: 'Амурская область',
    distanceKm: 160,
    minDeliveryHours: 3,
    popularVolume: 'от 10 000 до 120 000 л',
    depotHub: 'Свободненский терминал'
  },
  {
    id: 'belogorsk',
    name: 'Белогорск',
    regionId: 'amur',
    regionName: 'Амурская область',
    distanceKm: 120,
    minDeliveryHours: 2.5,
    popularVolume: 'от 5 000 до 38 000 л',
    depotHub: 'Белогорский хаб'
  },
  {
    id: 'tynda',
    name: 'Тында (БАМ)',
    regionId: 'amur',
    regionName: 'Амурская область',
    distanceKm: 850,
    minDeliveryHours: 18,
    popularVolume: 'от 25 000 л / Ж/Д цистерны',
    depotHub: 'Тындинский узел'
  },
  {
    id: 'zeya',
    name: 'Зея',
    regionId: 'amur',
    regionName: 'Амурская область',
    distanceKm: 520,
    minDeliveryHours: 11,
    popularVolume: 'от 15 000 л',
    depotHub: 'Зейский филиал'
  },
  {
    id: 'skovorodino',
    name: 'Сковородино (Нефтепровод ВСТО)',
    regionId: 'amur',
    regionName: 'Амурская область',
    distanceKm: 660,
    minDeliveryHours: 14,
    popularVolume: 'от 30 000 л',
    depotHub: 'Сковородинский узел'
  },

  // 3. Забайкальский край
  {
    id: 'chita',
    name: 'Чита',
    regionId: 'zabaykalsky',
    regionName: 'Забайкальский край',
    distanceKm: 210,
    minDeliveryHours: 4.5,
    popularVolume: 'от 5 000 до 40 000 л',
    depotHub: 'Читинский нефтетерминал'
  },
  {
    id: 'krasnokamensk',
    name: 'Краснокаменск (Горнорудный кластер)',
    regionId: 'zabaykalsky',
    regionName: 'Забайкальский край',
    distanceKm: 530,
    minDeliveryHours: 12,
    popularVolume: 'от 25 000 л / Автоколонны',
    depotHub: 'Краснокаменский терминал'
  },
  {
    id: 'borzya',
    name: 'Борзя',
    regionId: 'zabaykalsky',
    regionName: 'Забайкальский край',
    distanceKm: 380,
    minDeliveryHours: 8,
    popularVolume: 'от 10 000 до 35 000 л',
    depotHub: 'Борзинская нефтебаза'
  },
  {
    id: 'zabaykalsk',
    name: 'Забайкальск (Пограничный переход)',
    regionId: 'zabaykalsky',
    regionName: 'Забайкальский край',
    distanceKm: 480,
    minDeliveryHours: 10,
    popularVolume: 'от 20 000 л',
    depotHub: 'Таможенно-логистический хаб'
  },
  {
    id: 'mogocha',
    name: 'Могоча (Золотодобыча)',
    regionId: 'zabaykalsky',
    regionName: 'Забайкальский край',
    distanceKm: 610,
    minDeliveryHours: 13,
    popularVolume: 'от 30 000 л / Карьерные комплексы',
    depotHub: 'Могочинский узел'
  },

  // 4. Республика Бурятия (Бурятский АО)
  {
    id: 'ulan-ude',
    name: 'Улан-Удэ',
    regionId: 'buryatia',
    regionName: 'Республика Бурятия (Бурятский АО)',
    distanceKm: 450,
    minDeliveryHours: 8,
    popularVolume: 'от 2 000 до 40 000 л',
    depotHub: 'Улан-Удэнская нефтебаза'
  },
  {
    id: 'severobaykalsk',
    name: 'Северобайкальск',
    regionId: 'buryatia',
    regionName: 'Республика Бурятия (Бурятский АО)',
    distanceKm: 810,
    minDeliveryHours: 18,
    popularVolume: 'от 20 000 л',
    depotHub: 'Северобайкальский узел'
  },
  {
    id: 'gusinoozyorsk',
    name: 'Гусиноозёрск (ГРЭС / Угольные разрезы)',
    regionId: 'buryatia',
    regionName: 'Республика Бурятия (Бурятский АО)',
    distanceKm: 560,
    minDeliveryHours: 10,
    popularVolume: 'от 15 000 до 50 000 л',
    depotHub: 'Гусиноозёрский филиал'
  },
  {
    id: 'kyakhta',
    name: 'Кяхта (Монгольское направление)',
    regionId: 'buryatia',
    regionName: 'Республика Бурятия (Бурятский АО)',
    distanceKm: 680,
    minDeliveryHours: 12,
    popularVolume: 'от 20 000 л',
    depotHub: 'Кяхтинский терминал'
  }
];

export const TANK_TRUCK_FLEET = [
  {
    type: 'Малый бензовоз-вездеход (5 - 8 м³)',
    description: 'Маневренная техника для строительных площадок, частных котельных, автопарков и труднодоступных участков. Шланг до 40 м.',
    meterType: 'Электронный счетчик ППО-25 с калибровкой и насосом'
  },
  {
    type: 'Среднетоннажная автоцистерна (10 - 18 м³)',
    description: '2–3 раздельных изолированных отсека. Скоростная перекачка до 350 л/мин. Идеально для снабжения техники на объектах.',
    meterType: 'Калиброванный расходомер ППО-40 с погрешностью 0.25%'
  },
  {
    type: 'Магистральный автопоезд (30 - 42 м³)',
    description: 'Крупный опт для горнодобывающих предприятий, карьеров, автоколонн, АЗС и промышленных баз. Термоизолированные секции.',
    meterType: 'Пломбированные донные клапаны и GPS/ГЛОНАСС мониторинг'
  },
  {
    type: 'Ж/Д Цистерны (60 - 66 тонн)',
    description: 'Прямые железнодорожные поставки с заводов-изготовителей на подъездные пути предприятий по всей ВСЖД и ЗабЖД.',
    meterType: 'Заводской весовой контроль и пломбы РЖД'
  }
];
