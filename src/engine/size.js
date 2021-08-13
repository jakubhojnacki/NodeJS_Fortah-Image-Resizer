/**
 * @module "Size" class
 * @description Keeps information about one image size
 * @version 0.0.1 (2021-08-13)
 * @example scale%            | Height and width both scaled by specified percentage.
 * @example scale-x%xscale-y% | Height and width individually scaled by specified percentages. (Only one % symbol needed.)
 * @example width             | Width given, height automagically selected to preserve aspect ratio.
 * @example xheight           | Height given, width automagically selected to preserve aspect ratio.
 * @example widthxheight      | Maximum values of height and width given, aspect ratio preserved.
 * @example widthxheight!     | Width and height emphatically given, original aspect ratio ignored.    
 */

import "../general/javaScript";


export default class Size {
    get width() { return this.mWidth; }
    get height() { return this.mHeight; }
    get ignoreAspectRatio() { return this.mIgnoreAspectRatio; }

    constructor(pWidth, pHeight, pIgnoreAspectRatio) {
        this.mWidth = String.default(pWidth);
        this.mHeight = String.default(pHeight);
        this.mIgnoreAspectRatio = Boolean.default(pIgnoreAspectRatio);
    }

    static parse(pText) {
        let width = "";
        let height = "";
        let ignoreAspectRatio = false;
        pText = pText.trim().toLowerCase();
        if (pText.endsWith("!")) {
            ignoreAspectRatio = true;
            pText = pText.substr(0, pText.length - 1);
        }
        const textParts = pText.split("x");
        width = textParts[0];
        if (textParts.length > 1)
            height = textParts[1];
        const size = new Size(width, height, ignoreAspectRatio);
        return size;
    }
}