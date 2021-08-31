/**
 * @module "Application" class
 * @description Represents the main application class
 * @version 0.0.1 (2021-07-27)
 */

import "./general/javaScript.js";
import Args from "./general/args.js";
import ArgName from "./args/argName.js";
import ArgTemplateFactory from "./args/argTemplateFactory.js";
import Engine from "./engine/engine.js";
import Logger from "./general/logger.js";
import Manifest from "./general/manifest.js";

export default class Application {
    static get manifest() { return new Manifest(); }

    get args() { return this.mArgs; }
    get logger() { return this.mLogger; }
    get debugMode() { return this.mDebugMode; }

    constructor(pArgValues) {
        this.mArgs = Args.parse(pArgValues, ArgTemplateFactory.argTemplates);
        this.mLogger = new Logger();
        this.mDebugMode = this.args.get(ArgName.debugMode, false);
    }

    async run() {
        try {
            if (this.initialise())
                await this.runEngine();
        } catch (tError) {
            const message = (tError ? (this.debugMode ? tError.stack : tError.message) : "Unknown error");
            this.logger.writeError(message);
        } finally {
            this.finalise();
        }
    }

    async runEngine() {
        const __this = this;
        const source = this.args.get(ArgName.source);
        const destination = this.args.get(ArgName.destination);
        const sizes = this.args.get(ArgName.sizes);
        const directoryTemplate = this.args.get(ArgName.directoryTemplate, "");
        const fileTemplate = this.args.get(ArgName.fileTemplate, "");
        const engine = new Engine(source, destination, sizes, directoryTemplate, fileTemplate);
        engine.onDirectoryFound = (lDirectoryPath, lIndentation) => { 
            __this.logger.writeLine(`[${lDirectoryPath}]`, lIndentation * this.logger.tab); 
        };
        engine.onFileFound = (lFileName, lIndentation) => { 
            __this.logger.writeLine(lFileName, (lIndentation + 1) * this.logger.tab); 
        };
        engine.onResized = (lImageInformation, lDestinationFilePath, lIndentation) => { 
            __this.logger.writeLine(`${lImageInformation.width}x${lImageInformation.height} => ${lDestinationFilePath}`, (lIndentation + 2) * this.logger.tab); 
        };
        await engine.run();
    }

    initialise() {
        this.logger.writeLine(Application.manifest.toString());
        this.logger.newLine();
        const result = this.args.validate();
        return result;
    }

    finalise() {
        this.logger.newLine();
        this.logger.writeLine("Completed.");
    }
}
