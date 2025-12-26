
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PageRoute } from '../types';
import { Button } from './ui';
import { Logo } from './Logo';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location]);

  const navLinks = [
    { name: 'Главная', path: PageRoute.HOME },
    { name: 'Тарифы', path: PageRoute.TARIFFS },
    { name: 'Расписание', path: PageRoute.SCHEDULE },
    { name: 'Команда', path: PageRoute.TEAM },
    { name: 'Корпоративным', path: PageRoute.CORPORATE },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300 py-3 md:py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo - Increased Size (~1.4x) */}
        <Link to={PageRoute.HOME} className="flex items-center gap-2 group relative z-50 shrink-0">
          <div className="transition-transform duration-300 group-hover:scale-105">
             <Logo className="h-14 md:h-[74px] w-auto transition-all" variant="color" />
          </div>
        </Link>

        {/* Desktop Nav - Clean Corporate Style */}
        <div className="hidden lg:flex items-center gap-8 mx-auto">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-sm font-bold uppercase tracking-wider transition-all duration-200 relative group py-2 ${
                location.pathname === link.path 
                  ? 'text-brand-blue' 
                  : 'text-slate-600 hover:text-brand-blue'
              }`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue transform origin-left transition-transform duration-300 ${
                location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
          ))}
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4 relative z-50 shrink-0">
          <Link to={PageRoute.TARIFFS}>
            <Button variant="primary" size="md" className="hidden md:inline-flex shadow-brand-blue/20 hover:shadow-brand-blue/40 px-8">
              Купить билет
            </Button>
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out pt-32 px-6 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-3xl font-display font-bold py-4 border-b border-slate-100 ${
                location.pathname === link.path ? 'text-brand-blue' : 'text-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to={PageRoute.TARIFFS} className="w-full mt-8">
            <Button variant="primary" size="lg" className="w-full justify-center shadow-xl">Купить билет</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
