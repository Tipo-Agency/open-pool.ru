import React, { useState } from 'react';
import { Building2, Users, CheckCircle2, Send, Phone, Mail, User, Briefcase } from 'lucide-react';
import { SectionTitle, Button } from '../components/ui';

export const Corporate: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', company: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Корпоративным клиентам" subtitle="Специальные условия для организаций" />

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Building2,
              title: 'Корпоративные абонементы',
              desc: 'Специальные тарифы для компаний с гибкими условиями оплаты и индивидуальным подходом.'
            },
            {
              icon: Users,
              title: 'Групповые занятия',
              desc: 'Организация корпоративных мероприятий, тимбилдингов и спортивных программ для сотрудников.'
            },
            {
              icon: Briefcase,
              title: 'Персональный менеджер',
              desc: 'Выделенный специалист для решения всех вопросов и организации корпоративных программ.'
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-soft border border-slate-100 hover:shadow-hover transition-all duration-300">
              <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center text-brand-blue mb-6">
                <benefit.icon size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          
          {status === 'success' ? (
            <div className="text-center py-10 animate-fade-up relative z-10">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Заявка принята!</h3>
              <p className="text-slate-500">Наш менеджер свяжется с вами в течение рабочего дня.</p>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="mb-10">
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-4 uppercase">Оставить заявку</h3>
                <p className="text-slate-500 font-medium">
                  Заполните форму, и наш менеджер подготовит индивидуальное коммерческое предложение для вашей организации.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={14} /> Ваше имя
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Phone size={14} /> Телефон
                  </label>
                  <input 
                    required
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail size={14} /> Email
                  </label>
                  <input 
                    required
                    type="email"
                    placeholder="ivan@company.ru"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Building2 size={14} /> Название компании
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="ООО «Компания»"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Сообщение</label>
                  <textarea 
                    rows={4}
                    placeholder="Расскажите о ваших потребностях и количестве сотрудников..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all resize-none"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full h-[60px] rounded-2xl shadow-xl shadow-brand-blue/20"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
              
              <p className="mt-6 text-[10px] text-slate-400 text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и обработки персональных данных.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

