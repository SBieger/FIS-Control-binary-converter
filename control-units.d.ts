/**
 * @typedef {{name: string, values: Object.<number, string>}} ControlUnitConfig
 * @type {Object.<number, ControlUnitConfig>} */
export const controlUnits: Map<number, ControlUnitConfig>;

export type ControlUnitConfig = {
  name: string;
  values: Map<number, string>;
};
