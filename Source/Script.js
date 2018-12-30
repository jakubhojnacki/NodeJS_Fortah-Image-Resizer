const Info = require('./Info');
const InfoData = require('../package.json');
const Settings = require('./Settings');
const SettingsData = require('../Settings.json');
const Console = require('./Console');
const Resizer = require('./Resizer');

module.exports = class Script {
  get Info() {
    return this.mInfo;
  }
  
  get Settings() {
    return this.mSettings;
  }

  get Console() {
    return this.mConsole;
  }

  constructor() {
    this.mInfo = Info.Deserialise(InfoData);
    this.mSettings = Settings.Deserialise(SettingsData);
    this.mConsole = new Console(80);
  }

  Run() {
    this.InitialiseScreen();
    let TheResizer = new Resizer(this);
    TheResizer.Run();
  }

  InitialiseScreen() {
    this.Console.WriteLine(`${this.Info.Name} ${this.Info.Version} by ${this.Info.Author}`);
    this.Console.WriteLine(`${this.Info.Description}`);
    this.Console.WriteSeparator();    
  }
}
