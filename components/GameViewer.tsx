import React, { useEffect, useRef } from 'react';
import { ViewMode } from '../types';

interface GameViewerProps {
  code: string;
  mode: ViewMode;
}

const GameViewer: React.FC<GameViewerProps> = ({ code, mode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update iframe content when code changes
  useEffect(() => {
    if (mode === ViewMode.PREVIEW && iframeRef.current) {
      // Using srcDoc is safer and easier for dynamic content updates without server
      iframeRef.current.srcdoc = code;
    }
  }, [code, mode]);

  if (mode === ViewMode.CODE) {
    return (
      <div className="w-full h-full bg-[#1e1e1e] text-gray-300 p-4 font-mono text-sm overflow-auto rounded-xl shadow-inner border border-slate-700">
        <pre className="whitespace-pre-wrap break-words">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-lg border border-slate-700 relative">
      <div className="absolute top-0 left-0 right-0 bg-slate-100 text-slate-500 text-xs px-2 py-1 border-b border-slate-200 flex justify-between items-center z-10">
        <span>Preview Mode</span>
        <span className="text-[10px] uppercase tracking-wider">Interactive</span>
      </div>
      <iframe
        ref={iframeRef}
        title="Game Preview"
        className="w-full h-full pt-6"
        sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
      />
    </div>
  );
};

export default GameViewer;