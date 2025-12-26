import React from 'react';
import { SectionTitle } from '../components/ui';
import { COACHES } from '../services/mockData';
import { Instagram } from 'lucide-react';

export const Team: React.FC = () => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 bg-slate-50">
      <SectionTitle title="Команда Тренеров" subtitle="Профессионалы своего дела" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {COACHES.map((coach) => (
          <div key={coach.id} className="group bg-white rounded-[2.5rem] p-4 shadow-soft hover:shadow-hover border border-slate-100 transition-all duration-300">
            <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-[4/5]">
              <img 
                src={coach.image} 
                alt={coach.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                 <button className="bg-white text-brand-dark px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-blue hover:text-white transition-colors flex items-center gap-2">
                    <Instagram size={18} /> Подписаться
                 </button>
              </div>
            </div>
            
            <div className="text-center px-4 pb-4">
              <h3 className="text-2xl font-display font-bold text-brand-dark mb-1">{coach.name}</h3>
              <p className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-4">{coach.role}</p>
              <div className="w-10 h-1 bg-slate-100 mx-auto mb-4 rounded-full" />
              <p className="text-slate-500 text-sm leading-relaxed">
                {coach.specialization}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};