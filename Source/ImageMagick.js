const child_process = require('child_process');

module.exports = class ImageMagick {
  get Script() {
    return this.mScript;
  }

  constructor(pScript) {
    this.mScript = pScript;
  }

  Resize(pFilePath, pWidth, pHeight) {
    const MaxDimension = Math.max(pWidth, pHeight);
    this.Convert(pFilePath, ['-resize', `${MaxDimension}x${MaxDimension}`]);
    this.Convert(pFilePath, ['-gravity', 'North', '-extent', `${pWidth}x${pHeight}`]);
  }

  Convert(pFilePath, pCustomArguments) {
    var FilePath = `"${pFilePath}"`;
    var Arguments = [].concat(FilePath, pCustomArguments, FilePath);
    child_process.execFileSync(this.Script.Settings.ImageMagickConvertPath, Arguments, {windowsHide: true});
  }
}