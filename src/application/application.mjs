/**
 * @module "Application" class
 * @description Represents the main application class
 */

import { ConsoleApplication } from "fortah-console-library";
import { ConsoleProgress } from "fortah-console-library";
import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { Logic } from "../logic/logic.mjs";
import { LogicArgs } from "../logic/logicArgs.mjs";

export class Application extends ConsoleApplication {
    get progress() { return this.mProgress; }
    set progress(pValue) { this.mProgress = pValue; }

    constructor(pRootDirectoryPath) {
        super(pRootDirectoryPath, (new ArgTemplateFactory()).create());
        this.progress = null;        
    }

    async runLogic() {
        const logicArgs = new LogicArgs(this.args);
        this.console.writeLine(logicArgs.toString(this.console.tab));

        const logic = new Logic(this, logicArgs);
        
        const __this = this;
        logic.onCount = (lEventArgs) => { __this.onLogicCount(lEventArgs); }
        logic.onDirectoryFound = (lEventArgs) => { __this.onLogicDirectoryFound(lEventArgs); };
        logic.onFileFound = (lEventArgs) => { __this.onLogicFileFound(lEventArgs); };
        logic.onResized = (lEventArgs) => { __this.onLogicResized(lEventArgs); };

        await logic.run();
    }

    onLogicCount(pEventArgs) {
        if (!this.diagnostics.enabled) {
            const __this = this;
            this.progress = new ConsoleProgress(null, null, (lProgress) => { __this.onProgressUpdate(lProgress); }, "[", "#", "]", 20, this.console.width);
            this.progress.reset(pEventArgs.count, "Resizing...");
        }
    }

    onLogicDirectoryFound(pEventArgs) {
        const text = `[${pEventArgs.fileSystemItem.name}]`;
        if (this.diagnostics.enabled)
            this.console.writeLine(text, pEventArgs.indentation);
        else
            this.progress.move(0, text);
    }

    onLogicFileFound(pEventArgs) {
        const text = pEventArgs.fileSystemItem.name;
        if (this.diagnostics.enabled)
            this.console.writeLine(pEventArgs.fileName, pEventArgs.indentation + 1);
        else
            this.progress.move(1, text);
    }

    onLogicResized(pEventArgs) {
        const text = `${pEventArgs.imageInformation.width}x${pEventArgs.imageInformation.height} => ${pEventArgs.destinationFilePath}`;
        if (this.diagnostics.enabled)
            this.console.writeLine(text, pEventArgs.iIndentation + 2);
        else
            this.progress.move(0, text);
    }

    onProgressUpdate(pProgres) {
        pProgres.render(this.console);
    }    

    finalise() {
        this.console.writeLine();
        super.finalise();
    }
}
