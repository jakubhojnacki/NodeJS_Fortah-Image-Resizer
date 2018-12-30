module.exports = class Settings {
  get ImageMagickConvertPath() {
    return this.mImageMagickConvertPath;
  }
  set ImageMagickConvertPath(pValue) {
    this.mImageMagickConvertPath = pValue;
  }
  
  get Directory() {
    return this.mDirectory;
  }
  set Directory(pValue) {
    this.mDirectory = pValue;
  }

  get FileExtensions() {
    return this.mFileExtensions;
  }
  set FileExtensions(pValue) {
    this.mFileExtensions = pValue;
  }

  get Width() {
    return this.mWidth;
  }
  set Width(pValue) {
    this.mWidth = pValue;
  }

  get Height() {
    return this.mHeight;
  }
  set Height(pValue) {
    this.mHeight = pValue;
  }

  constructor() {
    this.mImageMagickConvertPath = '';
    this.mDirectory = '';
    this.mFileExtensions = [];
    this.mWidth = 0;
    this.mHeight = 0;
  }

  static Deserialise(pData) {
    let NewSettings = new Settings();
    NewSettings.ImageMagickConvertPath = pData.ImageMagickConvertPath;
    NewSettings.Directory = pData.Directory;
    NewSettings.FileExtensions = Settings.ProcessFileExtensions(pData.FileExtensions);
    NewSettings.Width = pData.Width;
    NewSettings.Height = pData.Height;
    return NewSettings;
  }

  static ProcessFileExtensions(pFileExtensions) {
    var FileExtensions = [];
    for(var Index = 0; Index < pFileExtensions.length; Index++)
      FileExtensions.push(pFileExtensions[Index].trim().toLowerCase());
    return FileExtensions;
  }
}