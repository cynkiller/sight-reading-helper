import type { NoteEvent, LookAheadConfig } from '../types'

export interface NoteRenderState {
  noteEvent: NoteEvent
  opacity: number
  isActive: boolean   // currently being played
  isPast: boolean     // has been played
  isFuture: boolean   // upcoming
  isFarFuture: boolean // beyond lookahead window
}

export function getNoteOpacity(
  note: NoteEvent,
  currentBeat: number,
  config: LookAheadConfig,
  beatsPerBar: number
): number {
  const lookaheadBeats = config.lookaheadBars * beatsPerBar
  const beatsAhead = note.beat - currentBeat
  const beatsSincePlayed = currentBeat - note.beat

  if (beatsAhead > lookaheadBeats) return 0.25  // far future: dimmed
  if (beatsAhead > 0) return 1.0               // upcoming within lookahead: full
  if (beatsSincePlayed < 0.05) return 1.0       // current (tiny tolerance)
  // linear fade from 1 → 0.12 over fadeDuration beats
  const t = Math.min(beatsSincePlayed / Math.max(config.fadeDuration, 0.25), 1)
  return 1 - t * 0.88
}

export function buildNoteRenderStates(
  notes: NoteEvent[],
  currentBeat: number,
  config: LookAheadConfig,
  beatsPerBar: number
): NoteRenderState[] {
  return notes.map(note => {
    const lookaheadBeats = config.lookaheadBars * beatsPerBar
    const beatsAhead = note.beat - currentBeat
    const beatsSincePlayed = currentBeat - note.beat
    const opacity = getNoteOpacity(note, currentBeat, config, beatsPerBar)

    return {
      noteEvent: note,
      opacity,
      isActive: beatsSincePlayed >= -0.05 && beatsSincePlayed < 0.5,
      isPast: beatsSincePlayed >= 0.5,
      isFuture: beatsAhead > 0 && beatsAhead <= lookaheadBeats,
      isFarFuture: beatsAhead > lookaheadBeats,
    }
  })
}

export function getNoteDurationBeats(duration: NoteEvent['duration']): number {
  const map: Record<string, number> = {
    w: 4, h: 2, hd: 3, q: 1, '8': 0.5, '16': 0.25
  }
  return map[duration] ?? 1
}
