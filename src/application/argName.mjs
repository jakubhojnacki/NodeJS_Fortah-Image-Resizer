/**
 * @module "ArgName" class
 * @description Class representing argument names
 */

export class ArgName {
    static get source() { return "Source"; }
    static get destination() { return "Destination"; }
    static get sizes() { return "Sizes"; }
    static get directoryTemplate() { return "DirectoryTemplate"; }
    static get fileTemplate() { return "FileTemplate"; }
    static get debugMode() { return "DebugMode"; }

    static get values() { return [
        new EnumItem(ArgName.source),
        new EnumItem(ArgName.destination),
        new EnumItem(ArgName.sizes),
        new EnumItem(ArgName.directoryTemplate),
        new EnumItem(ArgName.fileTemplate),
        new EnumItem(ArgName.debugMode)
    ]; }

    static parse(pText) {
        return Enum.parse(pText, ArgName.values, ArgName.name);
    }
}
