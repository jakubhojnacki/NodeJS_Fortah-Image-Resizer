/**
 * @module "ImageInformation" class
 * @description Stores information about image
 * @version 0.0.1 (2021-08-13)
 */

import "../general/javaScript.js";

export default class ImageInformation {
    get format() { return this.mFormat; }
    get mimeType() { return this.mMimeType; }
    get width() { return this.mWidth; }
    get height() { return this.mHeight; }
    get depth() { return this.mDepth; }
    get fileSize() { return this.mFileSize; }

    constructor(pFormat, pMimeType, pWidth, pHeight, pDepth, pCompression, pFileSize) {
        this.mFormat = String.validate(pFormat).toLowerCase();
        this.mMimeType = String.validate(pMimeType).toLowerCase();
        this.mWidth = Number.validate(pWidth);
        this.mHeight = Number.validate(pHeight);
        this.mDepth = Number.validate(pDepth);
        this.mCompression = String.validate(pCompression).toLowerCase();
        this.mFileSize = Number.validate(pFileSize);
    }

    static parse(pData) {
        let object = null;
        if (pData)
            object = new ImageInformation(pData.format, pData["mime type"], pData.width, pData.height, pData.depth, pData.compression, pData.filesize);
        return object;
    }
}
