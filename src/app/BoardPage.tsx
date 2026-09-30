"use client"

import { DisplayOptions } from "@/components/DisplayOptions"
import { Fretboard } from "@/components/Fretboard"
import { RecordingControls } from "@/components/RecordingControls"
import { ScaleControls } from "@/components/ScaleControls"
import { buildScaleOverlay } from "@/music/scales"
import { useStableDetectedNotes } from "@/music/useStableDetectedNotes"
import { useRecording } from "@/recording/useRecorder"
import { useBoardViewSearchParams } from "./useBoardViewSearchParams"

export const BoardPage = () => {
  const {
    start,
    stop,
    isRecording,
    isStarting,
    frequency,
    frequencyRevision,
    error,
  } = useRecording()
  const { detectedNotes } = useStableDetectedNotes(frequency, frequencyRevision)
  const { boardView, replaceBoardView } = useBoardViewSearchParams()

  const scaleOverlay = boardView.showScale
    ? buildScaleOverlay(boardView.scaleRoot, boardView.scaleTypeId)
    : null

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-zinc-950 sm:px-6 sm:py-10 lg:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold tracking-[0.24em] text-zinc-500 uppercase">
              Friend Board
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              See the note on the neck.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
              Standard tuning · open string through 15th fret · filled notes are
              exact octaves, silver rings are matching note names.
            </p>
          </div>

          <RecordingControls
            hasError={error !== null}
            isRecording={isRecording}
            isStarting={isStarting}
            onStart={start}
            onStop={stop}
          />
        </header>

        {error !== null ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <DisplayOptions
          showNoteLabels={boardView.showNoteLabels}
          onChange={replaceBoardView}
        />

        <ScaleControls
          scaleRoot={boardView.scaleRoot}
          scaleTypeId={boardView.scaleTypeId}
          showScale={boardView.showScale}
          onChange={replaceBoardView}
        />

        <Fretboard
          detectedNotes={detectedNotes}
          showNoteLabels={boardView.showNoteLabels}
          scaleOverlay={scaleOverlay}
        />
      </section>
    </main>
  )
}
