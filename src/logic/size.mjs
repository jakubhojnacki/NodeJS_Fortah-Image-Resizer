/**
 * @module "Size" class
 * @description Keeps information about one image size
 * @example scale%            | Height and width both scaled by specified percentage.
 * @example scale-x%xscale-y% | Height and width individually scaled by specified percentages. (Only one % symbol needed.)
 * @example width             | Width given, height automatically selected to preserve aspect ratio.
 * @example xheight           | Height given, width automatically selected to preserve aspect ratio.
 * @example widthxheight      | Maximum values of height and width given, aspect ratio preserved.
 * @example widthxheight!     | Width and height emphatically given, original aspect ratio ignored.    
 */

export class Size {
    get width() { return this.mWidth; }
    set width(pValue) { this.mWidth = Number.verifyAsInteger(pValue); }
    get height() { return this.mHeight; }
    set height(pValue) { this.mHeight = Number.verifyAsInteger(pValue); }
    get ignoreAspectRatio() { return this.mIgnoreAspectRatio; }
    set ignoreAspectRatio(pValue) { this.mIgnoreAspectRatio = Boolean.verify(pValue); }

    constructor(pWidth, pHeight, pIgnoreAspectRatio) {
        this.width = pWidth;
        this.height = pHeight;
        this.ignoreAspectRatio = pIgnoreAspectRatio;
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
        else
            height = width;
        const size = new Size(width, height, ignoreAspectRatio);
        return size;
    }

    validate(pValidator) {
        pValidator.setComponent(Size.name);
        if (this.width <= 0)
            pValidator.addError("Width", "must be greater than zero");
        if (this.height <= 0)
            pValidator.addError("Height", "must be greater than zero");
        pValidator.restoreComponent();
    }
}