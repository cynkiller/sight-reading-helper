import type { Piece } from '../../types'

export const odeToJoy: Piece = {
  id: 'ode-to-joy',
  title: 'Ode to Joy (Phrase 1)',
  composer: 'Beethoven',
  difficulty: 'beginner',
  level: 2,
  timeSignature: { numerator: 4, denominator: 4 },
  keySignature: 'C',
  keySharps: [],
  keyFlats: [],
  tempo: 72,
  totalMeasures: 4,
  description: 'The iconic opening phrase. Stepwise motion, predictable rhythm, builds confidence.',
  tags: ['C position', 'stepwise', 'famous melody', 'beginner'],
  notes: [
    // Measure 0: E E F G
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 0, measure: 0 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 1, measure: 0 },
    { pitch: 'F4', duration: 'q', hand: 'RH', beat: 2, measure: 0 },
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 3, measure: 0 },
    // Measure 1: G F E D
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 4, measure: 1 },
    { pitch: 'F4', duration: 'q', hand: 'RH', beat: 5, measure: 1 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 6, measure: 1 },
    { pitch: 'D4', duration: 'q', hand: 'RH', beat: 7, measure: 1 },
    // Measure 2: C C D E
    { pitch: 'C4', duration: 'q', hand: 'RH', beat: 8, measure: 2 },
    { pitch: 'C4', duration: 'q', hand: 'RH', beat: 9, measure: 2 },
    { pitch: 'D4', duration: 'q', hand: 'RH', beat: 10, measure: 2 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 11, measure: 2 },
    // Measure 3: E. D D (dotted quarter + eighth + half)
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 12, measure: 3 },
    { pitch: 'D4', duration: 'h', hand: 'RH', beat: 13, measure: 3 },
    { pitch: null, duration: 'q', hand: 'RH', beat: 15, measure: 3 },
    // LH: simple bass support
    { pitch: 'C3', duration: 'h', hand: 'LH', beat: 0, measure: 0 },
    { pitch: 'G3', duration: 'h', hand: 'LH', beat: 2, measure: 0 },
    { pitch: 'G3', duration: 'h', hand: 'LH', beat: 4, measure: 1 },
    { pitch: 'C3', duration: 'h', hand: 'LH', beat: 6, measure: 1 },
    { pitch: 'C3', duration: 'h', hand: 'LH', beat: 8, measure: 2 },
    { pitch: 'G3', duration: 'h', hand: 'LH', beat: 10, measure: 2 },
    { pitch: 'C3', duration: 'w', hand: 'LH', beat: 12, measure: 3 },
  ],
}
