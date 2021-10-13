/**
 * @module "Application" class
 * @description Represents the main application class
 */

import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { ConsoleApplication } from "console-library";
import { Logic } from "../logic/logic.mjs";

export class Application extends ConsoleApplication {
    constructor() {
        super();
        this.argTemplates = ( new ArgTemplateFactory()).create();
    }

    async runLogic() {
        const source = this.args.get(ArgName.source);
        const destination = this.args.get(ArgName.destination);
        const sizes = this.args.get(ArgName.sizes);
        const directoryTemplate = this.args.get(ArgName.directoryTemplate, "");
        const fileTemplate = this.args.get(ArgName.fileTemplate, "");
        
        const logic = new Logic(source, destination, sizes, directoryTemplate, fileTemplate);
        const __this = this;
        logic.onDirectoryFound = (lDirectory) => { __this.logic_onDirectoryFound(lDirectory); };
        logic.onFileFound = (lFile) => { __this.logic_onFileFound(lFile); };
        logic.onResized = (lImageInformation, lFile) => { __this.logic_onResized(lImageInformation, lFile); };
        await logic.run();
    }

    logic_onDirectoryFound(pDirectory) {
        this.console.writeLine(`[${pDirectory.path}]`, pDirectory.indentation); 
    }

    logic_onFileFound(pFile) {
        this.console.writeLine(pFile.name, pFile.indentation); 
    }

    logic_onResized(pImageInformation, pFile) {
        this.console.writeLine(`${pImageInformation.width}x${pImageInformation.height} => ${pFile.path}`, pFile.indentation); 
    }
}
