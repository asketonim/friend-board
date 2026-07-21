import { afterEach, describe, expect, it, vi } from "vitest"
import { stopRecordingSession } from "./recordingSession"

describe("stopRecordingSession", () => {
  const cancelAnimationFrame = vi.fn()

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it("releases every active recording resource", async () => {
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame)
    const stopRecorder = vi.fn()
    const stopTrack = vi.fn()
    const closeContext = vi.fn().mockResolvedValue(undefined)

    await stopRecordingSession({
      recorder: {
        state: "recording",
        stop: stopRecorder,
      } as unknown as MediaRecorder,
      stream: {
        getTracks: () => [{ stop: stopTrack }],
      } as unknown as MediaStream,
      audioContext: { close: closeContext } as unknown as AudioContext,
      frame: 42,
    })

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42)
    expect(stopRecorder).toHaveBeenCalledOnce()
    expect(stopTrack).toHaveBeenCalledOnce()
    expect(closeContext).toHaveBeenCalledOnce()
  })

  it("does not stop an inactive recorder", async () => {
    const stopRecorder = vi.fn()

    await stopRecordingSession({
      recorder: {
        state: "inactive",
        stop: stopRecorder,
      } as unknown as MediaRecorder,
      stream: null,
      audioContext: null,
      frame: null,
    })

    expect(stopRecorder).not.toHaveBeenCalled()
  })
})
