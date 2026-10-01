import {
  FretboardCell,
  GuitarStringLineStyle,
  getFretboardCellModel,
} from "@/components/FretboardCell"
import { DetectedNote, getFretboardPositions } from "@/music/notes"
import { ScaleOverlay } from "@/music/scales"

const MAX_FRET = 15
const FRETS = Array.from({ length: MAX_FRET }, (_, fret) => fret + 1)

const STRING_STYLES: readonly GuitarStringLineStyle[] = [
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
  scaleOverlay: ScaleOverlay | null
}

export const Fretboard = ({
  detectedNotes,
  showNoteLabels,
  scaleOverlay,
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
              const cell = getFretboardCellModel({
                position,
                detectedNotes,
                hasDetectedNote,
                showNoteLabels,
                scaleOverlay,
              })

              return (
                <FretboardCell
                  key={cell.key}
                  cell={cell}
                  stringStyle={stringStyle}
                />
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
