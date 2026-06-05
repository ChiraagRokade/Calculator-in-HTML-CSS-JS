import React from 'react';
import { Trash2, X, CornerDownLeft } from 'lucide-react';

export default function HistoryPanel({ history, isOpen, onClose, onClearHistory, onSelectHistoryItem }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-20 rounded-3xl glass p-5 flex flex-col justify-between transition-all duration-300 animate-in fade-in slide-in-from-right-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-calc-border mb-4">
        <h3 className="font-bold text-lg text-display-text flex items-center">
          Calculation History
        </h3>
        <div className="flex items-center space-x-1">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1.5 rounded-lg text-key-fn-text hover:bg-key-fn/20 transition-all duration-150 cursor-pointer active:scale-90"
              title="Clear History"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-display-subtext hover:text-display-text hover:bg-key-num/40 transition-all duration-150 cursor-pointer active:scale-90"
            title="Close Panel"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-display-subtext/50 text-sm">
            <span className="text-3xl mb-2">⏳</span>
            No history yet
          </div>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectHistoryItem(item.result)}
              className="p-2.5 rounded-xl bg-display-bg/30 hover:bg-display-bg/75 border border-calc-border/40 transition-all duration-200 cursor-pointer group flex flex-col text-right relative overflow-hidden"
            >
              {/* Insert indicator */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-key-op-text flex items-center space-x-1 text-[10px] font-semibold">
                <CornerDownLeft size={10} />
                <span>Insert</span>
              </div>
              <div className="text-[11px] text-display-subtext font-mono-display mb-0.5 truncate pl-12">
                {item.expression}
              </div>
              <div className="text-base text-display-text font-bold font-mono-display truncate pl-12">
                = {item.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
