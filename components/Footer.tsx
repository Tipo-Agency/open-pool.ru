
import React from 'react';
import { MapPin, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 rounded-t-[3rem] mt-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-12">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
                <Logo className="h-12 w-auto" variant="white" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Хабаровск, ул. Советская 60.<br/>
              Единственный открытый бассейн, работающий круглый год. Место силы и здоровья.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Навигация</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-brand-blue transition-colors">О комплексе</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Вакансии</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Для бизнеса</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Пресс-центр</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Контакты</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-blue shrink-0" />
                <span>г. Хабаровск, Советская ул., 60</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-blue shrink-0" />
                <span>+7 (4212) 12-34-56</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-blue shrink-0" />
                <span>info@open-pool.ru</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Социальные сети</h4>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-medium order-2 md:order-1">© 2024 ОПБ Хабаровск. Все права защищены.</p>
          
          <div className="flex items-center gap-8 order-1 md:order-2">
            <a
              href="https://dontask.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group/credit"
            >
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest transition-colors group-hover/credit:text-white/40">
                DESIGNED BY
              </span>
              <div className="flex items-center gap-0.5 text-[11px] md:text-[13px] font-black italic uppercase transition-all group-hover/credit:tracking-[0.1em]">
                <span className="text-white">DONT</span>
                <span className="text-[#6768E8] ml-1">ASK</span>
                <span className="ml-1 flex">
                  <span className="studio-outline">STU</span>
                  <span className="text-white">D</span>
                  <span className="studio-outline">IO</span>
                </span>
              </div>
            </a>
          </div>

          <div className="flex gap-8 order-3 text-xs text-slate-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
