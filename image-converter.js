/**
 * @file Generates binary blobs from images for FIS-Control device.
 * @author Stefan Bieger
 * @author Paweł Szydło
 */

"use strict";

import {UPNG} from './libs/UPNG.js';

/**
 * Converts a raw PNG array buffer into a clamped RGBA values array.
 *
 * @param {ArrayBuffer} rawPngData
 *
 * @returns {Uint8ClampedArray|undefined} RGBA array if input provided, otherwise undefined.
 */
export function rawPngArrayBufferToClampedRGBA(rawPngData) {
  if (!rawPngData) return;

  const frames = UPNG.toRGBA8(UPNG.decode(new Uint8Array(rawPngData)));
  return new Uint8ClampedArray(frames[0]);
}

/**
 * Returns PNG images dimensions.
 *
 * @param {ArrayBuffer} rawPngData
 *
 * @returns {[number, number]} [width, height] tuple.
 */
export function getImageDimensions(rawPngData) {
  const image = UPNG.decode(new Uint8Array(rawPngData));
  return [image.width, image.height];
}

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
export function convertNeedlesAndDigits(needle1, needle2, needle3, digit0, digit1, digit2, digit3,
                                        digit4, digit5, digit6, digit7, digit8, digit9, digitDot,
                                        digitMinus) {
  if (!needle1 || !needle2 || !needle3) {
    throw new Error('Needle images are required!');
  }

  const imageArray = [
    rawPngArrayBufferToClampedRGBA(needle1),
    rawPngArrayBufferToClampedRGBA(needle2),
    rawPngArrayBufferToClampedRGBA(needle3),
    rawPngArrayBufferToClampedRGBA(digit0),
    rawPngArrayBufferToClampedRGBA(digit1),
    rawPngArrayBufferToClampedRGBA(digit2),
    rawPngArrayBufferToClampedRGBA(digit3),
    rawPngArrayBufferToClampedRGBA(digit4),
    rawPngArrayBufferToClampedRGBA(digit5),
    rawPngArrayBufferToClampedRGBA(digit6),
    rawPngArrayBufferToClampedRGBA(digit7),
    rawPngArrayBufferToClampedRGBA(digit8),
    rawPngArrayBufferToClampedRGBA(digit9),
    rawPngArrayBufferToClampedRGBA(digitDot),
    rawPngArrayBufferToClampedRGBA(digitMinus),
  ]

  const outputBuffer = new ArrayBuffer(131072); // 128 * 1024 * 1
  const outputView = new DataView(outputBuffer);
  for (let i = 0; i < 131072; i++) {
    outputView.setUint8(i, 0xFF);
  }

  // Images [0-2] are the needles.
  for (let offset = 0; offset < 3; offset++) {
    let segment = new DataView(outputBuffer, 1024 * 32 * offset);

    if (imageArray[offset] !== undefined) {
      const image = imageArray[offset];

      const pixels = image.length / 4;
      if (pixels <= 8192) {
        for (let i = 0; i < pixels; i++) {
          segment.setUint8(i * 4 + 0, image[i * 4 + 2]); // B
          segment.setUint8(i * 4 + 1, image[i * 4 + 1]); // G
          segment.setUint8(i * 4 + 2, image[i * 4 + 0]); // R
          segment.setUint8(i * 4 + 3, image[i * 4 + 3]); // A
        }
      }
    }
  }

  // Images [3-14] are the digits.
  for (let offset = 3; offset < 15; offset++) {
    let segment = new DataView(outputBuffer, 2730 * (offset - 3) + 98304);

    if (imageArray[offset] !== undefined) {
      const image = imageArray[offset];

      const pixels = image.length / 4;
      if (pixels <= 2730) {
        for (let i = 0; i < pixels; i++) {
          // R (on grayscale image, R, G and B should have the same value), invert because
          // black shall be opaque and white shall be transparent
          segment.setUint8(i, 0xFF - image[i * 4]);
        }
      }
    }
  }

  return outputBuffer;
}

/**
 * Converts background images into a single binary object.
 *
 * @param {ArrayBuffer} gaugesBackground
 * @param {ArrayBuffer} [tablesBackground]
 *
 * @returns {ArrayBuffer} A buffer that can be loaded into FIS-Control as "background".
 * @throws {Error} Gauges background must be provided.
 */
export function convertBackgrounds(gaugesBackground, tablesBackground) {
  if (gaugesBackground === undefined) {
    throw new Error('Gauges background has to be provided!');
  }

  const gaugesImage = rawPngArrayBufferToClampedRGBA(gaugesBackground);
  let outputBuffer = new ArrayBuffer(786432); // 128 * 1024 * 6
  let outputView = new DataView(outputBuffer);

  for (let i = 0; i < (800 * 480); i++) {
    let rgb = (gaugesImage[i * 4 + 0] >> 3) << 11; // R
    rgb |= (gaugesImage[i * 4 + 1] >> 2) << 5; // G
    rgb |= gaugesImage[i * 4 + 2] >> 3; // B
    outputView.setUint16(i * 2, rgb, true);
  }

  if (tablesBackground !== undefined) {
    const tablesImage = rawPngArrayBufferToClampedRGBA(tablesBackground);

    for (let i = 0; i < (96 * 96); i++) {
      let rgb = (tablesImage[i * 4 + 0] >> 3) << 11; // R
      rgb |= (tablesImage[i * 4 + 1] >> 2) << 5; // G
      rgb |= tablesImage[i * 4 + 2] >> 3; // B
      outputView.setUint16(i * 2 + 768000, rgb, true);
    }
  }

  return outputBuffer;
}
