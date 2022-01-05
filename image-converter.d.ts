/**
 * Converts a raw PNG array buffer into a clamped RGBA values array.
 *
 * @param {ArrayBuffer} rawPngData
 *
 * @returns {Uint8ClampedArray|undefined} RGBA array if input provided, otherwise undefined.
 */
export function rawPngArrayBufferToClampedRGBA(
  rawPngData: ArrayBuffer
): Uint8ClampedArray | undefined;

/**
 * Returns PNG images dimensions.
 *
 * @param {ArrayBuffer} rawPngData
 *
 * @returns {[number, number]} [width, height] tuple.
 */
export function getImageDimensions(rawPngData: ArrayBuffer): [number, number];

/**
 * Converts needle and digit images into a single binary object.
 *
 * @param {ArrayBuffer} needle1
 * @param {ArrayBuffer} needle2
 * @param {ArrayBuffer} needle3
 * @param {ArrayBuffer} [digit0]
 * @param {ArrayBuffer} [digit1]
 * @param {ArrayBuffer} [digit2]
 * @param {ArrayBuffer} [digit3]
 * @param {ArrayBuffer} [digit4]
 * @param {ArrayBuffer} [digit5]
 * @param {ArrayBuffer} [digit6]
 * @param {ArrayBuffer} [digit7]
 * @param {ArrayBuffer} [digit8]
 * @param {ArrayBuffer} [digit9]
 * @param {ArrayBuffer} [digitDot]
 * @param {ArrayBuffer} [digitMinus]
 *
 * @returns {ArrayBuffer} A buffer that can be loaded into FIS-Control as "needles".
 * @throws {Error} Needle images must be provided.
 */
export function convertNeedlesAndDigits(
  needle1: ArrayBuffer,
  needle2: ArrayBuffer,
  needle3: ArrayBuffer,
  digit0?: ArrayBuffer,
  digit1?: ArrayBuffer,
  digit2?: ArrayBuffer,
  digit3?: ArrayBuffer,
  digit4?: ArrayBuffer,
  digit5?: ArrayBuffer,
  digit6?: ArrayBuffer,
  digit7?: ArrayBuffer,
  digit8?: ArrayBuffer,
  digit9?: ArrayBuffer,
  digitDot?: ArrayBuffer,
  digitMinus?: ArrayBuffer
): ArrayBuffer;

/**
 * Converts background images into a single binary object.
 *
 * @param {ArrayBuffer} gaugesBackground
 * @param {ArrayBuffer} [tablesBackground]
 *
 * @returns {ArrayBuffer} A buffer that can be loaded into FIS-Control as "background".
 * @throws {Error} Gauges background must be provided.
 */
export function convertBackgrounds(
  gaugesBackground: ArrayBuffer,
  tablesBackground?: ArrayBuffer
): ArrayBuffer;
