/**
 * @module "FileSystemToolkit" class
 * @description Various tools to work with file system
 * @version 0.0.2 (2021-05-25)
 */

import "../general/javaScript.js";
import FileSystem from "fs";
import Path from "path";

export default class FileSystemToolkit {
    static toDirectoryName(pString) {
        const string = String.validate(pString);
        const directoryName = string.replace(/[/\\?%*:|"<>,;=]/g, "_");
        return directoryName;
    }

    static createDirectoryIfDoesntExist(pPath) {
        if (!FileSystem.existsSync(pPath))
            FileSystem.mkdirSync(pPath, { recursive: true });
    }

    static deleteIfExists(pPath) {
        if (FileSystem.existsSync(pPath))
            FileSystem.unlinkSync(pPath);
    }

    static copyFile(pSourceFilePath, pDestinationFilePath) {
        const destinationDirectoryPath = Path.dirname(pDestinationFilePath);
        this.createDirectoryIfDoesntExist(destinationDirectoryPath);
        FileSystem.copyFileSync(pSourceFilePath, pDestinationFilePath);
    }

    static renameFile(pSourceFilePath, pDestinationFilePath) {
        const destinationDirectoryPath = Path.dirname(pDestinationFilePath);
        this.createDirectoryIfDoesntExist(destinationDirectoryPath);
        FileSystem.renameSync(pSourceFilePath, pDestinationFilePath);
    }
}
