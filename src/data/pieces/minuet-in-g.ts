import type { Piece } from '../../types'

export const minuetInG: Piece = {
  id: 'minuet-in-g',
  title: 'Minuet in G (Phrase 1)',
  composer: 'Bach',
  difficulty: 'beginner',
  level: 4,
  timeSignature: { numerator: 3, denominator: 4 },
  keySignature: 'G',
  keySharps: ['F'],
  keyFlats: [],
  tempo: 80,
  totalMeasures: 4,
  description: 'Introduces G position and 3/4 time. Minimal jumps, elegant melody.',
  tags: ['G position', '3/4', 'Bach', 'beginner'],
  notes: [
    // Measure 0: G4 A4 B4
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 0, measure: 0 },
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 1, measure: 0 },
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 2, measure: 0 },
    // Measure 1: C5 D5 E5
    { pitch: 'C5', duration: 'q', hand: 'RH', beat: 3, measure: 1 },
    { pitch: 'D5', duration: 'q', hand: 'RH', beat: 4, measure: 1 },
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 5, measure: 1 },
    // Measure 2: F#5 G5 A5 (F# from key sig)
    { pitch: 'F#5', duration: 'q', hand: 'RH', beat: 6, measure: 2 },
    { pitch: 'G5', duration: 'q', hand: 'RH', beat: 7, measure: 2 },
    { pitch: 'A5', duration: 'q', hand: 'RH', beat: 8, measure: 2 },
    // Measure 3: G5 (dotted half)
    { pitch: 'G5', duration: 'hd', hand: 'RH', beat: 9, measure: 3 },
    // LH: waltz bass
    { pitch: 'G3', duration: 'q', hand: 'LH', beat: 0, measure: 0 },
    { pitch: ['B3', 'D4'], duration: 'h', hand: 'LH', beat: 1, measure: 0 },
    { pitch: 'C3', duration: 'q', hand: 'LH', beat: 3, measure: 1 },
    { pitch: ['E3', 'G3'], duration: 'h', hand: 'LH', beat: 4, measure: 1 },
    { pitch: 'D3', duration: 'q', hand: 'LH', beat: 6, measure: 2 },
    { pitch: ['F#3', 'A3'], duration: 'h', hand: 'LH', beat: 7, measure: 2 },
    { pitch: 'G3', duration: 'hd', hand: 'LH', beat: 9, measure: 3 },
  ],
}
