/**
 * Converts all config values into a single binary object.
 *
 * @param {Config} config Full configuration.
 *
 * @returns {Blob} Binary data that can be loaded into FIS-Control as "settings".
 * @throws {Error} Config must be correctly filled.
 */
export function convertConfig(config: Config): Blob;

import {Config} from './config-model.js';
