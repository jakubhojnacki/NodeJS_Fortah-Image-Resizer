/**
 * @module "FileSystemToolkit" class
 * @description Various tools to work with file system
 * @version 0.0.2 (2021-05-25)
 */

import "../general/javaScript.js";

export default class FileSystemToolkit {
    static toDirectoryName(pString) {
        const string = String.validate(pString);
        const directoryName = string.replace(/[/\\?%*:|"<>,;=]/g, "_");
        return directoryName;
    }
}