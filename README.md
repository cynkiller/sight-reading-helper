# Sight-Reading Helper

A web application to help piano learners improve sight-reading skills using a look-ahead training system. Optimized for Android tablets.

## 🎹 Features

- **Look-Ahead Training**: Notes fade out as they're played, encouraging you to read ahead
- **Adjustable Settings**: 
  - Tempo (BPM)
  - Lookahead window (0.5–3 bars)
  - Fade duration (0.5–6 beats)
  - Hand mode (Both/Right/Left)
  - Metronome toggle
- **Curated Musical Library**: 9 pieces from beginner to advanced levels
- **Progress Tracking**: Session history and practice statistics
- **Responsive Design**: Touch-friendly UI optimized for tablets
- **Audio Playback**: Piano samples with Web Audio API

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173 in your browser.

### Using the App

1. **Select a Piece**: Browse pieces by difficulty (Beginner/Intermediate/Advanced)
2. **Adjust Settings**:
   - Set your preferred tempo or use piece default
   - Choose lookahead window (how many bars ahead you see)
   - Select hand mode for focused practice
3. **Practice**:
   - Press Play to start playback
   - Notes fade out as they're played - focus on reading ahead
   - Use transport controls to pause/restart
   - Adjust tempo and lookahead on the fly

## 📱 Tablet Usage

- **Landscape Orientation**: The app works best in landscape mode
- **Touch Targets**: All buttons are sized for easy touch interaction
- **Full Screen**: Use your browser's full-screen mode for the best experience

## 🎵 Musical Library

### Beginner (4–8 bars)
- Five Note Warmup
- Ode to Joy
- Lullaby (Brahms)
- Minuet in G

### Intermediate (8–12 bars)
- Für Elise (excerpt)
- Canon in D (excerpt)

### Advanced (16+ bars)
- Bach Prelude in C Major
- Gymnopédie No. 1
- Waltz in A Minor

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Vite** for development and building
- **TailwindCSS v4** for styling
- **React Router** for navigation
- **VexFlow** concepts for music notation (custom SVG implementation)
- **Web Audio API** for piano sound playback

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── StaffDisplay.tsx    # Music notation renderer
│   ├── HintBar.tsx         # Upcoming notes display
│   ├── SettingsPanel.tsx   # Settings modal
│   └── PieceCard.tsx       # Piece selection cards
├── pages/              # Main pages
│   ├── Home.tsx            # Piece selection
│   ├── Practice.tsx        # Main practice interface
│   └── Progress.tsx        # Practice statistics
├── hooks/              # Custom React hooks
│   ├── usePlayback.ts      # Playback timing and control
│   ├── useAudioSampler.ts  # Audio sample loading/playing
│   ├── useLookAhead.ts     # Note opacity calculations
│   ├── useSettings.ts      # Settings persistence
│   └── useProgress.ts      # Progress tracking
├── data/               # Musical piece data
│   ├── pieces/             # Individual piece files
│   └── index.ts            # Piece registry
└── types/              # TypeScript type definitions
```

## 🎯 How Look-Ahead Training Works

1. **Notes appear** at full opacity when they're within your lookahead window
2. **Notes fade out** over the configured fade duration after being played
3. **Far future notes** (beyond lookahead) appear dimmed
4. **Cursor** shows current playback position

This encourages you to:
- Look ahead of the cursor
- Anticipate upcoming notes
- Develop faster pattern recognition

## ⚙️ Settings Presets

- **Beginner**: 2 bars ahead, 4-beat fade - gentle learning curve
- **Intermediate**: 1 bar ahead, 2-beat fade - moderate challenge  
- **Advanced**: 0.5 bars ahead, 1-beat fade - expert sight-reading

## 🔧 Development

### Adding New Pieces

Create a new file in `src/data/pieces/` following the pattern:

```typescript
import { Piece } from '../types'

export const myPiece: Piece = {
  id: 'my-piece',
  title: 'My Piece',
  composer: 'Composer Name',
  difficulty: 'intermediate',
  level: 5,
  timeSignature: { numerator: 4, denominator: 4 },
  keySignature: 'C',
  keySharps: [],
  keyFlats: [],
  tempo: 120,
  totalMeasures: 8,
  notes: [
    // Note events...
  ],
  description: 'Description for the piece',
  tags: ['tag1', 'tag2'],
}
```

Then register it in `src/data/index.ts`.

### Note Event Format

```typescript
{
  pitch: "C4" | ["C4", "E4", "G4"] | null,  // Single note, chord, or rest
  duration: "w" | "h" | "hd" | "q" | "8" | "16",  // Note duration
  hand: "RH" | "LH",  // Hand assignment
  beat: 0,           // Absolute beat position (0-indexed)
  measure: 0,        // Measure number (0-indexed)
}
```

## 📄 License

MIT License - feel free to use this for your sight-reading practice!
