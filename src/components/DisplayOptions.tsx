type DisplayOptionsProps = {
  showNoteLabels: boolean
  onShowNoteLabelsChange: (showNoteLabels: boolean) => void
}

export const DisplayOptions = ({
  showNoteLabels,
  onShowNoteLabelsChange,
}: DisplayOptionsProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <label className="inline-flex w-fit cursor-pointer items-center gap-3 rounded-full border border-zinc-300 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-white">
      <input
        type="checkbox"
        checked={showNoteLabels}
        onChange={(event) => onShowNoteLabelsChange(event.target.checked)}
        className="h-4 w-4 accent-zinc-950"
      />
      Show all note labels
    </label>
  </div>
)
