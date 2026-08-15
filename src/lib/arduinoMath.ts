/** Direct ports of the two Arduino helper functions used throughout the sketch. */

/** Arduino's `map(x, in_min, in_max, out_min, out_max)`, including its integer truncation. */
export function arduinoMap(
  x: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return Math.trunc(((x - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;
}

/** Arduino's `constrain(x, low, high)`. */
export function constrainValue(x: number, low: number, high: number): number {
  return Math.min(Math.max(x, low), high);
}
