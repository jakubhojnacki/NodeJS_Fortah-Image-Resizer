/**
 * @module "ImageMagick" class
 * @description Class wrapping ImageMagick functionality
 * @version 0.0.2 (2021-08-12)
 */

import "../general/javaScript.js";
import ImageMagickEngine from "imagemagick";
import ImageInformation from "./imageInformation.js";

export default class ImageMagick {
    constructor() {
    }
	
    async split(pSourcePath, pDestinationDirectoryPath, pDestinationFileType) {
        await this.convert([pSourcePath, `${pDestinationDirectoryPath}/%02d.${pDestinationFileType}`]);
	}    

    async resize(pSourcePath, pDestinationPath, pWidth, pHeight, pIgnoreAspectRatio) {
        let sizeArgument = pWidth;
        if (pHeight)
            sizeArgument = `${sizeArgument}x${pHeight}`;
        if (pIgnoreAspectRatio)
            sizeArgument = `${sizeArgument}!`;
        await this.convert([pSourcePath, "-resize", sizeArgument, pDestinationPath]);
    }

	convert(pParameters) {
		return new Promise((lResolve, lReject) => {
			ImageMagickEngine.convert(pParameters, (lError, lStdOut) => {
				if (lError)
					lReject();
				lResolve(lStdOut);
			});
		});
	}    

	async getInformation(pImageFilePath) {
        const data = await this.identify(pImageFilePath);
        return ImageInformation.parse(data);
	}

	identify(pImageFilePath) {
		return new Promise((lResolve, lReject) => {
			ImageMagickEngine.identify(pImageFilePath, (lError, lImageData) => {
				if (lError)
					lReject();
				lResolve(lImageData);
			});
		});
	}
}
