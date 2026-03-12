import type { AppSettings, HandMode, PracticeMode } from '../types'

interface Props {
  settings: AppSettings
  pieceDefaultTempo: number
  onUpdate: (patch: Partial<AppSettings>) => void
  onClose: () => void
}

function Slider({ label, min, max, step, value, onChange, format }: {
  label: string; min: number; max: number; step: number
  value: number; onChange: (v: number) => void; format?: (v: number) => string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-slate-300 text-sm">{label}</span>
        <span className="text-blue-400 font-mono text-sm font-semibold">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full accent-blue-500 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-600">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-300 text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-blue-500' : 'bg-slate-600'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
          ${value ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

const HAND_OPTIONS: { value: HandMode; label: string }[] = [
  { value: 'both', label: 'Both Hands' },
  { value: 'RH', label: 'Right Hand Only' },
  { value: 'LH', label: 'Left Hand Only' },
]

export function SettingsPanel({ settings, pieceDefaultTempo, onUpdate, onClose }: Props) {
  const effectiveTempo = settings.tempo > 0 ? settings.tempo : pieceDefaultTempo

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700 z-50
        flex flex-col overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-white font-semibold text-lg">Settings</h2>
          <button onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-6">
          {/* Tempo */}
          <section>
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Tempo</h3>
            <Slider
              label="BPM"
              min={30} max={160} step={2}
              value={effectiveTempo}
              onChange={v => onUpdate({ tempo: v })}
              format={v => `♩=${v}`}
            />
            <button
              onClick={() => onUpdate({ tempo: 0 })}
              className="mt-2 text-xs text-slate-500 hover:text-slate-300 underline">
              Reset to piece default ({pieceDefaultTempo})
            </button>
          </section>

          {/* Look-Ahead */}
          <section>
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Look-Ahead Training</h3>
            <div className="flex flex-col gap-4">
              <Slider
                label="Bars Ahead (lookahead window)"
                min={0.5} max={3} step={0.5}
                value={settings.lookAhead.lookaheadBars}
                onChange={v => onUpdate({ lookAhead: { ...settings.lookAhead, lookaheadBars: v } })}
                format={v => `${v} bar${v !== 1 ? 's' : ''}`}
              />
              <Slider
                label="Fade Speed (beats until faded)"
                min={0.5} max={6} step={0.5}
                value={settings.lookAhead.fadeDuration}
                onChange={v => onUpdate({ lookAhead: { ...settings.lookAhead, fadeDuration: v } })}
                format={v => `${v} beat${v !== 1 ? 's' : ''}`}
              />
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <p className="text-slate-500 text-xs">Presets:</p>
              {[
                { label: '🌱 Beginner', bars: 2, fade: 4 },
                { label: '🎵 Intermediate', bars: 1, fade: 2 },
                { label: '⚡ Advanced', bars: 0.5, fade: 1 },
              ].map(p => (
                <button key={p.label}
                  onClick={() => onUpdate({ lookAhead: { lookaheadBars: p.bars, fadeDuration: p.fade } })}
                  className="text-left text-xs text-blue-400 hover:text-blue-300 underline">
                  {p.label}: {p.bars} bar{p.bars !== 1 ? 's' : ''} ahead, {p.fade} beat fade
                </button>
              ))}
            </div>
          </section>

          {/* Hand Mode */}
          <section>
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Hand Mode</h3>
            <div className="flex flex-col gap-2">
              {HAND_OPTIONS.map(opt => (
                <button key={opt.value}
                  onClick={() => onUpdate({ handMode: opt.value })}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition-colors
                    ${settings.handMode === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Practice Mode */}
          <section>
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Practice Mode</h3>
            <div className="flex flex-col gap-2">
              {([
                { value: 'sightReading' as PracticeMode, label: 'Sight Reading', desc: 'Metronome beats only — practice reading ahead' },
                { value: 'review' as PracticeMode, label: 'Review', desc: 'Notes play back — verify your playing' },
              ]).map(opt => (
                <button key={opt.value}
                  onClick={() => onUpdate({ practiceMode: opt.value })}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition-colors
                    ${settings.practiceMode === opt.value
                      ? (opt.value === 'sightReading' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white')
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Display */}
          <section>
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Display</h3>
            <div className="flex flex-col gap-3">
              <Toggle
                label="Show Hint Bar"
                value={settings.showHintBar}
                onChange={v => onUpdate({ showHintBar: v })}
              />
              <Toggle
                label="Metronome"
                value={settings.metronomeEnabled}
                onChange={v => onUpdate({ metronomeEnabled: v })}
              />
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Notation Size</span>
                <div className="flex gap-1">
                  {(['normal', 'large'] as const).map(size => (
                    <button key={size}
                      onClick={() => onUpdate({ displaySize: size })}
                      className={`px-3 py-1 rounded text-sm transition-colors
                        ${settings.displaySize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                      {size === 'normal' ? 'Normal' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
