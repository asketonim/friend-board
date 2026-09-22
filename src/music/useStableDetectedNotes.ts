"use client"

import { useEffect, useReducer } from "react"
import { DetectedNote, frequencyToNote } from "./notes"

const STABLE_NOTE_MS = 120

export type StableDetectedNotes = {
  detectedNotes: DetectedNote[]
  activeNote: DetectedNote | null
  isSignalActive: boolean
  hasDetectedNote: boolean
}

type CandidateNote = {
  midi: number
  firstSeenAt: number
}

type StableDetectedNotesState = StableDetectedNotes & {
  candidate: CandidateNote | null
}

type SampleAction = {
  frequency: number | null
  now: number
}

const INITIAL_STATE: StableDetectedNotesState = {
  detectedNotes: [],
  activeNote: null,
  isSignalActive: false,
  hasDetectedNote: false,
  candidate: null,
}

const reduceStableDetectedNotes = (
  state: StableDetectedNotesState,
  action: SampleAction,
): StableDetectedNotesState => {
  if (action.frequency === null) {
    return {
      ...state,
      activeNote: null,
      isSignalActive: false,
      candidate: null,
    }
  }

  const note = frequencyToNote(action.frequency)

  if (note === null) {
    return {
      ...state,
      activeNote: null,
      isSignalActive: false,
      candidate: null,
    }
  }

  if (state.candidate?.midi !== note.midi) {
    return {
      ...state,
      activeNote: null,
      isSignalActive: false,
      candidate: { midi: note.midi, firstSeenAt: action.now },
    }
  }

  if (action.now - state.candidate.firstSeenAt < STABLE_NOTE_MS) {
    return state
  }

  return {
    detectedNotes: [note],
    activeNote: note,
    isSignalActive: true,
    hasDetectedNote: true,
    candidate: state.candidate,
  }
}

export const useStableDetectedNotes = (
  frequency: number | null,
  frequencyRevision: number,
): StableDetectedNotes => {
  const [state, dispatch] = useReducer(reduceStableDetectedNotes, INITIAL_STATE)

  useEffect(() => {
    dispatch({ frequency, now: performance.now() })
  }, [frequency, frequencyRevision])

  return {
    detectedNotes: state.detectedNotes,
    activeNote: state.activeNote,
    isSignalActive: state.isSignalActive,
    hasDetectedNote: state.hasDetectedNote,
  }
}
