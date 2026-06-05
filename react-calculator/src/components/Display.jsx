import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function Display({ expression, result, onBackspace }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result && !expression) return;
    const textToCopy = result || expression;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative w-full rounded-2xl bg-display-bg p-6 flex flex-col justify-end min-h-[140px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-300">
      {/* Top controls: Copy & Backspace */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={handleCopy}
          disabled={!expression && !result}
          className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
            expression || result
              ? 'text-display-subtext hover:text-display-text hover:bg-key-num/40 cursor-pointer active:scale-90'
              : 'text-display-subtext/20 cursor-not-allowed'
          }`}
          title="Copy Result"
        >
          {copied ? (
            <Check size={16} className="text-emerald-400" />
          ) : (
            <Copy size={16} />
          )}
        </button>
        <button
          onClick={onBackspace}
          disabled={!expression}
          className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
            expression
              ? 'text-display-subtext hover:text-display-text hover:bg-key-num/40 cursor-pointer active:scale-90'
              : 'text-display-subtext/20 cursor-not-allowed'
          }`}
          title="Backspace"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
      </div>

      {/* Expression / Formula Log */}
      <div className="w-full text-right overflow-x-auto whitespace-nowrap scrollbar-thin text-display-subtext font-mono-display text-lg select-text mb-2 min-h-[28px] pr-2">
        {expression || ' '}
      </div>

      {/* Current Output / Result preview */}
      <div className="w-full text-right overflow-x-auto overflow-y-hidden whitespace-nowrap text-display-text font-mono-display text-4xl font-bold select-text tracking-tight pr-2">
        {result !== '' ? result : (expression ? '' : '0')}
      </div>
    </div>
  );
}
