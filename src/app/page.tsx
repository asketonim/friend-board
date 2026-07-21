"use client"

import { useRecording } from "@/recording/useRecorder"

export default function Home() {
  const { start, stop, isRecording, frequency } = useRecording()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm font-medium tracking-wide text-slate-400">
          Recording controls
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Capture a moment
        </h1>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={start}
            disabled={isRecording}
            className="flex-1 cursor-pointer rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:scale-[0.98]"
          >
            Start
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={!isRecording}
            className="flex-1 cursor-pointer rounded-xl border border-slate-600 px-4 py-3 font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 active:scale-[0.98]"
          >
            Stop
          </button>
        </div>

        <p className="mt-6 text-center text-4xl font-semibold text-emerald-300">
          {frequency === null ? "Listening…" : `${frequency.toFixed(1)} Hz`}
        </p>
      </section>
    </main>
  )
}
