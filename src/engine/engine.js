/**
 * @module "Engine" class
 * @description Represents application engine
 * @version 0.0.1 (2021-08-10)
 */

import "../general/javaScript.js";
import ArgName from "../args/argName.js";
import FileSystem from "fs";
import ImageMagickRunner from "./imageMagickRunner.js";
import Path from "path";
import Sizes from "./sizes.js";

export default class Engine {
    get application() { return global.theApplication; }
    get sourceFilePath() { return this.mSourceFilePath; }
    get destinationDirectoryPath() { return this.mDestinationDirectoryPath; }
    get sizes() { return this.mSizes; }

    constructor() {
        this.mSourceFilePath = this.application.args.get(ArgName.sourceFilePath);
        this.mDestinationDirectoryPath = this.application.args.get(ArgName.destinationDirectoryPath);
        this.mSizes = this.application.args.get(ArgName.sizes);
    }

    async run() {      
        this.validate();
        await this.process();
    }

    validate() {
        if (!FileSystem.existsSync(this.sourceFilePath))
            throw new Error(`Source file (${this.sourceFilePath}) doesn't exist`);
        if (!FileSystem.existsSync(this.destinationDirectoryPath))
            throw new Error(`Destination directory (${this.destinationDirectoryPath}) doesn't exist`);
        if (!this.sizes)
            throw new Error("No sizes have been defined");
    }

    async process() {
        const sizes = Sizes.parse(this.sizes);
        for (const size of sizes) {
            const temporaryFilePath = this.buildTemporaryFilePath();
            await ImageMagickRunner.resize(this.sourceFilePath, temporaryFilePath, size.width, size.height, size.ignoreAspectRatio);
            const imageInformation = ImageMagickRunner.getInformation(temporaryFilePath);
            const destinationFilePath = this.buildDestinationFilePath(imageInformation);
            FileSystem.renameSync(temporaryFilePath, destinationFilePath);
        }
    }

    buildTemporaryFilePath() {        
        //TODO - Not implemented
    }

    buildDestinationFilePath(pImageInformation) {
        //TODO - Not implemented
    }
}