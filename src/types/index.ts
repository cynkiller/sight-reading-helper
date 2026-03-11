export type HandMode = 'both' | 'RH' | 'LH'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type NoteDuration = 'w' | 'h' | 'hd' | 'q' | '8' | '16'
// w=whole(4), h=half(2), hd=dotted-half(3), q=quarter(1), 8=eighth(0.5), 16=sixteenth(0.25)

export interface NoteEvent {
  pitch: string | string[] | null  // "E4", ["E4","G4","C5"] for chord, null=rest
  duration: NoteDuration
  hand: 'RH' | 'LH'
  beat: number       // absolute beat position (0-indexed)
  measure: number    // 0-indexed measure number
}

export interface Piece {
  id: string
  title: string
  composer: string
  difficulty: Difficulty
  level: number          // 1-10
  timeSignature: { numerator: number; denominator: number }
  keySignature: string   // e.g. "C", "G", "F"
  keySharps: string[]    // e.g. ["F"] for G major
  keyFlats: string[]     // e.g. ["B"] for F major
  tempo: number          // default BPM
  totalMeasures: number
  notes: NoteEvent[]
  description: string
  tags: string[]
}

export interface LookAheadConfig {
  fadeDuration: number    // beats after played before fully faded
  lookaheadBars: number   // bars ahead to show at full opacity
}

export interface PlaybackState {
  isPlaying: boolean
  currentBeat: number
  tempo: number
}

export interface AppSettings {
  lookAhead: LookAheadConfig
  handMode: HandMode
  tempo: number           // BPM override (0 = use piece default)
  displaySize: 'normal' | 'large'
  theme: 'dark' | 'light'
  metronomeEnabled: boolean
  showHintBar: boolean
}

export interface PracticeSession {
  pieceId: string
  startedAt: number
  durationSeconds: number
  completedMeasures: number
  settings: AppSettings
}

export interface ProgressData {
  sessions: PracticeSession[]
  lastPieceId: string | null
  unlockedLevels: number[]
}
