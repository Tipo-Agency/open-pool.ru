
import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from './ui';

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', phone: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-slate-100 relative overflow-hidden">
      {status === 'success' ? (
        <div className="text-center py-10 animate-fade-up">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявка принята!</h3>
          <p className="text-slate-500">Мы перезвоним вам в течение 15 минут.</p>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <h3 className="text-3xl font-display font-bold text-slate-900 mb-4 uppercase">Остались вопросы?</h3>
            <p className="text-slate-500 font-medium">Оставьте заявку, и наш менеджер проконсультирует вас по всем услугам и тарифам.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ваше имя</label>
              <input 
                required
                type="text"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Телефон</label>
              <input 
                required
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
              />
            </div>
            <div className="flex items-end">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full h-[60px] rounded-2xl shadow-xl shadow-brand-blue/20"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Отправка...' : 'Перезвоните мне'}
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>
          <p className="mt-6 text-[10px] text-slate-400 text-center md:text-left">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и обработки персональных данных.
          </p>
        </>
      )}
    </div>
  );
};
