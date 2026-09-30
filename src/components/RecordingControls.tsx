type RecordingControlsProps = {
  hasError: boolean
  isRecording: boolean
  isStarting: boolean
  onStart: () => void | Promise<void>
  onStop: () => void | Promise<void>
}

export const RecordingControls = ({
  hasError,
  isRecording,
  isStarting,
  onStart,
  onStop,
}: RecordingControlsProps) => (
  <div className="flex flex-col gap-3 sm:flex-row lg:min-w-96">
    <button
      type="button"
      onClick={onStart}
      disabled={isRecording || isStarting}
      className="flex-1 cursor-pointer rounded-full bg-zinc-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:active:scale-100"
    >
      {hasError ? "Retry" : "Start"}
    </button>
    <button
      type="button"
      onClick={onStop}
      disabled={!isRecording && !isStarting}
      className="flex-1 cursor-pointer rounded-full border border-zinc-950 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-zinc-300 disabled:text-zinc-400 disabled:active:scale-100"
    >
      Stop
    </button>
  </div>
)
