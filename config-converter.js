/**
 * @file Generates a binary config for the FIS-Control device.
 * @author Stefan Bieger
 * @author Paweł Szydło
 */

import {control_units_index} from "./control-units";

/**
 * Calculate CRC checksum for the XModem protocol.
 *
 * @param {DataView} bufferView
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
 * Converts standard hexadecimal color string into byte values.
 *
 * @param {string} hexColor Color in HTML hex format ("#123456").
 * @returns {number}
 */
function hexColorToBytes(hexColor) {
    return parseInt(hexColor.substr(1, 6), 16) | 0xFF000000
}

/**
 * Gauge configuration object.
 *
 * @param {number} needleWidth
 * @param {number} needleHeight
 * @param {number} needleCenterX
 * @param {number} needleCenterY
 * @param {number} needlePosX
 * @param {number} needlePosY
 * @param {number} indicatorPosX
 * @param {number} indicatorPosY
 * @param {number} startAngle
 * @param {number} scaleRange
 * @param {number} lowerLimit
 * @param {number} upperLimit
 * @constructor
 */
export function GaugeConfig(needleWidth, needleHeight, needleCenterX, needleCenterY, needlePosX, needlePosY,
                            indicatorPosX, indicatorPosY, startAngle, scaleRange, lowerLimit, upperLimit) {
    this.needleWidth = needleWidth;
    this.needleHeight = needleHeight;
    this.needleCenterX = needleCenterX;
    this.needleCenterY = needleCenterY;
    this.needlePosX = needlePosX;
    this.needlePosY = needlePosY;
    this.indicatorPosX = indicatorPosX;
    this.indicatorPosY = indicatorPosY;
    this.startangle = startangle;
    this.scaleRange = scaleRange;
    this.lowerLimit = lowerLimit;
    this.upperLimit = upperLimit;
}

/**
 * Digits configuration object.
 *
 * @param {number} width
 * @param {number} height
 * @param {number} dotWidth
 * @param {number} spacing Extra spacing between digits.
 * @param {string} normalColor Color in HTML hex format ("#123456").
 * @param {string} warningColor Color in HTML hex format ("#123456").
 * @constructor
 */
export function DigitsConfig(width, height, dotWidth, spacing, normalColor, warningColor) {
    this.width = width;
    this.height = height;
    this.dotWidth = dotWidth;
    this.spacing = spacing;
    this.normalColor = normalColor;
    this.warningColor = warningColor;
}

/**
 * Numerical gauge configuration object.
 *
 * @param {number} positionX
 * @param {number} positionY
 * @param {boolean} centered Should the gauge be centered or right-aligned.
 * @constructor
 */
export function NumericalGaugeConfig(positionX, positionY, centered) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.centered = centered;
}

/**
 * Table configuration object.
 *
 * @param {number} controlUnitIndex Index of the selected control unit.
 * @param {Array<TableRowConfig>} rows
 * @constructor
 */
export function TableConfig(controlUnitIndex, rows) {
    this.controlUnitIndex = controlUnitIndex;
    this.rows = rows;
}

/**
 * Table row configuration object.
 *
 * @param measurement ?
 * @param {string} label Max 30 characters.
 * @param {string } unit Max 20 characters. Use *lambda* to get the lambda symbol.
 * @param {number} decimals How many decimal places to show on digital gauges.
 * @param factor ?
 * @param pressure ?
 * @param {number} lowerWarning Value low warning threshold.
 * @param {number} upperWarning Value high warning threshold.
 * @constructor
 */
export function TableRowConfig(measurement, label, unit, decimals, factor, pressure, lowerWarning, upperWarning) {
    this.measurement = measurement;
    this.label = label;
    this.unit = unit;
    this.decimals = decimals;
    this.factor = factor;
    this.pressure = pressure;
    this.lowerWarning = lowerWarning;
    this.upperWarning = upperWarning;
}

/**
 * Mods configuration object.
 *
 * @param {boolean} mfswRoller
 * @param {boolean} driveSelect
 * @param {boolean} egtToCan
 * @param {boolean} halfResolution
 * @param {boolean} ignorePdc
 * @param {boolean} scrollTables
 * @param {boolean} statusbarGauge
 * @param {boolean} statusbarTable
 * @param {boolean} virtualCockpit
 * @param {boolean} starButton
 * @param {boolean} texture
 * @param {boolean} hideDrive
 * @param {boolean} hideMmi
 * @param {boolean} alarm
 * @constructor
 */
export function ModsConfig(mfswRoller, driveSelect, egtToCan, halfResolution, ignorePdc,
                           scrollTables, statusbarGauge, statusbarTable, virtualCockpit, starButton,
                           texture, hideDrive, hideMmi, alarm) {
    this.mfswRoller = mfswRoller;
    this.driveSelect = driveSelect;
    this.egtToCan = egtToCan;
    this.halfResolution = halfResolution;
    this.ignorePdc = ignorePdc;
    this.scrollTables = scrollTables;
    this.statusbarGauge = statusbarGauge;
    this.statusbarTable = statusbarTable;
    this.virtualCockpit = virtualCockpit;
    this.starButton = starButton;
    this.texture = texture;
    this.hideDrive = hideDrive;
    this.hideMmi = hideMmi;
    this.alarm = alarm;
}

/**
 * Converts all config values into a single binary object.
 *
 * @param language ?
 * @param autostart ?
 * @param bluetooth ?
 * @param car ?
 * @param layout ?
 * @param view1 ?
 * @param {string} backgroundColor Color in HTML hex format ("#123456").
 * @param {string} fontColor Color in HTML hex format ("#123456").
 * @param {ModsConfig} modsConfig
 * @param {DigitsConfig} digitsConfig
 * @param {Array<GaugeConfig>} gaugeConfigs
 * @param {Array<NumericalGaugeConfig>} numericalGaugeConfigs
 * @param {Array<TableConfig>} tableConfigs

 * @returns {Blob} Binary data that can be loaded into FIS-Control as "settings".
 */
export function convertConfig(language, autostart, bluetooth, car, layout, view1, backgroundColor,
                              fontColor, modsConfig, digitsConfig, gaugeConfigs, numericalGaugeConfigs, tableConfigs) {

    if (!gaugeConfigs || gaugeConfigs.length !== 3) {
        throw new Error('Expected three gauge configs');
    }
    if (!numericalGaugeConfigs || numericalGaugeConfigs.length !== 10) {
        throw new Error('Expected 10 numerical gauge configs');
    }
    if (!tableConfigs || tableConfigs.length !== 5) {
        throw new Error('Expected five table configs');
    }
    for (const table of tableConfigs) {
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
    settings[1] = language;
    settings[2] = autostart;
    settings[3] = bluetooth;
    settings[4] = car;
    settings[7] = layout;
    settings[9] = view1;
    view.setUint32(10, hexColorToBytes(backgroundColor), true);
    view.setUint32(14, hexColorToBytes(fontColor), true);
    // Mods.
    settings[18] |= modsConfig.mfswRoller << 0;
    settings[18] |= modsConfig.driveSelect << 2;
    settings[18] |= modsConfig.egtToCan << 3;
    settings[18] |= modsConfig.halfResolution << 4;
    settings[18] |= modsConfig.ignorePdc << 6;
    settings[18] |= modsConfig.scrollTables << 7;
    settings[19] |= modsConfig.statusbarGauge << 0;
    settings[19] |= modsConfig.statusbarTable << 1;
    settings[19] |= modsConfig.virtualCockpit << 2;
    settings[19] |= modsConfig.starButton << 3;
    settings[19] |= modsConfig.texture << 4;
    settings[19] |= modsConfig.hideDrive << 5;
    settings[19] |= modsConfig.hideMmi << 6;
    settings[19] |= modsConfig.alarm << 7;
    // Digital gauges config.
    settings[36] = digitsConfig.height;
    settings[37] = digitsConfig.width;
    settings[38] = digitsConfig.dotWidth;
    settings[39] = digitsConfig.spacing;
    view.setUint32(40, hexColorToBytes(digitsConfig.normalColor), true);
    view.setUint32(44, hexColorToBytes(digitsConfig.warningColor), true);

    // TODO(SBieger): put the config arrays together.
    // Arrays: gaugeConfigs (len=3), numericalGaugeConfigs (len=10), tableConfigs (len=5)
    for (let tableIndex = 0; tableIndex < 5; tableIndex++) {
        const tableConfig = tableConfigs[tableIndex];

        settings[(tableIndex * 2) + 26] = control_units_index[tableConfig.controlUnitIndex] & 0xFF;
        settings[(tableIndex * 2) + 27] = (control_units_index[tableConfig.controlUnitIndex] >> 8) & 0xFF;

        for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
            const rowConfig = tableConfig[rowIndex];
            let address = (100 * 10 * tableIndex) + (100 * rowIndex) + 100;
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

            view.setInt8(address + 82, rowConfig.decimals);
            view.setInt8(address + 83, rowConfig.factor);
            view.setInt8(address + 84, rowConfig.pressure);
            view.setInt32(address + 85, rowConfig.lowerWarning * 1000, true);
            view.setInt32(address + 89, rowConfig.upperWarning * 1000, true);

            // For the first table - add numerical gauges settings.
            if (tableIndex === 0) {
                const numericalGaugeConfig = numericalGaugeConfigs[rowIndex];
                if (numericalGaugeConfig.centered) {
                    view.setInt16(address + 93, numericalGaugeConfig.positionX * -1, true);
                } else {
                    view.setInt16(address + 93, numericalGaugeConfig.positionX, true);
                }
                view.setInt16(address + 95, numericalGaugeConfig.positionY, true);
            }

            // For the first table - add gauge settings for the first three rows.
            if ((tableIndex === 0) && (rowIndex < 3)) {
                const gaugeConfig = gaugeConfigs[rowIndex];
                settings[address + 52] = gaugeConfig.needleWidth;
                settings[address + 53] = gaugeConfig.needleHeight
                view.setInt16(address + 54, gaugeConfig.needleCenterX, true);
                view.setInt16(address + 56, gaugeConfig.needleCenterY, true);
                view.setInt16(address + 58, gaugeConfig.needlePosX, true);
                view.setInt16(address + 60, gaugeConfig.needlePosY, true);
                view.setInt16(address + 62, gaugeConfig.indicatorPosX, true);
                view.setInt16(address + 64, gaugeConfig.indicatorPosY, true);
                view.setInt32(address + 66, gaugeConfig.startangle * 10, true);
                view.setInt32(address + 70, gaugeConfig.scaleRange * 10, true);
                view.setInt32(address + 74, gaugeConfig.lowerLimit * 1000, true);
                view.setInt32(address + 78, gaugeConfig.upperLimit * 1000, true);
            }
        }
    }

    outputView.setUint16(16382, xmodemCRC(outputView), true);
    return new Blob([outputBuffer]);
}