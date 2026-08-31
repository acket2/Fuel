export type FuelCategory = 'diesel' | 'petrol' | 'kerosene' | 'heating';
export type CurrencyCode = 'RUB' | 'USD' | 'EUR';
export type RegionId = 'irkutsk' | 'amur' | 'zabaykalsky' | 'buryatia';
export type VolumeUnit = 'm3' | 'liters' | 'tons';

export interface FuelProduct {
  id: string;
  name: string;
  shortName: string;
  category: FuelCategory;
  grade: string;
  gost: string;
  basePriceRubPerLiter: number; // For interactive calculator benchmark
  density: number; // кг/л (например, 0.840)
  minTemp?: string; // температура застывания / предельной фильтруемости
  cetaneNumber?: number;
  sulfurContent?: string;
  producer: string;
  badge?: string;
  description: string;
  applications: string[];
  inStockLiters: number;
}

export interface DeliveryLocation {
  id: string;
  name: string;
  regionId: RegionId;
  regionName: string;
  distanceKm: number;
  popularVolume: string;
  depotHub: string;
}

export interface RegionInfo {
  id: RegionId;
  name: string;
  shortName: string;
  description: string;
  depotHubs: string[];
  expressAvailable: boolean;
  iconName: string;
}

export interface CalculationResult {
  fuel: FuelProduct;
  quantity: number;
  unit: 'liters' | 'tons' | 'm3';
  currency: CurrencyCode;
  volumeInLiters: number;
  volumeInTons: number;
  volumeInM3: number;
  location: DeliveryLocation;
  estimatedCostInSelectedCurrency: number;
  estimatedCostRub: number;
  truckType: string;
  truckSections: number;
}

export type OrderStatus = 'new' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface OrderLeadData {
  id: string;
  createdAt: string;
  phone: string;
  regionName: string;
  destination: string;
  volumeM3: number;
  volumeLiters: number;
  volumeTons: number;
  selectedUnit: VolumeUnit;
  fuelName: string;
  fullName: string;
  companyName: string;
  email: string;
  paymentType: 'cashless_vat' | 'cashless_no_vat' | 'consultation';
  comment: string;
  status?: OrderStatus;
}
