import type { Piece } from '../types'

interface Props {
  piece: Piece
  timesPlayed: number
  lastPlayed: number | null
  onSelect: () => void
}

const DIFFICULTY_COLORS: Record<Piece['difficulty'], string> = {
  beginner:     'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  intermediate: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  advanced:     'bg-red-900/50 text-red-300 border-red-700',
}

const DIFFICULTY_STARS: Record<Piece['difficulty'], string> = {
  beginner: '★☆☆',
  intermediate: '★★☆',
  advanced: '★★★',
}

function formatAgo(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function PieceCard({ piece, timesPlayed, lastPlayed, onSelect }: Props) {
  const totalBeats = piece.totalMeasures * piece.timeSignature.numerator
  const durationSecs = Math.round((totalBeats / piece.tempo) * 60)
  const mins = Math.floor(durationSecs / 60)
  const secs = durationSecs % 60
  const durationStr = `${mins}:${String(secs).padStart(2, '0')}`

  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700
        hover:border-slate-500 rounded-xl p-4 transition-all duration-200
        hover:shadow-lg hover:shadow-slate-900/50 active:scale-[0.98] group"
    >
      {/* Top row: level badge + difficulty */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-slate-500 text-xs font-mono">Lv.{piece.level}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[piece.difficulty]}`}>
          {DIFFICULTY_STARS[piece.difficulty]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-base leading-tight group-hover:text-blue-300 transition-colors">
        {piece.title}
      </h3>
      <p className="text-slate-400 text-sm mt-0.5">{piece.composer}</p>

      {/* Meta row */}
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        <span>♩={piece.tempo}</span>
        <span>{piece.timeSignature.numerator}/{piece.timeSignature.denominator}</span>
        <span>{piece.totalMeasures} bars</span>
        <span>{durationStr}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        {piece.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Play history */}
      {timesPlayed > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2 text-xs text-slate-500">
          <span>▶ {timesPlayed}×</span>
          {lastPlayed && <span>· {formatAgo(lastPlayed)}</span>}
        </div>
      )}
    </button>
  )
}
