/**
 * Converts all config values into a single binary object.
 *
 * @param {Config} config Full configuration.
 *
 * @returns {ArrayBuffer} Binary data that can be loaded into FIS-Control as "settings".
 * @throws {Error} Config must be correctly filled.
 */
export function convertConfigToBinary(config: Config): ArrayBuffer;

/**
 * Converts a binary array into a Config object.
 *
 * @param {ArrayBuffer} binaryArray
 *
 * @returns {Config} Config object.
 * @throws {Error} Valid binary array must be provided.
 */
export function convertBinaryToConfig(binaryArray: ArrayBuffer): Config;

import {Config} from './config-model.js';
