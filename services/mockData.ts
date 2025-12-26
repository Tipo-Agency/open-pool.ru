import { Coach, ScheduleItem, Tariff } from '../types';

export const TARIFFS: Tariff[] = [
  // --- АБОНЕМЕНТЫ (Посещения) ---
  {
    id: 'v1',
    name: '20 посещений',
    price: 13400,
    pricePerUnit: '670 ₽/пос.',
    duration: '60 дней',
    sessionDuration: '1 ч 30 мин',
    features: ['Без заморозки', 'Доступ в бассейн', 'Сауна'],
    group: 'visits'
  },
  {
    id: 'v2',
    name: '60 посещений',
    price: 31390,
    pricePerUnit: '524 ₽/пос.',
    duration: '180 дней',
    sessionDuration: '1 ч 30 мин',
    features: ['Заморозка 15 дней', 'Выгодная цена', 'Сауна'],
    group: 'visits'
  },
  {
    id: 'v3',
    name: '50 посещений + Бонусы',
    price: 34900,
    pricePerUnit: '698 ₽/пос.',
    duration: '365 дней',
    sessionDuration: '1 ч 40 мин',
    features: ['Увеличенный сеанс', 'Подарок: Сауна + Парк', 'Действует год', 'Без заморозки'],
    isHit: true,
    group: 'visits'
  },
  {
    id: 'v4',
    name: 'Семейный (на двоих)',
    price: 33000,
    pricePerUnit: '550 ₽/пос.',
    duration: '120 дней',
    sessionDuration: '1 ч 30 мин',
    features: ['30 + 30 посещений', 'Для двух членов семьи', 'Без заморозки'],
    group: 'visits'
  },

  // --- БЕЗЛИМИТНЫЕ ---
  {
    id: 'u1',
    name: 'Безлимит 30 дней',
    price: 11900,
    duration: '1 месяц',
    features: ['Без ограничений по времени', 'Подарок: Сауна', 'Без заморозки'],
    isHit: true,
    group: 'unlimited'
  },
  {
    id: 'u2',
    name: 'Безлимит 90 дней',
    price: 23900,
    pricePerUnit: '7 967 ₽/мес',
    duration: '3 месяца',
    features: ['Заморозка 20 дней', 'Подарок: Баня + Парк', 'Полный доступ'],
    group: 'unlimited'
  },
  {
    id: 'u3',
    name: 'Безлимит 180 дней',
    price: 38745,
    pricePerUnit: '6 458 ₽/мес',
    duration: '6 месяцев',
    features: ['Заморозка 30 дней', 'Подарок: Баня + Парк', 'Выгода 15%'],
    group: 'unlimited'
  },
  {
    id: 'u4',
    name: 'Безлимит 365 дней',
    price: 67900,
    pricePerUnit: '5 659 ₽/мес',
    duration: '12 месяцев',
    features: ['Заморозка 60 дней', 'Подарок: Баня + Парк + Пляж', 'Максимальная выгода'],
    isHit: true,
    group: 'unlimited'
  }
];

export const COACHES: Coach[] = [
  {
    id: 'c1',
    name: 'Алексей Водников',
    role: 'Старший тренер',
    specialization: 'Спортивное плавание, подготовка к соревнованиям',
    image: '/1651573524_01.jpeg'
  },
  {
    id: 'c2',
    name: 'Мария Глубина',
    role: 'Инструктор аква-аэробики',
    specialization: 'Реабилитация, аква-фитнес для беременных',
    image: '/1651573518_02.jpeg'
  },
  {
    id: 'c3',
    name: 'Дмитрий Быстров',
    role: 'Тренер детских групп',
    specialization: 'Обучение плаванию с нуля',
    image: '/1625809882105_default.jpeg'
  }
];

export const SCHEDULE: ScheduleItem[] = [
  { id: 's1', time: '07:00', activity: 'Свободное плавание', location: 'Дорожки 1-8', intensity: 'low' },
  { id: 's2', time: '09:00', activity: 'Аква-аэробика', location: 'Мелкая чаша', trainer: 'Мария Глубина', intensity: 'medium' },
  { id: 's3', time: '14:00', activity: 'Детская секция', location: 'Дорожки 1-3', trainer: 'Дмитрий Быстров', intensity: 'medium' },
  { id: 's4', time: '18:30', activity: 'Masters Swim', location: 'Дорожки 4-6', trainer: 'Алексей Водников', intensity: 'high' },
  { id: 's5', time: '20:00', activity: 'Вечерний релакс', location: 'Весь бассейн', intensity: 'low' },
];