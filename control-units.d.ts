/**
 * @typedef {{name: string, values: Object.<number, string>}} ControlUnitConfig
 * @type {Object.<number, ControlUnitConfig>} */
export const controlUnits: {
    [x: number]: ControlUnitConfig;
};
export type ControlUnitConfig = {
    name: string;
    values: {
        [x: number]: string;
    };
};
