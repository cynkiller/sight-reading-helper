import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StaffDisplay } from '../components/StaffDisplay'
import { HintBar } from '../components/HintBar'
import { SettingsPanel } from '../components/SettingsPanel'
import { usePlayback } from '../hooks/usePlayback'
import { useAudioSampler } from '../hooks/useAudioSampler'
import { useSettings } from '../hooks/useSettings'
import { useProgress } from '../hooks/useProgress'
import { getPieceById } from '../data'

export function Practice() {
  const { pieceId } = useParams<{ pieceId: string }>()
  const navigate = useNavigate()
  const piece = pieceId ? getPieceById(pieceId) : null

  const { settings, updateSettings } = useSettings()
  const { recordSession } = useProgress()
  const { playNotes, playMetronomeClick, preloadEssentials, isLoading } = useAudioSampler()

  const [showSettings, setShowSettings] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const sessionStartRef = useRef<number>(Date.now())

  // Preload on mount
  useEffect(() => { preloadEssentials() }, [preloadEssentials])

  const handleNotePlay = useCallback((pitches: string[], durationMs: number) => {
    playNotes(pitches, durationMs)
  }, [playNotes])

  const handleComplete = useCallback(() => {
    if (!piece) return
    recordSession({
      pieceId: piece.id,
      startedAt: sessionStartRef.current,
      durationSeconds: Math.round((Date.now() - sessionStartRef.current) / 1000),
      completedMeasures: piece.totalMeasures,
      settings,
    })
    setShowComplete(true)
    setTimeout(() => setShowComplete(false), 2500)
  }, [piece, recordSession, settings])

  const effectiveTempo = settings.tempo > 0 ? settings.tempo : (piece?.tempo ?? 72)

  const { isPlaying, currentBeat, totalBeats, play, pause, restart } = usePlayback({
    piece: piece ?? null,
    tempo: effectiveTempo,
    handMode: settings.handMode,
    onNotePlay: handleNotePlay,
    onComplete: handleComplete,
  })

  // Metronome
  const bpb = piece?.timeSignature.numerator ?? 4
  const prevBeatRef = useRef(-1)
  useEffect(() => {
    if (!isPlaying || !settings.metronomeEnabled) return
    const beatInBar = Math.floor(currentBeat % bpb)
    if (beatInBar !== prevBeatRef.current) {
      prevBeatRef.current = beatInBar
      playMetronomeClick(beatInBar === 0)
    }
  }, [currentBeat, isPlaying, settings.metronomeEnabled, bpb, playMetronomeClick])

  if (!piece) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-800">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Piece not found.</p>
          <button onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 underline">← Back to Library</button>
        </div>
      </div>
    )
  }

  const lineSpacing = settings.displaySize === 'large' ? 18 : 14
  const progress = totalBeats > 0 ? currentBeat / totalBeats : 0

  const HAND_LABELS: Record<string, string> = { both: '🎹 Both', RH: '▷ RH', LH: '▷ LH' }

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 py-2 border-b border-slate-800 bg-slate-950 shrink-0 min-h-[52px]">
        <button onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white transition-colors p-2 -ml-2 text-lg">‹</button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-semibold text-base leading-tight truncate">{piece.title}</h1>
          <p className="text-slate-500 text-xs">{piece.composer} · Lv.{piece.level} · ♩={effectiveTempo}</p>
        </div>

        {/* Hand mode toggle */}
        <div className="flex gap-1">
          {(['both', 'RH', 'LH'] as const).map(mode => (
            <button key={mode}
              onClick={() => updateSettings({ handMode: mode })}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors
                ${settings.handMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'}`}>
              {HAND_LABELS[mode]}
            </button>
          ))}
        </div>

        <button onClick={() => setShowSettings(true)}
          className="text-slate-400 hover:text-white p-2 text-lg transition-colors"
          title="Settings">⚙</button>
      </header>

      {/* ── Staff notation ──────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col overflow-hidden bg-slate-900">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
            <div className="text-center">
              <div className="text-white text-lg mb-2">🎵 Loading samples...</div>
              <div className="text-slate-400 text-sm">Preparing piano sounds</div>
            </div>
          </div>
        )}

        {/* Completion overlay */}
        {showComplete && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-emerald-900/90 border border-emerald-600 rounded-2xl px-8 py-5 text-center
              shadow-2xl shadow-emerald-900/50 animate-pulse">
              <div className="text-4xl mb-2">✓</div>
              <div className="text-emerald-300 font-bold text-xl">Complete!</div>
              <div className="text-emerald-500 text-sm mt-1">{piece.title}</div>
            </div>
          </div>
        )}

        {/* Notation area — fills available space */}
        <div className="flex-1 flex items-center justify-center px-2 overflow-hidden">
          <div className="w-full">
            <StaffDisplayWrapper
              piece={piece}
              currentBeat={currentBeat}
              lookAhead={settings.lookAhead}
              handMode={settings.handMode}
              lineSpacing={lineSpacing}
            />
          </div>
        </div>

        {/* ── Hint bar ────────────────────────────────────── */}
        {settings.showHintBar && (
          <HintBar
            piece={piece}
            currentBeat={currentBeat}
            lookAhead={settings.lookAhead}
            handMode={settings.handMode}
          />
        )}

        {/* ── Controls ────────────────────────────────────── */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 shrink-0">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-700 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Transport controls */}
            <div className="flex gap-2">
              <button
                onClick={restart}
                className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white
                  flex items-center justify-center text-lg transition-colors">
                ↺
              </button>
              <button
                onClick={isPlaying ? pause : play}
                className={`w-24 h-12 rounded-xl font-semibold text-white flex items-center
                  justify-center gap-2 text-base transition-colors
                  ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>

            {/* Tempo quick adjust */}
            <div className="flex items-center gap-2 ml-2">
              <button onClick={() => updateSettings({ tempo: Math.max(30, effectiveTempo - 4) })}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-lg
                  flex items-center justify-center transition-colors">−</button>
              <span className="text-slate-300 font-mono text-sm w-16 text-center">♩={effectiveTempo}</span>
              <button onClick={() => updateSettings({ tempo: Math.min(160, effectiveTempo + 4) })}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-lg
                  flex items-center justify-center transition-colors">+</button>
            </div>

            {/* Fade speed quick adjust */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-slate-500 text-xs">Lookahead:</span>
              <button
                onClick={() => updateSettings({
                  lookAhead: { ...settings.lookAhead,
                    lookaheadBars: Math.max(0.5, settings.lookAhead.lookaheadBars - 0.5) }
                })}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm
                  flex items-center justify-center transition-colors">−</button>
              <span className="text-slate-300 font-mono text-sm w-16 text-center">
                {settings.lookAhead.lookaheadBars}bar{settings.lookAhead.lookaheadBars !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => updateSettings({
                  lookAhead: { ...settings.lookAhead,
                    lookaheadBars: Math.min(3, settings.lookAhead.lookaheadBars + 0.5) }
                })}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm
                  flex items-center justify-center transition-colors">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          pieceDefaultTempo={piece.tempo}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

// Wrapper that measures container width for responsive SVG
function StaffDisplayWrapper(props: Parameters<typeof StaffDisplay>[0]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(900)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(Math.floor(w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      <StaffDisplay {...props} svgWidth={width} />
    </div>
  )
}
