import { useRef, useState, useCallback, useEffect } from 'react'
import type { Piece, HandMode } from '../types'
import { getNoteDurationBeats } from './useLookAhead'

interface UsePlaybackOptions {
  piece: Piece | null
  tempo: number          // BPM (0 = use piece default)
  handMode: HandMode
  onNotePlay?: (pitches: string[], durationMs: number) => void
  onComplete?: () => void
}

interface PlaybackControls {
  isPlaying: boolean
  currentBeat: number
  totalBeats: number
  play: () => void
  pause: () => void
  restart: () => void
  seekToMeasure: (measure: number) => void
}

export function usePlayback({
  piece,
  tempo,
  handMode,
  onNotePlay,
  onComplete,
}: UsePlaybackOptions): PlaybackControls {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)

  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const startBeatRef = useRef<number>(0)
  const lastTriggeredBeatRef = useRef<number>(-1)
  const isPlayingRef = useRef(false)

  const effectiveTempo = tempo > 0 ? tempo : (piece?.tempo ?? 72)
  const beatsPerSecond = effectiveTempo / 60
  const beatsPerBar = piece?.timeSignature.numerator ?? 4

  // Keep refs up-to-date so RAF callback always reads the latest values
  const beatsPerSecondRef = useRef(beatsPerSecond)
  const currentBeatRef    = useRef(0)
  const totalBeatsRef     = useRef(0)
  const onNotePlayRef     = useRef(onNotePlay)
  const onCompleteRef     = useRef(onComplete)
  const handModeRef       = useRef(handMode)
  useEffect(() => { onNotePlayRef.current = onNotePlay }, [onNotePlay])
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])
  useEffect(() => { handModeRef.current = handMode }, [handMode])
  // Resync start point when tempo changes mid-playback to avoid position jump
  useEffect(() => {
    beatsPerSecondRef.current = beatsPerSecond
    if (isPlayingRef.current) {
      startTimeRef.current = performance.now()
      startBeatRef.current = currentBeatRef.current
    }
  }, [beatsPerSecond])

  const totalBeats = piece
    ? piece.totalMeasures * beatsPerBar
    : 0
  useEffect(() => { totalBeatsRef.current = totalBeats }, [totalBeats])

  // Get all unique beat positions that have notes
  const getScheduledBeats = useCallback(() => {
    if (!piece) return []
    const beats = new Set<number>()
    piece.notes.forEach(n => beats.add(n.beat))
    return Array.from(beats).sort((a, b) => a - b)
  }, [piece])

  const triggerNotesAtBeat = useCallback((beat: number) => {
    if (!piece || !onNotePlayRef.current) return
    const currentHandMode = handModeRef.current
    const notesAtBeat = piece.notes.filter(n => {
      if (Math.abs(n.beat - beat) > 0.05) return false
      if (currentHandMode === 'RH' && n.hand !== 'RH') return false
      if (currentHandMode === 'LH' && n.hand !== 'LH') return false
      if (!n.pitch) return false
      return true
    })

    if (notesAtBeat.length === 0) return

    const allPitches: string[] = []
    let maxDuration = 0
    notesAtBeat.forEach(n => {
      const pitches = Array.isArray(n.pitch) ? n.pitch : [n.pitch as string]
      allPitches.push(...pitches)
      const dur = getNoteDurationBeats(n.duration)
      if (dur > maxDuration) maxDuration = dur
    })

    const durationMs = (maxDuration / beatsPerSecondRef.current) * 1000
    onNotePlayRef.current!(allPitches, durationMs)
  }, [piece])

  const tick = useCallback((timestamp: number) => {
    if (!isPlayingRef.current) return

    const elapsed = (timestamp - startTimeRef.current) / 1000
    // Always read from ref so tempo changes take effect immediately
    const beat = startBeatRef.current + elapsed * beatsPerSecondRef.current
    const total = totalBeatsRef.current
    const clampedBeat = Math.min(beat, total)

    currentBeatRef.current = clampedBeat
    setCurrentBeat(clampedBeat)

    // Find next scheduled beat to trigger
    const scheduledBeats = getScheduledBeats()
    for (const sb of scheduledBeats) {
      if (sb > lastTriggeredBeatRef.current && sb <= clampedBeat + 0.05) {
        lastTriggeredBeatRef.current = sb
        triggerNotesAtBeat(sb)
      }
    }

    if (clampedBeat >= total) {
      isPlayingRef.current = false
      setIsPlaying(false)
      onCompleteRef.current?.()
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [getScheduledBeats, triggerNotesAtBeat])

  const play = useCallback(() => {
    if (!piece) return
    isPlayingRef.current = true
    setIsPlaying(true)
    startTimeRef.current = performance.now()
    startBeatRef.current = currentBeatRef.current
    lastTriggeredBeatRef.current = currentBeatRef.current - 0.1
    rafRef.current = requestAnimationFrame(tick)
  }, [piece, tick])

  const pause = useCallback(() => {
    isPlayingRef.current = false
    setIsPlaying(false)
    cancelAnimationFrame(rafRef.current)
  }, [])

  const restart = useCallback(() => {
    isPlayingRef.current = false
    setIsPlaying(false)
    cancelAnimationFrame(rafRef.current)
    setCurrentBeat(0)
    lastTriggeredBeatRef.current = -1
  }, [])

  const seekToMeasure = useCallback((measure: number) => {
    const beat = measure * beatsPerBar
    const wasPlaying = isPlayingRef.current
    if (wasPlaying) {
      isPlayingRef.current = false
      cancelAnimationFrame(rafRef.current)
    }
    setCurrentBeat(beat)
    lastTriggeredBeatRef.current = beat - 0.1
    if (wasPlaying) {
      startTimeRef.current = performance.now()
      startBeatRef.current = beat
      isPlayingRef.current = true
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [beatsPerBar, tick])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      isPlayingRef.current = false
    }
  }, [])

  // Reset when piece changes
  useEffect(() => {
    restart()
  }, [piece?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return { isPlaying, currentBeat, totalBeats, play, pause, restart, seekToMeasure }
}
