
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Thermometer, Clock, Droplets, Trophy, Waves, MapPin, ChevronRight, Phone, ShieldCheck, Star } from 'lucide-react';
import { SectionTitle, Button, Card, Badge } from '../components/ui';
import { ContactForm } from '../components/ContactForm';
import { useModal } from '../contexts/ModalContext';
import { SCHEDULE } from '../services/mockData';
import { PageRoute } from '../types';

export const Home: React.FC = () => {
  const { openModal } = useModal();
  return (
    <div className="flex flex-col gap-24 pb-24 overflow-x-hidden">
      
      {/* 1. HERO SECTION (UTP) */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-full md:w-3/4 h-full bg-brand-light rounded-bl-[100px] -z-10" />
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-fade-up">
              <Badge color="blue">Главный открытый бассейн края</Badge>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[1.05]">
                Плавание под<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-sky">открытым</span> небом
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
                Круглогодичный открытый бассейн 50 метров. Почувствуйте энергию воды и неба в самом центре Хабаровска.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="primary" 
                  className="w-full sm:w-auto shadow-brand-blue/30 group"
                  onClick={() => openModal('Выбрать абонемент')}
                >
                  Выбрать абонемент
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to={PageRoute.SCHEDULE}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Расписание сеансов
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-slate-200/60">
                <div>
                  <div className="font-display text-4xl font-bold text-brand-blue">50<span className="text-xl">м</span></div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">8 дорожек</div>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div>
                  <div className="font-display text-4xl font-bold text-brand-blue">+28<span className="text-xl">°</span></div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Температура воды</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full">
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-blue/20 transform rotate-1 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="/хероблок.jpeg" 
                  alt="Open Pool Main View" 
                  className="w-full h-[500px] lg:h-[650px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/40 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-6 rounded-3xl flex items-center justify-between shadow-lg border border-white/50">
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Статус на сегодня</p>
                      <div className="flex items-center gap-2">
                        <Waves className="w-5 h-5 text-brand-blue" />
                        <p className="text-slate-900 font-bold text-lg">Работаем до 22:00</p>
                      </div>
                   </div>
                   <div className="bg-[#E6F4EA] text-[#1E8E3E] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-[#1E8E3E]/10">
                      <span className="w-2 h-2 bg-[#1E8E3E] rounded-full animate-pulse" /> Открыто
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="container mx-auto px-6">
        <SectionTitle title="Наши Услуги" subtitle="Для спорта и отдыха" align="left" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Спортивное плавание', 
              desc: 'Профессиональные тренировки для взрослых и детей. Подготовка к соревнованиям.',
              image: '/habarovsk-basseĭn_ad1.webp'
            },
            { 
              title: 'Обучение плаванию', 
              desc: 'Групповые и индивидуальные занятия для новичков. Уверенность на воде за 8 уроков.',
              image: '/habarovsk-basseĭt-2_e16.webp'
            },
            { 
              title: 'Аква-фитнес', 
              desc: 'Эффективные тренировки в воде. Снижение веса и укрепление мышц без нагрузки на суставы.',
              image: '/5193697.webp'
            },
          ].map((service, idx) => (
            <div key={idx} className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-lg hover:-translate-y-2 transition-all duration-500">
              <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h4 className="text-2xl font-display font-bold mb-3">{service.title}</h4>
                <p className="text-sm text-slate-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{service.desc}</p>
                <Button 
                  size="sm" 
                  variant="glass" 
                  className="rounded-xl"
                  onClick={() => openModal('Узнать подробнее')}
                >
                  Подробнее
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US (BENEFITS) */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden rounded-[3rem]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue opacity-10 blur-[120px]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <Badge color="white" className="mb-6">Мировые стандарты качества</Badge>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">Почему выбирают ОПБ?</h2>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: 'Многоступенчатая очистка', text: 'Система очистки воды соответствует мировым стандартам. Каждые 4 часа проводятся лабораторные замеры.' },
                  { icon: Thermometer, title: 'Круглогодичный комфорт', text: 'Даже в -35°C температура воды поддерживается на уровне +28°C. Над водой всегда теплый слой пара.' },
                  { icon: Star, title: 'Уникальность', text: 'Единственный открытый бассейн олимпийского формата на Дальнем Востоке.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="w-14 h-14 bg-brand-blue/20 rounded-2xl flex items-center justify-center text-brand-blue shrink-0">
                      <item.icon size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="/IMG_9470_1_1.jpg" className="rounded-3xl w-full h-64 object-cover" alt="Pool feature 1" />
              <img src="/XXXL_1_1.jpg" className="rounded-3xl w-full h-80 object-cover mt-8" alt="Pool feature 2" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. MINI SCHEDULE PREVIEW */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <SectionTitle title="Ближайшие сеансы" subtitle="Актуальное расписание" align="left" />
          <Link to={PageRoute.SCHEDULE}>
            <Button variant="outline" className="mb-16">Смотреть всё расписание</Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-soft p-3 border border-slate-100">
          {SCHEDULE.slice(0, 4).map((item, idx) => (
            <div key={item.id} className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-[1.5rem] transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100 ${idx % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}`}>
              <div className="flex items-center gap-8 w-full sm:w-auto mb-4 sm:mb-0">
                <span className="text-3xl font-display font-bold text-brand-blue min-w-[100px]">{item.time}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{item.activity}</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                    <MapPin size={14} /> {item.location}
                  </div>
                </div>
              </div>
              <Badge color={item.intensity === 'high' ? 'blue' : 'white'} className="hidden md:inline-flex">
                {item.intensity === 'high' ? 'Высокая интенсивность' : 'Средняя нагрузка'}
              </Badge>
              <Button 
                size="sm" 
                variant="secondary" 
                className="rounded-xl px-8"
                onClick={() => openModal('Записаться на сеанс')}
              >
                Записаться
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROMOTION BANNER */}
      <section className="container mx-auto px-6">
        <div className="bg-gradient-brand rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] border-[40px] border-white/20 rounded-[40%] animate-spin-slow"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Первое посещение со скидкой 50%</h2>
            <p className="text-blue-100 text-lg mb-12 font-medium">Оформите разовый билет онлайн и получите бонусную скидку на первый визит в наш бассейн.</p>
            <Button 
              variant="white" 
              size="lg" 
              className="px-12"
              onClick={() => openModal('Получить скидку 50%')}
            >
              Получить скидку
            </Button>
          </div>
        </div>
      </section>

      {/* 6. CONTACT FORM SECTION */}
      <section className="container mx-auto px-6">
        <ContactForm />
      </section>

    </div>
  );
};
