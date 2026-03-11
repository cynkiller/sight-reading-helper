import type { Piece } from '../../types'

export const waltzInAm: Piece = {
  id: 'waltz-in-am',
  title: 'Waltz in A minor',
  composer: 'Chopin (attr.)',
  difficulty: 'advanced',
  level: 7,
  timeSignature: { numerator: 3, denominator: 4 },
  keySignature: 'C',
  keySharps: [],
  keyFlats: [],
  tempo: 116,
  totalMeasures: 16,
  description: 'Delicate waltz with position shifts and expressive melodic leaps. Excellent for reading intervals.',
  tags: ['Am', '3/4', 'Chopin', 'advanced', 'position shifts', 'waltz'],
  notes: [
    // Section A (bars 1-8): Flowing melody over waltz bass
    // Bar 1: A4(q) C5(q) B4(q)
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 0, measure: 0 },
    { pitch: 'C5', duration: 'q', hand: 'RH', beat: 1, measure: 0 },
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 2, measure: 0 },
    // Bar 2: A4(hd)
    { pitch: 'A4', duration: 'hd', hand: 'RH', beat: 3, measure: 1 },
    // Bar 3: G4(q) E4(q) F4(q)
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 6, measure: 2 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 7, measure: 2 },
    { pitch: 'F4', duration: 'q', hand: 'RH', beat: 8, measure: 2 },
    // Bar 4: E4(hd)
    { pitch: 'E4', duration: 'hd', hand: 'RH', beat: 9, measure: 3 },
    // Bar 5: D4(q) F4(q) E4(q)
    { pitch: 'D4', duration: 'q', hand: 'RH', beat: 12, measure: 4 },
    { pitch: 'F4', duration: 'q', hand: 'RH', beat: 13, measure: 4 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 14, measure: 4 },
    // Bar 6: D4(hd)
    { pitch: 'D4', duration: 'hd', hand: 'RH', beat: 15, measure: 5 },
    // Bar 7: C4(q) E4(q) D4(q)
    { pitch: 'C4', duration: 'q', hand: 'RH', beat: 18, measure: 6 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 19, measure: 6 },
    { pitch: 'D4', duration: 'q', hand: 'RH', beat: 20, measure: 6 },
    // Bar 8: C4(hd)
    { pitch: 'C4', duration: 'hd', hand: 'RH', beat: 21, measure: 7 },
    // Section B (bars 9-16): Higher register, position shift
    // Bar 9: E5(q) G5(q) F#5(q)
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 24, measure: 8 },
    { pitch: 'G5', duration: 'q', hand: 'RH', beat: 25, measure: 8 },
    { pitch: 'F#5', duration: 'q', hand: 'RH', beat: 26, measure: 8 },
    // Bar 10: E5(hd)
    { pitch: 'E5', duration: 'hd', hand: 'RH', beat: 27, measure: 9 },
    // Bar 11: D5(q) F5(q) E5(q)
    { pitch: 'D5', duration: 'q', hand: 'RH', beat: 30, measure: 10 },
    { pitch: 'F5', duration: 'q', hand: 'RH', beat: 31, measure: 10 },
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 32, measure: 10 },
    // Bar 12: D5(hd)
    { pitch: 'D5', duration: 'hd', hand: 'RH', beat: 33, measure: 11 },
    // Bar 13: C5(q) E5(q) D5(q)
    { pitch: 'C5', duration: 'q', hand: 'RH', beat: 36, measure: 12 },
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 37, measure: 12 },
    { pitch: 'D5', duration: 'q', hand: 'RH', beat: 38, measure: 12 },
    // Bar 14: B4(hd)
    { pitch: 'B4', duration: 'hd', hand: 'RH', beat: 39, measure: 13 },
    // Bar 15: A4(q) C5(q) B4(q)
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 42, measure: 14 },
    { pitch: 'C5', duration: 'q', hand: 'RH', beat: 43, measure: 14 },
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 44, measure: 14 },
    // Bar 16: A4(hd)
    { pitch: 'A4', duration: 'hd', hand: 'RH', beat: 45, measure: 15 },

    // LH: waltz bass pattern (bass on beat 1, chord on beats 2+3)
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 0, measure: 0 },
    { pitch: ['E3', 'A3'], duration: 'h', hand: 'LH', beat: 1, measure: 0 },
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 3, measure: 1 },
    { pitch: ['E3', 'A3'], duration: 'h', hand: 'LH', beat: 4, measure: 1 },
    { pitch: 'C3', duration: 'q', hand: 'LH', beat: 6, measure: 2 },
    { pitch: ['G3', 'C4'], duration: 'h', hand: 'LH', beat: 7, measure: 2 },
    { pitch: 'C3', duration: 'q', hand: 'LH', beat: 9, measure: 3 },
    { pitch: ['G3', 'C4'], duration: 'h', hand: 'LH', beat: 10, measure: 3 },
    { pitch: 'F2', duration: 'q', hand: 'LH', beat: 12, measure: 4 },
    { pitch: ['C3', 'F3'], duration: 'h', hand: 'LH', beat: 13, measure: 4 },
    { pitch: 'F2', duration: 'q', hand: 'LH', beat: 15, measure: 5 },
    { pitch: ['C3', 'F3'], duration: 'h', hand: 'LH', beat: 16, measure: 5 },
    { pitch: 'E2', duration: 'q', hand: 'LH', beat: 18, measure: 6 },
    { pitch: ['G#3', 'B3'], duration: 'h', hand: 'LH', beat: 19, measure: 6 },
    { pitch: 'E2', duration: 'q', hand: 'LH', beat: 21, measure: 7 },
    { pitch: ['G#3', 'B3'], duration: 'h', hand: 'LH', beat: 22, measure: 7 },
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 24, measure: 8 },
    { pitch: ['E3', 'A3'], duration: 'h', hand: 'LH', beat: 25, measure: 8 },
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 27, measure: 9 },
    { pitch: ['E3', 'A3'], duration: 'h', hand: 'LH', beat: 28, measure: 9 },
    { pitch: 'D3', duration: 'q', hand: 'LH', beat: 30, measure: 10 },
    { pitch: ['A3', 'D4'], duration: 'h', hand: 'LH', beat: 31, measure: 10 },
    { pitch: 'D3', duration: 'q', hand: 'LH', beat: 33, measure: 11 },
    { pitch: ['A3', 'D4'], duration: 'h', hand: 'LH', beat: 34, measure: 11 },
    { pitch: 'G2', duration: 'q', hand: 'LH', beat: 36, measure: 12 },
    { pitch: ['D3', 'G3'], duration: 'h', hand: 'LH', beat: 37, measure: 12 },
    { pitch: 'E2', duration: 'q', hand: 'LH', beat: 39, measure: 13 },
    { pitch: ['G#3', 'B3'], duration: 'h', hand: 'LH', beat: 40, measure: 13 },
    { pitch: 'A2', duration: 'q', hand: 'LH', beat: 42, measure: 14 },
    { pitch: ['E3', 'A3'], duration: 'h', hand: 'LH', beat: 43, measure: 14 },
    { pitch: 'A2', duration: 'hd', hand: 'LH', beat: 45, measure: 15 },
  ],
}
