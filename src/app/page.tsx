"use client"

import { Fretboard } from "@/components/Fretboard"
import { formatDetectedNote } from "@/music/notes"
import { useStableDetectedNotes } from "@/music/useStableDetectedNotes"
import { useRecording } from "@/recording/useRecorder"
import { useState } from "react"

export default function Home() {
  const {
    start,
    stop,
    isRecording,
    isStarting,
    frequency,
    frequencyRevision,
    error,
  } = useRecording()
  const { detectedNotes, activeNote, hasDetectedNote } = useStableDetectedNotes(
    frequency,
    frequencyRevision,
  )
  const [showNoteLabels, setShowNoteLabels] = useState(true)

  const lastDetectedNote = detectedNotes[0] ?? null
  const noteText =
    activeNote !== null
      ? `Detected: ${formatDetectedNote(activeNote)}`
      : lastDetectedNote !== null
        ? `Last detected: ${formatDetectedNote(lastDetectedNote)}`
        : isRecording
          ? "Play a single note to highlight the fretboard"
          : "Start listening"
  const statusText = isStarting
    ? "Requesting microphone access"
    : isRecording
      ? hasDetectedNote && activeNote === null
        ? "No clear note"
        : "Listening"
      : "Not listening"

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

          <div className="flex flex-col gap-3 sm:flex-row lg:min-w-96">
            <button
              type="button"
              onClick={start}
              disabled={isRecording || isStarting}
              className="flex-1 cursor-pointer rounded-full bg-zinc-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:active:scale-100"
            >
              {error === null ? "Start" : "Retry"}
            </button>
            <button
              type="button"
              onClick={stop}
              disabled={!isRecording && !isStarting}
              className="flex-1 cursor-pointer rounded-full border border-zinc-950 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-zinc-300 disabled:text-zinc-400 disabled:active:scale-100"
            >
              Stop
            </button>
          </div>
        </header>

        {error !== null ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              {statusText}
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              {noteText}
            </p>
          </div>

          <label className="inline-flex w-fit cursor-pointer items-center gap-3 rounded-full border border-zinc-300 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-white">
            <input
              type="checkbox"
              checked={showNoteLabels}
              onChange={(event) => setShowNoteLabels(event.target.checked)}
              className="h-4 w-4 accent-zinc-950"
            />
            Show all note labels
          </label>
        </div>

        <Fretboard
          detectedNotes={detectedNotes}
          showNoteLabels={showNoteLabels}
        />
      </section>
    </main>
  )
}
