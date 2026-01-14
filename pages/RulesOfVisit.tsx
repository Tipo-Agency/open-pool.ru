import React from 'react';
import { RulesSection1, RulesSection2, RulesSection3, SafetyInstructions } from '../components/RulesSections';

export const RulesOfVisit: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-[2.5rem] shadow-soft p-8 md:p-12 space-y-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              ПРАВИЛА ПОСЕЩЕНИЯ ОТКРЫТОГО ПЛАВАТЕЛЬНОГО БАССЕЙНА
            </h1>
            <p className="text-slate-600 leading-relaxed">
              Приобретение абонемента или оплата разового посещения означает согласие с правилами, установленными ООО «Спортинвест».
            </p>
            <p className="text-slate-600 leading-relaxed mt-2">
              За нарушение правил внутреннего распорядка «ОПБ» администрация оставляет за собой право удалить клиента, нарушившего правила с территории открытого бассейна и в одностороннем порядке расторгнуть договор с клиентом. Деньги за посещение, при котором клиент нарушил данные правила не подлежат возврату.
            </p>
            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
              <p className="text-amber-800 font-semibold">
                ВНИМАНИЕ: за травмы и несчастные случаи, связанные с нарушением правил посещения комплекса, сохранность вещей посетителей, персонал бассейна ответственности не несет.
              </p>
            </div>
          </div>

          <RulesSection1 />
          <RulesSection2 />
          <RulesSection3 />
          <SafetyInstructions />

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-slate-700 font-semibold mb-2">С УВАЖЕНИЕМ АДМИНИСТРАЦИЯ «ОТКРЫТОГО ПЛАВАТЕЛЬНОГО БАССЕЙНА».</p>
            <p className="text-slate-700">Наш адрес:</p>
            <p className="text-slate-700">680009, г. Хабаровск ул. Советская 1 корп 4.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
