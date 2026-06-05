import React from 'react';

export default function Keypad({ onKeyPress }) {
  const buttons = [
    { label: 'C', value: 'C', type: 'fn' },
    { label: '(', value: '(', type: 'fn' },
    { label: ')', value: ')', type: 'fn' },
    { label: '÷', value: '/', type: 'op' },
    { label: '7', value: '7', type: 'num' },
    { label: '8', value: '8', type: 'num' },
    { label: '9', value: '9', type: 'num' },
    { label: '×', value: '*', type: 'op' },
    { label: '4', value: '4', type: 'num' },
    { label: '5', value: '5', type: 'num' },
    { label: '6', value: '6', type: 'num' },
    { label: '−', value: '-', type: 'op' },
    { label: '1', value: '1', type: 'num' },
    { label: '2', value: '2', type: 'num' },
    { label: '3', value: '3', type: 'num' },
    { label: '+', value: '+', type: 'op' },
    { label: '%', value: '%', type: 'num' },
    { label: '0', value: '0', type: 'num' },
    { label: '.', value: '.', type: 'num' },
    { label: '=', value: '=', type: 'eq' },
  ];

  const getKeyClasses = (type) => {
    const base = 'flex items-center justify-center rounded-2xl text-xl md:text-2xl font-semibold select-none transition-all duration-100 active:scale-92 shadow-sm aspect-square cursor-pointer';
    
    switch (type) {
      case 'fn':
        return `${base} bg-key-fn hover:bg-key-fn-hover text-key-fn-text`;
      case 'op':
        return `${base} bg-key-op hover:bg-key-op-hover text-key-op-text font-bold`;
      case 'eq':
        return `${base} bg-[var(--key-eq-bg)] hover:opacity-95 text-key-eq-text font-bold shadow-md shadow-glow/40`;
      case 'num':
      default:
        return `${base} bg-key-num hover:bg-key-num-hover text-key-num-text`;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3.5 mt-5">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={() => onKeyPress(btn.value)}
          className={getKeyClasses(btn.type)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
