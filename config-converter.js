/**
 * @file Generates a binary config for the FIS-Control device.
 * @author Stefan Bieger
 * @author Paweł Szydło
 */

"use strict";

import {control_units_index} from "./control-units.js";
import {
  Config,
  DigitsConfig, GaugeConfig,
  ModsConfig,
  NumericalGaugeConfig,
  TableConfig,
  TableRowConfig
} from "./config-model.js";

const CONFIG_VERSION = 5;
const CONFIG_SIZE = 16384; // In bytes.

/**
 * Calculate CRC checksum for the XModem protocol.
 *
 * @param {DataView} bufferView
 *
 * @returns {number} CRC checksum.
 */
function xmodemCRC(bufferView) {
  let crc = 0;
  for (let d = 0; d < 16382; d++) {
    crc = crc ^ (bufferView.getUint8(d) << 8);
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return crc;
}

/**
 * Converts all config values into a single binary array.
 *
 * @param {Config} config Full configuration.
 *
 * @returns {ArrayBuffer} Binary data that can be loaded into FIS-Control as "settings".
 * @throws {Error} Config must be correctly filled.
 */
export function convertConfigToBinary(config) {
  if (!config || !(config instanceof Config)) {
    throw new Error('Config is required.');
  }
  if (!config.gaugeConfigs || config.gaugeConfigs.length !== 3) {
    throw new Error('Expected three gauge configs');
  }
  if (!config.numericalGaugeConfigs || config.numericalGaugeConfigs.length !== 10) {
    throw new Error('Expected 10 numerical gauge configs');
  }
  if (!config.tableConfigs || config.tableConfigs.length !== 5) {
    throw new Error('Expected five table configs');
  }
  for (const table of config.tableConfigs) {
    if (!table.rows || table.rows.length !== 10) {
      throw new Error('Every table config must have 10 rows.');
    }
  }

  const outputBuffer = new ArrayBuffer(CONFIG_SIZE);
  const settings = new Uint8Array(outputBuffer);
  const outputView = new DataView(outputBuffer);
  for (let i = 0; i < settings.length; i++) {
    settings[i] = 0x00;
  }

  // Config version.
  settings[0] = CONFIG_VERSION;
  // General settings.
  settings[1] = config.language;
  settings[2] = config.autostart;
  settings[3] = config.bluetooth;
  settings[4] = config.car;
  settings[7] = config.layout;
  settings[9] = config.view1;
  // Bytes 10-13 and 14-17 - table colors.
  outputView.setUint32(10, parseInt(config.backgroundColor.substr(1, 6), 16) | 0xFF000000, true);
  outputView.setUint32(14, parseInt(config.fontColor.substr(1, 6), 16) & 0x00FFFFFF, true);
  // Mods.
  settings[18] |= config.modsConfig.mfswRoller << 0;
  settings[18] |= config.modsConfig.driveSelect << 2;
  settings[18] |= config.modsConfig.egtToCan << 3;
  settings[18] |= config.modsConfig.halfResolution << 4;
  settings[18] |= config.modsConfig.ignorePdc << 6;
  settings[18] |= config.modsConfig.scrollTables << 7;
  settings[19] |= config.modsConfig.statusbarGauge << 0;
  settings[19] |= config.modsConfig.statusbarTable << 1;
  settings[19] |= config.modsConfig.virtualCockpit << 2;
  settings[19] |= config.modsConfig.starButton << 3;
  settings[19] |= config.modsConfig.texture << 4;
  settings[19] |= config.modsConfig.hideDrive << 5;
  settings[19] |= config.modsConfig.hideMmi << 6;
  settings[19] |= config.modsConfig.alarm << 7;
  // Digital gauges config.
  settings[36] = config.digitsConfig.height;
  settings[37] = config.digitsConfig.width;
  settings[38] = config.digitsConfig.dotWidth;
  settings[39] = config.digitsConfig.spacing;
  // Bytes 40-43 and 44-47 - digital gauge colors.
  outputView.setUint32(40, parseInt(config.digitsConfig.normalColor.substr(1, 6), 16) | 0xFF000000, true);
  outputView.setUint32(44, parseInt(config.digitsConfig.warningColor.substr(1, 6), 16) & 0x00FFFFFF, true);

  for (let tableIndex = 0; tableIndex < 5; tableIndex++) {
    const tableConfig = config.tableConfigs[tableIndex];

    settings[(tableIndex * 2) + 26] = tableConfig.controlUnitIndex & 0xFF;
    settings[(tableIndex * 2) + 27] = (tableConfig.controlUnitIndex >> 8) & 0xFF;

    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
      const rowConfig = tableConfig.rows[rowIndex];
      const address = (100 * 10 * tableIndex) + (100 * rowIndex) + 100;
      settings[address] = rowConfig.measurement & 0xFF;
      settings[address + 1] = (rowConfig.measurement >> 8) & 0xFF;

      // Label. Max 30 characters.
      for (let i = 0; i < 30; i++) {
        settings[address + 2 + i] = 0x00;
      }
      for (let i = 0; i < Math.min(rowConfig.label.length, 30); i++) {
        settings[address + 2 + i] = rowConfig.label.charCodeAt(i);
      }
      // Unit. Max 20 characters.
      const unit = rowConfig.unit.replace("*lambda*", "\x81");
      for (let i = 0; i < 20; i++) {
        settings[address + 32 + i] = 0x00;
      }
      for (let i = 0; i < Math.min(unit.length, 20); i++) {
        settings[address + 32 + i] = unit.charCodeAt(i);
      }

      outputView.setInt8(address + 82, rowConfig.decimals);
      outputView.setInt8(address + 83, rowConfig.factor);
      outputView.setInt8(address + 84, rowConfig.pressure);
      outputView.setInt32(address + 85, rowConfig.lowerWarning * 1000, true);
      outputView.setInt32(address + 89, rowConfig.upperWarning * 1000, true);

      // For the first table - add numerical gauges settings.
      if (tableIndex === 0) {
        const numericalGaugeConfig = config.numericalGaugeConfigs[rowIndex];
        if (numericalGaugeConfig.centered) {
          outputView.setInt16(address + 93, numericalGaugeConfig.positionX * -1, true);
        } else {
          outputView.setInt16(address + 93, numericalGaugeConfig.positionX, true);
        }
        outputView.setInt16(address + 95, numericalGaugeConfig.positionY, true);
      }

      // For the first table - add gauge settings for the first three rows.
      if ((tableIndex === 0) && (rowIndex < 3)) {
        const gaugeConfig = config.gaugeConfigs[rowIndex];
        settings[address + 52] = gaugeConfig.needleWidth;
        settings[address + 53] = gaugeConfig.needleHeight
        outputView.setInt16(address + 54, gaugeConfig.needleCenterX, true);
        outputView.setInt16(address + 56, gaugeConfig.needleCenterY, true);
        outputView.setInt16(address + 58, gaugeConfig.needlePosX, true);
        outputView.setInt16(address + 60, gaugeConfig.needlePosY, true);
        outputView.setInt16(address + 62, gaugeConfig.indicatorPosX, true);
        outputView.setInt16(address + 64, gaugeConfig.indicatorPosY, true);
        outputView.setInt32(address + 66, gaugeConfig.startAngle * 10, true);
        outputView.setInt32(address + 70, gaugeConfig.scaleRange * 10, true);
        outputView.setInt32(address + 74, gaugeConfig.lowerLimit * 1000, true);
        outputView.setInt32(address + 78, gaugeConfig.upperLimit * 1000, true);
      }
    }
  }
  // Put checksum at the last two bytes.
  outputView.setUint16(CONFIG_SIZE - 2, xmodemCRC(outputView), true);
  return outputBuffer;
}

/**
 * Converts a binary array into a Config object.
 *
 * @param {ArrayBuffer} binaryArray
 *
 * @returns {Config} Config object.
 * @throws {Error} Valid binary array must be provided.
 */
export function convertBinaryToConfig(binaryArray) {
  if (!binaryArray || !(binaryArray instanceof ArrayBuffer) || binaryArray.byteLength !== CONFIG_SIZE) {
    throw new Error('Invalid binary data provided.');
  }

  const settings = new Uint8Array(binaryArray);
  const inputView = new DataView(binaryArray);

  if (settings[0] !== CONFIG_VERSION) {
    throw new Error(`Unsupported config version. Wanted ${CONFIG_VERSION}, got ${settings[0]}`);
  }

  const modsConfig = new ModsConfig(
    /** mfswRoller= */ !!(settings[18] & (1 << 0)),
    /** driveSelect= */ !!(settings[18] & (1 << 2)),
    /** egtToCan= */ !!(settings[18] & (1 << 3)),
    /** halfResolution= */ !!(settings[18] & (1 << 4)),
    /** ignorePdc= */ !!(settings[18] & (1 << 6)),
    /** scrollTables= */ !!(settings[18] & (1 << 7)),
    /** statusbarGauge= */ !!(settings[19] & (1 << 0)),
    /** statusbarTable= */ !!(settings[19] & (1 << 1)),
    /** virtualCockpit= */ !!(settings[19] & (1 << 2)),
    /** starButton= */ !!(settings[19] & (1 << 3)),
    /** texture= */ !!(settings[19] & (1 << 4)),
    /** hideDrive= */ !!(settings[19] & (1 << 5)),
    /** hideMmi= */ !!(settings[19] & (1 << 6)),
    /** alarm= */ !!(settings[19] & (1 << 7)),
  );

  const digitsConfig = new DigitsConfig(
    /** width= */ settings[37],
    /** height= */ settings[36],
    /** dotWidth= */ settings[38],
    /** spacing= */ settings[39],
    /** normalColor= */ '#' + (inputView.getUint32(40, true) & 0x00FFFFFF).toString(16).padStart(6, '0'),
    /** warningColor= */ '#' + (inputView.getUint32(44, true) & 0x00FFFFFF).toString(16).padStart(6, '0'),
  );

  const gaugeConfigs = [];
  const numericalGaugeConfigs = [];
  const tableConfigs = [];

  for (let tableIndex = 0; tableIndex < 5; tableIndex++) {
    const tableRowConfigs = [];
    tableConfigs[tableIndex] = new TableConfig(
      /** controlUnitIndex= */ settings[(tableIndex * 2) + 26] | (settings[(tableIndex * 2) + 27] << 8),
      /** rows= */ tableRowConfigs,
    );

    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
      let address = (100 * 10 * tableIndex) + (100 * rowIndex) + 100;
      // Label.
      let label = '';
      for (let i = 0; i < 30; i++) {
        if (settings[address + 2 + i] === 0) {
          break;
        } else {
          label += String.fromCharCode(settings[address + 2 + i]);
        }
      }
      // Unit.
      let unit = '';
      for (let i = 0; i < 20; i++) {
        if (settings[address + 32 + i] === 0) {
          break;
        } else {
          unit += String.fromCharCode(settings[address + 32 + i]);
        }
      }

      tableRowConfigs[rowIndex] = new TableRowConfig(
        /** measurement= */ settings[address + 0] | (settings[address + 1] << 8),
        /** label= */ label,
        /** unit= */ unit.replace("\x81", "*lambda*"),
        /** decimals= */ inputView.getInt8(address + 82, true),
        /** factor= */ inputView.getInt8(address + 83, true),
        /** pressure= */ inputView.getInt8(address + 84, true),
        /** lowerWarning= */ inputView.getInt32(address + 85, true) / 1000,
        /** upperWarning= */ inputView.getInt32(address + 89, true) / 1000,
      );

      if (tableIndex === 0) {
        let position = inputView.getInt16(address + 93, true);
        numericalGaugeConfigs[rowIndex] = new NumericalGaugeConfig(
          /** positionX= */ position < 0 ? position * -1 : position,
          /** positionY= */ inputView.getInt16(address + 95, true),
          /** centered= */ position < 0,
        );
      }

      if ((tableIndex === 0) && (rowIndex < 3)) {
        gaugeConfigs[rowIndex] = new GaugeConfig(
          /** needleWidth= */ settings[address + 52],
          /** needleHeight= */ settings[address + 53],
          /** needleCenterX= */ inputView.getInt16(address + 54, true),
          /** needleCenterY= */ inputView.getInt16(address + 56, true),
          /** needlePosX= */ inputView.getInt16(address + 58, true),
          /** needlePosY= */ inputView.getInt16(address + 60, true),
          /** indicatorPosX= */ inputView.getInt16(address + 62, true),
          /** indicatorPosY= */ inputView.getInt16(address + 64, true),
          /** startAngle= */ inputView.getInt32(address + 66, true) / 10,
          /** scaleRange= */ inputView.getInt32(address + 70, true) / 10,
          /** lowerLimit= */ inputView.getInt32(address + 74, true) / 1000,
          /** upperLimit= */ inputView.getInt32(address + 78, true) / 1000,
        );
      }
    }
  }

  return new Config(
    /** language= */ settings[1],
    /** autostart= */ settings[2],
    /** bluetooth= */ settings[3],
    /** car= */ settings[4],
    /** layout= */ settings[7],
    /** view1= */ settings[9],
    /** backgroundColor= */ '#' + (inputView.getUint32(10, true) & 0x00FFFFFF).toString(16).padStart(6, '0'),
    /** fontColor= */ '#' + (inputView.getUint32(14, true) & 0x00FFFFFF).toString(16).padStart(6, '0'),
    /** modsConfig= */ modsConfig,
    /** digitsConfig= */ digitsConfig,
    /** gaugeConfigs= */ gaugeConfigs,
    /** numericalGaugeConfigs= */ numericalGaugeConfigs,
    /** tableConfigs= */ tableConfigs,
  );
}
