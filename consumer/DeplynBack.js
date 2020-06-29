import Process from "./Process";

class DeplynBack {
  constructor() {}

  initApp(config) {
    this.appConfig = config;
  }

  initDatabase(config) {
    this.databaseConfig = config;
  }

  start() {
    const process = new Process(this.appConfig, this.databaseConfig);
    process.start();
  }
}

export default DeplynBack;
export const DeplynBackInstance = new DeplynBack();
