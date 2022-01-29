/**
 * @module "DirectoryEventArgs" class
 * @description Event arguments for a directory
 */

"use strict";

export class DirectoryEventArgs {
    get directory() { return this.mDirectory; }
    set directory(pValue) { this.mDirectory = pValue; }
    get indentation() { return this.mIndentation; }
    set indentation(pValue) { this.mIndentation = Number.verifyAsInteger(pValue); }

    constructor(pDirectory, pIndentation) {
        this.directory = pDirectory;
        this.indentation = pIndentation;
    }
}