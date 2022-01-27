/**
 * @module "Application" class
 * @description Represents the main application class
 */

import ConsoleApplication from "fortah-console-application";
import { ArgName } from "../application/argName.mjs";
import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { Logic } from "../logic/logic.mjs";

export class Application extends ConsoleApplication {
    get progress() { return this.mProgress; }
    set progress(pValue) { this.mProgress = pValue; }

    constructor(pRootDirectoryPath) {
        super(pRootDirectoryPath, (new ArgTemplateFactory()).create());
        this.progress = null;        
    }

    async runLogic() {
        const source = this.args.get(ArgName.source);
        const destination = this.args.get(ArgName.destination);
        const sizes = this.args.get(ArgName.sizes);
        const directoryTemplate = this.args.get(ArgName.directoryTemplate, "");
        const fileTemplate = this.args.get(ArgName.fileTemplate, "");

        this.console.writeLine(`Source: "${source}"`, 1);
        this.console.writeLine(`Destination: "${destination}"`, 1);
        this.console.writeLine(`Sizes: "${sizes}"`, 1);
        this.console.writeLine(`Directory Template: "${directoryTemplate}"`, 1);
        this.console.writeLine(`File Template: "${fileTemplate}"`, 1);

        const logic = new Logic(source, destination, sizes, directoryTemplate, fileTemplate);
        
        const __this = this;
        logic.onDirectoryFound = (lEventArgs) => { __this.logic_onDirectoryFound(lEventArgs); };
        logic.onFileFound = (lEventArgs) => { __this.logic_onFileFound(lEventArgs); };
        logic.onResized = (lEventArgs) => { __this.logic_onResized(lEventArgs); };

        await logic.run();
    }

    logic_onDirectoryFound(pEventArgs) {
        this.console.writeLine(`[${pEventArgs.directoryPath}]`, pEventArgs.indentation);
    }

    logic_onFileFound(pEventArgs) {
        this.console.writeLine(pEventArgs.fileName, pEventArgs.indentation + 1);
    }

    logic_onResized(pEventArgs) {
        this.console.writeLine(`${pEventArgs.imageInformation.width}x${pEventArgs.imageInformation.height} => ${pEventArgs.destinationFilePath}`, pEventArgs.iIndentation + 2);        
    }
}
