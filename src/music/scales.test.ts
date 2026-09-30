import { describe, expect, it } from "vitest"
import { buildScaleOverlay } from "./scales"

describe("buildScaleOverlay", () => {
  it("builds major scales from the selected root", () => {
    expect(buildScaleOverlay("C", "major").pitchClasses).toEqual([
      0, 2, 4, 5, 7, 9, 11,
    ])
  })

  it("wraps scale intervals across the octave", () => {
    expect(buildScaleOverlay("A", "minor-pentatonic").pitchClasses).toEqual([
      9, 0, 2, 4, 7,
    ])
  })

  it("keeps root and scale type metadata", () => {
    expect(buildScaleOverlay("F#", "major-pentatonic")).toMatchObject({
      root: "F#",
      rootPitchClass: 6,
      scaleType: { id: "major-pentatonic", label: "Major pentatonic" },
    })
  })
})
