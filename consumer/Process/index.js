import { ValidatorInstance } from "./Validator";
import Runtime from "./Runtime";

class Process {
  constructor(AppConfig, DatabaseConfig) {
    this.AppConfig = AppConfig;
    this.DatabaseConfig = DatabaseConfig;
    this.Runtime = new Runtime(AppConfig, DatabaseConfig);
  }

  validateAppConfig() {
    if (!this.AppConfig) {
      return false;
    }
    //Validamos los campos requeridos...
    ValidatorInstance.numeric("server.port", this.AppConfig.port);
    ValidatorInstance.required(
      "server.request.type",
      this.AppConfig.requestType
    );
    if (ValidatorInstance.fails()) {
      throw new Error(ValidatorInstance.getErrors().join("\n"));
    }
    return true;
  }

  validateDatabaseConfig() {
    if (!this.DatabaseConfig) {
      return false;
    }
    ValidatorInstance.required("database.host", this.DatabaseConfig.host);
    ValidatorInstance.numeric("database.port", this.DatabaseConfig.port);
    ValidatorInstance.required(
      "database.username",
      this.DatabaseConfig.username
    );

    if (ValidatorInstance.fails()) {
      throw new Error(ValidatorInstance.getErrors().join("\n"));
    }
    return true;
    //Si el usuario usa tunel, validamos las credenciales...
  }

  validateConfigs() {
    if (!this.validateAppConfig()) {
      throw new Error("La configuración de App está vacia.");
    }
    if (!this.validateDatabaseConfig()) {
      throw new Error("La configuración de Database está vacia.");
    }
    //Si todo sale bien arrancamos el proyecto con los componentes necesarios...
    this.Runtime.start();
  }

  start() {
    this.validateConfigs();
  }
}
export default Process;
