import React from 'react';
import { PrivacySection1, PrivacySection2, PrivacySection3, PrivacySection4 } from '../components/PrivacySections';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-[2.5rem] shadow-soft p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ И БИОМЕТРИЧЕСКИХ ДАННЫХ
          </h1>
          <p className="text-slate-500 mb-8 text-sm">
            (в соответствии с Федеральным законом от 27.07.2006 N 152-ФЗ)
          </p>
          
          <div className="prose prose-slate max-w-none space-y-8">
            <p className="text-slate-700 leading-relaxed">
              Клиент принимает решение о предоставлении своих персональных и биометрических данных Обществу с ограниченной ответственностью «Спортинвест» ИНН 2724204411 ОГРН 1152724006247 (далее – «Оператор персональных данных») и даю согласие на их обработку свободно, своей волей и в своем интересе на указанных ниже условиях:
            </p>

            <PrivacySection1 />
            <PrivacySection2 />
            <PrivacySection3 />
            <PrivacySection4 />

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-slate-700 leading-relaxed mb-6">
                Подтверждаю, что ознакомлен(а) с положениями Федерального закона от 27.07.2006 №152-ФЗ «О персональных данных», права и обязанности в области защиты персональных данных мне разъяснены.
              </p>
              
              <div className="mt-8 space-y-2">
                <p className="text-slate-600 font-semibold">УТВЕРЖДАЮ</p>
                <p className="text-slate-600">Генеральный директор</p>
                <p className="text-slate-600">ООО «Спортинвест»</p>
                <p className="text-slate-600">Донских С.Г.</p>
                <p className="text-slate-600">«01» января 2023 год</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
