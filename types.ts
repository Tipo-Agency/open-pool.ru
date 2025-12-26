export interface Tariff {
  id: string;
  name: string;
  price: number;
  pricePerUnit?: string; // e.g. "670 руб./пос." or "7967 руб./мес"
  duration: string; // Validity period e.g. "60 дней"
  sessionDuration?: string; // e.g. "1 ч 30 мин"
  features: string[];
  isHit?: boolean; // For "Action" items
  group: 'visits' | 'unlimited';
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  image: string;
  specialization: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  location: string;
  trainer?: string;
  intensity: 'low' | 'medium' | 'high';
}

export enum PageRoute {
  HOME = '/',
  TARIFFS = '/tariffs',
  SCHEDULE = '/schedule',
  TEAM = '/team',
  CORPORATE = '/corporate',
  ABOUT = '/about',
  CONTACTS = '/contacts',
}