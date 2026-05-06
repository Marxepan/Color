import React, { useState, useEffect } from 'react';
import { Palette, Plus, Droplet, Trash2, Save, Download, Copy, Check } from 'lucide-react';
import { mixColors, getContrastColor, generateSteps, hexToRgb, rgbToHex } from './lib/colors';
import { Palette as PaletteType } from './types';

export default function App() {
  const [colorA, setColorA] = useState('#3b82f6');
  const [colorB, setColorB] = useState('#ef4444');
  const [mixWeight, setMixWeight] = useState(0.5);
  const [resultColor, setResultColor] = useState(mixColors('#3b82f6', '#ef4444', 0.5));
  
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [palettes, setPalettes] = useState<PaletteType[]>([]);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Sync result color when A, B, or weight changes
  useEffect(() => {
    setResultColor(mixColors(colorA, colorB, mixWeight));
  }, [colorA, colorB, mixWeight]);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleSaveColor = (color: string) => {
    if (!savedColors.includes(color)) {
      setSavedColors([color, ...savedColors]);
    }
  };

  const removeSavedColor = (colorToRemove: string) => {
    setSavedColors(savedColors.filter(c => c !== colorToRemove));
  };

  const handleCreatePalette = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaletteName.trim()) return;
    
    const newPalette: PaletteType = {
      id: crypto.randomUUID(),
      name: newPaletteName.trim(),
      colors: []
    };
    setPalettes([newPalette, ...palettes]);
    setNewPaletteName('');
  };

  const addColorToPalette = (paletteId: string, color: string) => {
    setPalettes(palettes.map(p => {
      if (p.id === paletteId && !p.colors.includes(color)) {
        return { ...p, colors: [...p.colors, color] };
      }
      return p;
    }));
  };

  const removeColorFromPalette = (paletteId: string, colorToRemove: string) => {
    setPalettes(palettes.map(p => {
      if (p.id === paletteId) {
        return { ...p, colors: p.colors.filter(c => c !== colorToRemove) };
      }
      return p;
    }));
  };

  const removePalette = (paletteId: string) => {
    setPalettes(palettes.filter(p => p.id !== paletteId));
  };

  const steps = generateSteps(colorA, colorB, 7);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center text-white shadow-sm">
            <Droplet size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">ChromaMix</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Mixer Workspace */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Result Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="h-48 md:h-64 flex flex-col items-center justify-center transition-colors duration-200 relative group"
                style={{ backgroundColor: resultColor }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
                  <button 
                    onClick={() => handleCopy(resultColor)}
                    className="flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-white shadow-sm transition-all"
                    style={{ color: getContrastColor(resultColor) === '#ffffff' ? '#111827' : '#ffffff', backgroundColor: getContrastColor(resultColor) === '#ffffff' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)' }}
                  >
                    {copiedColor === resultColor ? <Check size={18} /> : <Copy size={18} />}
                    {copiedColor === resultColor ? 'Skopiowano!' : 'Kopiuj HEX'}
                  </button>
                </div>
                <div 
                  className="text-4xl md:text-6xl font-bold font-mono tracking-tighter mix-blend-difference text-white"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                >
                  {resultColor.toUpperCase()}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Wymieszany kolor</h2>
                    <p className="text-sm text-gray-500">Dostosuj proporcje poniżej lub zapisz wynik.</p>
                  </div>
                  <button 
                    onClick={() => handleSaveColor(resultColor)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    <Save size={18} />
                    Zapisz kolor
                  </button>
                </div>
              </div>
            </div>

            {/* Mixing Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Palette size={20} className="text-gray-400" />
                Mieszalnik
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Color A */}
                <div className="flex-1 w-full text-center space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Kolor A</label>
                  <div className="relative inline-block w-full">
                    <input 
                      type="color" 
                      value={colorA}
                      onChange={(e) => setColorA(e.target.value)}
                      className="w-full h-16 cursor-pointer border-0 p-0 rounded-xl overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/10"></div>
                  </div>
                  <div className="font-mono text-xs text-gray-500 uppercase">{colorA}</div>
                </div>

                {/* Slider */}
                <div className="flex-[2] w-full px-4 text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Proporcje mieszania</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={mixWeight}
                    onChange={(e) => setMixWeight(parseFloat(e.target.value))}
                    className="w-full accent-gray-900 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                    <span>{Math.round((1 - mixWeight) * 100)}%</span>
                    <span>{Math.round(mixWeight * 100)}%</span>
                  </div>
                </div>

                {/* Color B */}
                <div className="flex-1 w-full text-center space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Kolor B</label>
                  <div className="relative inline-block w-full">
                    <input 
                      type="color" 
                      value={colorB}
                      onChange={(e) => setColorB(e.target.value)}
                      className="w-full h-16 cursor-pointer border-0 p-0 rounded-xl overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/10"></div>
                  </div>
                  <div className="font-mono text-xs text-gray-500 uppercase">{colorB}</div>
                </div>
              </div>

              {/* Gradient Steps */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Paleta pośrednia</label>
                <div className="flex h-12 rounded-xl overflow-hidden ring-1 ring-black/5 shadow-inner">
                  {steps.map((step, idx) => (
                    <button
                      key={idx}
                      className="flex-1 transition-transform hover:scale-110 hover:z-10 relative focus:outline-none focus:z-10 focus:ring-2 focus:ring-gray-900"
                      style={{ backgroundColor: step }}
                      onClick={() => {
                        setColorA(step);
                        // Optional: Reset mix weight or just set color A
                      }}
                      title={`Ustaw jako Kolor A: ${step}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RGB Sliders for manual tweak */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                Dostrajanie RGB (Kolor A)
              </h3>
              
              <div className="space-y-4">
                {(() => {
                  const rgb = hexToRgb(colorA) || { r: 0, g: 0, b: 0 };
                  const updateRgb = (channel: 'r'|'g'|'b', val: number) => {
                    const newRgb = { ...rgb, [channel]: val };
                    setColorA(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                  };
                  return (
                    <>
                      <div className="flex items-center gap-4">
                        <span className="w-4 font-mono font-medium text-red-500">R</span>
                        <input type="range" min="0" max="255" value={rgb.r} onChange={e => updateRgb('r', parseInt(e.target.value))} className="flex-1 accent-red-500" />
                        <span className="w-8 text-right font-mono text-sm">{rgb.r}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="w-4 font-mono font-medium text-green-500">G</span>
                        <input type="range" min="0" max="255" value={rgb.g} onChange={e => updateRgb('g', parseInt(e.target.value))} className="flex-1 accent-green-500" />
                        <span className="w-8 text-right font-mono text-sm">{rgb.g}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="w-4 font-mono font-medium text-blue-500">B</span>
                        <input type="range" min="0" max="255" value={rgb.b} onChange={e => updateRgb('b', parseInt(e.target.value))} className="flex-1 accent-blue-500" />
                        <span className="w-8 text-right font-mono text-sm">{rgb.b}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

          </div>

          {/* Right Column: Saved Colors & Palettes */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Saved Colors */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Zapisane Kolory</h3>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">{savedColors.length}</span>
              </div>
              
              {savedColors.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <p className="text-sm text-gray-500">Nie masz jeszcze żadnych zapisanych kolorów.<br/>Skorzystaj z sekcji mieszalnika, aby coś stworzyć!</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-5 gap-3">
                  {savedColors.map(color => (
                    <div key={color} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm border border-black/5" style={{ backgroundColor: color }}>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                        <button 
                          onClick={() => handleCopy(color)}
                          className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white transition-colors"
                          title="Kopiuj"
                        >
                          <Copy size={14} />
                        </button>
                        <button 
                          onClick={() => removeSavedColor(color)}
                          className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md text-white transition-colors"
                          title="Usuń"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {/* Optional: Add to palette menu or drag and drop. For simplicity, we'll click to add to the first palette. */}
                      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         {palettes.length > 0 && (
                            <button 
                              onClick={() => addColorToPalette(palettes[0].id, color)}
                              className="p-1 bg-gray-900/80 hover:bg-gray-900 rounded-full text-white"
                              title="Dodaj do pierwszej palety"
                            >
                              <Plus size={12} />
                            </button>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Palettes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[400px]">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Twoje Palety</h3>
              
              <form onSubmit={handleCreatePalette} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Nazwa nowej palety..." 
                  value={newPaletteName}
                  onChange={(e) => setNewPaletteName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button 
                  type="submit"
                  disabled={!newPaletteName.trim()}
                  className="bg-gray-900 text-white p-2 w-10 flex border border-gray-900 border-l-0 items-center justify-center rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={18} />
                </button>
              </form>

              <div className="flex-1 space-y-6">
                {palettes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <Palette size={48} className="text-gray-200 mb-4" strokeWidth={1} />
                    <p className="text-sm">Stwórz swoją pierwszą paletę używając pola powyżej.</p>
                  </div>
                ) : (
                  palettes.map(palette => (
                    <div key={palette.id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                        <h4 className="font-medium text-gray-900 text-sm truncate pr-4">{palette.name}</h4>
                        <button 
                          onClick={() => removePalette(palette.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="p-3">
                        {palette.colors.length === 0 ? (
                          <div className="text-xs text-gray-400 text-center py-4">Brak kolorów w palecie.</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                             {palette.colors.map((color, idx) => (
                                <div key={`${color}-${idx}`} className="group relative w-10 h-10 rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: color }}>
                                   <button 
                                      onClick={() => removeColorFromPalette(palette.id, color)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                </div>
                             ))}
                          </div>
                        )}
                        
                        {/* Selector to add from saved */}
                        {savedColors.length > 0 && (
                          <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-400">Dodaj...</span>
                            <div className="flex overflow-x-auto pb-2 gap-1 no-scrollbar flex-1">
                              {savedColors.filter(c => !palette.colors.includes(c)).map(color => (
                                <button
                                  key={`add-${color}`}
                                  onClick={() => addColorToPalette(palette.id, color)}
                                  className="shrink-0 w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                  title="Dodaj do palety"
                                />
                              ))}
                              {savedColors.filter(c => !palette.colors.includes(c)).length === 0 && (
                                <span className="text-xs text-gray-400">Wszystkie dodane!</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
