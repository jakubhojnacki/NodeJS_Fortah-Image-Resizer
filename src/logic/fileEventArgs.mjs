/**
 * @module "FileEventArgs" class
 * @description Arguments with file for events
 */

"use strict";

export class FileEventArgs {
    get file() { return this.mFile; }
    set file(pValue) { this.mFile = pValue; }
    get indentation() { return this.mIndentation; }
    set indentation(pValue) { this.mIndentation = Number.verifyAsInteger(pValue); }

    constructor(pFile, pIndentation) {
        this.file = pFile;
        this.indentation = pIndentation;
    }
}