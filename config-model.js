/**
 * @file Model objects for building a FIS-Control configuration.
 * @author Stefan Bieger
 * @author Paweł Szydło
 */

"use strict";

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
  this.startAngle = startAngle;
  this.scaleRange = scaleRange;
  this.lowerLimit = lowerLimit;
  this.upperLimit = upperLimit;
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
 * @param {number} measurement Measurement value from the control unit tables.
 * @param {string} label Max 30 characters.
 * @param {string} unit Max 20 characters. Use *lambda* to get the lambda symbol.
 * @param {number} decimals How many decimal places to show on digital gauges.
 * @param {number} factor Conversion factor index.
 * @param {number} pressure Pressure calculation value index.
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
 * Digits (font) configuration object.
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
 * Full FIS-Control configuration object.
 *
 * @param {number} language 0 - English, 1 - German.
 * @param {number} autostart 0 - off, 1 - on, 2 - on with needle sweep, 3-7 - sweep delay.
 * @param {number} bluetooth 0 - off after a while, 1 - always on
 * @param {number} car Index of the selected car.
 * @param {number} layout 0 - gauges, 1 - virtual cockpit, 2 - back to the future.
 * @param {number} view1 Index of the first table view to show.
 * @param {string} backgroundColor Color in HTML hex format ("#123456").
 * @param {string} fontColor Color in HTML hex format ("#123456").
 * @param {ModsConfig} modsConfig
 * @param {DigitsConfig} digitsConfig
 * @param {Array<GaugeConfig>} gaugeConfigs
 * @param {Array<NumericalGaugeConfig>} numericalGaugeConfigs
 * @param {Array<TableConfig>} tableConfigs
 * @constructor
 */
export function Config(language, autostart, bluetooth, car, layout, view1, backgroundColor,
                       fontColor, modsConfig, digitsConfig, gaugeConfigs, numericalGaugeConfigs, tableConfigs) {
  this.language = language;
  this.autostart = autostart;
  this.bluetooth = bluetooth;
  this.car = car;
  this.layout = layout;
  this.view1 = view1;
  this.backgroundColor = backgroundColor;
  this.fontColor = fontColor;
  this.modsConfig = modsConfig;
  this.digitsConfig = digitsConfig;
  this.gaugeConfigs = gaugeConfigs;
  this.numericalGaugeConfigs = numericalGaugeConfigs;
  this.tableConfigs = tableConfigs;
}

