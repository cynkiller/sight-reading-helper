import React, { useMemo } from 'react'
import type { Piece, LookAheadConfig, HandMode } from '../types'
import { buildNoteRenderStates } from '../hooks/useLookAhead'

// ── Music theory helpers ────────────────────────────────────────────────────

const DIATONIC: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }
const TREBLE_TOP_STEP = 5 * 7 + 3  // F5 = 38
const BASS_TOP_STEP   = 3 * 7 + 5  // A3 = 26
const TREBLE_BOT_STEP = 4 * 7 + 2  // E4 = 30
const BASS_BOT_STEP   = 2 * 7 + 4  // G2 = 18

function diatonicStep(pitch: string): number {
  const m = pitch.match(/^([A-G])[#b]?(\d+)$/)
  if (!m) return 30
  return parseInt(m[2]) * 7 + DIATONIC[m[1]]
}

function noteY(pitch: string, clef: 'treble' | 'bass', staffTop: number, ls: number): number {
  const topStep = clef === 'treble' ? TREBLE_TOP_STEP : BASS_TOP_STEP
  return staffTop + (topStep - diatonicStep(pitch)) * (ls / 2)
}

/** Ledger line y-positions required for a note outside the 5 lines.
 *  Rule: draw lines at every 2nd diatonic step outside the staff, from the
 *  first one outside down to (and including) the note’s own line position.
 *  Notes in spaces just outside the staff need no ledger lines.
 */
function ledgerLines(pitch: string, clef: 'treble' | 'bass', staffTop: number, ls: number): number[] {
  const step = diatonicStep(pitch)
  const topStep = clef === 'treble' ? TREBLE_TOP_STEP : BASS_TOP_STEP
  const botStep = clef === 'treble' ? TREBLE_BOT_STEP : BASS_BOT_STEP
  const result: number[] = []
  // Below staff: first line at botStep-2, draw while s >= step
  for (let s = botStep - 2; s >= step; s -= 2) {
    result.push(staffTop + (topStep - s) * (ls / 2))
  }
  // Above staff: first line at topStep+2, draw while s <= step
  for (let s = topStep + 2; s <= step; s += 2) {
    result.push(staffTop + (topStep - s) * (ls / 2))
  }
  return result
}

function getAccidental(pitch: string, keySharps: string[], keyFlats: string[]): '#' | 'b' | 'n' | null {
  const m = pitch.match(/^([A-G])([#b]?)(\d+)$/)
  if (!m) return null
  const letter = m[1], mod = m[2]
  if (mod === '#') return keySharps.includes(letter) ? null : '#'
  if (mod === 'b') return keyFlats.includes(letter) ? null : 'b'
  if (keySharps.includes(letter)) return 'n'
  if (keyFlats.includes(letter)) return 'n'
  return null
}

// ── Layout constants ────────────────────────────────────────────────────────

const LEFT_MARGIN  = 90   // px left of first note (clef + key sig)
const RIGHT_MARGIN = 20
const TREBLE_Y     = 45
const STAFF_GAP    = 52   // gap between treble bottom and bass top

interface Props {
  piece: Piece
  currentBeat: number
  lookAhead: LookAheadConfig
  handMode: HandMode
  lineSpacing?: number   // px between staff lines
  svgWidth?: number
}

export function StaffDisplay({ piece, currentBeat, lookAhead, handMode, lineSpacing = 14, svgWidth = 900 }: Props) {
  const ls = lineSpacing
  const bassY  = TREBLE_Y + 4 * ls + STAFF_GAP
  const svgH   = bassY + 4 * ls + 48
  const bpb    = piece.timeSignature.numerator

  // How many beats to show: past + future window
  const pastBeats   = bpb                                       // 1 bar back
  const futureBeats = (lookAhead.lookaheadBars + 1.2) * bpb    // lookahead + 1 dimmed bar
  const totalVisibleBeats = pastBeats + futureBeats
  const usableWidth = svgWidth - LEFT_MARGIN - RIGHT_MARGIN
  const beatW = usableWidth / totalVisibleBeats
  const cursorX = LEFT_MARGIN + pastBeats * beatW

  function beatToX(beat: number): number {
    return cursorX + (beat - currentBeat) * beatW
  }

  // Build note render states
  const noteStates = useMemo(
    () => buildNoteRenderStates(piece.notes, currentBeat, lookAhead, bpb),
    [piece.notes, currentBeat, lookAhead, bpb]
  )

  // Determine visible beat range
  const minBeat = currentBeat - pastBeats - 0.5
  const maxBeat = currentBeat + futureBeats + 0.5

  // Staff line y coords
  const trebleLines = Array.from({ length: 5 }, (_, i) => TREBLE_Y + i * ls)
  const bassLines   = Array.from({ length: 5 }, (_, i) => bassY   + i * ls)

  // Measure bar line x positions in visible range
  const barLines: number[] = []
  for (let m = 0; m <= piece.totalMeasures; m++) {
    const beat = m * bpb
    if (beat >= minBeat && beat <= maxBeat) {
      barLines.push(beatToX(beat))
    }
  }

  // Colors
  const activeColor   = '#22c55e'   // green
  const upcomingColor = '#93c5fd'   // blue-300
  const defaultColor  = '#e2e8f0'   // slate-200 (visible on dark bg)
  const dimColor      = '#64748b'   // slate-500 dimmed
  const staffColor    = '#64748b'   // slate-500
  const cursorColor   = '#f87171'   // red-400

  function getNoteColor(state: ReturnType<typeof buildNoteRenderStates>[number]): string {
    if (state.isActive) return activeColor
    if (state.isFuture) return upcomingColor
    if (state.isFarFuture) return dimColor
    return defaultColor
  }

  function renderNote(
    pitch: string,
    beat: number,
    duration: string,
    clef: 'treble' | 'bass',
    staffTop: number,
    color: string,
    opacity: number,
    key: string
  ): React.ReactNode {
    const x = beatToX(beat)
    if (x < LEFT_MARGIN - 30 || x > svgWidth + 10) return null

    const y = noteY(pitch, clef, staffTop, ls)
    const step = diatonicStep(pitch)
    const topStep = clef === 'treble' ? TREBLE_TOP_STEP : BASS_TOP_STEP
    const botStep = clef === 'treble' ? TREBLE_BOT_STEP : BASS_BOT_STEP
    const midStep = clef === 'treble' ? 34 : 22   // B4 / D3

    const nhW = ls * 0.68   // notehead width
    const nhH = ls * 0.58   // notehead height
    const stemLen = ls * 3.2
    const stemUp = step <= midStep
    const isOpen = duration === 'h' || duration === 'hd' || duration === 'w'
    const isDotted = duration === 'hd'

    // Stem x/y
    const stemX = stemUp ? x + nhW * 0.45 : x - nhW * 0.45
    const stemY1 = y + (stemUp ? -nhH * 0.3 : nhH * 0.3)
    const stemY2 = y + (stemUp ? -stemLen : stemLen)

    const lls = ledgerLines(pitch, clef, staffTop, ls)
    const acc = getAccidental(pitch, piece.keySharps, piece.keyFlats)

    return (
      <g key={key} opacity={opacity} style={{ transition: 'opacity 0.3s ease-out' }}>
        {/* Ledger lines */}
        {lls.map((ly, i) => (
          <line key={i} x1={x - nhW * 1.1} x2={x + nhW * 1.1} y1={ly} y2={ly}
            stroke={staffColor} strokeWidth={1.2} />
        ))}
        {/* Accidental */}
        {acc && (
          <text x={x - nhW * 1.4} y={y + ls * 0.35} fontSize={ls * 1.1}
            fill={color} textAnchor="middle"
            style={{ fontFamily: 'serif', userSelect: 'none' }}>
            {acc === '#' ? '♯' : acc === 'b' ? '♭' : '♮'}
          </text>
        )}
        {/* Notehead */}
        {duration !== 'w' && (
          <line x1={stemX} y1={stemY1} x2={stemX} y2={stemY2}
            stroke={color} strokeWidth={1.3} />
        )}
        <ellipse cx={x} cy={y} rx={nhW * 0.5} ry={nhH * 0.5}
          fill={isOpen ? 'none' : color}
          stroke={color}
          strokeWidth={isOpen ? 1.4 : 0}
          transform={`rotate(-15, ${x}, ${y})`}
        />
        {/* Dot for dotted notes */}
        {isDotted && (
          <circle cx={x + nhW * 0.85} cy={y - ls * 0.08} r={ls * 0.14} fill={color} />
        )}
        {/* On-line indicator: fill inside open notes when on a line */}
        {isOpen && step % 2 === topStep % 2 && step >= botStep && step <= topStep && (
          <ellipse cx={x} cy={y} rx={nhW * 0.2} ry={nhH * 0.35}
            fill={color} opacity={0.25}
            transform={`rotate(-15, ${x}, ${y})`}
          />
        )}
      </g>
    )
  }

  function renderRest(
    beat: number,
    duration: string,
    staffTop: number,
    color: string,
    opacity: number,
    key: string
  ): React.ReactNode {
    const x = beatToX(beat)
    if (x < LEFT_MARGIN - 30 || x > svgWidth + 10) return null
    const midY = staffTop + 2 * ls
    const clr = dimColor

    let sym = ''
    if (duration === 'w') sym = '𝄻'
    else if (duration === 'h' || duration === 'hd') sym = '𝄼'
    else if (duration === 'q') sym = '𝄽'
    else if (duration === '8') sym = '𝄾'
    else sym = '𝄿'

    return (
      <text key={key} x={x} y={midY + ls * 0.4} fontSize={ls * 1.6}
        fill={clr} textAnchor="middle" opacity={opacity}
        style={{ userSelect: 'none', transition: 'opacity 0.3s ease-out' }}>
        {sym}
      </text>
    )
  }

  return (
    <svg
      width={svgWidth}
      height={svgH}
      viewBox={`0 0 ${svgWidth} ${svgH}`}
      aria-label="Music staff notation"
    >
      {/* ── Staff background ───────────────────────────── */}
      <rect x={0} y={0} width={svgWidth} height={svgH} fill="#0f172a" />
      {/* Treble staff background */}
      <rect x={LEFT_MARGIN - 6} y={TREBLE_Y - 2} width={svgWidth - LEFT_MARGIN + 6 - RIGHT_MARGIN}
        height={4 * ls + 4} rx={2} fill="#1e293b" opacity={0.6} />
      {/* Bass staff background */}
      <rect x={LEFT_MARGIN - 6} y={bassY - 2} width={svgWidth - LEFT_MARGIN + 6 - RIGHT_MARGIN}
        height={4 * ls + 4} rx={2} fill="#1e293b" opacity={0.6} />

      {/* ── Staff lines ─────────────────────────────────── */}
      {trebleLines.map((y, i) => (
        <line key={`t${i}`} x1={LEFT_MARGIN - 5} x2={svgWidth - RIGHT_MARGIN}
          y1={y} y2={y} stroke={staffColor} strokeWidth={1.2} />
      ))}
      {bassLines.map((y, i) => (
        <line key={`b${i}`} x1={LEFT_MARGIN - 5} x2={svgWidth - RIGHT_MARGIN}
          y1={y} y2={y} stroke={staffColor} strokeWidth={1.2} />
      ))}

      {/* ── Clef symbols ────────────────────────────────── */}
      <text x={10} y={TREBLE_Y + 3.5 * ls} fontSize={ls * 4.2}
        fill={staffColor} style={{ fontFamily: 'serif', userSelect: 'none' }}>𝄞</text>
      <text x={12} y={bassY + 2.8 * ls} fontSize={ls * 2.2}
        fill={staffColor} style={{ fontFamily: 'serif', userSelect: 'none' }}>𝄢</text>

      {/* ── Key signature ───────────────────────────────── */}
      {piece.keySharps.map((note, i) => {
        const sharpPositions: Record<string, number> = {
          F: TREBLE_Y + 0 * ls, C: TREBLE_Y + 1.5 * ls, G: TREBLE_Y - 0.5 * ls,
          D: TREBLE_Y + 1 * ls, A: TREBLE_Y + 2.5 * ls,
        }
        const y = sharpPositions[note] ?? TREBLE_Y
        return (
          <text key={note} x={52 + i * 9} y={y + ls * 0.4} fontSize={ls * 1.1}
            fill={staffColor} style={{ fontFamily: 'serif', userSelect: 'none' }}>♯</text>
        )
      })}
      {piece.keyFlats.map((note, i) => {
        const flatPositions: Record<string, number> = {
          B: TREBLE_Y + 0.5 * ls, E: TREBLE_Y + 2 * ls, A: TREBLE_Y + 1 * ls,
        }
        const y = flatPositions[note] ?? TREBLE_Y + ls
        return (
          <text key={note} x={52 + i * 9} y={y + ls * 0.6} fontSize={ls * 1.1}
            fill={staffColor} style={{ fontFamily: 'serif', userSelect: 'none' }}>♭</text>
        )
      })}

      {/* ── Time signature ──────────────────────────────── */}
      {currentBeat < bpb * 2 && (
        <>
          <text x={LEFT_MARGIN - 14} y={TREBLE_Y + 1.5 * ls} fontSize={ls * 1.35}
            fill={staffColor} textAnchor="middle" fontWeight="bold"
            style={{ userSelect: 'none' }}>
            {piece.timeSignature.numerator}
          </text>
          <text x={LEFT_MARGIN - 14} y={TREBLE_Y + 3.2 * ls} fontSize={ls * 1.35}
            fill={staffColor} textAnchor="middle" fontWeight="bold"
            style={{ userSelect: 'none' }}>
            {piece.timeSignature.denominator}
          </text>
          <text x={LEFT_MARGIN - 14} y={bassY + 1.5 * ls} fontSize={ls * 1.35}
            fill={staffColor} textAnchor="middle" fontWeight="bold"
            style={{ userSelect: 'none' }}>
            {piece.timeSignature.numerator}
          </text>
          <text x={LEFT_MARGIN - 14} y={bassY + 3.2 * ls} fontSize={ls * 1.35}
            fill={staffColor} textAnchor="middle" fontWeight="bold"
            style={{ userSelect: 'none' }}>
            {piece.timeSignature.denominator}
          </text>
        </>
      )}

      {/* ── Bar lines ───────────────────────────────────── */}
      {barLines.map((x, i) => (
        <line key={i} x1={x} x2={x}
          y1={TREBLE_Y} y2={bassY + 4 * ls}
          stroke={staffColor} strokeWidth={x < LEFT_MARGIN + 2 ? 2 : 1.5} />
      ))}

      {/* ── Notes ───────────────────────────────────────── */}
      {noteStates.map((state, idx) => {
        const { noteEvent: n } = state
        if (n.beat < minBeat || n.beat > maxBeat) return null
        if (handMode === 'RH' && n.hand !== 'RH') return null
        if (handMode === 'LH' && n.hand !== 'LH') return null

        const clef = n.hand === 'LH' ? 'bass' : 'treble'
        const staffTop = n.hand === 'LH' ? bassY : TREBLE_Y
        const color = getNoteColor(state)

        if (n.pitch === null) {
          return renderRest(n.beat, n.duration, staffTop, color, state.opacity, `rest-${idx}`)
        }

        const pitches = Array.isArray(n.pitch) ? n.pitch : [n.pitch]
        return pitches.map((p, pi) =>
          renderNote(p, n.beat, n.duration, clef, staffTop, color, state.opacity,
            `note-${idx}-${pi}`)
        )
      })}

      {/* ── Playback cursor ─────────────────────────────── */}
      <line
        x1={cursorX} x2={cursorX}
        y1={TREBLE_Y - 10} y2={bassY + 4 * ls + 10}
        stroke={cursorColor} strokeWidth={2} opacity={0.85}
      />
      {/* Cursor triangle indicator */}
      <polygon
        points={`${cursorX - 5},${TREBLE_Y - 16} ${cursorX + 5},${TREBLE_Y - 16} ${cursorX},${TREBLE_Y - 9}`}
        fill={cursorColor}
      />

      {/* ── Look-ahead zone indicator ───────────────────── */}
      <rect
        x={cursorX}
        y={TREBLE_Y - 6}
        width={lookAhead.lookaheadBars * bpb * beatW}
        height={bassY + 4 * ls + 12 - (TREBLE_Y - 6)}
        fill="#60a5fa"
        opacity={0.04}
      />

      {/* ── Measure numbers ─────────────────────────────── */}
      {Array.from({ length: piece.totalMeasures + 1 }, (_, m) => {
        const beat = m * bpb
        if (beat < minBeat || beat > maxBeat) return null
        const x = beatToX(beat)
        return (
          <text key={m} x={x + 4} y={TREBLE_Y - 20}
            fontSize={10} fill={staffColor}
            style={{ userSelect: 'none' }}>
            {m + 1}
          </text>
        )
      })}
    </svg>
  )
}
