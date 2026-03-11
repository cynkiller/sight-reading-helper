import { fiveNoteWarmup } from './pieces/five-note-warmup'
import { odeToJoy } from './pieces/ode-to-joy'
import { lullabyBrahms } from './pieces/lullaby-brahms'
import { minuetInG } from './pieces/minuet-in-g'
import { furElise } from './pieces/fur-elise'
import { canonInD } from './pieces/canon-in-d'
import { waltzInAm } from './pieces/waltz-in-am'
import { bachPreludioC } from './pieces/bach-prelude-c'
import { gymnopedie } from './pieces/gymnopedie'
import type { Piece } from '../types'

export const ALL_PIECES: Piece[] = [
  fiveNoteWarmup,
  odeToJoy,
  lullabyBrahms,
  minuetInG,
  furElise,
  canonInD,
  waltzInAm,
  bachPreludioC,
  gymnopedie,
]

export function getPieceById(id: string): Piece | undefined {
  return ALL_PIECES.find(p => p.id === id)
}

export function getPiecesByDifficulty(difficulty: Piece['difficulty']): Piece[] {
  return ALL_PIECES.filter(p => p.difficulty === difficulty).sort((a, b) => a.level - b.level)
}

export { fiveNoteWarmup, odeToJoy, lullabyBrahms, minuetInG, furElise, canonInD, waltzInAm, bachPreludioC, gymnopedie }
