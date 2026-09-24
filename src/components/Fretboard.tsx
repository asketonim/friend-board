import { DetectedNote, getFretboardPositions } from "@/music/notes"

const MAX_FRET = 15
const FRETS = Array.from({ length: MAX_FRET }, (_, fret) => fret + 1)
const MARKER_FRETS: Record<number, true> = {
  3: true,
  5: true,
  7: true,
  9: true,
  15: true,
}

const STRING_STYLES = [
  { height: "1px", color: "bg-zinc-300" },
  { height: "1px", color: "bg-zinc-400" },
  { height: "2px", color: "bg-zinc-500" },
  { height: "2px", color: "bg-zinc-600" },
  { height: "3px", color: "bg-zinc-700" },
  { height: "4px", color: "bg-zinc-800" },
]

const NOTE_COLOR_STYLES = [
  "bg-rose-500 border-rose-200 text-white",
  "bg-orange-500 border-orange-200 text-white",
  "bg-amber-400 border-amber-100 text-zinc-950",
  "bg-lime-500 border-lime-200 text-zinc-950",
  "bg-emerald-500 border-emerald-200 text-white",
  "bg-teal-400 border-teal-100 text-zinc-950",
  "bg-cyan-500 border-cyan-200 text-zinc-950",
  "bg-sky-500 border-sky-200 text-white",
  "bg-indigo-500 border-indigo-200 text-white",
  "bg-violet-500 border-violet-200 text-white",
  "bg-fuchsia-500 border-fuchsia-200 text-white",
  "bg-pink-500 border-pink-200 text-white",
]

type FretboardProps = {
  detectedNotes: DetectedNote[]
  showNoteLabels: boolean
}

type Highlight = "exact" | "related" | null

const getHighlight = (
  midi: number,
  pitchClass: number,
  detectedNotes: DetectedNote[],
): Highlight => {
  if (detectedNotes.some((note) => note.midi === midi)) return "exact"
  if (detectedNotes.some((note) => note.pitchClass === pitchClass)) {
    return "related"
  }

  return null
}

const getNoteClassName = (
  highlight: Highlight,
  pitchClass: number,
  hasDetectedNote: boolean,
  isVisible: boolean,
): string => {
  const baseClass =
    "absolute left-1/2 top-1/2 z-20 flex h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1.5 font-mono text-[11px] font-bold tracking-tight shadow-sm transition-[filter,transform,box-shadow,background-color,border-color,color] duration-200"

  if (!isVisible) return `${baseClass} opacity-0`

  if (highlight === "exact") {
    return `${baseClass} ${NOTE_COLOR_STYLES[pitchClass]} scale-110 border-white opacity-100 shadow-[0_0_0_2px_rgba(255,255,255,0.95),0_0_22px_rgba(255,255,255,0.55)]`
  }

  if (hasDetectedNote) {
    return `${baseClass} ${NOTE_COLOR_STYLES[pitchClass]} opacity-100 brightness-50 saturate-50 grayscale-[35%]`
  }

  return `${baseClass} ${NOTE_COLOR_STYLES[pitchClass]} opacity-100`
}

export const Fretboard = ({
  detectedNotes,
  showNoteLabels,
}: FretboardProps) => {
  const rows = getFretboardPositions(MAX_FRET)
  const hasDetectedNote = detectedNotes.length > 0

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[875px]">
        <div
          className="grid overflow-hidden border border-zinc-900 bg-gradient-to-b from-zinc-800 via-zinc-950 to-black shadow-2xl shadow-zinc-400/30"
          style={{
            gridTemplateColumns: `3rem repeat(${MAX_FRET}, minmax(3rem, 1fr))`,
          }}
        >
          {rows.map((positions, stringIndex) => {
            const stringStyle = STRING_STYLES[stringIndex]

            return positions.map((position) => {
              const highlight = getHighlight(
                position.midi,
                position.pitchClass,
                detectedNotes,
              )
              const isOpenString = position.fret === 0
              const isNoteVisible = showNoteLabels || highlight === "exact"
              const showSingleMarker =
                stringIndex === 2 && MARKER_FRETS[position.fret] === true
              const showDoubleMarker =
                position.fret === 12 && (stringIndex === 1 || stringIndex === 4)

              return (
                <div
                  key={`${position.stringId}-${position.fret}`}
                  className={
                    isOpenString
                      ? "relative min-h-16 border-r border-zinc-300/70 bg-white"
                      : "relative min-h-16 border-l border-zinc-300/50"
                  }
                >
                  {showSingleMarker ? (
                    <span className="absolute left-1/2 top-full z-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/15" />
                  ) : null}
                  {showDoubleMarker ? (
                    <span className="absolute left-1/2 top-1/2 z-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/15" />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 top-1/2 z-10 ${stringStyle.color}`}
                    style={{ height: stringStyle.height }}
                  />
                  <span
                    className={getNoteClassName(
                      highlight,
                      position.pitchClass,
                      hasDetectedNote,
                      isNoteVisible,
                    )}
                  >
                    {isNoteVisible ? position.noteName : null}
                  </span>
                </div>
              )
            })
          })}
        </div>

        <div
          className="mt-3 grid font-mono text-xs font-medium text-zinc-500"
          style={{
            gridTemplateColumns: `3rem repeat(${MAX_FRET}, minmax(3rem, 1fr))`,
          }}
        >
          <div aria-hidden="true" />
          {FRETS.map((fret) => (
            <div key={fret} className="text-center">
              {fret}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
