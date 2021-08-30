/**
 * @module "ArgName" class
 * @description Class representing argument names
 * @version 0.0.3 (2021-08-10)
 */

export default class ArgName {
    static get source() { return "Source"; }
    static get destination() { return "Destination"; }
    static get sizes() { return "Sizes"; }
    static get directoryTemplate() { return "DirectoryTemplate"; }
    static get fileTemplate() { return "FileTemplate"; }
    static get debugMode() { return "DebugMode"; }

    static get values() { return [
        ArgName.source,
        ArgName.destination,
        ArgName.sizes,
        ArgName.directoryTemplate,
        ArgName.fileTemplate,
        ArgName.debugMode
    ]; }

    static parse(pText) {
        return Enum.parse(pText, ArgName.values, ArgName.name);
    }
}
