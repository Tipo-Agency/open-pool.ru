import React, { useState } from 'react';
import { SectionTitle, Badge, Button } from '../components/ui';
import { useModal } from '../contexts/ModalContext';
import { SCHEDULE } from '../services/mockData';
import { Filter, Calendar, Clock, User } from 'lucide-react';

export const Schedule: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [activeDay, setActiveDay] = useState('ПН');
  const { openModal } = useModal();
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 bg-slate-50 min-h-screen relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src="/orig.jpeg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10">
        <SectionTitle title="Расписание Занятий" subtitle="Выбери свое время" />

        {/* Controls Container */}
        <div className="bg-white rounded-3xl p-4 shadow-soft mb-10 flex flex-col lg:flex-row justify-between items-center gap-6 border border-slate-100">
        
        {/* Days Filter */}
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
          {days.map(day => (
             <button
               key={day}
               onClick={() => setActiveDay(day)}
               className={`w-14 h-14 rounded-2xl font-bold flex items-center justify-center transition-all shadow-sm ${
                 activeDay === day 
                   ? 'bg-brand-blue text-white shadow-brand-blue/20 translate-y-[-2px]' 
                   : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
               }`}
             >
               {day}
             </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl w-full lg:w-auto border border-slate-100">
           <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm">
             <Filter className="w-5 h-5" />
           </div>
           <select 
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="bg-transparent text-slate-900 font-bold border-none outline-none py-2 px-2 text-sm cursor-pointer w-full"
           >
             <option value="all">Все направления</option>
             <option value="pool">Спортивное плавание</option>
             <option value="gym">Аква-аэробика</option>
             <option value="kids">Детские группы</option>
           </select>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="space-y-4">
        {SCHEDULE.map((item) => (
          <div key={item.id} className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-brand-blue/30 hover:shadow-hover transition-all duration-300 flex flex-col md:flex-row items-center gap-8">
            
            {/* Time */}
            <div className="flex flex-col items-center md:items-start min-w-[100px]">
               <div className="flex items-center gap-2 text-brand-blue mb-1">
                 <Clock size={16} />
                 <span className="font-bold text-sm">Начало</span>
               </div>
               <div className="text-4xl font-display font-bold text-slate-900">{item.time}</div>
            </div>

            {/* Divider */}
            <div className="w-full md:w-px h-px md:h-16 bg-slate-100" />

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                   <h3 className="text-xl font-bold text-slate-900">{item.activity}</h3>
                   <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      item.intensity === 'high' ? 'bg-red-50 text-red-500' : 
                      item.intensity === 'medium' ? 'bg-blue-50 text-brand-blue' : 
                      'bg-green-50 text-green-500'
                   }`}>
                     {item.intensity === 'high' ? 'Интенсивно' : item.intensity === 'medium' ? 'Средне' : 'Легко'}
                   </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                    <Calendar className="w-4 h-4 text-brand-blue" /> {item.location}
                  </span>
                  {item.trainer && (
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                      <User className="w-4 h-4 text-brand-blue" /> {item.trainer}
                    </span>
                  )}
                </div>
            </div>

            {/* Action */}
            <div className="w-full md:w-auto">
              <Button 
                size="md" 
                variant="secondary" 
                className="w-full md:w-auto rounded-xl border-slate-200"
                onClick={() => openModal(`Записаться на ${item.activity}`)}
              >
                Записаться
              </Button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};