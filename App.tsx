import React, { useState, useCallback } from 'react';
import { Download, RefreshCw, Code, Eye, RotateCcw } from 'lucide-react';
import FileUploader from './components/FileUploader';
import GameViewer from './components/GameViewer';
import PromptPanel from './components/PromptPanel';
import { improveGameCode } from './services/geminiService';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [originalCode, setOriginalCode] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('game.html');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PREVIEW);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileLoaded = useCallback((content: string, name: string) => {
    setGameCode(content);
    setOriginalCode(content); // Save original state for reset
    setFileName(name);
    setError(null);
  }, []);

  const handleImprovement = async (instruction: string) => {
    if (!gameCode) return;

    setIsLoading(true);
    setError(null);

    try {
      const improvedCode = await improveGameCode(gameCode, instruction);
      setGameCode(improvedCode);
    } catch (err) {
      setError("Не удалось улучшить код. Проверьте API ключ или попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!gameCode) return;
    
    const blob = new Blob([gameCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `improved_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить все изменения?')) {
      setGameCode(originalCode);
    }
  };

  const handleClear = () => {
     if (confirm('Загрузить другой файл? Текущий прогресс будет потерян.')) {
      setGameCode(null);
      setOriginalCode(null);
      setFileName('');
      setError(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">GameImprover AI</h1>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
          </div>
        </div>
        
        {gameCode && (
          <div className="flex items-center gap-3">
             <button 
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Загрузить другую
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Скачать HTML
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        {!gameCode ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] animate-fade-in">
            <div className="max-w-xl w-full">
              <h2 className="text-3xl font-bold text-center mb-2">Улучшите свою игру с ИИ</h2>
              <p className="text-slate-400 text-center mb-8">
                Загрузите простой HTML-файл игры, и Gemini поможет вам добавить функции, 
                изменить дизайн или исправить ошибки.
              </p>
              <FileUploader onFileLoaded={handleFileLoaded} />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                  <h3 className="font-semibold text-blue-400 mb-1">Мгновенный результат</h3>
                  <p className="text-xs text-slate-500">Смотрите изменения сразу в браузере</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                  <h3 className="font-semibold text-purple-400 mb-1">Без ограничений</h3>
                  <p className="text-xs text-slate-500">Меняйте логику, физику и графику</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                  <h3 className="font-semibold text-green-400 mb-1">Чистый код</h3>
                  <p className="text-xs text-slate-500">ИИ генерирует валидный HTML/JS</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            {/* Left Panel: Controls */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <PromptPanel 
                isLoading={isLoading} 
                onSubmit={handleImprovement} 
              />
              
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex-1 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">Управление</h3>
                   <button 
                    onClick={handleReset}
                    className="text-xs flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
                    title="Вернуть исходный код"
                  >
                    <RotateCcw className="w-3 h-3" /> Сброс
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">Текущий файл</div>
                    <div className="font-mono text-sm text-blue-300 truncate">{fileName}</div>
                  </div>

                   <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">Статус</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                      <span className="text-sm">{isLoading ? 'Генерация кода...' : 'Готов к работе'}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="text-xs text-slate-500 mt-4 leading-relaxed">
                    Этот инструмент использует Gemini 2.5 Flash для переписывания всего HTML файла. 
                    Сложные игры могут обрабатываться с ошибками. Рекомендуется для простых аркад и прототипов.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Preview/Code */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between bg-slate-800 p-2 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-md">
                  <button
                    onClick={() => setViewMode(ViewMode.PREVIEW)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all ${viewMode === ViewMode.PREVIEW ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Eye className="w-4 h-4" /> Предпросмотр
                  </button>
                  <button
                    onClick={() => setViewMode(ViewMode.CODE)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all ${viewMode === ViewMode.CODE ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Code className="w-4 h-4" /> Код
                  </button>
                </div>
                <div className="text-xs text-slate-500 px-2">
                  {gameCode.length} символов
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <GameViewer code={gameCode} mode={viewMode} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;