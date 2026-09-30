import { NoteName, SHARP_NOTE_NAMES } from "./notes"

export type ScaleTypeId =
  "major" | "natural-minor" | "major-pentatonic" | "minor-pentatonic"

export type ScaleType = {
  id: ScaleTypeId
  label: string
  intervals: readonly number[]
}

export type ScaleOverlay = {
  root: NoteName
  rootPitchClass: number
  scaleType: ScaleType
  pitchClasses: readonly number[]
}

export const SCALE_TYPES: readonly ScaleType[] = [
  { id: "major", label: "Major", intervals: [0, 2, 4, 5, 7, 9, 11] },
  {
    id: "natural-minor",
    label: "Natural minor",
    intervals: [0, 2, 3, 5, 7, 8, 10],
  },
  {
    id: "major-pentatonic",
    label: "Major pentatonic",
    intervals: [0, 2, 4, 7, 9],
  },
  {
    id: "minor-pentatonic",
    label: "Minor pentatonic",
    intervals: [0, 3, 5, 7, 10],
  },
]

export const DEFAULT_SCALE_TYPE_ID: ScaleTypeId = "major"

export const getPitchClass = (noteName: NoteName): number =>
  SHARP_NOTE_NAMES.indexOf(noteName)

export const getScaleType = (scaleTypeId: ScaleTypeId): ScaleType =>
  SCALE_TYPES.find((scaleType) => scaleType.id === scaleTypeId) ??
  SCALE_TYPES[0]

export const buildScaleOverlay = (
  root: NoteName,
  scaleTypeId: ScaleTypeId,
): ScaleOverlay => {
  const rootPitchClass = getPitchClass(root)
  const scaleType = getScaleType(scaleTypeId)

  return {
    root,
    rootPitchClass,
    scaleType,
    pitchClasses: scaleType.intervals.map(
      (interval) => (rootPitchClass + interval) % 12,
    ),
  }
}
