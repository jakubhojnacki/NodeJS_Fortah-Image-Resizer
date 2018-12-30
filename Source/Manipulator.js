const fs = require('fs');
const path = require('path');
const ImageMagick = require('./ImageMagick');

module.exports = class Manipulator {
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
    const DirectoryName = path.basename(pDirectoryPath);
    this.Script.Console.WriteLine(' '.repeat(pLevel) + `[${DirectoryName}]`);
    const Files = fs.readdirSync(pDirectoryPath);
    Files.forEach(File => {
      const FilePath = pDirectoryPath + '/' + File;
      if (fs.statSync(FilePath).isDirectory())
        this.ProcessDirectory(FilePath, pLevel + 2);
      else
        if (this.IsFileInFilter(FilePath))
          this.ProcessFile(FilePath, pLevel + 2);
    });
  }

  IsFileInFilter(pFilePath) {
    var Result = false;
    var FileExtension = path.extname(pFilePath).trim().toLowerCase();
    if (FileExtension.length > 0) {
      if (FileExtension.startsWith('.'))
        FileExtension = FileExtension.substr('.'.length);
      if (FileExtension.length > 0)
        Result = this.Script.Settings.FileExtensions.includes(FileExtension);
    }
    return Result;
  }

  ProcessFile(pFilePath, pLevel) {
    const FileName = path.basename(pFilePath);
    this.Script.Console.WriteLine(' '.repeat(pLevel) + `${FileName}`);
    const TheImageMagick = new ImageMagick(this.Script);
    TheImageMagick.Resize(pFilePath, this.Script.Settings.Width, this.Script.Settings.Height);
  }
}