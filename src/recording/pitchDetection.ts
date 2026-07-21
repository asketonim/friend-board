const MIN_FREQUENCY = 70
const MAX_FREQUENCY = 1_200
const MIN_VOLUME = 0.01

export const detectPitch = (
  samples: Float32Array,
  sampleRate: number,
): number | null => {
  if (samples.length === 0) return null

  const rms = Math.sqrt(
    samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length,
  )

  if (rms < MIN_VOLUME) return null

  const minLag = Math.floor(sampleRate / MAX_FREQUENCY)
  const maxLag = Math.min(
    Math.floor(sampleRate / MIN_FREQUENCY),
    samples.length - 1,
  )
  let bestLag = 0
  let bestCorrelation = -Infinity

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0

    for (let index = 0; index < samples.length - lag; index += 1) {
      correlation += samples[index] * samples[index + lag]
    }

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation
      bestLag = lag
    }
  }

  return bestLag === 0 ? null : sampleRate / bestLag
}
