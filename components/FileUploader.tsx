import React, { useRef } from 'react';
import { Upload, FileCode } from 'lucide-react';

interface FileUploaderProps {
  onFileLoaded: (content: string, fileName: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/html' && !file.name.endsWith('.html')) {
      alert('Пожалуйста, выберите файл .html');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'text/html' || file.name.endsWith('.html'))) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onFileLoaded(ev.target?.result as string, file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <div className="mb-4 p-4 bg-blue-500/20 rounded-full group-hover:scale-110 transition-transform">
          <Upload className="w-10 h-10 text-blue-400" />
        </div>
        <p className="mb-2 text-xl font-semibold text-white">
          Загрузите HTML игру
        </p>
        <p className="mb-4 text-sm text-slate-400">
          Нажмите для выбора или перетащите файл сюда
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full">
          <FileCode className="w-4 h-4" />
          <span>Поддерживается только .html</span>
        </div>
      </div>
      <input 
        type="file" 
        className="hidden" 
        accept=".html" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;