import React, { useState } from 'react';
import Simplifier from './components/Simplifier';
import ThemePanel from './components/ThemePanel';

export default function App(){
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1224] text-[#e3e6ef] transition-colors duration-300">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">🌉</div>
          <h1 className="text-2xl font-semibold">PaperBridge — Understand Every Form</h1>
        </div>
        <div>
          <button aria-label="Open theme controls" onClick={() => setThemeOpen(true)} className="p-2 rounded-full bg-[#111427] hover:bg-[#222745] transition-colors">⚙️</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-12">
        <Simplifier />
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-6 text-sm opacity-80">
        Built for clarity • Client-only demo
      </footer>

      {themeOpen && <ThemePanel onClose={() => setThemeOpen(false)} />}
    </div>
  );
}