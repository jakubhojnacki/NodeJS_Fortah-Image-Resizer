/**
 * @module "ArgName" class
 * @description Class representing argument names
 * @version 0.0.3 (2021-08-10)
 */

export default class ArgName {
    static get sourceFilePath() { return "SourceFilePath"; }
    static get sizes() { return "Sizes"; }
    static get destinationDirectoryPattern() { return "DestinationDirectoryPattern"; }
    static get destinationFilePattern() { return "DestinationFilePattern"; }
    static get debugMode() { return "DebugMode"; }

    static get values() { return [
        ArgName.sourceFilePath,
        ArgName.sizes,
        ArgName.destinationDirectoryPattern,
        ArgName.destinationFilePattern,
        ArgName.debugMode
    ]; }

    static parse(pText) {
        return Enum.parse(pText, ArgName.values, ArgName.name);
    }
}
