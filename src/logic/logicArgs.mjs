/**
 * @module "LogicArgs" class
 * @description Class with logic arguments
 */

"use strict";

import { ArgName } from "../application/argName.mjs";
import { StringBuilder } from "fortah-core-library";

export class LogicArgs {
    get source() { return this.mSource; }
    set source(pValue) { this.mSource = String.verify(pValue); }
    get destination() { return this.mDestination; }
    set destination(pValue) { this.mDestination = String.verify(pValue); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = String.verify(pValue); }
    get directoryTemplate() { return this.mDirectoryTemplate; }
    set directoryTemplate(pValue) { this.mDirectoryTemplate = String.verify(pValue); }
    get fileTemplate() { return this.mFileTemplate; }
    set fileTemplate(pValue) { this.mFileTemplate = String.verify(pValue); }
    get imageProcessorType() { return this.mImageProcessorType; }
    set imageProcessorType(pValue) { this.mImageProcessorType = String.verify(pValue); }
    get imageProcessorPath() { return this.mImageProcessorPath; }
    set imageProcessorPath(pValue) { this.mImageProcessorPath = String.verify(pValue); }

    constructor(pArgs) {
        this.source = pArgs.get(ArgName.source);
        this.destination = pArgs.get(ArgName.destination);
        this.sizes = pArgs.get(ArgName.sizes);
        this.directoryTemplate = pArgs.get(ArgName.directoryTemplate, "");
        this.fileTemplate = pArgs.get(ArgName.fileTemplate, "");
        this.imageProcessorType = pArgs.get(ArgName.imageProcessorType, "");
        this.imageProcessorPath = pArgs.get(ArgName.imageProcessorPath, "");
    }

    toString() {
        const stringBuilder = new StringBuilder();
        stringBuilder.addNameValue("Source", this.source);
        stringBuilder.addNameValue("Destination", this.destination);
        stringBuilder.addNameValue("Sizes", this.sizes);
        stringBuilder.addNameValue("Directory Template", this.directoryTemplate);
        stringBuilder.addNameValue("File Template", this.fileTemplate);
        stringBuilder.addNameValue("Image Processor Type", this.imageProcessorType);
        stringBuilder.addNameValue("Image Processor Path", this.imageProcessorPath);
        return stringBuilder.toString();
    }

    validate(pValidator) {
        pValidator.setComponent(LogicArgs.name);
        pValidator.testNotEmpty("Source", this.destination);
        pValidator.testNotEmpty("Destination", this.destination);
        pValidator.testNotEmpty("Sizes", this.sizes);
        pValidator.restoreComponent();
    }
}