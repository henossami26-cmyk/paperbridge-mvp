import React, { useState, useEffect } from 'react';
import LZString from 'lz-string';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

const DEFAULT_TEXT = `By signing this form, the applicant hereby consents to disclose their SIN pursuant to the program assessment. Notwithstanding any other provision herein, failure to remit sufficient documentation may render the application void.`;

const DICTIONARY_SAMPLE = {
  applicant: { simple: 'person applying', note: 'the person using the form' },
  hereby: { simple: 'now', note: 'formal word often used' },
  'pursuant to': { simple: 'according to', note: 'refers to a rule/law' },
  notwithstanding: { simple: 'even though', note: 'overrides another clause' }
};

function basicSimplify(text, level='simple'){
  // expanded patterns and varying strength
  let s = text
    .replace(/pursuant to/gi, level==='strong'?'according to':'under')
    .replace(/herein/gi, 'in this document')
    .replace(/hereby/gi, 'now')
    .replace(/notwithstanding/gi, 'even though')
    .replace(/remit/gi, 'send')
    .replace(/void/gi, 'invalid');

  if(level === 'strong'){
    s = s.replace(/\bapplicant\b/gi, 'person applying');
  }
  return s;
}

export default function Simplifier(){
  const [text, setText] = useState(DEFAULT_TEXT);
  const [level, setLevel] = useState('simple');
  const [result, setResult] = useState('');
  const [highlights, setHighlights] = useState([]);

  useEffect(()=> {
    const simplified = basicSimplify(text, level);
    setResult(simplified);

    // find replacements for highlight
    const found = [];
    Object.keys(DICTIONARY_SAMPLE).forEach(k => {
      const regex = new RegExp('\b' + k.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&') + '\b', 'gi');
      if(regex.test(text)) found.push(k);
    });
    setHighlights(found);
  }, [text, level]);

  function onCopy(){
    navigator.clipboard?.writeText(result);
    alert('Copied!');
  }

  function downloadTxt(){
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'paperbridge-simplified.txt');
  }

  function downloadPdf(){
    const doc = new jsPDF();
    doc.setFont('helvetica');
    const lines = doc.splitTextToSize(result, 180);
    doc.text(lines, 10, 10);
    doc.save('paperbridge-simplified.pdf');
  }

  function createShareLink(){
    const compressed = LZString.compressToEncodedURIComponent(result);
    const u = `${location.origin}${location.pathname}?t=${compressed}`;
    navigator.clipboard?.writeText(u);
    alert('Share link copied.');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card bg-[#111427] rounded-xl p-6 transition-all duration-300">
        <label className="font-semibold mb-2 block">Paste form text</label>
        <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-48 p-4 bg-[#0f1224] rounded-md text-sm font-mono"></textarea>

        <div className="flex gap-3 mt-4">
          <button onClick={() => setLevel('simple')} className="px-4 py-2 rounded bg-[#4f46e5]">Simplify</button>
          <button onClick={() => setLevel('medium')} className="px-4 py-2 rounded bg-[#222745]">Line-by-line</button>
          <button onClick={onCopy} className="px-4 py-2 rounded bg-[#222745]">Copy All</button>
          <button onClick={() => { setText(''); setResult(''); }} className="px-4 py-2 rounded bg-[#222745]">Clear</button>
        </div>
      </div>

      <div className="card bg-[#111427] rounded-xl p-6 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[#1f2440]">Mode: {level}</span>
            <span className="px-3 py-1 rounded-full bg-[#1f2440]">Terms: {highlights.length}</span>
          </div>
        </div>

        <div className="prose max-w-none text-white animate-fadeIn">
          <p>{result}</p>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={downloadTxt} className="px-4 py-2 rounded bg-[#222745]">Download .txt</button>
          <button onClick={downloadPdf} className="px-4 py-2 rounded bg-[#222745]">Download .pdf</button>
          <button onClick={createShareLink} className="px-4 py-2 rounded bg-[#222745]">Copy share link</button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Glossary highlights</h3>
          <ul className="list-disc list-inside mt-2">
            {highlights.map(h => (
              <li key={h}><strong>{h}</strong> — {DICTIONARY_SAMPLE[h].simple}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}