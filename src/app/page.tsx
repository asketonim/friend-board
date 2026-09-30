"use client"

import { Fretboard } from "@/components/Fretboard"
import { NoteName, SHARP_NOTE_NAMES } from "@/music/notes"
import {
  buildScaleOverlay,
  DEFAULT_SCALE_TYPE_ID,
  SCALE_TYPES,
  ScaleTypeId,
} from "@/music/scales"
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
  const { detectedNotes } = useStableDetectedNotes(
    frequency,
    frequencyRevision,
  )
  const [showNoteLabels, setShowNoteLabels] = useState(true)
  const [showScale, setShowScale] = useState(false)
  const [scaleRoot, setScaleRoot] = useState<NoteName>("C")
  const [scaleTypeId, setScaleTypeId] = useState<ScaleTypeId>(
    DEFAULT_SCALE_TYPE_ID,
  )

  const scaleOverlay = showScale
    ? buildScaleOverlay(scaleRoot, scaleTypeId)
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
                  setScaleRoot(event.target.value as NoteName)
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
                  setScaleTypeId(event.target.value as ScaleTypeId)
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
                onChange={(event) => setShowScale(event.target.checked)}
                className="h-4 w-4 accent-zinc-950"
              />
              Show scale
            </label>
          </div>
        </div>

        <Fretboard
          detectedNotes={detectedNotes}
          showNoteLabels={showNoteLabels}
          scaleOverlay={scaleOverlay}
        />
      </section>
    </main>
  )
}
