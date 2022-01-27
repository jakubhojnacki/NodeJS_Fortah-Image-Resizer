/**
 * @module "Sizes" class
 * @description Keeps a collection of sizes
 * @version 0.0.1 (2021-08-13)
 */

import "../general/javaScript.js";
import Size from "./size.js";

export default class Sizes extends Array {
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
}