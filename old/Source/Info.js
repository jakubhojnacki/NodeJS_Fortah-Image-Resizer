module.exports = class Info {
  get Name() {
    return this.mName;
  }
  set Name(pValue) {
    this.mName = pValue;
  }

  get Description() {
    return this.mDescription;
  }
  set Description(pValue) {
    this.mDescription = pValue;
  }

  get Version() {
    return this.mVersion;
  }
  set Version(pValue) {
    this.mVersion = pValue;
  }

  get Author() {
    return this.mAuthor;
  }
  set Author(pValue) {
    this.mAuthor = pValue;
  }

  constructor() {
    this.mName = '';
    this.mDescription = '';
    this.mVersion = '';
    this.mAuthor = '';
  }

  static Deserialise(pData) {
    let NewInfo = new Info();
    NewInfo.Name = pData.displayName;
    NewInfo.Description = pData.description;
    NewInfo.Version = pData.version;
    NewInfo.Author = pData.author;
    return NewInfo;
  }
}