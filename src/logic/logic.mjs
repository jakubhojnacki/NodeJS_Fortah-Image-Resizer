/**
 * @module "Engine" class
 * @description Represents application engine
 */

import FileSystem from "fs";
import Path from "path";

import { CountEventArgs } from "./countEventArgs.mjs";
import { FileSystemItem } from "fortah-file-system-library";
import { FileSystemItemEventArgs } from "./fileSystemItemEventArgs.mjs";
import { FileSystemItemType } from "fortah-file-system-library";
import { FileSystemMatcher } from "fortah-file-system-library";
import { FileSystemToolkit } from "fortah-file-system-library";
import { ResizedEventArgs } from "../logic/resizedEventArgs.mjs";
import { Sizes } from "../logic/sizes.mjs";
import { Source } from "../logic/source.mjs";

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }

    get args() { return this.mArgs; }
    set args(pValue) { this.mArgs = pValue; }

    get source() { return this.mSource; }
    set source(pValue) { this.mSource = pValue; }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = pValue; }
    get imageProcessor() { return this.mImageProcessor; }
    set imageProcessor(pValue) { this.mImageProcessor = pValue; }
    get sourceFileMatcher() { return this.mSourceFileMatcher; }
    set sourceFileMatcher(pValue) { this.mSourceFileMatcher = pValue; }

    get onCount() { return this.mOnCount; }
    set onCount(pValue) { this.mOnCount = pValue; }
    get onDirectoryFound() { return this.mOnDirectoryFound; }
    set onDirectoryFound(pValue) { this.mOnDirectoryFound = pValue; }
    get onFileFound() { return this.mOnFileFound; }
    set onFileFound(pValue) { this.mOnFileFound = pValue; }
    get onResized() { return this.mOnResized; }
    set onResized(pValue) { this.mOnResized = pValue; }

    constructor(pApplication, pArgs) {
        this.application = pApplication;

        this.args = pArgs;

        this.source = null;
        this.sizes = null;
        this.imageProcessor = null;
        this.sourceFileMatcher = null;
        
        this.onCount = null;
        this.onDirectoryFound = null;
        this.onFileFound = null;
        this.onResized = null;
    }

    async run() {      
        if (this.initialise()) {
            this.count();
            await this.process();
            this.finalise();
        }
    }

    initialise() {
        const validator = new Validator();
        validator.setComponent(Logic.name);

        this.args.validate(validator);

        this.source = Source.parse(pSource);
        this.source.validate(validator);

        if (this.args.destination)
            if (!FileSystem.existsSync(this.args.destination))
                validator.addError("Destination", "does not exist");

        this.sizes = Sizes.parse(this.args.sizes);
        this.sizes.validate(validator);

        this.imageProcessor = (new ImageProcessorFactory()).create(this.args.imageProcessorType, this.args.imageProcessorPath, this.application.rootDirectoryPath);            

        this.sourceFileMatcher = new FileSystemMatcher(this.source.fileFilter);

        validator.restoreComponent();
        return validator.require();
    }

    count() {
        const directory = new FileSystemItem(FileSystemItemType.directory, this.source.directory);
        const count = this.countDirectory(directory, 0);
        if (this.onCount)
            this.onCount(new CountEventArgs(count));
    }

    countDirectory(pDirectory, pCountSoFar) {
        const count = pCountSoFar;
        const directoryItems = FileSystemToolkit.readDirectory(pDirectory.path);
        for (const directoryItem of directoryItems)
            switch (directoryItem.type) {
                case FileSystemItemType.directory:
                    count = this.countDirectory(directoryItem.path, count);
                    break;
                case FileSystemItemType.file:
                    if (this.sourceFileMatcher.matches(directoryItem.name))
                        count++;
                    break;
            }
        return count;
    }

    async process() {
        const directory = new FileSystemItem(FileSystemItemType.directory, this.source.directory);
        await this.processDirectory(directory, "", 0);
    }

    async processDirectory(pSourceDirectory, pDirectorySubPath, pIndentation) {
        if (this.onDirectoryFound)
            this.onDirectoryFound(new FileSystemItemEventArgs(pSourceDirectory, pIndentation));
        const sourceDirectoryItems = FileSystemToolkit.readDirectory(pSourceDirectory.path);
        for (const sourceDirectoryItem of sourceDirectoryItems)
            switch (sourceDirectoryItem.type) {
                case FileSystemItemType.directory: {
                    const subDirectoryPath = Path.join(pDirectorySubPath, sourceDirectoryItem.name);
                    await this.processDirectory(sourceDirectoryItem, subDirectoryPath, pIndentation + 1);
                } break;
                case FileSystemItemType.file:
                    if (this.sourceFileMatcher.matches(sourceDirectoryItem.name))
                        await this.processFile(sourceDirectoryItem, pDirectorySubPath, pIndentation);
                    break;
            }
    }

    async processFile(pSourceFile, pDirectorySubPath, pIndentation) {
        if (this.onFileFound)
            this.onFileFound(new FileSystemItemEventArgs(pSourceFile, pIndentation));
        for (const size of this.sizes) {
            const sourceImageInformation = await this.imageProcessor.getInformation(pSourceFile);
            if ((sourceImageInformation.width != size.width) || (sourceImageInformation.height != size.height)) {
                const sourceFileExtension = FileSystemToolkit.getFileExtension(pSourceFile.name).removeIfStartsWith(".");
                const temporaryFilePath = this.buildTemporaryFilePath(sourceFileExtension);
                FileSystemToolkit.deleteIfExists(temporaryFilePath);
                await this.imageProcessor.resize(pSourceFile.path, temporaryFilePath, size.width, size.height, size.ignoreAspectRatio);
                const destinationImageInformation = await this.imageProcessor.getInformation(temporaryFilePath);
                const destinationFilePath = this.buildDestinationFilePath(pSourceFile.name, destinationImageInformation, pDirectorySubPath);
                FileSystemToolkit.renameFile(temporaryFilePath, destinationFilePath);
                if (this.onResized)
                    this.onResized(new ResizedEventArgs(destinationImageInformation, destinationFilePath, pIndentation));
            } else {
                const destinationFilePath = this.buildDestinationFilePath(pSourceFile.name, sourceImageInformation, pDirectorySubPath);
                FileSystemToolkit.copyFile(temporaryFilePath, destinationFilePath);
                if (this.onResized)
                    this.onResized(new ResizedEventArgs(sourceImageInformation, destinationFilePath, pIndentation));
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