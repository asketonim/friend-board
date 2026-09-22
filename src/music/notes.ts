export const SHARP_NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const

export type NoteName = (typeof SHARP_NOTE_NAMES)[number]

export type DetectedNote = {
  midi: number
  pitchClass: number
  name: NoteName
  octave: number
  cents: number
  frequency: number
}

export type GuitarString = {
  id: string
  label: NoteName
  openMidi: number
}

export type FretboardPosition = {
  stringId: string
  stringLabel: NoteName
  fret: number
  midi: number
  pitchClass: number
  noteName: NoteName
  octave: number
}

const A4_MIDI = 69
const A4_FREQUENCY = 440

export const STANDARD_TUNING_LOW_TO_HIGH: readonly GuitarString[] = [
  { id: "low-e", label: "E", openMidi: 40 },
  { id: "a", label: "A", openMidi: 45 },
  { id: "d", label: "D", openMidi: 50 },
  { id: "g", label: "G", openMidi: 55 },
  { id: "b", label: "B", openMidi: 59 },
  { id: "high-e", label: "E", openMidi: 64 },
]

export const STANDARD_TUNING_DISPLAY = [
  ...STANDARD_TUNING_LOW_TO_HIGH,
].reverse()

export const midiToFrequency = (midi: number): number =>
  A4_FREQUENCY * 2 ** ((midi - A4_MIDI) / 12)

export const getNoteName = (midi: number): NoteName =>
  SHARP_NOTE_NAMES[((midi % 12) + 12) % 12]

export const getOctave = (midi: number): number => Math.floor(midi / 12) - 1

export const frequencyToNote = (frequency: number): DetectedNote | null => {
  if (!Number.isFinite(frequency) || frequency <= 0) return null

  const midi = Math.round(A4_MIDI + 12 * Math.log2(frequency / A4_FREQUENCY))
  const targetFrequency = midiToFrequency(midi)
  const cents = Math.round(1200 * Math.log2(frequency / targetFrequency))
  const pitchClass = ((midi % 12) + 12) % 12

  return {
    midi,
    pitchClass,
    name: getNoteName(midi),
    octave: getOctave(midi),
    cents,
    frequency,
  }
}

export const formatCents = (cents: number): string => {
  if (cents > 0) return `+${cents}¢`
  return `${cents}¢`
}

export const formatDetectedNote = (note: DetectedNote): string =>
  `${note.name}${note.octave} ${formatCents(note.cents)}`

export const getFretboardPositions = (
  maxFret: number,
  strings: readonly GuitarString[] = STANDARD_TUNING_DISPLAY,
): FretboardPosition[][] =>
  strings.map((string) =>
    Array.from({ length: maxFret + 1 }, (_, fret) => {
      const midi = string.openMidi + fret

      return {
        stringId: string.id,
        stringLabel: string.label,
        fret,
        midi,
        pitchClass: ((midi % 12) + 12) % 12,
        noteName: getNoteName(midi),
        octave: getOctave(midi),
      }
    }),
  )
