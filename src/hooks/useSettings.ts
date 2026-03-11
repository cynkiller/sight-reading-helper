import { useState, useCallback } from 'react'
import type { AppSettings } from '../types'

const STORAGE_KEY = 'srh_settings'

const DEFAULT_SETTINGS: AppSettings = {
  lookAhead: {
    fadeDuration: 4,
    lookaheadBars: 2,
  },
  handMode: 'both',
  tempo: 0,
  displaySize: 'normal',
  theme: 'dark',
  metronomeEnabled: false,
  showHintBar: true,
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings)

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...patch }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }, [])

  return { settings, updateSettings, resetSettings }
}
