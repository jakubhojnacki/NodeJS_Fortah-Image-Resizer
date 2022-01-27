/**
 * @module "FileSystemItemEventArgs" class
 * @description Arguments with file system item for events
 */

"use strict";

export class FileSystemItemEventArgs {
    get fileSystemItem() { return this.mFileSystemItem; }
    set fileSystemItem(pValue) { this.mFileSystemItem = pValue; }
    get indentation() { return this.mIndentation; }
    set indentation(pValue) { this.mIndentation = Number.verifyAsInteger(pValue); }

    constructor(pFileSystemItem, pIndentation) {
        this.fileSystemItem = pFileSystemItem;
        this.indentation = pIndentation;
    }
}