import { useRef, useCallback, useState } from 'react'

const BASE_URL = 'https://cdn.jsdelivr.net/npm/tonejs-instrument-piano-mp3@1.1.2'

// Available samples and their MIDI numbers
const SAMPLES: Array<{ file: string; midi: number }> = [
  { file: 'A1.mp3', midi: 33 }, { file: 'A2.mp3', midi: 45 }, { file: 'A3.mp3', midi: 57 },
  { file: 'A4.mp3', midi: 69 }, { file: 'A5.mp3', midi: 81 }, { file: 'A6.mp3', midi: 93 },
  { file: 'C1.mp3', midi: 24 }, { file: 'C2.mp3', midi: 36 }, { file: 'C3.mp3', midi: 48 },
  { file: 'C4.mp3', midi: 60 }, { file: 'C5.mp3', midi: 72 }, { file: 'C6.mp3', midi: 84 },
  { file: 'C7.mp3', midi: 96 },
  { file: 'Ds1.mp3', midi: 27 }, { file: 'Ds2.mp3', midi: 39 }, { file: 'Ds3.mp3', midi: 51 },
  { file: 'Ds4.mp3', midi: 63 }, { file: 'Ds5.mp3', midi: 75 }, { file: 'Ds6.mp3', midi: 87 },
  { file: 'Fs1.mp3', midi: 30 }, { file: 'Fs2.mp3', midi: 42 }, { file: 'Fs3.mp3', midi: 54 },
  { file: 'Fs4.mp3', midi: 66 }, { file: 'Fs5.mp3', midi: 78 }, { file: 'Fs6.mp3', midi: 90 },
  { file: 'A7.mp3', midi: 105 },
]

const NOTE_TO_MIDI: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
}

function noteNameToMidi(note: string): number {
  const m = note.match(/^([A-G][#b]?)(\d+)$/)
  if (!m) return 60
  const pc = NOTE_TO_MIDI[m[1]] ?? 0
  return pc + (parseInt(m[2]) + 1) * 12
}

function findClosestSample(midi: number): { file: string; midi: number } {
  return SAMPLES.reduce((best, s) =>
    Math.abs(s.midi - midi) < Math.abs(best.midi - midi) ? s : best
  )
}

export function useAudioSampler() {
  const ctxRef = useRef<AudioContext | null>(null)
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const loadSample = useCallback(async (file: string): Promise<AudioBuffer | null> => {
    const cached = bufferCacheRef.current.get(file)
    if (cached) return cached
    try {
      const res = await fetch(`${BASE_URL}/${file}`)
      if (!res.ok) return null
      const arrayBuf = await res.arrayBuffer()
      const ctx = getCtx()
      const audioBuf = await ctx.decodeAudioData(arrayBuf)
      bufferCacheRef.current.set(file, audioBuf)
      return audioBuf
    } catch {
      return null
    }
  }, [getCtx])

  const preloadEssentials = useCallback(async () => {
    const essentials = ['C4.mp3', 'Ds4.mp3', 'Fs4.mp3', 'A4.mp3', 'C5.mp3', 'C3.mp3', 'A3.mp3']
    setIsLoading(true)
    let loaded = 0
    await Promise.all(essentials.map(async f => {
      await loadSample(f)
      loaded++
      setLoadProgress(Math.round((loaded / essentials.length) * 100))
    }))
    setIsLoading(false)
  }, [loadSample])

  const playNote = useCallback(async (note: string, durationMs: number, volume = 0.7) => {
    const midi = noteNameToMidi(note)
    const sample = findClosestSample(midi)
    let buffer = bufferCacheRef.current.get(sample.file)
    if (!buffer) {
      buffer = await loadSample(sample.file) ?? undefined
    }
    if (!buffer) return

    const ctx = getCtx()
    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Pitch shift via playbackRate
    const semitoneDiff = midi - sample.midi
    source.playbackRate.value = Math.pow(2, semitoneDiff / 12)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000 + 0.5)

    source.connect(gain)
    gain.connect(ctx.destination)
    source.start(ctx.currentTime)
    source.stop(ctx.currentTime + durationMs / 1000 + 0.6)
  }, [getCtx, loadSample])

  const playNotes = useCallback((pitches: string[], durationMs: number) => {
    pitches.forEach(p => playNote(p, durationMs, 0.65))
  }, [playNote])

  const playMetronomeClick = useCallback((isStrong = false) => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = isStrong ? 1000 : 750
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  }, [getCtx])

  return { isLoading, loadProgress, preloadEssentials, playNotes, playNote, playMetronomeClick }
}
