module.exports = class Console {
  get Width() {
    return this.mWidth;
  }
  set Width(pValue) {
    this.mWidth = pValue;
  }

  constructor(pWidth) {
    this.mWidth = pWidth;
  }

  WriteLine(pText) {
    console.log(pText)
  }

  WriteSeparator() {
    console.log('-'.repeat(this.Width));
  }
}