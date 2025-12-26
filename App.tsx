import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { ModalProvider, useModal } from './contexts/ModalContext';
import { Home } from './pages/Home';
import { Tariffs } from './pages/Tariffs';
import { Schedule } from './pages/Schedule';
import { Team } from './pages/Team';
import { Corporate } from './pages/Corporate';
import { PageRoute } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { isOpen, closeModal, modalTitle } = useModal();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <ScrollToTop />
      <Navigation />
      
      <main className="flex-grow">
        <Routes>
          <Route path={PageRoute.HOME} element={<Home />} />
          <Route path={PageRoute.TARIFFS} element={<Tariffs />} />
          <Route path={PageRoute.SCHEDULE} element={<Schedule />} />
          <Route path={PageRoute.TEAM} element={<Team />} />
          <Route path={PageRoute.CORPORATE} element={<Corporate />} />
          {/* Fallback placeholders for other pages */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
      <ContactModal isOpen={isOpen} onClose={closeModal} title={modalTitle} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ModalProvider>
        <AppContent />
      </ModalProvider>
    </HashRouter>
  );
};

export default App;