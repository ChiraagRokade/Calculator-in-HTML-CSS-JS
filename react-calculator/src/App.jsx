import React, { useState, useEffect } from 'react';
import { History, Volume2, VolumeX } from 'lucide-react';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryPanel from './components/HistoryPanel';
import ThemeSelector from './components/ThemeSelector';

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('auracalc_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('auracalc_theme') || 'onyx';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('auracalc_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('auracalc_theme', theme);
  }, [theme]);

  // Sync history & sound to localStorage
  useEffect(() => {
    localStorage.setItem('auracalc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('auracalc_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Synthesize short tactile beep
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime); // Subtle light feedback
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.04);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // AudioContext might be blocked by browser autoplay policy until user interaction
    }
  };

  const handleKeyPress = (value) => {
    playBeep();
    if (value === '=') {
      evaluateExpression();
    } else if (value === 'C') {
      clearAll();
    } else {
      appendToExpression(value);
    }
  };

  const appendToExpression = (char) => {
    // If there is an error shown in display, clear it first
    const isError = result.toLowerCase().includes('error') || result.toLowerCase().includes('zero');
    
    // If a result is currently active and we type a digit, start fresh. If we type an operator, append to the result.
    if (result !== '' && !expression) {
      if (['+', '-', '*', '/'].includes(char)) {
        setExpression(result + char);
      } else {
        setExpression(char);
      }
      setResult('');
      return;
    }

    setExpression((prev) => {
      // If error, reset to the new character
      if (isError) {
        setResult('');
        return ['+', '*', '/'].includes(char) ? '' : char;
      }

      // Prevent starting with operators except '-'
      if (prev === '' && ['+', '*', '/'].includes(char)) {
        return prev;
      }
      // Prevent consecutive operators
      if (['+', '-', '*', '/'].includes(char) && ['+', '-', '*', '/'].includes(prev.slice(-1))) {
        return prev.slice(0, -1) + char;
      }
      // Basic check to prevent duplicate decimals in the current token
      if (char === '.') {
        const parts = prev.split(/[\+\-\*\/()]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
          return prev;
        }
      }
      return prev + char;
    });
  };

  const handleBackspace = () => {
    playBeep();
    if (result) {
      setResult('');
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  };

  const clearAll = () => {
    setExpression('');
    setResult('');
  };

  const evaluateExpression = () => {
    if (!expression) return;
    try {
      // Safety evaluation check
      let cleanExpr = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
      cleanExpr = cleanExpr.trim();
      
      // Basic balanced parenthesis check
      let openBrackets = (cleanExpr.match(/\(/g) || []).length;
      let closeBrackets = (cleanExpr.match(/\)/g) || []).length;
      if (openBrackets !== closeBrackets) {
        throw new Error("Mismatched Parentheses");
      }

      if (!/^[0-9+\-*/.() ]+$/.test(cleanExpr)) {
        throw new Error("Invalid Format");
      }

      const evalResult = Function("return (" + cleanExpr + ")")();
      if (evalResult === Infinity || evalResult === -Infinity) {
        throw new Error("Cannot divide by zero");
      }
      if (isNaN(evalResult)) {
        throw new Error("Invalid Format");
      }

      // Format result to prevent floating point bugs (e.g. 0.1 + 0.2 = 0.3)
      const formattedResult = Number(evalResult.toFixed(8)).toString();
      
      // Add to history list
      setHistory((prev) => [{ expression, result: formattedResult }, ...prev].slice(0, 50));
      setResult(formattedResult);
      setExpression('');
    } catch (error) {
      setResult(error.message.includes("zero") ? "Cannot divide by zero" : "Error");
    }
  };

  // Keyboard support bindings
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      if (key >= '0' && key <= '9') {
        appendToExpression(key);
      } else if (key === '.') {
        appendToExpression('.');
      } else if (key === '%') {
        appendToExpression('%');
      } else if (key === '+') {
        appendToExpression('+');
      } else if (key === '-') {
        appendToExpression('-');
      } else if (key === '*') {
        appendToExpression('*');
      } else if (key === '/') {
        appendToExpression('/');
      } else if (key === '(') {
        appendToExpression('(');
      } else if (key === ')') {
        appendToExpression(')');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        evaluateExpression();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expression, result, soundEnabled, history]);

  const selectHistoryItem = (val) => {
    playBeep();
    setExpression(val);
    setResult('');
    setIsHistoryOpen(false);
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-br from-bg-gradient-from to-bg-gradient-to transition-all duration-500 overflow-hidden">
      {/* Dynamic Animated Ambient Orbs */}
      <div className="absolute top-[15%] left-[20%] w-80 h-80 rounded-full bg-glow opacity-25 blur-[100px] animate-orb-1 pointer-events-none"></div>
      <div className="absolute bottom-[15%] right-[20%] w-96 h-96 rounded-full bg-glow opacity-20 blur-[110px] animate-orb-2 pointer-events-none"></div>

      {/* Main Glassmorphic Calculator Container */}
      <div className="relative w-[340px] rounded-3xl p-6 glass flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300">
        
        {/* Decorative glass glare overlay */}
        <div className="absolute inset-0 glass-reflection opacity-25 pointer-events-none rounded-3xl"></div>

        {/* Top bar with Theme selector and Actions */}
        <div className="flex items-center justify-between mb-5 z-10">
          <ThemeSelector activeTheme={theme} onChangeTheme={setTheme} />
          
          <div className="flex items-center space-x-2">
            {/* Sound Toggle */}
            <button
              onClick={() => { playBeep(); setSoundEnabled(!soundEnabled); }}
              className="p-1.5 rounded-lg text-display-subtext hover:text-display-text hover:bg-key-num/40 transition-all duration-150 cursor-pointer active:scale-90"
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* History Toggle */}
            <button
              onClick={() => { playBeep(); setIsHistoryOpen(true); }}
              className="p-1.5 rounded-lg text-display-subtext hover:text-display-text hover:bg-key-num/40 transition-all duration-150 cursor-pointer active:scale-90"
              title="Calculation History"
            >
              <History size={16} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4.5 z-10 select-none">
          <h1 className="text-[17px] font-extrabold tracking-[0.25em] text-display-text opacity-85 select-none">A U R A C A L C</h1>
        </div>

        {/* Display screen */}
        <div className="z-10">
          <Display
            expression={expression}
            result={result}
            onBackspace={handleBackspace}
          />
        </div>

        {/* Keypad */}
        <div className="z-10">
          <Keypad onKeyPress={handleKeyPress} />
        </div>

        {/* History overlay panel */}
        <HistoryPanel
          history={history}
          isOpen={isHistoryOpen}
          onClose={() => { playBeep(); setIsHistoryOpen(false); }}
          onClearHistory={() => { playBeep(); setHistory([]); }}
          onSelectHistoryItem={selectHistoryItem}
        />
      </div>
    </div>
  );
}
