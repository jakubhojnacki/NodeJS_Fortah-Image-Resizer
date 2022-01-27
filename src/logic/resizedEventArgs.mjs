/**
 * @module "ResizedEventArgs" class
 * @description Event argumetns for resized event
 */

"use strict";

export class ResizedEventArgs {
    get imageInformation() { return this.mImageInformation; }
    set imageInformation(pValue) { this.mImageInformation = pValue; }
    get path() { return this.mPath; }
    set path(pValue) { this.mPath = String.verify(pValue); }
    get indentation() { return this.mIndentation; }
    set indentation(pValue) { this.mIndentation = Number.verifyAsInteger(pValue); }

    constructor(pImageInformation, pPath, pIndentation) {
        this.imageInformation = pImageInformation;
        this.path = pPath;
        this.indentation = pIndentation;
    }
}