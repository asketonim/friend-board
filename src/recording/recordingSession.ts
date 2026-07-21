export type RecordingSession = {
  recorder: MediaRecorder | null
  stream: MediaStream | null
  audioContext: AudioContext | null
  frame: number | null
}

export const stopRecordingSession = async ({
  recorder,
  stream,
  audioContext,
  frame,
}: RecordingSession): Promise<void> => {
  if (frame !== null) cancelAnimationFrame(frame)
  if (recorder && recorder.state !== "inactive") recorder.stop()
  stream?.getTracks().forEach((track) => track.stop())
  await audioContext?.close()
}
