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

// Uploaded pieces stored in memory (and localStorage for persistence)
const UPLOAD_STORAGE_KEY = 'srh_uploaded_pieces'
let uploadedPieces: Piece[] = []

function loadUploadedPieces(): Piece[] {
  try {
    const raw = localStorage.getItem(UPLOAD_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Piece[]
  } catch { /* ignore */ }
  return []
}

function saveUploadedPieces(pieces: Piece[]) {
  try { localStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(pieces)) } catch { /* ignore */ }
}

// Initialize uploaded pieces from localStorage
uploadedPieces = loadUploadedPieces()

export function addUploadedPiece(piece: Piece): void {
  uploadedPieces = [piece, ...uploadedPieces.filter(p => p.id !== piece.id)]
  saveUploadedPieces(uploadedPieces)
}

export function getUploadedPieces(): Piece[] {
  return uploadedPieces
}

export function removeUploadedPiece(id: string): void {
  uploadedPieces = uploadedPieces.filter(p => p.id !== id)
  saveUploadedPieces(uploadedPieces)
}

export function getPieceById(id: string): Piece | undefined {
  return ALL_PIECES.find(p => p.id === id)
    ?? uploadedPieces.find(p => p.id === id)
}

export function getPiecesByDifficulty(difficulty: Piece['difficulty']): Piece[] {
  return ALL_PIECES.filter(p => p.difficulty === difficulty).sort((a, b) => a.level - b.level)
}

export { fiveNoteWarmup, odeToJoy, lullabyBrahms, minuetInG, furElise, canonInD, waltzInAm, bachPreludioC, gymnopedie }
