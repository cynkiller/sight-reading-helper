import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieceCard } from '../components/PieceCard'
import { getPiecesByDifficulty, getUploadedPieces, addUploadedPiece } from '../data'
import { useProgress } from '../hooks/useProgress'
import { validateUploadFormat, parseMidiFile } from '../utils/midiUpload'

type Tab = 'beginner' | 'intermediate' | 'advanced' | 'uploaded'

const TAB_LABELS: Record<Tab, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
  uploaded:     'My Uploads',
}

export function Home() {
  const navigate = useNavigate()
  const { progress, getPieceStats } = useProgress()
  const [activeTab, setActiveTab] = useState<Tab>('beginner')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(getUploadedPieces().length)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const pieces = activeTab === 'uploaded'
    ? getUploadedPieces()
    : getPiecesByDifficulty(activeTab)

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError(null)

    const validation = validateUploadFormat(file)
    if (!validation.valid) {
      setUploadError(validation.error ?? 'Invalid file format')
      return
    }

    try {
      setUploading(true)
      const result = await parseMidiFile(file)
      addUploadedPiece(result.piece)
      setUploadedCount(getUploadedPieces().length)
      setActiveTab('uploaded')
      // Navigate to the piece
      navigate(`/practice/${result.piece.id}`)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to parse file')
    } finally {
      setUploading(false)
    }
  }, [navigate])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }, [handleFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [handleFileUpload])

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Sight-Reading Helper</h1>
            <p className="text-slate-500 text-xs">Piano sight-reading training</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm
              px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors border border-slate-700">
            Upload MIDI
          </button>
          <button
            onClick={() => navigate('/progress')}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm
              px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            Progress
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mid,.midi"
          onChange={handleFileSelect}
          className="hidden"
        />
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
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                ${tab === 'uploaded' ? 'mt-2 border-t border-slate-800 pt-3' : ''}`}>
              {label}
              {tab === 'uploaded' && uploadedCount > 0 && (
                <span className="ml-1 text-xs opacity-60">({uploadedCount})</span>
              )}
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
                Continue
              </button>
            )}
          </div>
        </nav>

        {/* Piece grid */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Upload error */}
          {uploadError && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-300 text-sm flex items-center justify-between">
              <span>{uploadError}</span>
              <button onClick={() => setUploadError(null)}
                className="text-red-400 hover:text-red-200 ml-4">×</button>
            </div>
          )}

          {/* Uploading indicator */}
          {uploading && (
            <div className="mb-4 p-3 rounded-lg bg-blue-900/30 border border-blue-800 text-blue-300 text-sm">
              Parsing MIDI file...
            </div>
          )}

          <div className="mb-4">
            <p className="text-slate-500 text-sm">
              {activeTab === 'beginner' && 'Short 4-bar excerpts — C/G position, no accidentals, simple rhythms.'}
              {activeTab === 'intermediate' && '8-12 bar excerpts — accidentals, position shifts, expressive phrasing.'}
              {activeTab === 'advanced' && '16+ bars — complex rhythms, rich harmony, multi-position.'}
              {activeTab === 'uploaded' && 'Your uploaded MIDI files for sight-reading practice.'}
            </p>
          </div>

          {/* Upload drop zone for "uploaded" tab or when empty */}
          {activeTab === 'uploaded' && pieces.length === 0 && (
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center
                hover:border-blue-600 transition-colors cursor-pointer mb-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-slate-400 text-lg mb-2">Drop a MIDI file here</div>
              <div className="text-slate-500 text-sm mb-4">or click to browse</div>
              <div className="text-slate-600 text-xs">
                Supported: .mid, .midi
              </div>
            </div>
          )}

          {activeTab === 'uploaded' && pieces.length > 0 && (
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className="border border-dashed border-slate-700 rounded-lg p-3 text-center
                hover:border-blue-600 transition-colors cursor-pointer mb-4 text-xs text-slate-500"
              onClick={() => fileInputRef.current?.click()}
            >
              Drop or click to upload another MIDI file
            </div>
          )}

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
              <p className="text-emerald-300 font-semibold mb-1">How to use Look-Ahead Training</p>
              <ol className="text-slate-400 text-xs space-y-1 list-decimal list-inside">
                <li>Press Play — the cursor moves rightward through the piece</li>
                <li>In Sight-Reading mode — only metronome beats play, practice reading ahead</li>
                <li>In Review mode — notes play back so you can verify</li>
                <li>Played notes fade out — focus on reading <em>ahead</em> of the cursor</li>
                <li>Use Settings to adjust look-ahead window and fade speed</li>
              </ol>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
