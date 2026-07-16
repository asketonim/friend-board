import { useState, useEffect } from "react"
import { requestMediaRecorder } from "./requestMediaRecorder"

export const useRecording = () => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>()
  const [stream, setStream] = useState<MediaStream | null>()

  const initializeRecorder = async () => {
    try {
      const { recorder, stream } = await requestMediaRecorder()
      setRecorder(recorder)
      setStream(stream)
    } catch (e) {
      setRecorder(null)
    }
  }

  return {
    initializeRecorder,
    recorder,
    stream,
  }
}
