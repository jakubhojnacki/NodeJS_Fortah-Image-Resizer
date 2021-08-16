/**
 * @module "Engine" class
 * @description Represents application engine
 * @version 0.0.1 (2021-08-10)
 */

import "../general/javaScript.js";
import ArgName from "../args/argName.js";
import FileSystem from "fs";
import FileSystemToolkit from "../general/fileSystemToolkit.js";
import ImageMagickRunner from "./imageMagickRunner.js";
import Path from "path";
import Sizes from "./sizes.js";

export default class Engine {
    get application() { return global.theApplication; }
    get sourceFilePath() { return this.mSourceFilePath; }
    get sourceFileName() { return this.mSourceFileName; }
    get destinationDirectoryPath() { return this.mDestinationDirectoryPath; }
    get sizes() { return this.mSizes; }
    get destinationDirectoryPattern() { return this.mDestinationDirectoryPattern; }

    constructor() {
        this.mSourceFilePath = this.application.args.get(ArgName.sourceFilePath);
        this.mSourceFileName = Path.basename(this.sourceFilePath);
        this.mDestinationDirectoryPath = this.application.args.get(ArgName.destinationDirectoryPath);
        this.mSizes = this.application.args.get(ArgName.sizes);
        this.mDestinationDirectoryPattern = this.application.args.get(ArgName.destinationDirectoryPattern);
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
            FileSystemToolkit.deleteIfExists(temporaryFilePath);
            await ImageMagickRunner.resize(this.sourceFilePath, temporaryFilePath, size.width, size.height, size.ignoreAspectRatio);
            const imageInformation = ImageMagickRunner.getInformation(temporaryFilePath);
            const destinationFilePath = this.buildDestinationFilePath(imageInformation);
            FileSystem.renameSync(temporaryFilePath, destinationFilePath);
        }
    }

    buildTemporaryFilePath() {        
        const fileName = `${Date.createFileTimeStamp()}.tmp`;
        return Path.join(this.destinationDirectoryPath, fileName);
    }

    buildDestinationFilePath(pImageInformation) {
        const widthText = pImageInformation.width.pad(4);
        const heightText = pImageInformation.height.pad(4);
        const replacements = [ this.sourceFileName, pImageInformation.width, pImageInformation.height, widthText, heightText ];
        const destinationDirectoryPattern = String.validate(this.destinationDirectoryPattern);
        const destinationDirectoryName = destinationDirectoryPattern.format(replacements);
        const destinationFilePattern = String.validate(this.destinationFilePattern, "{0} {1}x{2}");
        const destinationFileName = destinationFilePattern.format(replacements);
        return Path.join(this.destinationDirectoryPath, destinationDirectoryName, destinationFileName);
    }
}