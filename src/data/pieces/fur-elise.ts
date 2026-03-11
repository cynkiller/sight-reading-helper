import type { Piece } from '../../types'

export const furElise: Piece = {
  id: 'fur-elise',
  title: 'Für Elise (Opening Section)',
  composer: 'Beethoven',
  difficulty: 'intermediate',
  level: 5,
  timeSignature: { numerator: 3, denominator: 4 },
  keySignature: 'C',
  keySharps: [],
  keyFlats: [],
  tempo: 80,
  totalMeasures: 8,
  description: 'The iconic opening. Introduces D# accidental, expressive phrasing, wider range.',
  tags: ['Am', 'accidentals', 'Beethoven', 'expressive', 'intermediate'],
  notes: [
    // Measure 0: E5 D#5 E5
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 0, measure: 0 },
    { pitch: 'D#5', duration: 'q', hand: 'RH', beat: 1, measure: 0 },
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 2, measure: 0 },
    // Measure 1: B4 D5 C5
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 3, measure: 1 },
    { pitch: 'D5', duration: 'q', hand: 'RH', beat: 4, measure: 1 },
    { pitch: 'C5', duration: 'q', hand: 'RH', beat: 5, measure: 1 },
    // Measure 2: A4 (h) rest
    { pitch: 'A4', duration: 'h', hand: 'RH', beat: 6, measure: 2 },
    { pitch: null, duration: 'q', hand: 'RH', beat: 8, measure: 2 },
    // Measure 3: C4 E4 A4
    { pitch: 'C4', duration: 'q', hand: 'RH', beat: 9, measure: 3 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 10, measure: 3 },
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 11, measure: 3 },
    // Measure 4: B4 (h) rest
    { pitch: 'B4', duration: 'h', hand: 'RH', beat: 12, measure: 4 },
    { pitch: null, duration: 'q', hand: 'RH', beat: 14, measure: 4 },
    // Measure 5: E4 G#4 B4
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 15, measure: 5 },
    { pitch: 'G#4', duration: 'q', hand: 'RH', beat: 16, measure: 5 },
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 17, measure: 5 },
    // Measure 6: C5 (h) rest
    { pitch: 'C5', duration: 'h', hand: 'RH', beat: 18, measure: 6 },
    { pitch: null, duration: 'q', hand: 'RH', beat: 20, measure: 6 },
    // Measure 7: E5 D#5 E5
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 21, measure: 7 },
    { pitch: 'D#5', duration: 'q', hand: 'RH', beat: 22, measure: 7 },
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 23, measure: 7 },
    // LH: Am bass arpeggios (simplified)
    { pitch: null, duration: 'q', hand: 'LH', beat: 0, measure: 0 },
    { pitch: null, duration: 'h', hand: 'LH', beat: 1, measure: 0 },
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 3, measure: 1 },
    { pitch: ['E3', 'A3'], duration: 'h', hand: 'LH', beat: 4, measure: 1 },
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 6, measure: 2 },
    { pitch: ['E3', 'A3'], duration: 'h', hand: 'LH', beat: 7, measure: 2 },
    { pitch: 'E2', duration: 'q', hand: 'LH', beat: 9, measure: 3 },
    { pitch: ['G#3', 'E3'], duration: 'h', hand: 'LH', beat: 10, measure: 3 },
    { pitch: 'E2', duration: 'q', hand: 'LH', beat: 12, measure: 4 },
    { pitch: ['G#3', 'B3'], duration: 'h', hand: 'LH', beat: 13, measure: 4 },
    { pitch: 'E2', duration: 'q', hand: 'LH', beat: 15, measure: 5 },
    { pitch: ['G#3', 'B3'], duration: 'h', hand: 'LH', beat: 16, measure: 5 },
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 18, measure: 6 },
    { pitch: ['E3', 'A3'], duration: 'h', hand: 'LH', beat: 19, measure: 6 },
    { pitch: null, duration: 'hd', hand: 'LH', beat: 21, measure: 7 },
  ],
}
