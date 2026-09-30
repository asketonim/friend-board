import { DetectedNote, getFretboardPositions } from "@/music/notes"
import { ScaleOverlay } from "@/music/scales"

const MAX_FRET = 15
const FRETS = Array.from({ length: MAX_FRET }, (_, fret) => fret + 1)

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
  scaleOverlay: ScaleOverlay | null
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

const getNoteClassName = ({
  highlight,
  pitchClass,
  hasDetectedNote,
  isVisible,
  isInScale,
  isScaleActive,
  isScaleRoot,
  isOutOfScalePlayedNote,
}: {
  highlight: Highlight
  pitchClass: number
  hasDetectedNote: boolean
  isVisible: boolean
  isInScale: boolean
  isScaleActive: boolean
  isScaleRoot: boolean
  isOutOfScalePlayedNote: boolean
}): string => {
  const baseClass =
    "absolute left-1/2 top-1/2 z-20 flex h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1.5 font-mono text-[11px] font-bold tracking-tight shadow-sm transition-[filter,transform,box-shadow,background-color,border-color,color] duration-200"
  const noteColorClass = NOTE_COLOR_STYLES[pitchClass]

  if (!isVisible) return `${baseClass} opacity-0`

  if (isOutOfScalePlayedNote) {
    return `${baseClass} ${noteColorClass} scale-110 border-white opacity-100 shadow-[0_0_0_2px_rgba(251,146,60,0.95),0_0_22px_rgba(251,146,60,0.72)] ring-2 ring-orange-400`
  }

  if (highlight === "exact") {
    return `${baseClass} ${noteColorClass} scale-110 border-white opacity-100 shadow-[0_0_0_2px_rgba(255,255,255,0.95),0_0_22px_rgba(255,255,255,0.55)]`
  }

  if (isScaleActive && isScaleRoot) {
    return `${baseClass} ${noteColorClass} scale-105 border-white opacity-100 shadow-[0_0_0_2px_rgba(255,255,255,0.7),0_0_14px_rgba(255,255,255,0.35)]`
  }

  if (isScaleActive && isInScale) {
    return `${baseClass} ${noteColorClass} opacity-100 saturate-110 brightness-110`
  }

  if (isScaleActive) {
    return `${baseClass} ${noteColorClass} opacity-100 brightness-[0.32] saturate-[0.35] grayscale-[55%]`
  }

  if (hasDetectedNote) {
    return `${baseClass} ${noteColorClass} opacity-100 brightness-50 saturate-50 grayscale-[35%]`
  }

  return `${baseClass} ${noteColorClass} opacity-100`
}

export const Fretboard = ({
  detectedNotes,
  showNoteLabels,
  scaleOverlay,
}: FretboardProps) => {
  const rows = getFretboardPositions(MAX_FRET)
  const hasDetectedNote = detectedNotes.length > 0
  const isScaleActive = scaleOverlay !== null

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
              const isInScale =
                scaleOverlay?.pitchClasses.includes(position.pitchClass) ??
                false
              const isScaleRoot =
                scaleOverlay?.rootPitchClass === position.pitchClass
              const isOpenString = position.fret === 0
              const isNoteVisible =
                isScaleActive || showNoteLabels || highlight === "exact"
              const isOutOfScalePlayedNote =
                isScaleActive && highlight === "exact" && !isInScale

              return (
                <div
                  key={`${position.stringId}-${position.fret}`}
                  className={
                    isOpenString
                      ? "relative min-h-16 border-r border-zinc-300/70 bg-white"
                      : "relative min-h-16 border-l border-zinc-300/50"
                  }
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 top-1/2 z-10 ${stringStyle.color}`}
                    style={{ height: stringStyle.height }}
                  />
                  <span
                    className={getNoteClassName({
                      highlight,
                      pitchClass: position.pitchClass,
                      hasDetectedNote,
                      isVisible: isNoteVisible,
                      isInScale,
                      isScaleActive,
                      isScaleRoot,
                      isOutOfScalePlayedNote,
                    })}
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
