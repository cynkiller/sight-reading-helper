import type { Piece } from '../../types'

export const canonInD: Piece = {
  id: 'canon-in-d',
  title: 'Canon in D (Theme)',
  composer: 'Pachelbel',
  difficulty: 'intermediate',
  level: 6,
  timeSignature: { numerator: 4, denominator: 4 },
  keySignature: 'D',
  keySharps: ['F', 'C'],
  keyFlats: [],
  tempo: 72,
  totalMeasures: 8,
  description: 'The famous repeating progression. Introduces chord awareness and position shifts.',
  tags: ['D major', 'chord progression', 'Pachelbel', 'intermediate'],
  notes: [
    // RH melody over the canon progression D-A-Bm-F#m-G-D-G-A
    // Measure 0: F#5 E5 D5 C#5
    { pitch: 'F#5', duration: 'q', hand: 'RH', beat: 0, measure: 0 },
    { pitch: 'E5', duration: 'q', hand: 'RH', beat: 1, measure: 0 },
    { pitch: 'D5', duration: 'q', hand: 'RH', beat: 2, measure: 0 },
    { pitch: 'C#5', duration: 'q', hand: 'RH', beat: 3, measure: 0 },
    // Measure 1: B4 A4 B4 C#5
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 4, measure: 1 },
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 5, measure: 1 },
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 6, measure: 1 },
    { pitch: 'C#5', duration: 'q', hand: 'RH', beat: 7, measure: 1 },
    // Measure 2: D5 A4 B4 G4
    { pitch: 'D5', duration: 'q', hand: 'RH', beat: 8, measure: 2 },
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 9, measure: 2 },
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 10, measure: 2 },
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 11, measure: 2 },
    // Measure 3: F#4 E4 F#4 G4
    { pitch: 'F#4', duration: 'q', hand: 'RH', beat: 12, measure: 3 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 13, measure: 3 },
    { pitch: 'F#4', duration: 'q', hand: 'RH', beat: 14, measure: 3 },
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 15, measure: 3 },
    // Measure 4: A4 B4 A4 G4
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 16, measure: 4 },
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 17, measure: 4 },
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 18, measure: 4 },
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 19, measure: 4 },
    // Measure 5: F#4 E4 D4 E4
    { pitch: 'F#4', duration: 'q', hand: 'RH', beat: 20, measure: 5 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 21, measure: 5 },
    { pitch: 'D4', duration: 'q', hand: 'RH', beat: 22, measure: 5 },
    { pitch: 'E4', duration: 'q', hand: 'RH', beat: 23, measure: 5 },
    // Measure 6: F#4 G4 A4 B4
    { pitch: 'F#4', duration: 'q', hand: 'RH', beat: 24, measure: 6 },
    { pitch: 'G4', duration: 'q', hand: 'RH', beat: 25, measure: 6 },
    { pitch: 'A4', duration: 'q', hand: 'RH', beat: 26, measure: 6 },
    { pitch: 'B4', duration: 'q', hand: 'RH', beat: 27, measure: 6 },
    // Measure 7: A4 (whole)
    { pitch: 'A4', duration: 'w', hand: 'RH', beat: 28, measure: 7 },
    // LH: Canon bass line D-A-B-F#-G-D-G-A
    { pitch: 'D3', duration: 'h', hand: 'LH', beat: 0, measure: 0 },
    { pitch: 'A3', duration: 'h', hand: 'LH', beat: 2, measure: 0 },
    { pitch: 'B2', duration: 'h', hand: 'LH', beat: 4, measure: 1 },
    { pitch: 'F#3', duration: 'h', hand: 'LH', beat: 6, measure: 1 },
    { pitch: 'G2', duration: 'h', hand: 'LH', beat: 8, measure: 2 },
    { pitch: 'D3', duration: 'h', hand: 'LH', beat: 10, measure: 2 },
    { pitch: 'G2', duration: 'h', hand: 'LH', beat: 12, measure: 3 },
    { pitch: 'A2', duration: 'h', hand: 'LH', beat: 14, measure: 3 },
    { pitch: 'D3', duration: 'h', hand: 'LH', beat: 16, measure: 4 },
    { pitch: 'A2', duration: 'h', hand: 'LH', beat: 18, measure: 4 },
    { pitch: 'B2', duration: 'h', hand: 'LH', beat: 20, measure: 5 },
    { pitch: 'F#2', duration: 'h', hand: 'LH', beat: 22, measure: 5 },
    { pitch: 'G2', duration: 'h', hand: 'LH', beat: 24, measure: 6 },
    { pitch: 'A2', duration: 'h', hand: 'LH', beat: 26, measure: 6 },
    { pitch: 'D3', duration: 'w', hand: 'LH', beat: 28, measure: 7 },
  ],
}
