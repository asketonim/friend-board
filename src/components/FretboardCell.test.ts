import { describe, expect, it } from "vitest"
import { getFretboardCellModel } from "./FretboardCell"
import type { DetectedNote, FretboardPosition, NoteName } from "../music/notes"
import { buildScaleOverlay, type ScaleOverlay } from "../music/scales"
const position = ({
  midi,
  pitchClass,
  noteName,
}: {
  midi: number
  pitchClass: number
  noteName: NoteName
}): FretboardPosition => ({
  stringId: "test-string",
  stringLabel: "E",
  fret: 1,
  midi,
  pitchClass,
  noteName,
  octave: 4,
})

const detectedNote = ({
  midi,
  pitchClass,
  name,
}: {
  midi: number
  pitchClass: number
  name: NoteName
}): DetectedNote => ({
  midi,
  pitchClass,
  name,
  octave: 4,
  cents: 0,
  frequency: 440,
})

const modelFor = ({
  position,
  detectedNotes = [],
  showNoteLabels = false,
  scaleOverlay = null,
}: {
  position: FretboardPosition
  detectedNotes?: DetectedNote[]
  showNoteLabels?: boolean
  scaleOverlay?: ScaleOverlay | null
}) =>
  getFretboardCellModel({
    position,
    detectedNotes,
    hasDetectedNote: detectedNotes.length > 0,
    showNoteLabels,
    scaleOverlay,
  })

describe("getFretboardCellModel", () => {
  it("hides ordinary notes when labels and scale are off", () => {
    expect(
      modelFor({
        position: position({ midi: 60, pitchClass: 0, noteName: "C" }),
      }),
    ).toMatchObject({
      noteName: null,
      visualState: "hidden",
    })
  })

  it("shows normal notes when labels are on", () => {
    expect(
      modelFor({
        position: position({ midi: 60, pitchClass: 0, noteName: "C" }),
        showNoteLabels: true,
      }),
    ).toMatchObject({
      noteName: "C",
      visualState: "normal",
    })
  })

  it("marks scale roots", () => {
    expect(
      modelFor({
        position: position({ midi: 60, pitchClass: 0, noteName: "C" }),
        scaleOverlay: buildScaleOverlay("C", "major"),
      }),
    ).toMatchObject({
      noteName: "C",
      visualState: "scaleRoot",
    })
  })

  it("mutes notes outside the active scale", () => {
    expect(
      modelFor({
        position: position({ midi: 66, pitchClass: 6, noteName: "F#" }),
        scaleOverlay: buildScaleOverlay("C", "major"),
      }),
    ).toMatchObject({
      noteName: "F#",
      visualState: "scaleMuted",
    })
  })

  it("lets exact detected notes override scale states", () => {
    const c4 = position({ midi: 60, pitchClass: 0, noteName: "C" })

    expect(
      modelFor({
        position: c4,
        detectedNotes: [detectedNote({ midi: 60, pitchClass: 0, name: "C" })],
        scaleOverlay: buildScaleOverlay("C", "major"),
      }),
    ).toMatchObject({
      noteName: "C",
      visualState: "detectedExact",
    })
  })

  it("marks exact detected notes outside the active scale", () => {
    const fSharp4 = position({ midi: 66, pitchClass: 6, noteName: "F#" })

    expect(
      modelFor({
        position: fSharp4,
        detectedNotes: [detectedNote({ midi: 66, pitchClass: 6, name: "F#" })],
        scaleOverlay: buildScaleOverlay("C", "major"),
      }),
    ).toMatchObject({
      noteName: "F#",
      visualState: "detectedOutOfScale",
    })
  })

  it("does not force labels visible for related octaves", () => {
    expect(
      modelFor({
        position: position({ midi: 60, pitchClass: 0, noteName: "C" }),
        detectedNotes: [detectedNote({ midi: 72, pitchClass: 0, name: "C" })],
      }),
    ).toMatchObject({
      noteName: null,
      visualState: "hidden",
    })
  })
})
