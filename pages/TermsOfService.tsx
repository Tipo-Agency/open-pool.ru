import React, { useState } from 'react';
import { SingleVisitTerms, SubscriptionTerms } from '../components/TermsSections';

export const TermsOfService: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'subscription'>('single');

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-[2.5rem] shadow-soft p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8">
            ПУБЛИЧНАЯ ОФЕРТА О ЗАКЛЮЧЕНИИ ДОГОВОРА
          </h1>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-6 py-3 font-bold transition-colors ${
                activeTab === 'single'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Разовые посещения
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-6 py-3 font-bold transition-colors ${
                activeTab === 'subscription'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Абонементы
            </button>
          </div>

          <div className="prose prose-slate max-w-none">
            {activeTab === 'single' ? <SingleVisitTerms /> : <SubscriptionTerms />}
          </div>
        </div>
      </div>
    </div>
  );
};
