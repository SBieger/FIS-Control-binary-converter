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
export function GaugeConfig(needleWidth: number, needleHeight: number, needleCenterX: number,
                            needleCenterY: number, needlePosX: number, needlePosY: number,
                            indicatorPosX: number, indicatorPosY: number, startAngle: number,
                            scaleRange: number, lowerLimit: number, upperLimit: number): void;

export class GaugeConfig {
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
  constructor(needleWidth: number, needleHeight: number, needleCenterX: number,
              needleCenterY: number, needlePosX: number, needlePosY: number, indicatorPosX: number,
              indicatorPosY: number, startAngle: number, scaleRange: number, lowerLimit: number,
              upperLimit: number);

  needleWidth: number;
  needleHeight: number;
  needleCenterX: number;
  needleCenterY: number;
  needlePosX: number;
  needlePosY: number;
  indicatorPosX: number;
  indicatorPosY: number;
  startAngle: number;
  scaleRange: number;
  lowerLimit: number;
  upperLimit: number;
}

/**
 * Numerical gauge configuration object.
 *
 * @param {number} positionX
 * @param {number} positionY
 * @param {boolean} centered Should the gauge be centered or right-aligned.
 * @constructor
 */
export function NumericalGaugeConfig(positionX: number, positionY: number, centered: boolean): void;

export class NumericalGaugeConfig {
  /**
   * Numerical gauge configuration object.
   *
   * @param {number} positionX
   * @param {number} positionY
   * @param {boolean} centered Should the gauge be centered or right-aligned.
   * @constructor
   */
  constructor(positionX: number, positionY: number, centered: boolean);

  positionX: number;
  positionY: number;
  centered: boolean;
}

/**
 * Table configuration object.
 *
 * @param {number} controlUnitIndex Index of the selected control unit.
 * @param {Array<TableRowConfig>} rows
 * @constructor
 */
export function TableConfig(controlUnitIndex: number, rows: Array<TableRowConfig>): void;

export class TableConfig {
  /**
   * Table configuration object.
   *
   * @param {number} controlUnitIndex Index of the selected control unit.
   * @param {Array<TableRowConfig>} rows
   * @constructor
   */
  constructor(controlUnitIndex: number, rows: Array<TableRowConfig>);

  controlUnitIndex: number;
  rows: TableRowConfig[];
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
export function TableRowConfig(measurement: number, label: string, unit: string, decimals: number,
                               factor: number, pressure: number, lowerWarning: number,
                               upperWarning: number): void;

export class TableRowConfig {
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
  constructor(measurement: number, label: string, unit: string, decimals: number, factor: number,
              pressure: number, lowerWarning: number, upperWarning: number);

  measurement: number;
  label: string;
  unit: string;
  decimals: number;
  factor: number;
  pressure: number;
  lowerWarning: number;
  upperWarning: number;
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
export function ModsConfig(mfswRoller: boolean, driveSelect: boolean, egtToCan: boolean,
                           halfResolution: boolean, ignorePdc: boolean, scrollTables: boolean,
                           statusbarGauge: boolean, statusbarTable: boolean,
                           virtualCockpit: boolean, starButton: boolean, texture: boolean,
                           hideDrive: boolean, hideMmi: boolean, alarm: boolean): void;

export class ModsConfig {
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
  constructor(mfswRoller: boolean, driveSelect: boolean, egtToCan: boolean, halfResolution: boolean,
              ignorePdc: boolean, scrollTables: boolean, statusbarGauge: boolean,
              statusbarTable: boolean, virtualCockpit: boolean, starButton: boolean,
              texture: boolean, hideDrive: boolean, hideMmi: boolean, alarm: boolean);

  mfswRoller: boolean;
  driveSelect: boolean;
  egtToCan: boolean;
  halfResolution: boolean;
  ignorePdc: boolean;
  scrollTables: boolean;
  statusbarGauge: boolean;
  statusbarTable: boolean;
  virtualCockpit: boolean;
  starButton: boolean;
  texture: boolean;
  hideDrive: boolean;
  hideMmi: boolean;
  alarm: boolean;
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
export function DigitsConfig(width: number, height: number, dotWidth: number, spacing: number,
                             normalColor: string, warningColor: string): void;

export class DigitsConfig {
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
  constructor(width: number, height: number, dotWidth: number, spacing: number, normalColor: string,
              warningColor: string);

  width: number;
  height: number;
  dotWidth: number;
  spacing: number;
  normalColor: string;
  warningColor: string;
}

/**
 * Full FIS-Control configuration object.
 *
 * @param {number} language Index of the selected language.
 * @param {number} autostart Index of the selected autostart option.
 * @param {number} bluetooth Index of the selected bluetooth option.
 * @param {number} car Index of the selected car.
 * @param {number} layout Index of the selected layout
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
export function Config(language: number, autostart: number, bluetooth: number, car: number,
                       layout: number, view1: number, backgroundColor: string, fontColor: string,
                       modsConfig: ModsConfig, digitsConfig: DigitsConfig,
                       gaugeConfigs: Array<GaugeConfig>,
                       numericalGaugeConfigs: Array<NumericalGaugeConfig>,
                       tableConfigs: Array<TableConfig>): void;

export class Config {
  /**
   * Full FIS-Control configuration object.
   *
   * @param {number} language Index of the selected language.
   * @param {number} autostart Index of the selected autostart option.
   * @param {number} bluetooth Index of the selected bluetooth option.
   * @param {number} car Index of the selected car.
   * @param {number} layout Index of the selected layout
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
  constructor(language: number, autostart: number, bluetooth: number, car: number, layout: number,
              view1: number, backgroundColor: string, fontColor: string, modsConfig: ModsConfig,
              digitsConfig: DigitsConfig, gaugeConfigs: Array<GaugeConfig>,
              numericalGaugeConfigs: Array<NumericalGaugeConfig>, tableConfigs: Array<TableConfig>);

  language: number;
  autostart: number;
  bluetooth: number;
  car: number;
  layout: number;
  view1: number;
  backgroundColor: string;
  fontColor: string;
  modsConfig: ModsConfig;
  digitsConfig: DigitsConfig;
  gaugeConfigs: GaugeConfig[];
  numericalGaugeConfigs: NumericalGaugeConfig[];
  tableConfigs: TableConfig[];
}
