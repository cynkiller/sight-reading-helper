import { Midi } from '@tonejs/midi'
import type { Piece, NoteEvent, NoteDuration, Difficulty } from '../types'

// MIDI note number to pitch name
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function midiToPitch(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const name = NOTE_NAMES[midi % 12]
  return `${name}${octave}`
}

// Convert duration in beats to NoteDuration
function beatsToNoteDuration(beats: number): NoteDuration {
  if (beats >= 3.5) return 'w'
  if (beats >= 2.5) return 'hd'
  if (beats >= 1.5) return 'h'
  if (beats >= 0.75) return 'q'
  if (beats >= 0.375) return '8'
  return '16'
}

// Detect key signature from notes
function detectKeySignature(notes: { midi: number }[]): {
  keySignature: string
  keySharps: string[]
  keyFlats: string[]
} {
  // Simple heuristic: count pitch classes
  const pitchCounts = new Array(12).fill(0)
  for (const n of notes) {
    pitchCounts[n.midi % 12]++
  }

  // Check common keys by their characteristic sharps/flats
  const keys: { key: string; sharps: string[]; flats: string[]; score: number }[] = [
    { key: 'C', sharps: [], flats: [], score: 0 },
    { key: 'G', sharps: ['F'], flats: [], score: 0 },
    { key: 'D', sharps: ['F', 'C'], flats: [], score: 0 },
    { key: 'F', sharps: [], flats: ['B'], score: 0 },
    { key: 'Bb', sharps: [], flats: ['B', 'E'], score: 0 },
  ]

  // Score each key by how many notes fall on its scale degrees
  const scales: Record<string, number[]> = {
    C: [0, 2, 4, 5, 7, 9, 11],
    G: [7, 9, 11, 0, 2, 4, 6],
    D: [2, 4, 6, 7, 9, 11, 1],
    F: [5, 7, 9, 10, 0, 2, 4],
    Bb: [10, 0, 2, 3, 5, 7, 9],
  }

  for (const k of keys) {
    const scale = scales[k.key]
    k.score = scale.reduce((sum, pc) => sum + pitchCounts[pc], 0)
  }

  keys.sort((a, b) => b.score - a.score)
  const best = keys[0]
  return { keySignature: best.key, keySharps: best.sharps, keyFlats: best.flats }
}

// Detect difficulty based on note range, complexity, etc.
function detectDifficulty(notes: { midi: number; durationTicks: number }[], totalMeasures: number): {
  difficulty: Difficulty
  level: number
} {
  if (notes.length === 0) return { difficulty: 'beginner', level: 1 }

  const midiValues = notes.map(n => n.midi)
  const range = Math.max(...midiValues) - Math.min(...midiValues)
  const notesPerMeasure = notes.length / Math.max(totalMeasures, 1)

  if (range <= 12 && notesPerMeasure <= 4) return { difficulty: 'beginner', level: 2 }
  if (range <= 24 && notesPerMeasure <= 8) return { difficulty: 'intermediate', level: 5 }
  return { difficulty: 'advanced', level: 8 }
}

export type UploadFormat = 'midi'

export interface UploadResult {
  piece: Piece
  format: UploadFormat
}

export function validateUploadFormat(file: File): { valid: boolean; format?: UploadFormat; error?: string } {
  const name = file.name.toLowerCase()
  const ext = name.split('.').pop()

  if (ext === 'mid' || ext === 'midi') {
    return { valid: true, format: 'midi' }
  }

  if (ext === 'pdf') {
    return { valid: false, error: 'PDF files are not yet supported. Please upload a MIDI (.mid/.midi) file.' }
  }

  if (ext === 'musicxml' || ext === 'mxl' || ext === 'xml') {
    return { valid: false, error: 'MusicXML files are not yet supported. Please upload a MIDI (.mid/.midi) file.' }
  }

  return { valid: false, error: `Unsupported format ".${ext}". Supported: MIDI (.mid, .midi)` }
}

export async function parseMidiFile(file: File): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer()
  const midi = new Midi(arrayBuffer)

  if (midi.tracks.length === 0) {
    throw new Error('MIDI file contains no tracks')
  }

  // Get tempo from MIDI header
  const tempo = Math.round(midi.header.tempos[0]?.bpm ?? 120)
  const ppq = midi.header.ppq

  // Get time signature
  const ts = midi.header.timeSignatures[0]
  const numerator = ts?.timeSignature?.[0] ?? 4
  const denominator = ts?.timeSignature?.[1] ?? 4

  // Collect all notes across tracks
  const allNotes: {
    midi: number
    time: number      // in seconds
    duration: number   // in seconds
    velocity: number
    ticks: number
    durationTicks: number
    track: number
  }[] = []

  midi.tracks.forEach((track, trackIdx) => {
    track.notes.forEach(note => {
      allNotes.push({
        midi: note.midi,
        time: note.time,
        duration: note.duration,
        velocity: note.velocity,
        ticks: note.ticks,
        durationTicks: note.durationTicks,
        track: trackIdx,
      })
    })
  })

  if (allNotes.length === 0) {
    throw new Error('MIDI file contains no notes')
  }

  // Sort by time
  allNotes.sort((a, b) => a.time - b.time)

  // Calculate beat positions
  const beatsPerSecond = tempo / 60
  const ticksPerBeat = ppq
  const beatsPerMeasure = numerator

  // Determine total duration and measures
  const lastNote = allNotes[allNotes.length - 1]
  const totalDurationBeats = (lastNote.time + lastNote.duration) * beatsPerSecond
  const totalMeasures = Math.ceil(totalDurationBeats / beatsPerMeasure)

  // Split into RH and LH based on pitch (middle C = MIDI 60)
  const SPLIT_POINT = 60

  // Convert to NoteEvent[]
  const noteEvents: NoteEvent[] = allNotes.map(n => {
    const beat = n.time * beatsPerSecond
    const durationBeats = n.duration * beatsPerSecond
    const measure = Math.floor(beat / beatsPerMeasure)
    const hand = n.midi >= SPLIT_POINT ? 'RH' as const : 'LH' as const
    const duration = beatsToNoteDuration(durationBeats)
    const pitch = midiToPitch(n.midi)

    return { pitch, duration, hand, beat: Math.round(beat * 4) / 4, measure }
  })

  // Detect key and difficulty
  const { keySignature, keySharps, keyFlats } = detectKeySignature(allNotes)
  const { difficulty, level } = detectDifficulty(allNotes, totalMeasures)

  // Generate piece ID from filename
  const baseName = file.name.replace(/\.(mid|midi)$/i, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  const id = `upload-${baseName}-${Date.now()}`

  // Limit piece length for sight-reading practice
  const maxMeasures = Math.min(totalMeasures, 32)
  const maxBeat = maxMeasures * beatsPerMeasure
  const filteredNotes = noteEvents.filter(n => n.beat < maxBeat)

  const piece: Piece = {
    id,
    title: file.name.replace(/\.(mid|midi)$/i, ''),
    composer: 'Uploaded',
    difficulty,
    level,
    timeSignature: { numerator, denominator },
    keySignature,
    keySharps,
    keyFlats,
    tempo,
    totalMeasures: maxMeasures,
    notes: filteredNotes,
    description: `Uploaded MIDI file (${allNotes.length} notes, ${totalMeasures} measures)`,
    tags: ['uploaded', keySignature, difficulty],
  }

  return { piece, format: 'midi' }
}
