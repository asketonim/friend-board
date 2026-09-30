import { NoteName, SHARP_NOTE_NAMES } from "@/music/notes"
import { SCALE_TYPES, ScaleTypeId } from "@/music/scales"

type ScaleControlsProps = {
  scaleRoot: NoteName
  scaleTypeId: ScaleTypeId
  showScale: boolean
  onScaleRootChange: (scaleRoot: NoteName) => void
  onScaleTypeIdChange: (scaleTypeId: ScaleTypeId) => void
  onShowScaleChange: (showScale: boolean) => void
}

export const ScaleControls = ({
  scaleRoot,
  scaleTypeId,
  showScale,
  onScaleRootChange,
  onScaleTypeIdChange,
  onShowScaleChange,
}: ScaleControlsProps) => (
  <div className="flex flex-col gap-3 border-y border-zinc-300/70 py-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="font-mono text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
        Scale
      </p>
      <p className="mt-1 text-sm text-zinc-600">
        Highlight a scale map while keeping live note detection on top.
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="flex flex-col gap-1 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
        Root
        <select
          value={scaleRoot}
          onChange={(event) =>
            onScaleRootChange(event.target.value as NoteName)
          }
          className="min-w-24 rounded-full border border-zinc-300 bg-white px-4 py-2 font-mono text-sm font-semibold tracking-normal text-zinc-950 shadow-sm outline-none transition focus:border-zinc-950"
        >
          {SHARP_NOTE_NAMES.map((noteName) => (
            <option key={noteName} value={noteName}>
              {noteName}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
        Type
        <select
          value={scaleTypeId}
          onChange={(event) =>
            onScaleTypeIdChange(event.target.value as ScaleTypeId)
          }
          className="min-w-48 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold tracking-normal text-zinc-950 shadow-sm outline-none transition focus:border-zinc-950"
        >
          {SCALE_TYPES.map((scaleType) => (
            <option key={scaleType.id} value={scaleType.id}>
              {scaleType.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full border border-zinc-300 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-white sm:mt-5">
        <input
          type="checkbox"
          checked={showScale}
          onChange={(event) => onShowScaleChange(event.target.checked)}
          className="h-4 w-4 accent-zinc-950"
        />
        Show scale
      </label>
    </div>
  </div>
)
