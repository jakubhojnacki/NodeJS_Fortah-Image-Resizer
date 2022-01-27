/**
 * @module "Source" class
 * @description Specifies source (directory / file / file pattern)
 * @version 0.0.1 (2021-08-16)
 */

import "../general/javaScript.js";
import FileSystem from "fs";
import Path from "path";

export default class Source {
    get directory() { return this.mDirectory; }
    get fileFilter() { return this.mFileFilter; }
    get isPattern() { return this.mIsPattern; }

    constructor(pDirectory, pFileFilter, pIsPattern) {
        this.mDirectory = String.validate(pDirectory);
        this.mFileFilter = String.validate(pFileFilter);
        this.mIsPattern = Boolean.validate(pIsPattern);
    }

    validate() {
        if (this.directory)
            if (!FileSystem.existsSync(this.directory))
                throw new Error(`Directory "${this.directory}" doesn't exist`);
        if ((this.fileFilter) && (!this.isPattern)) {
            const filePath = Path.join(this.directory, this.fileFilter);
            if (!FileSystem.existsSync(filePath))
                throw new Error(`File "${filePath}" doesn't exist`);
        }
    }

    static parse(pPattern) {
        const path = Path.parse(pPattern);
        const directory = path.dir;
        const file = path.base;
        const isPattern = (file.indexOf("*") >= 0);
        return new Source(directory, file, isPattern);
    }
}