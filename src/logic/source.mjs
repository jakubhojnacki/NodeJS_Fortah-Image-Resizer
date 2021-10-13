/**
 * @module "Source" class
 * @description Specifies source (directory / file / file pattern)
 */

import FileSystem from "fs";
import Path from "path";

export class Source {
    get directory() { return this.mDirectory; }
    set directory(pValue) { this.mDirectory = String.validate(pValue); }
    get fileFilter() { return this.mFileFilter; }
    set fileFilter(pValue) { this.mFileFilter = String.validate(pValue); }
    get isPattern() { return this.mIsPattern; }
    set isPattern(pValue) { this.mIsPattern = Boolean.validate(pValue); }

    constructor(pDirectory, pFileFilter, pIsPattern) {
        this.directory = pDirectory;
        this.fileFilter = pFileFilter;
        this.isPattern = pIsPattern;
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