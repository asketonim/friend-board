import { DetectedNote, getFretboardPositions } from "@/music/notes"

const MAX_FRET = 15
const FRETS = Array.from({ length: MAX_FRET + 1 }, (_, fret) => fret)

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

const getDotClassName = (highlight: Highlight): string => {
  const baseClass =
    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition"

  if (highlight === "exact") {
    return `${baseClass} bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/30`
  }

  if (highlight === "related") {
    return `${baseClass} border-2 border-emerald-300 text-emerald-100`
  }

  return `${baseClass} text-slate-500`
}

export const Fretboard = ({
  detectedNotes,
  showNoteLabels,
}: FretboardProps) => {
  const rows = getFretboardPositions(MAX_FRET)

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-inner shadow-black/30">
      <div
        className="grid min-w-[860px] gap-2"
        style={{
          gridTemplateColumns: `3rem repeat(${MAX_FRET + 1}, minmax(2.75rem, 1fr))`,
        }}
      >
        <div aria-hidden="true" />
        {FRETS.map((fret) => (
          <div
            key={fret}
            className="text-center text-xs font-medium text-slate-500"
          >
            {fret}
          </div>
        ))}

        {rows.map((positions) => {
          const string = positions[0]

          return positions.map((position, index) => {
            const highlight = getHighlight(
              position.midi,
              position.pitchClass,
              detectedNotes,
            )
            const isStringLabel = index === 0

            return (
              <div
                key={`${position.stringId}-${position.fret}`}
                className={
                  isStringLabel
                    ? "contents"
                    : "flex min-h-12 items-center justify-center border-l border-slate-700/80"
                }
              >
                {isStringLabel ? (
                  <>
                    <div className="flex items-center justify-center text-sm font-semibold text-slate-300">
                      {string.stringLabel}
                    </div>
                    <div className="flex min-h-12 items-center justify-center rounded-l-xl border-l-4 border-slate-300 bg-slate-900/80">
                      <span className={getDotClassName(highlight)}>
                        {showNoteLabels ? position.noteName : null}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className={getDotClassName(highlight)}>
                    {showNoteLabels ? position.noteName : null}
                  </span>
                )}
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}
