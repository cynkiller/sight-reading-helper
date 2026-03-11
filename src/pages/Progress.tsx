import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { getPieceById } from '../data'

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function Progress() {
  const navigate = useNavigate()
  const { progress } = useProgress()

  // Aggregate per piece
  const pieceStats = new Map<string, { count: number; totalSecs: number; lastAt: number }>()
  for (const s of progress.sessions) {
    const existing = pieceStats.get(s.pieceId) ?? { count: 0, totalSecs: 0, lastAt: 0 }
    pieceStats.set(s.pieceId, {
      count: existing.count + 1,
      totalSecs: existing.totalSecs + s.durationSeconds,
      lastAt: Math.max(existing.lastAt, s.startedAt),
    })
  }

  const totalMinutes = Math.round(
    progress.sessions.reduce((s, p) => s + p.durationSeconds, 0) / 60
  )
  const uniquePieces = pieceStats.size
  const totalSessions = progress.sessions.length

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 shrink-0">
        <button onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white p-2 -ml-2 text-lg transition-colors">‹</button>
        <h1 className="text-white font-bold text-lg">Practice Progress</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Minutes', value: totalMinutes, icon: '⏱' },
            { label: 'Sessions', value: totalSessions, icon: '🎵' },
            { label: 'Pieces Tried', value: uniquePieces, icon: '📄' },
          ].map(c => (
            <div key={c.label} className="bg-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">{c.icon}</div>
              <div className="text-white text-2xl font-bold">{c.value}</div>
              <div className="text-slate-400 text-xs mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Per-piece stats */}
        {uniquePieces === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg mb-2">No practice sessions yet.</p>
            <button onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300 underline text-sm">
              Start practicing →
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">By Piece</h2>
            <div className="flex flex-col gap-2">
              {Array.from(pieceStats.entries())
                .sort((a, b) => b[1].lastAt - a[1].lastAt)
                .map(([id, stats]) => {
                  const piece = getPieceById(id)
                  return (
                    <button key={id}
                      onClick={() => navigate(`/practice/${id}`)}
                      className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700
                        border border-slate-700 hover:border-slate-600 rounded-xl p-4
                        text-left transition-colors group">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate group-hover:text-blue-300 transition-colors">
                          {piece?.title ?? id}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {piece?.composer} · {formatDate(stats.lastAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white font-semibold">{stats.count}×</p>
                        <p className="text-slate-500 text-xs">
                          {Math.round(stats.totalSecs / 60)}m total
                        </p>
                      </div>
                      <span className="text-slate-500 group-hover:text-slate-300">›</span>
                    </button>
                  )
                })}
            </div>
          </>
        )}

        {/* Recent sessions */}
        {progress.sessions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Recent Sessions</h2>
            <div className="flex flex-col gap-2">
              {[...progress.sessions].reverse().slice(0, 10).map((s, i) => {
                const piece = getPieceById(s.pieceId)
                return (
                  <div key={i} className="flex items-center justify-between bg-slate-800/50
                    border border-slate-800 rounded-lg px-4 py-3 text-sm">
                    <div>
                      <span className="text-slate-300">{piece?.title ?? s.pieceId}</span>
                      <span className="text-slate-600 ml-2 text-xs">
                        ♩={s.settings.tempo > 0 ? s.settings.tempo : piece?.tempo}
                      </span>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <div>{Math.round(s.durationSeconds)}s</div>
                      <div>{formatDate(s.startedAt)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
