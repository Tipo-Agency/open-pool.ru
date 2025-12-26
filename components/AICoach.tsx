import React, { useState } from 'react';
import { Sparkles, Bot, Send } from 'lucide-react';
import { getAiAdvice } from '../services/geminiService';
import { Button } from './ui';

export const AICoach: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('beginner');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setResponse(null);
    const advice = await getAiAdvice(goal, level);
    setResponse(advice);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft h-full relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Bot className="w-40 h-40 text-brand-blue" />
      </div>

      <div className="mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-sky rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-blue/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Тренер</h3>
        <p className="text-slate-500 text-sm">
          Умный помощник на базе Google Gemini. Составит план тренировки, даст совет по технике или питанию.
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        {!response ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-auto">
            <div className="space-y-3">
               <label className="text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">Уровень подготовки</label>
               <div className="grid grid-cols-3 gap-2">
                 {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                   <button
                     key={lvl}
                     type="button"
                     onClick={() => setLevel(lvl)}
                     className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${level === lvl ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                   >
                     {lvl === 'beginner' ? 'Новичок' : lvl === 'intermediate' ? 'Любитель' : 'Профи'}
                   </button>
                 ))}
               </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider ml-1 mb-2 block">Ваша цель</label>
              <div className="relative">
                <input 
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Например: проплыть 1км без остановки"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:border-brand-blue focus:ring-2 focus:ring-brand-light outline-none transition-all placeholder:text-slate-400"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-brand-dark disabled:opacity-50 transition-colors"
                >
                  {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mt-auto animate-fade-up">
            <div className="bg-brand-light rounded-2xl rounded-tl-none p-5 text-slate-900 text-sm leading-relaxed border border-blue-100 shadow-sm relative">
              <div className="absolute -top-3 left-0 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">AI Ответ</div>
              <p className="whitespace-pre-line">{response}</p>
            </div>
            <button 
              onClick={() => setResponse(null)}
              className="mt-4 w-full py-3 text-sm font-bold text-brand-blue hover:bg-brand-light rounded-xl transition-colors"
            >
              Задать новый вопрос
            </button>
          </div>
        )}
      </div>
    </div>
  );
};