import type { Piece } from '../../types'

export const fiveNoteWarmup: Piece = {
  id: 'five-note-warmup',
  title: 'Five-Note Warm-Up',
  composer: 'Traditional',
  difficulty: 'beginner',
  level: 1,
  timeSignature: { numerator: 4, denominator: 4 },
  keySignature: 'C',
  keySharps: [],
  keyFlats: [],
  tempo: 60,
  totalMeasures: 4,
  description: 'C position warm-up using only C4–G4. Perfect first exercise.',
  tags: ['C position', 'steps only', 'no accidentals', 'beginner'],
  notes: [
    // Measure 0: C D E F (ascending)
    { pitch: 'C4', duration: 'q', hand: 'RH', beat: 0, measure: 0 },
    { pitch: 'D4', duration: 'q', hand: 'RH', beat: 1, measure: 0 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 2, measure: 0 },
    { pitch: 'F4', duration: 'q', hand: 'RH', beat: 3, measure: 0 },
    // Measure 1: G F E D (descending)
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 4, measure: 1 },
    { pitch: 'F4', duration: 'q', hand: 'RH', beat: 5, measure: 1 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 6, measure: 1 },
    { pitch: 'D4', duration: 'q', hand: 'RH', beat: 7, measure: 1 },
    // Measure 2: E G E C (skips)
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 8, measure: 2 },
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 9, measure: 2 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 10, measure: 2 },
    { pitch: 'C4', duration: 'q', hand: 'RH', beat: 11, measure: 2 },
    // Measure 3: C (whole note)
    { pitch: 'C4', duration: 'w', hand: 'RH', beat: 12, measure: 3 },
    // LH: simple bass (C position block chords)
    { pitch: 'C3', duration: 'h', hand: 'LH', beat: 0, measure: 0 },
    { pitch: 'G3', duration: 'h', hand: 'LH', beat: 2, measure: 0 },
    { pitch: 'C3', duration: 'h', hand: 'LH', beat: 4, measure: 1 },
    { pitch: 'G3', duration: 'h', hand: 'LH', beat: 6, measure: 1 },
    { pitch: 'C3', duration: 'h', hand: 'LH', beat: 8, measure: 2 },
    { pitch: 'G3', duration: 'h', hand: 'LH', beat: 10, measure: 2 },
    { pitch: 'C3', duration: 'w', hand: 'LH', beat: 12, measure: 3 },
  ],
}
