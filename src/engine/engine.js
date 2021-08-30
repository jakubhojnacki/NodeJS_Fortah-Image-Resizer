/**
 * @module "Engine" class
 * @description Represents application engine
 * @version 0.0.1 (2021-08-10)
 */

import "../general/javaScript.js";
import ArgName from "../args/argName.js";
import FileMatcher from "../general/fileMatcher.js";
import FileSystem from "fs";
import FileSystemToolkit from "../general/fileSystemToolkit.js";
import ImageMagick from "./imageMagick.js";
import Path from "path";
import Sizes from "./sizes.js";
import Source from "./source.js";

export default class Engine {
    get application() { return global.theApplication; }

    get source() { return this.mSource; }
    get destination() { return this.mDestination; }
    get sizes() { return this.mSizes; }
    get directoryNameTemplate() { return this.mDirectoryNameTemplate; }
    get fileNameTemplate() { return this.mFileNameTemplate; }
    get imageMagick() { return this.mImageMagick; }
    get sourceFileMatcher() { return this.mSourceFileMatcher; }
    set sourceFileMatcher(pValue) { this.mSourceFileMatcher = pValue; }

    get onDirectoryFound() { return this.mOnDirectoryFound; }
    set onDirectoryFound(pValue) { this.mOnDirectoryFound = pValue; }
    get onFileFound() { return this.mOnFileFound; }
    set onFileFound(pValue) { this.mOnFileFound = pValue; }
    get onResized() { return this.mOnResized; }
    set onResized(pValue) { this.mOnResized = pValue; }

    constructor() {
        this.mSource = Source.parse(this.application.args.get(ArgName.source));
        this.mDestination = this.application.args.get(ArgName.destination);
        this.mSizes = Sizes.parse(this.application.args.get(ArgName.sizes));
        this.mDirectoryNameTemplate = this.application.args.get(ArgName.directoryNameTemplate);
        this.mFileNameTemplate = this.application.args.get(ArgName.fileNameTemplate);
        this.mImageMagick = new ImageMagick();
        this.mSourceFileMatcher = new FileMatcher(this.source.fileFilter);
        this.mOnDirectoryFound = null;
        this.mOnFileFound = null;
        this.mOnResized = null;
    }

    async run() {      
        this.initialise();
        await this.process();
        this.finalise();
    }

    initialise() {
        this.source.validate();
        if (!FileSystem.existsSync(this.destination))
            throw new Error(`Destination directory "${this.destination}" doesn't exist`);
        if (!this.sizes)
            throw new Error("No sizes have been defined");
    }

    async process() {
        this.processDirectory(this.source.directory, "", 0);
    }

    async processDirectory(pDirectoryPath, pSubDirectoryPath, pIndentation) {
        if (this.onDirectoryFound)
            this.onDirectoryFound(pDirectoryPath, pIndentation);
        const directoryEntries = FileSystem.readdirSync(pDirectoryPath, { withFileTypes: true });
        for (directoryEntry of directoryEntries) {
            if ((directoryEntry.isFolder()) && (this.source.isPattern)) {
                const directoryPath = Path.combine(pDirectoryPath, directoryEntry.name);
                const subDirectoryPath = Path.combine(pSubDirectoryPath, directoryEntry.name);
                await this.processDirectory(directoryPath, subDirectoryPath, pIndentation + 1);
            }
            if (directoryEntry.isFile())
                if (this.sourceFileMatcher.matches(directoryEntry.name)) {
                    const filePath = Path.combine(pDirectoryPath, directoryEntry.name);
                    await this.processFile(filePath, subDirectoryPath, pIndentation);
                }
        }
    }

    async processFile(pFilePath, pSubDirectoryPath, pIndentation) {
        if (this.onFileFound)
            this.onFileFound(pFilePath, pIndentation);
        for (const size of sizes) {
            const temporaryFilePath = this.buildTemporaryFilePath();
            FileSystemToolkit.deleteIfExists(temporaryFilePath);
            await this.imageMagick.resize(pFilePath, temporaryFilePath, size.width, size.height, size.ignoreAspectRatio);
            const imageInformation = ImageMagick.getInformation(temporaryFilePath);
            const destinationFilePath = this.buildDestinationFilePath(imageInformation);
            FileSystem.renameSync(temporaryFilePath, destinationFilePath);
        }
    }

    buildTemporaryFilePath() {        
        const fileName = `${Date.createFileTimeStamp()}.tmp`;
        return Path.join(this.destination, fileName);
    }

    buildDestinationFilePath(pImageInformation) {
        const widthText = pImageInformation.width.pad(4);
        const heightText = pImageInformation.height.pad(4);
        const replacements = [ this.sourceFileName, pImageInformation.width, pImageInformation.height, widthText, heightText ];
        const destinationDirectoryPattern = String.validate(this.directoryNameTemplate);
        const destinationDirectoryName = destinationDirectoryPattern.format(replacements);
        const destinationFilePattern = String.validate(this.destinationFilePattern, "{0} {1}x{2}");
        const destinationFileName = destinationFilePattern.format(replacements);
        return Path.join(this.destination, destinationDirectoryName, destinationFileName);
    }

    finalise() {        
    }
}