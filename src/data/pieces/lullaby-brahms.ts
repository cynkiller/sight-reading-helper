import type { Piece } from '../../types'

export const lullabyBrahms: Piece = {
  id: 'lullaby-brahms',
  title: 'Lullaby (Opening Phrase)',
  composer: 'Brahms',
  difficulty: 'beginner',
  level: 3,
  timeSignature: { numerator: 3, denominator: 4 },
  keySignature: 'C',
  keySharps: [],
  keyFlats: [],
  tempo: 60,
  totalMeasures: 4,
  description: 'Gentle 3/4 melody. Introduces waltz rhythm and slightly wider range (C4–D5).',
  tags: ['C position', '3/4', 'smooth', 'beginner'],
  notes: [
    // Measure 0: G4(q.) F4(8) (pickup feel adapted to 3/4)
    { pitch: 'G4', duration: 'h', hand: 'RH', beat: 0, measure: 0 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 2, measure: 0 },
    // Measure 1: C4 C4 E4
    { pitch: 'C4', duration: 'q', hand: 'RH', beat: 3, measure: 1 },
    { pitch: 'C4', duration: 'q', hand: 'RH', beat: 4, measure: 1 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 5, measure: 1 },
    // Measure 2: G4(h) rest
    { pitch: 'G4', duration: 'h', hand: 'RH', beat: 6, measure: 2 },
    { pitch: null, duration: 'q', hand: 'RH', beat: 8, measure: 2 },
    // Measure 3: A4 G4 E4
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 9, measure: 3 },
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 10, measure: 3 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 11, measure: 3 },
    // LH: waltz bass (bass note + chord)
    { pitch: 'C3', duration: 'q', hand: 'LH', beat: 0, measure: 0 },
    { pitch: ['E3', 'G3'], duration: 'h', hand: 'LH', beat: 1, measure: 0 },
    { pitch: 'C3', duration: 'q', hand: 'LH', beat: 3, measure: 1 },
    { pitch: ['E3', 'G3'], duration: 'h', hand: 'LH', beat: 4, measure: 1 },
    { pitch: 'C3', duration: 'q', hand: 'LH', beat: 6, measure: 2 },
    { pitch: ['E3', 'G3'], duration: 'h', hand: 'LH', beat: 7, measure: 2 },
    { pitch: 'F3', duration: 'q', hand: 'LH', beat: 9, measure: 3 },
    { pitch: ['A3', 'C4'], duration: 'h', hand: 'LH', beat: 10, measure: 3 },
  ],
}
