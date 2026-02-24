interface StaleTimeConfig {
  seconds?: number
  minutes?: number
  hours?: number
}

/**
 * Converte tempo em formato legível para milissegundos
 *
 * @example
 * useStaleTime({ minutes: 5 }) // 300000ms
 * useStaleTime({ hours: 2, minutes: 30 }) // 9000000ms
 * useStaleTime({ hours: 1, minutes: 30, seconds: 45 }) // 5445000ms
 */
export function useStaleTime(config: StaleTimeConfig): number {
  const { seconds = 0, minutes = 0, hours = 0 } = config

  const secondsInMs = seconds * 1000
  const minutesInMs = minutes * 60 * 1000
  const hoursInMs = hours * 60 * 60 * 1000

  return secondsInMs + minutesInMs + hoursInMs
}
