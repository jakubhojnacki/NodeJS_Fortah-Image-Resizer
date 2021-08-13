/**
 * @module "DataType" class (static)
 * @description Enumeratos and manages data types
 * @version 0.0.3 (2021-05-25)
 */

import "./javaScript.js";
import Enum from "./enum.js";

export default class DataType {
    static get boolean() { return "Boolean"; }
    static get integer() { return "Integer"; }
    static get float() { return "Float"; }
    static get string() { return "String"; }
    static get date() { return "Date"; }
    static get array() { return "Array"; }
    static get object() { return "Object"; }

    static get values() { return [
        DataType.string,
        DataType.boolean,
        DataType.integer,
        DataType.float,
        DataType.date,
        DataType.array,
        DataType.object
    ]; }

    static parse(pText) {
        return Enum.parse(pText, DataType.values, DataType.name);
    }

    static validateValue(pValue, pDataType) {
        const type = String.nonEmpty(typeof(pValue), "string");
        let value = null;
        if (pValue != null)
            switch (pDataType) {
                case DataType.boolean:
                    value = Boolean.validate(pValue);
                    break;
                case DataType.integer:
                    value = Number.validate(pValue, false, true);
                    break;
                case DataType.float:
                    value = Number.validate(pValue);
                    break;
                case DataType.date:
                    value = Date.validate(pValue);
                    break;
                case DataType.string:
                    value = String.validate(pValue);
                    break;
                case DataType.array:
                    value = Array.validate(pValue);
                    break;
                case DataType.object:
                    value = Object.validate(pValue);
                    break;
                default:
                    throw new Error(`Unhandled data type: ${pDataType}.`);
            }
        return value;
    }
}
