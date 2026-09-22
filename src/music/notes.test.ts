import { describe, expect, it } from "vitest"
import { frequencyToNote, getFretboardPositions } from "./notes"

describe("frequencyToNote", () => {
  it("maps 440 Hz to A4", () => {
    expect(frequencyToNote(440)).toMatchObject({
      midi: 69,
      name: "A",
      octave: 4,
      cents: 0,
    })
  })

  it("reports cents from the nearest note", () => {
    expect(frequencyToNote(443)?.cents).toBe(12)
    expect(frequencyToNote(438)?.cents).toBe(-8)
  })
})

describe("getFretboardPositions", () => {
  it("renders standard tuning high E on top and low E on bottom", () => {
    const rows = getFretboardPositions(15)

    expect(rows[0][0]).toMatchObject({
      stringId: "high-e",
      noteName: "E",
      octave: 4,
    })
    expect(rows.at(-1)?.[0]).toMatchObject({
      stringId: "low-e",
      noteName: "E",
      octave: 2,
    })
  })

  it("includes frets from open through the configured maximum", () => {
    const rows = getFretboardPositions(15)

    expect(rows).toHaveLength(6)
    expect(rows[0]).toHaveLength(16)
    expect(rows[0][15]).toMatchObject({ fret: 15 })
  })
})
