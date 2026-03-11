import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieceCard } from '../components/PieceCard'
import { getPiecesByDifficulty } from '../data'
import { useProgress } from '../hooks/useProgress'
import type { Piece } from '../types'

type Tab = 'beginner' | 'intermediate' | 'advanced'

const TAB_LABELS: Record<Tab, string> = {
  beginner:     '🌱 Beginner',
  intermediate: '🎵 Intermediate',
  advanced:     '⚡ Advanced',
}

export function Home() {
  const navigate = useNavigate()
  const { progress, getPieceStats } = useProgress()
  const [activeTab, setActiveTab] = useState<Tab>('beginner')

  const pieces = getPiecesByDifficulty(activeTab)

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎹</span>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Sight-Reading Helper</h1>
            <p className="text-slate-500 text-xs">Piano training for Android tablet</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/progress')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm
            px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          📊 Progress
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: difficulty tabs */}
        <nav className="w-44 shrink-0 border-r border-slate-800 flex flex-col pt-4 gap-1 px-2">
          {(Object.entries(TAB_LABELS) as [Tab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              {label}
            </button>
          ))}

          <div className="mt-auto pb-4 px-1">
            {progress.lastPieceId && (
              <div className="text-xs text-slate-600 mb-2">Last played:</div>
            )}
            {progress.lastPieceId && (
              <button
                onClick={() => navigate(`/practice/${progress.lastPieceId}`)}
                className="w-full text-left text-xs text-blue-400 hover:text-blue-300 bg-slate-800
                  rounded-lg px-2 py-2 leading-tight">
                ▶ Continue
              </button>
            )}
          </div>
        </nav>

        {/* Piece grid */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <p className="text-slate-500 text-sm">
              {activeTab === 'beginner' && 'Short 4-bar excerpts — C/G position, no accidentals, simple rhythms.'}
              {activeTab === 'intermediate' && '8–12 bar excerpts — accidentals, position shifts, expressive phrasing.'}
              {activeTab === 'advanced' && '16+ bars — complex rhythms, rich harmony, multi-position.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pieces.map(piece => {
              const stats = getPieceStats(piece.id)
              return (
                <PieceCard
                  key={piece.id}
                  piece={piece}
                  timesPlayed={stats.timesPlayed}
                  lastPlayed={stats.lastPlayed}
                  onSelect={() => navigate(`/practice/${piece.id}`)}
                />
              )
            })}
          </div>

          {/* Beginner guide callout */}
          {activeTab === 'beginner' && (
            <div className="mt-6 p-4 rounded-xl border border-emerald-800 bg-emerald-950/30 text-sm">
              <p className="text-emerald-300 font-semibold mb-1">💡 How to use Look-Ahead Training</p>
              <ol className="text-slate-400 text-xs space-y-1 list-decimal list-inside">
                <li>Press Play — the piece plays and the cursor moves rightward</li>
                <li>Played notes fade out — focus on reading <em>ahead</em> of the cursor</li>
                <li>Use ⚙ Settings to adjust how many bars ahead you can see</li>
                <li>Start with "Both Hands" mode — switch to RH/LH to isolate practice</li>
              </ol>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
