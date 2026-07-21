export const requestMediaRecorder = async (
  options?: MediaRecorderOptions | undefined,
): Promise<{ recorder: MediaRecorder; stream: MediaStream }> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream, options)

    return { recorder, stream }
  } catch (e) {
    throw new Error("No media stream detected.")
  }
}
