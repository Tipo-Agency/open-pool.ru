
import React from 'react';
import { MapPin, Phone, Instagram, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { PageRoute } from '../types';

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
              Советская ул., 1к 4<br/>
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
                <MapPin className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <span>Советская ул., 1к 4</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-blue shrink-0" />
                <a href="tel:+74212464912" className="hover:text-white transition-colors">8 (4212) 46-49-16</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>Будни: 06:00-22:00</div>
                  <div>Выходные: 07:00-22:00</div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Социальные сети</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/openpool_khv?igshid=YmMyMTA2M2Y=" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://t.me/openpool27" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                <img src="/telegram.svg" alt="Telegram" className="w-5 h-5" />
              </a>
              <a href="https://vk.com/openpool_khv" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                <img src="/vk.svg" alt="VK" className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                <img src="/max.svg" alt="Max" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-medium order-2 md:order-1">© 2026 ОПБ Хабаровск. Все права защищены.</p>
          
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
              <img 
                src="/Group.svg" 
                alt="Dont Ask Studio" 
                className="h-5 md:h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>

          <div className="flex gap-8 order-3 text-xs text-slate-500 font-medium">
            <Link to={PageRoute.PRIVACY} className="hover:text-white transition-colors">Политика конфиденциальности</Link>
            <Link to={PageRoute.TERMS} className="hover:text-white transition-colors">Публичная оферта</Link>
            <Link to={PageRoute.RULES} className="hover:text-white transition-colors">Правила посещения</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
