import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Phone, User } from 'lucide-react';
import { Button } from './ui';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, title = 'Оставить заявку' }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', phone: '' });
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 3000);
    }, 1500);
  };

  const handleClose = () => {
    if (status !== 'loading') {
      setStatus('idle');
      setFormData({ name: '', phone: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600 hover:text-slate-900"
          disabled={status === 'loading'}
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-10 animate-fade-up">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Заявка принята!</h3>
            <p className="text-slate-500">Мы перезвоним вам в течение 15 минут.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-4 uppercase">{title}</h3>
              <p className="text-slate-500 font-medium">Оставьте свои контакты, и мы свяжемся с вами в ближайшее время.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
            </form>
            
            <p className="mt-6 text-[10px] text-slate-400 text-center">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и обработки персональных данных.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

