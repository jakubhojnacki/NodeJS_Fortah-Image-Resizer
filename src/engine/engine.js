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
    get source() { return this.mSource; }
    get destination() { return this.mDestination; }
    get sizes() { return this.mSizes; }
    get directoryTemplate() { return this.mDirectoryTemplate; }
    get fileTemplate() { return this.mFileTemplate; }
    get imageMagick() { return this.mImageMagick; }
    get sourceFileMatcher() { return this.mSourceFileMatcher; }

    get onDirectoryFound() { return this.mOnDirectoryFound; }
    set onDirectoryFound(pValue) { this.mOnDirectoryFound = pValue; }
    get onFileFound() { return this.mOnFileFound; }
    set onFileFound(pValue) { this.mOnFileFound = pValue; }
    get onResized() { return this.mOnResized; }
    set onResized(pValue) { this.mOnResized = pValue; }

    constructor(pSource, pDestination, pSizes, pDirectoryNameTemplate, pFileNameTemplate) {
        this.mSource = Source.parse(pSource);
        this.mDestination = String.validate(pDestination);
        this.mSizes = Sizes.parse(pSizes);
        this.mDirectoryTemplate = String.validate(pDirectoryNameTemplate);
        this.mFileTemplate = String.validate(pFileNameTemplate);
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
        await this.processDirectory(this.source.directory, "", 0);
    }

    async processDirectory(pSourceDirectoryPath, pDirectorySubPath, pIndentation) {
        if (this.onDirectoryFound)
            this.onDirectoryFound(pSourceDirectoryPath, pIndentation);
        const sourceDirectoryEntries = FileSystem.readdirSync(pSourceDirectoryPath, { withFileTypes: true });
        for (const sourceDirectoryEntry of sourceDirectoryEntries) {
            if ((sourceDirectoryEntry.isDirectory()) && (this.source.isPattern)) {
                const directoryPath = Path.join(pSourceDirectoryPath, sourceDirectoryEntry.name);
                const subDirectoryPath = Path.join(pDirectorySubPath, sourceDirectoryEntry.name);
                await this.processDirectory(directoryPath, subDirectoryPath, pIndentation + 1);
            }
            if (sourceDirectoryEntry.isFile())
                if (this.sourceFileMatcher.matches(sourceDirectoryEntry.name)) {
                    const filePath = Path.join(pSourceDirectoryPath, sourceDirectoryEntry.name);
                    await this.processFile(filePath, pDirectorySubPath, pIndentation);
                }
        }
    }

    async processFile(pSourceFilePath, pDirectorySubPath, pIndentation) {
        const sourceFileName = Path.basename(pSourceFilePath);
        if (this.onFileFound)
            this.onFileFound(sourceFileName, pIndentation);
        for (const size of this.sizes) {
            const sourceImageInformation = await this.imageMagick.getInformation(pSourceFilePath);
            if ((sourceImageInformation.width != size.width) || (sourceImageInformation.height != size.height)) {
                const sourceFileExtension = Path.extname(pSourceFilePath);
                const temporaryFilePath = this.buildTemporaryFilePath(sourceFileExtension);
                FileSystemToolkit.deleteIfExists(temporaryFilePath);
                await this.imageMagick.resize(pSourceFilePath, temporaryFilePath, size.width, size.height, size.ignoreAspectRatio);
                const destinationImageInformation = await this.imageMagick.getInformation(temporaryFilePath);
                const destinationFilePath = this.buildDestinationFilePath(sourceFileName, destinationImageInformation, pDirectorySubPath);
                FileSystemToolkit.renameFile(temporaryFilePath, destinationFilePath);
                if (this.onResized)
                    this.onResized(destinationImageInformation, destinationFilePath, pIndentation);
            } else {
                const destinationFilePath = this.buildDestinationFilePath(sourceFileName, sourceImageInformation, pDirectorySubPath);
                FileSystemToolkit.copyFile(temporaryFilePath, destinationFilePath);
                if (this.onResized)
                    this.onResized(sourceImageInformation, destinationFilePath, pIndentation);
            }
        }
    }

    buildTemporaryFilePath(pSourceFileExtension) {        
        const fileName = `${Date.createFileTimeStamp()}${pSourceFileExtension}`;
        return Path.join(this.destination, fileName);
    }

    buildDestinationFilePath(pSourceFileName, pImageInformation, pDirectorySubPath) {
        const sourceFileNameWithoutExtension = FileSystemToolkit.getFileNameWithoutExtension(pSourceFileName);
        const sourceFileExtension = FileSystemToolkit.getFileExtension(pSourceFileName);
        const widthText = pImageInformation.width.pad(4);
        const heightText = pImageInformation.height.pad(4);
        const replacements = [ sourceFileNameWithoutExtension, pImageInformation.width, pImageInformation.height, widthText, heightText ];
        const directoryTemplate = String.validate(this.directoryTemplate);
        const directoryName = directoryTemplate.format(replacements);
        const fileTemplate = String.validate(this.fileTemplate ? this.fileTemplate : "{0} {1}x{2}");
        const fileName = `${fileTemplate.format(replacements)}${sourceFileExtension}`;
        return Path.join(this.destination, directoryName, pDirectorySubPath, fileName);
    }

    finalise() {        
    }
}