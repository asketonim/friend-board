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

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-emerald-300 uppercase">
                Friend Board
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                Play one note. See every place it lives.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Standard tuning, open string through the 15th fret. Filled dots
                mark the detected octave; outline dots mark the same note name
                in other octaves.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:min-w-96">
              <button
                type="button"
                onClick={start}
                disabled={isRecording || isStarting}
                className="flex-1 cursor-pointer rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:active:scale-100"
              >
                {error === null ? "Start" : "Retry"}
              </button>
              <button
                type="button"
                onClick={stop}
                disabled={!isRecording && !isStarting}
                className="flex-1 cursor-pointer rounded-xl border border-slate-600 px-4 py-3 font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600 disabled:active:scale-100"
              >
                Stop
              </button>
            </div>
          </div>

          {error !== null ? (
            <p className="mt-5 rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {isStarting
                  ? "Requesting microphone access"
                  : isRecording
                    ? hasDetectedNote && activeNote === null
                      ? "No clear note"
                      : "Listening"
                    : "Not listening"}
              </p>
              <p className="mt-1 text-3xl font-semibold text-emerald-200">
                {noteText}
              </p>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200">
              <input
                type="checkbox"
                checked={showNoteLabels}
                onChange={(event) => setShowNoteLabels(event.target.checked)}
                className="h-4 w-4 accent-emerald-300"
              />
              Show all note labels
            </label>
          </div>
        </div>

        <Fretboard
          detectedNotes={detectedNotes}
          showNoteLabels={showNoteLabels}
        />
      </section>
    </main>
  )
}
