const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = class Resizer {
  get Script() {
    return this.mScript;
  }

  get FileMask() {
    return this.mFileMask;
  }
  set FileMask(pValue) {
    this.mFileMask = pValue;
  }

  constructor(pScript) {
    this.mScript = pScript;
    this.mFileMask = '';
  }

  async Run() {
    this.FileMask = this.Script.Settings.FileMask;
    await this.ProcessDirectory(this.Script.Settings.Directory, 0);
  }

  async ProcessDirectory(pDirectoryPath, pLevel) {
    this.Script.Console.WriteIndentedLine(pLevel, `[${pDirectoryPath}]`);
    const Files = fs.readdirSync(pDirectoryPath);
    for (const File of Files) {
      const FilePath = pDirectoryPath + '/' + File;
      if (fs.statSync(FilePath).isDirectory())
        await this.ProcessDirectory(FilePath, pLevel + 2);
      else
        if (this.IsFileInFilter(FilePath))
          await this.ProcessFile(FilePath, pLevel + 2);
    };
  }

  IsFileInFilter(pFilePath) {
    let Result = false;
    let FileExtension = path.extname(pFilePath).trim().toLowerCase();
    if (FileExtension.length > 0) {
      if (FileExtension.startsWith('.'))
        FileExtension = FileExtension.substr('.'.length);
      if (FileExtension.length > 0)
        Result = this.Script.Settings.FileExtensions.includes(FileExtension);
    }
    return Result;
  }

  async ProcessFile(pFilePath, pLevel) {
    const PathInfo = path.parse(pFilePath);
    const TargetFilePath = path.join(PathInfo.dir, PathInfo.name + '.tmp' + PathInfo.ext);
    const Image = sharp(pFilePath);
    await Image.resize(this.Script.Settings.Width, this.Script.Settings.Height, { fit: 'cover', gravity: sharp.gravity.north }).toFile(TargetFilePath);
    await fs.unlinkSync(pFilePath);
    await fs.renameSync(TargetFilePath, pFilePath);
    this.Script.Console.WriteIndentedLine(pLevel, PathInfo.base);
  }
}