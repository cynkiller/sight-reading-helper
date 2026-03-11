import type { Piece } from '../../types'

export const gymnopedie: Piece = {
  id: 'gymnopedie',
  title: 'Gymnopédie No. 1 (Opening)',
  composer: 'Satie',
  difficulty: 'advanced',
  level: 9,
  timeSignature: { numerator: 3, denominator: 4 },
  keySignature: 'G',
  keySharps: ['F'],
  keyFlats: [],
  tempo: 60,
  totalMeasures: 8,
  description: 'Rich chord voicing, expressive phrasing. Develops musical sensitivity and chord reading.',
  tags: ['G major', '3/4', 'Satie', 'advanced', 'expressive', 'chords'],
  notes: [
    // Measure 0: Rest, chord, chord (LH: bass + chord pattern)
    { pitch: null, duration: 'q', hand: 'RH', beat: 0, measure: 0 },
    { pitch: 'D5', duration: 'h', hand: 'RH', beat: 1, measure: 0 },
    // Measure 1: B4(h) A4(q)
    { pitch: 'B4', duration: 'h', hand: 'RH', beat: 3, measure: 1 },
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 5, measure: 1 },
    // Measure 2: G4 (dotted half)
    { pitch: 'G4', duration: 'hd', hand: 'RH', beat: 6, measure: 2 },
    // Measure 3: rest B4(h)
    { pitch: null, duration: 'q', hand: 'RH', beat: 9, measure: 3 },
    { pitch: 'B4', duration: 'h', hand: 'RH', beat: 10, measure: 3 },
    // Measure 4: A4(h) G4(q)
    { pitch: 'A4', duration: 'h', hand: 'RH', beat: 12, measure: 4 },
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 14, measure: 4 },
    // Measure 5: F#4(hd)
    { pitch: 'F#4', duration: 'hd', hand: 'RH', beat: 15, measure: 5 },
    // Measure 6: rest E4(h)
    { pitch: null, duration: 'q', hand: 'RH', beat: 18, measure: 6 },
    { pitch: 'E4', duration: 'h', hand: 'RH', beat: 19, measure: 6 },
    // Measure 7: D4(hd)
    { pitch: 'D4', duration: 'hd', hand: 'RH', beat: 21, measure: 7 },
    // LH: characteristic bass + chord pattern (bass on beat 1, chord on beats 2+3)
    { pitch: 'D3', duration: 'q', hand: 'LH', beat: 0, measure: 0 },
    { pitch: ['F#3', 'A3', 'D4'], duration: 'q', hand: 'LH', beat: 1, measure: 0 },
    { pitch: ['F#3', 'A3', 'D4'], duration: 'q', hand: 'LH', beat: 2, measure: 0 },
    { pitch: 'G3', duration: 'q', hand: 'LH', beat: 3, measure: 1 },
    { pitch: ['B3', 'D4', 'G4'], duration: 'q', hand: 'LH', beat: 4, measure: 1 },
    { pitch: ['B3', 'D4', 'G4'], duration: 'q', hand: 'LH', beat: 5, measure: 1 },
    { pitch: 'D3', duration: 'q', hand: 'LH', beat: 6, measure: 2 },
    { pitch: ['F#3', 'A3', 'D4'], duration: 'q', hand: 'LH', beat: 7, measure: 2 },
    { pitch: ['F#3', 'A3', 'D4'], duration: 'q', hand: 'LH', beat: 8, measure: 2 },
    { pitch: 'G3', duration: 'q', hand: 'LH', beat: 9, measure: 3 },
    { pitch: ['B3', 'D4', 'G4'], duration: 'q', hand: 'LH', beat: 10, measure: 3 },
    { pitch: ['B3', 'D4', 'G4'], duration: 'q', hand: 'LH', beat: 11, measure: 3 },
    { pitch: 'D3', duration: 'q', hand: 'LH', beat: 12, measure: 4 },
    { pitch: ['F#3', 'A3', 'D4'], duration: 'q', hand: 'LH', beat: 13, measure: 4 },
    { pitch: ['F#3', 'A3', 'D4'], duration: 'q', hand: 'LH', beat: 14, measure: 4 },
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 15, measure: 5 },
    { pitch: ['C#3', 'E3', 'A3'], duration: 'q', hand: 'LH', beat: 16, measure: 5 },
    { pitch: ['C#3', 'E3', 'A3'], duration: 'q', hand: 'LH', beat: 17, measure: 5 },
    { pitch: 'E3', duration: 'q', hand: 'LH', beat: 18, measure: 6 },
    { pitch: ['G3', 'B3', 'E4'], duration: 'q', hand: 'LH', beat: 19, measure: 6 },
    { pitch: ['G3', 'B3', 'E4'], duration: 'q', hand: 'LH', beat: 20, measure: 6 },
    { pitch: 'D3', duration: 'q', hand: 'LH', beat: 21, measure: 7 },
    { pitch: ['F#3', 'A3', 'D4'], duration: 'q', hand: 'LH', beat: 22, measure: 7 },
    { pitch: ['F#3', 'A3', 'D4'], duration: 'q', hand: 'LH', beat: 23, measure: 7 },
  ],
}
