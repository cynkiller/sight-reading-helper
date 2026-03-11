import type { Piece, HandMode } from '../types'
import { buildNoteRenderStates } from '../hooks/useLookAhead'
import type { LookAheadConfig } from '../types'

interface Props {
  piece: Piece
  currentBeat: number
  lookAhead: LookAheadConfig
  handMode: HandMode
}

function pitchLabel(pitch: string | string[] | null): string {
  if (!pitch) return 'rest'
  if (Array.isArray(pitch)) return pitch.join('+')
  return pitch
}

export function HintBar({ piece, currentBeat, lookAhead, handMode }: Props) {
  const bpb = piece.timeSignature.numerator
  const states = buildNoteRenderStates(piece.notes, currentBeat, lookAhead, bpb)

  const activeRH = states.find(s => s.isActive && s.noteEvent.hand === 'RH' && s.noteEvent.pitch)
  const activeLH = states.find(s => s.isActive && s.noteEvent.hand === 'LH' && s.noteEvent.pitch)

  // Upcoming notes — unique beat positions, RH only
  const seenBeats = new Set<number>()
  const futurePitches = states
    .filter(s => {
      if (!s.isFuture || !s.noteEvent.pitch || s.noteEvent.hand !== 'RH') return false
      if (seenBeats.has(s.noteEvent.beat)) return false
      seenBeats.add(s.noteEvent.beat)
      return true
    })
    .slice(0, 4)
    .map(s => pitchLabel(s.noteEvent.pitch))

  // Current measure
  const currentMeasure = Math.floor(currentBeat / bpb)
  const totalMeasures = piece.totalMeasures

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-slate-800 border-t border-slate-700 text-sm">
      {/* Measure counter */}
      <span className="text-slate-400 font-mono text-xs whitespace-nowrap">
        Bar {currentMeasure + 1}/{totalMeasures}
      </span>

      <div className="w-px h-4 bg-slate-600" />

      {/* Current notes */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-slate-500 text-xs">Now:</span>
        {(handMode === 'both' || handMode === 'RH') && (
          <span className="text-green-400 font-mono font-semibold text-sm">
            {activeRH ? pitchLabel(activeRH.noteEvent.pitch) : '—'}
          </span>
        )}
        {handMode === 'both' && <span className="text-slate-600 text-xs">·</span>}
        {(handMode === 'both' || handMode === 'LH') && (
          <span className="text-green-500 font-mono text-sm opacity-80">
            {activeLH ? pitchLabel(activeLH.noteEvent.pitch) : '—'}
          </span>
        )}
      </div>

      <div className="w-px h-4 bg-slate-600" />

      {/* Upcoming */}
      <div className="flex items-center gap-1 overflow-hidden">
        <span className="text-slate-500 text-xs whitespace-nowrap">Next →</span>
        {futurePitches.map((p, i) => (
          <span key={i} className="text-blue-400 font-mono text-sm"
            style={{ opacity: 1 - i * 0.18 }}>
            {p}{i < futurePitches.length - 1 ? '' : ''}
            {i < futurePitches.length - 1 && <span className="text-slate-600 mx-0.5">›</span>}
          </span>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Lookahead info */}
      <span className="text-slate-500 text-xs whitespace-nowrap hidden sm:block">
        Lookahead: {lookAhead.lookaheadBars} bar{lookAhead.lookaheadBars !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
