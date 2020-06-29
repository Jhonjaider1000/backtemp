import { getApp } from "../../app";
import Server from "../../bin/www";
class Runtime {
  constructor(AppConfig, DatabaseConfig) {
    this.AppConfig = AppConfig;
    this.DatabaseConfig = DatabaseConfig;
  }

  setAppConfig(config) {
    this.config = config;
  }

  setDatabaseConfig(config) {
    this.DatabaseConfig = config;
  }

  start() {
    const app = getApp();
    Server.listen(this.AppConfig.port, app);
  }
}

export default Runtime;
