import React from 'react';

export default function ThemeSelector({ activeTheme, onChangeTheme }) {
  const themes = [
    {
      id: 'onyx',
      name: 'Onyx',
      colorClass: 'bg-slate-900 border-slate-700 hover:border-slate-500',
      activeBorderClass: 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 scale-100',
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      colorClass: 'bg-violet-950 border-pink-500 hover:border-pink-400',
      activeBorderClass: 'ring-2 ring-pink-500 ring-offset-2 ring-offset-violet-950 scale-100',
    },
    {
      id: 'emerald',
      name: 'Emerald',
      colorClass: 'bg-emerald-950 border-emerald-500 hover:border-emerald-400',
      activeBorderClass: 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-emerald-950 scale-100',
    },
    {
      id: 'peach',
      name: 'Peach',
      colorClass: 'bg-orange-100 border-orange-400 hover:border-orange-500',
      activeBorderClass: 'ring-2 ring-orange-500 ring-offset-2 ring-offset-orange-100 scale-100',
    },
  ];

  return (
    <div className="flex items-center space-x-1.5" title="Switch Theme">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onChangeTheme(theme.id)}
          className={`w-3.5 h-3.5 rounded-full border cursor-pointer transition-all duration-200 ${theme.colorClass} ${
            activeTheme === theme.id ? theme.activeBorderClass : 'scale-90 opacity-60 hover:opacity-100 hover:scale-100'
          }`}
          aria-label={`Switch to ${theme.name} theme`}
        />
      ))}
    </div>
  );
}
