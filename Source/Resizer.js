const fs = require('fs');
const path = require('path');
const gm = require('gm');

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

  Run() {
    this.FileMask = this.Script.Settings.FileMask;
    this.ProcessDirectory(this.Script.Settings.Directory, 0);
  }

  ProcessDirectory(pDirectoryPath, pLevel) {
    const Files = fs.readdirSync(pDirectoryPath);
    for (const File of Files) {
      const FilePath = pDirectoryPath + '/' + File;
      if (fs.statSync(FilePath).isDirectory())
        this.ProcessDirectory(FilePath, pLevel + 2);
      else
        if (this.IsFileInFilter(FilePath))
          this.ProcessFile(FilePath, pLevel + 2);
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

  ProcessFile(pFilePath, pLevel) {
    let ImageSize = null;
    gm(pFilePath)
      .size((Error, Size) => { this.ResizeFile(pFilePath, pLevel, Size, Error); });
  }

  ResizeFile(pFilePath, pLevel, pImageSize, pError) {
    if (!pError) {
      const ResizeWidth = pImageSize.width >= pImageSize.height ? this.Script.Settings.Width : null;
      const ResizeHeight = pImageSize.width < pImageSize.height ? this.Script.Settings.Height : null;
      gm(pFilePath)
        .resize(ResizeWidth, ResizeHeight)
        .crop(this.Script.Settings.Width, this.Script.Settings.Height, 0, 0)
        .write(pFilePath, (Error) => { this.FileProcessed(pFilePath, pLevel, Error); });
    } else
      throw pError;
  }

  FileProcessed(pFilePath, pLevel, pError) {
    if (!pError)
      this.Script.Console.WriteLine(`${pFilePath}`);
    else
      throw pError;
  }
}