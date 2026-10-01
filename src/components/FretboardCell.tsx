import { DetectedNote, FretboardPosition, NoteName } from "@/music/notes"
import { ScaleOverlay } from "@/music/scales"

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

const BASE_NOTE_CLASS_NAME =
  "absolute left-1/2 top-1/2 z-20 flex h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-1.5 font-mono text-[11px] font-bold tracking-tight shadow-sm transition-[filter,transform,box-shadow,background-color,border-color,color] duration-200"

type Highlight = "exact" | "related" | null

export type FretboardCellVisualState =
  | "hidden"
  | "normal"
  | "dimmedByDetectedNote"
  | "scaleMuted"
  | "scaleMember"
  | "scaleRoot"
  | "detectedExact"
  | "detectedOutOfScale"

export type FretboardCellModel = {
  key: string
  isOpenString: boolean
  noteName: NoteName | null
  pitchClass: number
  visualState: FretboardCellVisualState
}

export type GuitarStringLineStyle = {
  height: string
  color: string
}

const VISUAL_STATE_CLASS_NAMES: Record<FretboardCellVisualState, string> = {
  hidden: "opacity-0",
  normal: "opacity-100",
  dimmedByDetectedNote: "opacity-100 brightness-50 saturate-50 grayscale-[35%]",
  scaleMuted: "opacity-100 brightness-[0.32] saturate-[0.35] grayscale-[55%]",
  scaleMember: "opacity-100 saturate-110 brightness-110",
  scaleRoot:
    "scale-105 border-white opacity-100 shadow-[0_0_0_2px_rgba(255,255,255,0.7),0_0_14px_rgba(255,255,255,0.35)]",
  detectedExact:
    "scale-110 border-white opacity-100 shadow-[0_0_0_2px_rgba(255,255,255,0.95),0_0_22px_rgba(255,255,255,0.55)]",
  detectedOutOfScale:
    "scale-110 border-white opacity-100 shadow-[0_0_0_2px_rgba(251,146,60,0.95),0_0_22px_rgba(251,146,60,0.72)] ring-2 ring-orange-400",
}

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
  pitchClass,
  visualState,
}: {
  pitchClass: number
  visualState: FretboardCellVisualState
}): string => {
  const visualStateClassName = VISUAL_STATE_CLASS_NAMES[visualState]

  if (visualState === "hidden") {
    return `${BASE_NOTE_CLASS_NAME} ${visualStateClassName}`
  }

  return `${BASE_NOTE_CLASS_NAME} ${NOTE_COLOR_STYLES[pitchClass]} ${visualStateClassName}`
}

export const getFretboardCellModel = ({
  position,
  detectedNotes,
  hasDetectedNote,
  showNoteLabels,
  scaleOverlay,
}: {
  position: FretboardPosition
  detectedNotes: DetectedNote[]
  hasDetectedNote: boolean
  showNoteLabels: boolean
  scaleOverlay: ScaleOverlay | null
}): FretboardCellModel => {
  const highlight = getHighlight(
    position.midi,
    position.pitchClass,
    detectedNotes,
  )
  const isScaleActive = scaleOverlay !== null
  const isInScale =
    scaleOverlay?.pitchClasses.includes(position.pitchClass) ?? false
  const isScaleRoot = scaleOverlay?.rootPitchClass === position.pitchClass
  const isVisible = isScaleActive || showNoteLabels || highlight === "exact"
  let visualState: FretboardCellVisualState = "normal"

  if (!isVisible) {
    visualState = "hidden"
  } else if (isScaleActive && highlight === "exact" && !isInScale) {
    visualState = "detectedOutOfScale"
  } else if (highlight === "exact") {
    visualState = "detectedExact"
  } else if (isScaleActive && isScaleRoot) {
    visualState = "scaleRoot"
  } else if (isScaleActive && isInScale) {
    visualState = "scaleMember"
  } else if (isScaleActive) {
    visualState = "scaleMuted"
  } else if (hasDetectedNote) {
    visualState = "dimmedByDetectedNote"
  }

  return {
    key: `${position.stringId}-${position.fret}`,
    isOpenString: position.fret === 0,
    noteName: visualState === "hidden" ? null : position.noteName,
    pitchClass: position.pitchClass,
    visualState,
  }
}

type FretboardCellProps = {
  cell: FretboardCellModel
  stringStyle: GuitarStringLineStyle
}

export const FretboardCell = ({ cell, stringStyle }: FretboardCellProps) => (
  <div
    className={
      cell.isOpenString
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
        pitchClass: cell.pitchClass,
        visualState: cell.visualState,
      })}
    >
      {cell.noteName}
    </span>
  </div>
)
