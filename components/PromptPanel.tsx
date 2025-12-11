import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface PromptPanelProps {
  isLoading: boolean;
  onSubmit: (prompt: string) => void;
}

const PromptPanel: React.FC<PromptPanelProps> = ({ isLoading, onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col gap-3 shadow-lg">
      <div className="flex items-center gap-2 text-blue-400 font-medium">
        <Sparkles className="w-5 h-5" />
        <h3>Что улучшить?</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Например: Сделай врагов быстрее, добавь звук прыжка или поменяй фон на ночной город..."
          className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className={`
            flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all
            ${!prompt.trim() || isLoading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>ИИ думает...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Применить изменения</span>
            </>
          )}
        </button>
      </form>
      
      <div className="text-xs text-slate-500 mt-1">
        Совет: Будьте конкретны в своих желаниях для лучшего результата.
      </div>
    </div>
  );
};

export default PromptPanel;