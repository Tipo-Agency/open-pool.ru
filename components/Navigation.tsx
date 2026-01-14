import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PageRoute } from '../types';
import { Button } from './ui';
import { Logo } from './Logo';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Главная', path: PageRoute.HOME },
    { name: 'Тарифы', path: PageRoute.TARIFFS },
    { name: 'Расписание', path: PageRoute.SCHEDULE },
    { name: 'Команда', path: PageRoute.TEAM },
    { name: 'Корпоративным', path: PageRoute.CORPORATE },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b-2 border-slate-200">
      <div className="container mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to={PageRoute.HOME} className="flex items-center gap-2 shrink-0">
            <Logo className="h-14 md:h-[74px] w-auto" variant="color" />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                  location.pathname === link.path 
                    ? 'text-brand-blue' 
                    : 'text-slate-600 hover:text-brand-blue'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block shrink-0">
            <Link to={PageRoute.TARIFFS}>
              <Button variant="primary" size="md" className="px-8">
                Купить билет
              </Button>
            </Link>
          </div>

          {/* Mobile burger button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg"
            aria-label="Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t-2 border-slate-200 bg-white shadow-inner pb-6">
            <div className="pt-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-6 py-4 text-lg font-bold rounded-xl transition-colors ${
                    location.pathname === link.path
                      ? 'text-brand-blue bg-brand-blue/10'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-6">
                <Link to={PageRoute.TARIFFS} onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full">
                    Купить билет
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
