/**
 * @module "CountEventArgs" class
 * @description Event arguments for count event
 */

"use strict";

export class CountEventArgs {
    get count() { return this.mCount; }
    set count(pValue) { this.mCount = Number.verifyAsInteger(pValue); }

    constructor(pCount) {
        this.count = pCount;
    }
}