import React from 'react';
import { Check, Star, Download, Gift, Clock, CalendarDays, Info } from 'lucide-react';
import { SectionTitle, Button, Badge } from '../components/ui';
import { useModal } from '../contexts/ModalContext';
import { TARIFFS } from '../services/mockData';
import { Tariff } from '../types';

const TariffCard: React.FC<{ tariff: Tariff }> = ({ tariff }) => {
  const { openModal } = useModal();
  
  return (
  <div 
    className={`bg-white rounded-[2rem] p-8 border transition-all duration-300 flex flex-col h-full relative overflow-hidden group ${
      tariff.isHit 
        ? 'border-brand-blue shadow-xl ring-4 ring-brand-light z-10' 
        : 'border-slate-100 shadow-soft hover:shadow-hover hover:border-brand-blue/30'
    }`}
  >
    {tariff.isHit && (
      <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider">
        Акция
      </div>
    )}
    
    <div className="mb-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4 pr-10 min-h-[56px] flex items-center">{tariff.name}</h3>
      
      <div className="flex flex-col gap-1 mb-4">
         <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold text-brand-blue">{tariff.price.toLocaleString('ru-RU')}</span>
            <span className="text-slate-400 font-bold">₽</span>
         </div>
         {tariff.pricePerUnit && (
           <span className="text-sm font-semibold text-brand-sky">
             {tariff.pricePerUnit}
           </span>
         )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
        <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
           <CalendarDays size={14} className="text-brand-blue" /> {tariff.duration}
        </div>
        {tariff.sessionDuration && (
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
             <Clock size={14} className="text-brand-blue" /> {tariff.sessionDuration}
          </div>
        )}
      </div>
    </div>

    <ul className="space-y-4 mb-8 flex-1 border-t border-slate-100 pt-6">
      {tariff.features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
          <div className={`rounded-full p-0.5 mt-0.5 shrink-0 ${feature.includes('Подарок') ? 'bg-orange-100 text-orange-500' : 'bg-brand-light text-brand-blue'}`}>
            {feature.includes('Подарок') ? <Gift className="w-3 h-3" /> : <Check className="w-3 h-3" />}
          </div>
          <span className={feature.includes('Подарок') ? 'text-orange-600 font-bold' : ''}>{feature}</span>
        </li>
      ))}
    </ul>

    <Button 
      variant={tariff.isHit ? 'primary' : 'outline'} 
      className="w-full rounded-xl group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue transition-colors"
      onClick={() => openModal(`Купить абонемент: ${tariff.name}`)}
    >
      Купить онлайн
    </Button>
  </div>
  );
};

export const Tariffs: React.FC = () => {
  const visitTariffs = TARIFFS.filter(t => t.group === 'visits');
  const unlimitedTariffs = TARIFFS.filter(t => t.group === 'unlimited');

  return (
    <div className="pt-36 pb-20 bg-slate-50 min-h-screen relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src="/4925812127972686_3dc.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle title="Тарифы Бассейна" subtitle="Инвестируй в здоровье" />
        
        {/* Section 1: Visits */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-10 w-1 bg-brand-blue rounded-full"></div>
             <h3 className="text-3xl font-display font-bold text-slate-900">Абонементы на посещения</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {visitTariffs.map((tariff) => (
              <TariffCard key={tariff.id} tariff={tariff} />
            ))}
          </div>
        </div>

        {/* Section 2: Unlimited */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-10 w-1 bg-brand-sky rounded-full"></div>
             <h3 className="text-3xl font-display font-bold text-slate-900">Безлимитные карты</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {unlimitedTariffs.map((tariff) => (
              <TariffCard key={tariff.id} tariff={tariff} />
            ))}
          </div>
        </div>

        {/* Discounts & Rules Section */}
        <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-soft border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
           
           <h3 className="text-2xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
             <Info className="text-brand-blue" /> Правила и Скидки
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-sm md:text-base text-slate-600 leading-relaxed font-medium">
              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <span className="block text-brand-blue font-bold text-lg mb-2">15% Скидка</span>
                    <p>При непрерывном продлении абонемента. Действует от стоимости приобретаемого абонемента на момент покупки (для абонементов от 180 дней).</p>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <span className="block text-brand-blue font-bold text-lg mb-2">10% День Рождения</span>
                    <p>Скидка действует 3 дня ДО и 3 дня ПОСЛЕ вашего праздника. Сделайте себе полезный подарок!</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <span className="block text-brand-blue font-bold text-lg mb-2">10% Льготная категория</span>
                    <p className="mb-2">Действует при предъявлении документа для следующих категорий:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-500">
                       <li>Дети (до 14 лет)</li>
                       <li>Пенсионеры (60+ Ж и 65+ М)</li>
                       <li>Ветераны боевых действий</li>
                       <li>Многодетные семьи</li>
                       <li>Инвалиды</li>
                    </ul>
                 </div>
                 <p className="text-xs text-slate-400 mt-4 italic">
                    * Скидки не суммируются. Скидки не распространяются на акции, разовые посещения, услуги тренера и дополнительные услуги.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};