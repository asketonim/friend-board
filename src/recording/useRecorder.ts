"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { detectPitch } from "./pitchDetection"
import { requestMediaRecorder } from "./requestMediaRecorder"
import { stopRecordingSession } from "./recordingSession"

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [frequency, setFrequency] = useState<number | null>(null)
  const [frequencyRevision, setFrequencyRevision] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const frameRef = useRef<number | null>(null)
  const isStartingRef = useRef(false)
  const isMountedRef = useRef(true)

  const stop = useCallback(async () => {
    const recorder = recorderRef.current
    const stream = streamRef.current
    const audioContext = audioContextRef.current
    const frame = frameRef.current

    // Clear refs first so repeated Stop calls cannot clean up the same session.
    recorderRef.current = null
    streamRef.current = null
    audioContextRef.current = null
    frameRef.current = null
    isStartingRef.current = false

    await stopRecordingSession({ recorder, stream, audioContext, frame })

    if (isMountedRef.current) {
      setIsRecording(false)
      setIsStarting(false)
      setFrequency(null)
      setFrequencyRevision((revision) => revision + 1)
    }
  }, [])

  const start = useCallback(async () => {
    if (isStartingRef.current || recorderRef.current) return

    isStartingRef.current = true
    setIsStarting(true)
    setError(null)
    setFrequency(null)
    setFrequencyRevision((revision) => revision + 1)

    try {
      const { recorder, stream } = await requestMediaRecorder()

      // The component may unmount while the browser permission prompt is open.
      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        isStartingRef.current = false
        return
      }

      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      audioContext.createMediaStreamSource(stream).connect(analyser)

      recorderRef.current = recorder
      streamRef.current = stream
      audioContextRef.current = audioContext

      // A context can begin suspended in some browsers; this is safe to call
      // from the Start button's user gesture.
      void audioContext.resume()
      recorder.start()
      setIsRecording(true)

      const samples = new Float32Array(analyser.fftSize)

      const updateFrequency = () => {
        analyser.getFloatTimeDomainData(samples)
        setFrequency(detectPitch(samples, audioContext.sampleRate))
        setFrequencyRevision((revision) => revision + 1)
        frameRef.current = requestAnimationFrame(updateFrequency)
      }

      frameRef.current = requestAnimationFrame(updateFrequency)
    } catch {
      await stop()

      if (isMountedRef.current) {
        setError("Microphone access was denied or unavailable.")
      }
    } finally {
      isStartingRef.current = false

      if (isMountedRef.current) {
        setIsStarting(false)
      }
    }
  }, [stop])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      void stop()
    }
  }, [stop])

  return {
    start,
    stop,
    isRecording,
    isStarting,
    frequency,
    frequencyRevision,
    error,
  }
}
