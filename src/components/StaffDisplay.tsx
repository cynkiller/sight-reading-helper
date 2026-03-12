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
 *  first one outside down to (and including) the note's own line position.
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

// ── SMuFL codepoints (Bravura font) ─────────────────────────────────────────
const SMUFL = {
  gClef:       '\uE050',
  fClef:       '\uE062',
  sharp:       '\uE262',
  flat:        '\uE260',
  natural:     '\uE261',
  restWhole:   '\uE4E3',
  restHalf:    '\uE4E4',
  restQuarter: '\uE4E5',
  rest8th:     '\uE4E6',
  rest16th:    '\uE4E7',
  flag8thUp:   '\uE240',
  flag8thDown: '\uE241',
  flag16thUp:  '\uE242',
  flag16thDown:'\uE243',
}

const BRAVURA_FONT = "'Bravura', 'Noto Music', serif"

// ── Layout constants ────────────────────────────────────────────────────────

const LEFT_MARGIN  = 110  // more room for clef + key sig
const RIGHT_MARGIN = 24

interface Props {
  piece: Piece
  currentBeat: number
  lookAhead: LookAheadConfig
  handMode: HandMode
  lineSpacing?: number   // px between staff lines
  svgWidth?: number
}

export function StaffDisplay({ piece, currentBeat, lookAhead, handMode, lineSpacing = 20, svgWidth = 900 }: Props) {
  const ls = lineSpacing
  const trebleY = Math.round(ls * 3.5)         // room above for ledger lines + measure numbers
  const staffGap = Math.round(ls * 3.8)        // breathing room between staves
  const bassY  = trebleY + 4 * ls + staffGap
  const svgH   = bassY + 4 * ls + Math.round(ls * 3)
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
  const trebleLines = Array.from({ length: 5 }, (_, i) => trebleY + i * ls)
  const bassLines   = Array.from({ length: 5 }, (_, i) => bassY   + i * ls)

  // Measure bar line x positions in visible range
  const barLines: number[] = []
  for (let m = 0; m <= piece.totalMeasures; m++) {
    const beat = m * bpb
    if (beat >= minBeat && beat <= maxBeat) {
      barLines.push(beatToX(beat))
    }
  }

  // ── Colors ─────────────────────────────────────────────────────────────
  const activeColor   = '#34d399'   // emerald-400
  const upcomingColor = '#93c5fd'   // blue-300
  const defaultColor  = '#e2e8f0'   // slate-200 (visible on dark bg)
  const dimColor      = '#475569'   // slate-600 dimmed
  const staffColor    = '#94a3b8'   // slate-400 - brighter staff lines
  const staffBgColor  = '#475569'   // slate-600 for line strokes
  const cursorColor   = '#f87171'   // red-400

  function getNoteColor(state: ReturnType<typeof buildNoteRenderStates>[number]): string {
    if (state.isActive) return activeColor
    if (state.isFuture) return upcomingColor
    if (state.isFarFuture) return dimColor
    return defaultColor
  }

  // ── Note rendering ────────────────────────────────────────────────────

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
    if (x < LEFT_MARGIN - 40 || x > svgWidth + 15) return null

    const y = noteY(pitch, clef, staffTop, ls)
    const step = diatonicStep(pitch)
    const midStep = clef === 'treble' ? 34 : 22   // B4 / D3

    // Notehead dimensions - properly proportioned
    const nhW = ls * 0.72    // notehead width (slightly wider)
    const nhH = ls * 0.54    // notehead height
    const stemLen = ls * 3.5
    const stemWidth = ls * 0.08 + 0.8
    const stemUp = step <= midStep
    const isOpen = duration === 'h' || duration === 'hd' || duration === 'w'
    const isDotted = duration === 'hd'
    const isEighth = duration === '8'
    const isSixteenth = duration === '16'

    // Stem x/y - attach at notehead edge
    const stemX = stemUp ? x + nhW * 0.44 : x - nhW * 0.44
    const stemY1 = y
    const stemY2 = y + (stemUp ? -stemLen : stemLen)

    const lls = ledgerLines(pitch, clef, staffTop, ls)
    const acc = getAccidental(pitch, piece.keySharps, piece.keyFlats)

    return (
      <g key={key} opacity={opacity} style={{ transition: 'opacity 0.3s ease-out' }}>
        {/* Ledger lines */}
        {lls.map((ly, i) => (
          <line key={i} x1={x - nhW * 1.2} x2={x + nhW * 1.2} y1={ly} y2={ly}
            stroke={staffBgColor} strokeWidth={ls * 0.07 + 0.5} />
        ))}
        {/* Accidental - use Bravura font */}
        {acc && (
          <text x={x - nhW * 1.1} y={y + ls * 0.35} fontSize={ls * 1.6}
            fill={color} textAnchor="end"
            style={{ fontFamily: BRAVURA_FONT, userSelect: 'none' }}>
            {acc === '#' ? SMUFL.sharp : acc === 'b' ? SMUFL.flat : SMUFL.natural}
          </text>
        )}
        {/* Stem */}
        {duration !== 'w' && (
          <line x1={stemX} y1={stemY1} x2={stemX} y2={stemY2}
            stroke={color} strokeWidth={stemWidth} />
        )}
        {/* Flag for eighth/sixteenth notes */}
        {(isEighth || isSixteenth) && (
          <text
            x={stemX}
            y={stemUp ? stemY2 + ls * 0.3 : stemY2 - ls * 0.3}
            fontSize={ls * 2.8}
            fill={color}
            textAnchor={stemUp ? 'start' : 'end'}
            style={{ fontFamily: BRAVURA_FONT, userSelect: 'none' }}>
            {isEighth
              ? (stemUp ? SMUFL.flag8thUp : SMUFL.flag8thDown)
              : (stemUp ? SMUFL.flag16thUp : SMUFL.flag16thDown)
            }
          </text>
        )}
        {/* Notehead - tilted ellipse */}
        <ellipse cx={x} cy={y} rx={nhW * 0.52} ry={nhH * 0.52}
          fill={isOpen ? 'none' : color}
          stroke={color}
          strokeWidth={isOpen ? ls * 0.07 + 0.7 : 0.3}
          transform={`rotate(-12, ${x}, ${y})`}
        />
        {/* Dot for dotted notes */}
        {isDotted && (
          <circle cx={x + nhW * 0.9} cy={y - ls * 0.08} r={ls * 0.12} fill={color} />
        )}
      </g>
    )
  }

  function renderRest(
    beat: number,
    duration: string,
    staffTop: number,
    _color: string,
    opacity: number,
    key: string
  ): React.ReactNode {
    const x = beatToX(beat)
    if (x < LEFT_MARGIN - 40 || x > svgWidth + 15) return null
    // Rest position: line 3 (middle of staff)
    const midY = staffTop + 2 * ls

    let sym = SMUFL.restQuarter
    if (duration === 'w') sym = SMUFL.restWhole
    else if (duration === 'h' || duration === 'hd') sym = SMUFL.restHalf
    else if (duration === 'q') sym = SMUFL.restQuarter
    else if (duration === '8') sym = SMUFL.rest8th
    else if (duration === '16') sym = SMUFL.rest16th

    return (
      <text key={key} x={x} y={midY + ls * 0.4} fontSize={ls * 2.6}
        fill={dimColor} textAnchor="middle" opacity={opacity}
        style={{ fontFamily: BRAVURA_FONT, userSelect: 'none', transition: 'opacity 0.3s ease-out' }}>
        {sym}
      </text>
    )
  }

  // ── Key signature positions on treble & bass staves ────────────────────
  const trebleSharpSteps: Record<string, number> = {
    F: 0, C: 1.5, G: -0.5, D: 1, A: 2.5, E: 0.5, B: 2,
  }
  const trebleFlatSteps: Record<string, number> = {
    B: 1, E: -0.5, A: 1.5, D: 0, G: 2, C: 0.5, F: 2.5,
  }
  const bassSharpSteps: Record<string, number> = {
    F: 1, C: 2.5, G: 0.5, D: 2, A: 3.5, E: 1.5, B: 3,
  }
  const bassFlatSteps: Record<string, number> = {
    B: 2, E: 0.5, A: 2.5, D: 1, G: 3, C: 1.5, F: 3.5,
  }

  const keySigWidth = Math.max(piece.keySharps.length, piece.keyFlats.length) * ls * 0.65

  return (
    <svg
      width={svgWidth}
      height={svgH}
      viewBox={`0 0 ${svgWidth} ${svgH}`}
      aria-label="Music staff notation"
      style={{ display: 'block' }}
    >
      {/* ── Background ─────────────────────────────────── */}
      <rect x={0} y={0} width={svgWidth} height={svgH} fill="#0f172a" rx={4} />

      {/* Staff background bands */}
      <rect x={LEFT_MARGIN - 8} y={trebleY - ls * 0.3}
        width={svgWidth - LEFT_MARGIN + 8 - RIGHT_MARGIN}
        height={4 * ls + ls * 0.6} rx={3} fill="#1e293b" opacity={0.5} />
      <rect x={LEFT_MARGIN - 8} y={bassY - ls * 0.3}
        width={svgWidth - LEFT_MARGIN + 8 - RIGHT_MARGIN}
        height={4 * ls + ls * 0.6} rx={3} fill="#1e293b" opacity={0.5} />

      {/* ── Staff lines ────────────────────────────────── */}
      {trebleLines.map((y, i) => (
        <line key={`t${i}`} x1={LEFT_MARGIN - 6} x2={svgWidth - RIGHT_MARGIN}
          y1={y} y2={y} stroke={staffBgColor} strokeWidth={ls * 0.06 + 0.5} />
      ))}
      {bassLines.map((y, i) => (
        <line key={`b${i}`} x1={LEFT_MARGIN - 6} x2={svgWidth - RIGHT_MARGIN}
          y1={y} y2={y} stroke={staffBgColor} strokeWidth={ls * 0.06 + 0.5} />
      ))}

      {/* ── Grand staff brace ──────────────────────────── */}
      <path
        d={`M ${LEFT_MARGIN - 12} ${trebleY}
            C ${LEFT_MARGIN - 22} ${trebleY + (bassY + 4 * ls - trebleY) * 0.25},
              ${LEFT_MARGIN - 22} ${trebleY + (bassY + 4 * ls - trebleY) * 0.45},
              ${LEFT_MARGIN - 16} ${trebleY + (bassY + 4 * ls - trebleY) * 0.5}
            C ${LEFT_MARGIN - 22} ${trebleY + (bassY + 4 * ls - trebleY) * 0.55},
              ${LEFT_MARGIN - 22} ${trebleY + (bassY + 4 * ls - trebleY) * 0.75},
              ${LEFT_MARGIN - 12} ${bassY + 4 * ls}`}
        stroke={staffColor}
        strokeWidth={ls * 0.12 + 0.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Clef symbols (Bravura font) ──────────────── */}
      {/* Treble clef: positioned so the curl sits on the G line (trebleY + 3*ls) */}
      <text
        x={LEFT_MARGIN - 75}
        y={trebleY + 3.15 * ls}
        fontSize={ls * 3.8}
        fill={staffColor}
        style={{ fontFamily: BRAVURA_FONT, userSelect: 'none' }}
      >
        {SMUFL.gClef}
      </text>
      {/* Bass clef: positioned so the dots straddle the F line (bassY + 1*ls) */}
      <text
        x={LEFT_MARGIN - 75}
        y={bassY + 1.05 * ls}
        fontSize={ls * 3.8}
        fill={staffColor}
        style={{ fontFamily: BRAVURA_FONT, userSelect: 'none' }}
      >
        {SMUFL.fClef}
      </text>

      {/* ── Key signature (treble) ───────────────────── */}
      {piece.keySharps.map((note, i) => {
        const step = trebleSharpSteps[note] ?? 0
        const y = trebleY + step * ls
        return (
          <text key={`ts-${note}`} x={LEFT_MARGIN - 45 + i * ls * 0.6} y={y + ls * 0.4}
            fontSize={ls * 1.5} fill={staffColor}
            style={{ fontFamily: BRAVURA_FONT, userSelect: 'none' }}>
            {SMUFL.sharp}
          </text>
        )
      })}
      {piece.keyFlats.map((note, i) => {
        const step = trebleFlatSteps[note] ?? 1
        const y = trebleY + step * ls
        return (
          <text key={`tf-${note}`} x={LEFT_MARGIN - 45 + i * ls * 0.6} y={y + ls * 0.4}
            fontSize={ls * 1.5} fill={staffColor}
            style={{ fontFamily: BRAVURA_FONT, userSelect: 'none' }}>
            {SMUFL.flat}
          </text>
        )
      })}
      {/* Key signature (bass) */}
      {piece.keySharps.map((note, i) => {
        const step = bassSharpSteps[note] ?? 1
        const y = bassY + step * ls
        return (
          <text key={`bs-${note}`} x={LEFT_MARGIN - 45 + i * ls * 0.6} y={y + ls * 0.4}
            fontSize={ls * 1.5} fill={staffColor}
            style={{ fontFamily: BRAVURA_FONT, userSelect: 'none' }}>
            {SMUFL.sharp}
          </text>
        )
      })}
      {piece.keyFlats.map((note, i) => {
        const step = bassFlatSteps[note] ?? 2
        const y = bassY + step * ls
        return (
          <text key={`bf-${note}`} x={LEFT_MARGIN - 45 + i * ls * 0.6} y={y + ls * 0.4}
            fontSize={ls * 1.5} fill={staffColor}
            style={{ fontFamily: BRAVURA_FONT, userSelect: 'none' }}>
            {SMUFL.flat}
          </text>
        )
      })}

      {/* ── Time signature ─────────────────────────────── */}
      {currentBeat < bpb * 2 && (
        <>
          <text x={LEFT_MARGIN - 16 + keySigWidth} y={trebleY + 1.7 * ls}
            fontSize={ls * 1.9} fill={staffColor}
            textAnchor="middle" fontWeight="bold"
            style={{ fontFamily: 'system-ui, sans-serif', userSelect: 'none' }}>
            {piece.timeSignature.numerator}
          </text>
          <text x={LEFT_MARGIN - 16 + keySigWidth} y={trebleY + 3.6 * ls}
            fontSize={ls * 1.9} fill={staffColor}
            textAnchor="middle" fontWeight="bold"
            style={{ fontFamily: 'system-ui, sans-serif', userSelect: 'none' }}>
            {piece.timeSignature.denominator}
          </text>
          <text x={LEFT_MARGIN - 16 + keySigWidth} y={bassY + 1.7 * ls}
            fontSize={ls * 1.9} fill={staffColor}
            textAnchor="middle" fontWeight="bold"
            style={{ fontFamily: 'system-ui, sans-serif', userSelect: 'none' }}>
            {piece.timeSignature.numerator}
          </text>
          <text x={LEFT_MARGIN - 16 + keySigWidth} y={bassY + 3.6 * ls}
            fontSize={ls * 1.9} fill={staffColor}
            textAnchor="middle" fontWeight="bold"
            style={{ fontFamily: 'system-ui, sans-serif', userSelect: 'none' }}>
            {piece.timeSignature.denominator}
          </text>
        </>
      )}

      {/* ── Bar lines ──────────────────────────────────── */}
      {barLines.map((x, i) => (
        <line key={i} x1={x} x2={x}
          y1={trebleY} y2={bassY + 4 * ls}
          stroke={staffBgColor}
          strokeWidth={x < LEFT_MARGIN + 2 ? ls * 0.1 + 0.8 : ls * 0.06 + 0.5}
          opacity={0.8}
        />
      ))}

      {/* ── Look-ahead zone indicator ──────────────────── */}
      <rect
        x={cursorX}
        y={trebleY - ls * 0.5}
        width={lookAhead.lookaheadBars * bpb * beatW}
        height={bassY + 4 * ls + ls - (trebleY - ls * 0.5)}
        fill="#60a5fa"
        opacity={0.04}
        rx={2}
      />

      {/* ── Notes ──────────────────────────────────────── */}
      {noteStates.map((state, idx) => {
        const { noteEvent: n } = state
        if (n.beat < minBeat || n.beat > maxBeat) return null
        if (handMode === 'RH' && n.hand !== 'RH') return null
        if (handMode === 'LH' && n.hand !== 'LH') return null

        const clef = n.hand === 'LH' ? 'bass' : 'treble'
        const staffTop = n.hand === 'LH' ? bassY : trebleY
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

      {/* ── Playback cursor ────────────────────────────── */}
      <line
        x1={cursorX} x2={cursorX}
        y1={trebleY - ls * 0.8} y2={bassY + 4 * ls + ls * 0.8}
        stroke={cursorColor} strokeWidth={2.5} opacity={0.9}
        strokeLinecap="round"
      />
      {/* Cursor diamond indicator */}
      <polygon
        points={`${cursorX},${trebleY - ls * 1.5} ${cursorX + ls * 0.4},${trebleY - ls * 1.1} ${cursorX},${trebleY - ls * 0.7} ${cursorX - ls * 0.4},${trebleY - ls * 1.1}`}
        fill={cursorColor}
        opacity={0.9}
      />

      {/* ── Measure numbers ────────────────────────────── */}
      {Array.from({ length: piece.totalMeasures + 1 }, (_, m) => {
        const beat = m * bpb
        if (beat < minBeat || beat > maxBeat) return null
        const x = beatToX(beat)
        return (
          <text key={m} x={x + 5} y={trebleY - ls * 1.8}
            fontSize={ls * 0.6} fill={staffBgColor}
            style={{ fontFamily: 'system-ui, sans-serif', userSelect: 'none' }}>
            {m + 1}
          </text>
        )
      })}
    </svg>
  )
}
