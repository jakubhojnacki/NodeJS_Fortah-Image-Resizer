/**
 * @module "Sizes" class
 * @description Keeps a collection of sizes
 */

import { Size } from "../logic/size.mjs";

export class Sizes extends Array {
    constructor() {
        super();
    }

    static parse(pText) {
        const sizes = new Sizes();
        pText = pText.trim().toLowerCase();
        const textParts = pText.split(",");
        for (const text of textParts) {
            const size = Size.parse(text);
            sizes.push(size);
        }
        return sizes;
    }

    validate(pValidator) {
        for (const size of this)
            size.validate(pValidator);
    }
}