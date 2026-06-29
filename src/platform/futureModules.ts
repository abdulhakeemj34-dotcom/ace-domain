export type FutureModuleKey =
  | 'mini-games'
  | 'marketplace'
  | 'food-ordering'
  | 'clothes-shopping'
  | 'ride-booking'
  | 'flights'
  | 'hotels'
  | 'wallet'
  | 'payments'
  | 'banking';

export type FutureModuleManifest = {
  key: FutureModuleKey;
  displayName: string;
  status: 'planned';
};

export const futureModuleRegistry: FutureModuleManifest[] = [
  { key: 'mini-games', displayName: 'Mini Games', status: 'planned' },
  { key: 'marketplace', displayName: 'Marketplace', status: 'planned' },
  { key: 'food-ordering', displayName: 'Food Ordering', status: 'planned' },
  { key: 'clothes-shopping', displayName: 'Clothes Shopping', status: 'planned' },
  { key: 'ride-booking', displayName: 'Ride Booking', status: 'planned' },
  { key: 'flights', displayName: 'Flights', status: 'planned' },
  { key: 'hotels', displayName: 'Hotels', status: 'planned' },
  { key: 'wallet', displayName: 'Wallet', status: 'planned' },
  { key: 'payments', displayName: 'Payments', status: 'planned' },
  { key: 'banking', displayName: 'Banking Features', status: 'planned' }
];
