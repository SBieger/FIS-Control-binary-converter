/**
 * @file Generates a binary config for the FIS-Control device.
 * @author Stefan Bieger
 * @author Paweł Szydło
 */

import {control_units_index} from "./control-units.js";
import {Config} from "./config-model.js";

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
 * Converts all config values into a single binary object.
 *
 * @param {Config} config Full configuration.
 *
 * @returns {Blob} Binary data that can be loaded into FIS-Control as "settings".
 * @throws {Error} Config must be correctly filled.
 */
export function convertConfig(config) {
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

  const outputBuffer = new ArrayBuffer(16384);

  const settings = new Uint8Array(outputBuffer);
  const outputView = new DataView(outputBuffer);
  for (let i = 0; i < settings.length; i++) {
    settings[i] = 0x00;
  }

  // General settings.
  settings[0] = 5;
  settings[1] = config.language;
  settings[2] = config.autostart;
  settings[3] = config.bluetooth;
  settings[4] = config.car;
  settings[7] = config.layout;
  settings[9] = config.view1;
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
  outputView.setUint32(40, parseInt(config.digitsConfig.normalColor.substr(1, 6), 16) | 0xFF000000, true);
  outputView.setUint32(44, parseInt(config.digitsConfig.warningColor.substr(1, 6), 16) & 0x00FFFFFF, true);

  for (let tableIndex = 0; tableIndex < 5; tableIndex++) {
    const tableConfig = config.tableConfigs[tableIndex];

    settings[(tableIndex * 2) + 26] = control_units_index[tableConfig.controlUnitIndex] & 0xFF;
    settings[(tableIndex * 2) + 27] = (control_units_index[tableConfig.controlUnitIndex] >> 8) & 0xFF;

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

  outputView.setUint16(16382, xmodemCRC(outputView), true);
  return new Blob([outputBuffer]);
}
