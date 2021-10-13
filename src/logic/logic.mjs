/**
 * @module "Engine" class
 * @description Represents application engine
 */

import FileSystem from "fs";
import Path from "path";
 
import { FileMatcher } from "file-system-library";
import { FileSystemItem } from "file-system-library";
import { FileSystemItemType } from "file-system-library";
import { FileSystemToolkit } from "file-system-library";
import { ImageToolkit } from "image-library";
import { ImageSizes } from "image-library";
import { Source } from "../logic/source.mjs";

export default class Engine {
    get source() { return this.mSource; }
    set source(pValue) { this.mSource = Object.validate(pValue, new Source()); }
    get destination() { return this.mDestination; }
    set destination(pValue) { this.mDestination = String.validate(pValue); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = Object.validate(pValue, new ImageSizes()); }
    get directoryTemplate() { return this.mDirectoryTemplate; }
    set directoryTemplate(pValue) { this.mDirectoryTemplate = String.validate(pValue); }
    get fileTemplate() { return this.mFileTemplate; }
    set fileTemplate(pValue) { this.mFileTemplate = String.validate(pValue); }
    get imageToolkit() { return this.mImageToolkit; }
    set imageToolkit(pValue) { this.mImageToolkit = pValue; }
    get sourceFileMatcher() { return this.mSourceFileMatcher; }
    set sourceFileMatcher(pValue) { this.mSourceFileMatcher = pValue; }

    get onDirectoryFound() { return this.mOnDirectoryFound; }
    set onDirectoryFound(pValue) { this.mOnDirectoryFound = pValue; }
    get onFileFound() { return this.mOnFileFound; }
    set onFileFound(pValue) { this.mOnFileFound = pValue; }
    get onResized() { return this.mOnResized; }
    set onResized(pValue) { this.mOnResized = pValue; }

    constructor(pSource, pDestination, pSizes, pDirectoryNameTemplate, pFileNameTemplate) {
        this.source = Source.parse(pSource);
        this.destination = pDestination;
        this.sizes = ImageSizes.parse(pSizes);
        this.directoryTemplate = pDirectoryNameTemplate;
        this.fileTemplate = pFileNameTemplate;
        this.imageToolkit = new ImageToolkit();
        this.sourceFileMatcher = new FileMatcher(this.source.fileFilter);
        this.onDirectoryFound = null;
        this.onFileFound = null;
        this.onResized = null;
    }

    async run() {      
        this.validate();
        await this.process();
    }

    validate() {
        this.source.validate();
        if (!FileSystem.existsSync(this.destination))
            throw new Error(`Destination directory "${this.destination}" doesn't exist`);
        if (!this.sizes)
            throw new Error("No sizes have been defined");
    }

    async process() {
        const sourceDirectory = new FileSystemItem(FileSystemItemType.directory, this.source.directory);
        await this.processDirectory(sourceDirectory, "");
    }

    async processDirectory(pSourceDirectory, pDirectorySubPath) {
        if (this.onDirectoryFound)
            this.onDirectoryFound(pSourceDirectory);
        const sourceDirectoryItems = FileSystemToolkit.readDirectory(pSourceDirectory.path);
        for (const sourceDirectoryItem of sourceDirectoryItems) {
            sourceDirectoryItem.indentation = pSourceDirectory.indentation + 1;
            switch (sourceDirectoryItem.type) {
                case FileSystemItemType.directory:
                    if (this.source.isPattern) {
                        const directorySubPath = Path.join(pDirectorySubPath, sourceDirectoryItem.name);
                        await this.processDirectory(sourceDirectoryItem, directorySubPath);        
                    } break;
                case FileSystemItemType.file: 
                    if (this.sourceFileMatcher.matches(sourceDirectoryItem.name))
                        await this.processFile(sourceDirectoryItem, pDirectorySubPath);    
                    break;
            }
        }
    }

    async processFile(pSourceFile, pDirectorySubPath) {
        if (this.onFileFound)
            this.onFileFound(pSourceFile);
        for (const size of this.sizes) {
            const sourceImageInformation = await this.imageToolkit.getInformation(pSourceFile.path);
            if ((sourceImageInformation.width != size.width) || (sourceImageInformation.height != size.height)) {
                const sourceFileExtension = Path.extname(pSourceFile.path);
                const temporaryFilePath = this.buildTemporaryFilePath(sourceFileExtension);
                FileSystemToolkit.deleteIfExists(temporaryFilePath);
                await this.imageToolkit.resize(pSourceFile.path, temporaryFilePath, size.width, size.height, size.ignoreAspectRatio);
                const destinationImageInformation = await this.imageToolkit.getInformation(temporaryFilePath);
                const destinationFilePath = this.buildDestinationFilePath(sourceFileName, destinationImageInformation, pDirectorySubPath);
                FileSystemToolkit.renameFile(temporaryFilePath, destinationFilePath);
                if (this.onResized)
                    this.onResized(destinationImageInformation, new FileSystemItem(FileSystemItemType.file, destinationFilePath, null, pIndentation));
            } else {
                const destinationFilePath = this.buildDestinationFilePath(sourceFileName, sourceImageInformation, pDirectorySubPath);
                FileSystemToolkit.copyFile(temporaryFilePath, destinationFilePath);
                if (this.onResized)
                    this.onResized(sourceImageInformation, new FileSystemItem(FileSystemItemType.file, destinationFilePath, null, pIndentation));
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
}