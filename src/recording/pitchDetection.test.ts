import { describe, expect, it } from "vitest"
import { detectPitch } from "./pitchDetection"

const sineWave = (
  frequency: number,
  sampleRate: number,
  length: number,
): Float32Array =>
  Float32Array.from(
    { length },
    (_, index) => Math.sin((2 * Math.PI * frequency * index) / sampleRate),
  )

describe("detectPitch", () => {
  it("returns null for silence or an empty buffer", () => {
    expect(detectPitch(new Float32Array(2_048), 48_000)).toBeNull()
    expect(detectPitch(new Float32Array(), 48_000)).toBeNull()
  })

  it("detects a 440 Hz sine wave", () => {
    const detectedFrequency = detectPitch(sineWave(440, 48_000, 2_048), 48_000)

    expect(detectedFrequency).not.toBeNull()
    expect(detectedFrequency).toBeCloseTo(440, -1)
  })
})
