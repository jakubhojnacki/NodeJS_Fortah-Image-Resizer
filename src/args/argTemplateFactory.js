/**
 * @module "ArgTemplateFactory" class
 * @description Creates arg templates
 * @version 0.0.1 (2021-08-12)
 */

import "../general/javaScript.js";
import ArgName from "./argName.js";
import ArgTemplate from "../general/argTemplate.js";
import ArgTemplates from "../general/argTemplates.js";
import DataType from "../general/dataType.js";

export default class ArgTemplateFactory {
    static get argTemplates() { 
        return new ArgTemplates([
            new ArgTemplate(0, ArgName.source, "Source folder, file or file pattern", DataType.string, true),
            new ArgTemplate(1, ArgName.destination, "Destination directory", DataType.string, true),
            new ArgTemplate(2, ArgName.sizes, "Comma-separated list of sizes", DataType.string, true),
            new ArgTemplate([ "ddp", "destinationDirectoryPattern" ], ArgName.directoryNameTemplate, "Pattern of destination directory", DataType.string),
            new ArgTemplate([ "dfp", "destinationFilePattern" ], ArgName.fileNameTemplate, "Pattern of destination file", DataType.string),
            new ArgTemplate([ "dm", "debugMode" ], ArgName.debugMode, "Defines debug mode (\"true\" or \"false\")", DataType.boolean)
        ]);        
    }
}