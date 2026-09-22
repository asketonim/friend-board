import { DetectedNote, getFretboardPositions } from "@/music/notes"

const MAX_FRET = 15
const FRETS = Array.from({ length: MAX_FRET + 1 }, (_, fret) => fret)
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

const getNoteClassName = (highlight: Highlight): string => {
  const baseClass =
    "absolute left-1/2 top-1/2 z-20 flex h-8 min-w-8 -translate-x-1/2 -translate-y-[105%] items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-semibold tracking-tight transition"

  if (highlight === "exact") {
    return `${baseClass} bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.38)]`
  }

  if (highlight === "related") {
    return `${baseClass} border border-zinc-200 bg-transparent text-zinc-100 shadow-[0_0_10px_rgba(255,255,255,0.16)]`
  }

  return `${baseClass} text-zinc-300/80`
}

export const Fretboard = ({
  detectedNotes,
  showNoteLabels,
}: FretboardProps) => {
  const rows = getFretboardPositions(MAX_FRET)

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[920px]">
        <div
          className="grid overflow-hidden border border-zinc-900 bg-gradient-to-b from-zinc-800 via-zinc-950 to-black shadow-2xl shadow-zinc-400/30"
          style={{
            gridTemplateColumns: `3rem repeat(${MAX_FRET + 1}, minmax(3rem, 1fr))`,
          }}
        >
          {rows.map((positions, stringIndex) => {
            const string = positions[0]
            const stringStyle = STRING_STYLES[stringIndex]

            return positions.map((position, fretIndex) => {
              const highlight = getHighlight(
                position.midi,
                position.pitchClass,
                detectedNotes,
              )
              const isStringLabel = fretIndex === 0
              const showSingleMarker =
                stringIndex === 2 && MARKER_FRETS[position.fret] === true
              const showDoubleMarker =
                position.fret === 12 && (stringIndex === 1 || stringIndex === 4)

              return (
                <div
                  key={`${position.stringId}-${position.fret}`}
                  className={
                    isStringLabel
                      ? "contents"
                      : "relative min-h-16 border-l border-zinc-300/50"
                  }
                >
                  {isStringLabel ? (
                    <>
                      <div className="flex items-center justify-center border-r border-zinc-300/70 bg-white pr-3 text-right font-mono text-sm font-semibold text-zinc-700">
                        {string.stringLabel}
                      </div>
                      <div className="relative min-h-16 border-l-[5px] border-zinc-200 bg-zinc-950 shadow-[inset_10px_0_16px_rgba(0,0,0,0.75)]">
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 right-0 top-1/2 z-10 ${stringStyle.color}`}
                          style={{ height: stringStyle.height }}
                        />
                        <span className={getNoteClassName(highlight)}>
                          {showNoteLabels ? position.noteName : null}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
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
                      <span className={getNoteClassName(highlight)}>
                        {showNoteLabels ? position.noteName : null}
                      </span>
                    </>
                  )}
                </div>
              )
            })
          })}
        </div>

        <div
          className="mt-3 grid font-mono text-xs font-medium text-zinc-500"
          style={{
            gridTemplateColumns: `3rem repeat(${MAX_FRET + 1}, minmax(3rem, 1fr))`,
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
