import { useState, useCallback } from 'react'
import type { ProgressData, PracticeSession } from '../types'

const STORAGE_KEY = 'srh_progress'

const DEFAULT_PROGRESS: ProgressData = {
  sessions: [],
  lastPieceId: null,
  unlockedLevels: [1, 2, 3],
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_PROGRESS
}

function saveProgress(data: ProgressData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress)

  const recordSession = useCallback((session: PracticeSession) => {
    setProgress(prev => {
      const newSessions = [...prev.sessions.slice(-49), session] // keep last 50
      const next: ProgressData = {
        ...prev,
        sessions: newSessions,
        lastPieceId: session.pieceId,
        unlockedLevels: [...new Set([...prev.unlockedLevels, ...getUnlockedLevels(newSessions)])],
      }
      saveProgress(next)
      return next
    })
  }, [])

  const getPieceStats = useCallback((pieceId: string) => {
    const sessions = progress.sessions.filter(s => s.pieceId === pieceId)
    return {
      timesPlayed: sessions.length,
      lastPlayed: sessions.length > 0 ? sessions[sessions.length - 1].startedAt : null,
      totalMinutes: Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60),
    }
  }, [progress.sessions])

  return { progress, recordSession, getPieceStats }
}

function getUnlockedLevels(sessions: PracticeSession[]): number[] {
  // Unlock next level after practicing current pieces
  const playedPieces = new Set(sessions.map(s => s.pieceId))
  const levels = [1, 2, 3]
  if (playedPieces.size >= 2) levels.push(4)
  if (playedPieces.size >= 3) levels.push(5, 6)
  if (playedPieces.size >= 5) levels.push(7, 8, 9, 10)
  return levels
}
