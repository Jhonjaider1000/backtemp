import { config } from "../src/app/Utils/Utils";
import { del as delProp } from "object-path";

export const TYPE_DATABA = {
  POSTGREST: "pg",
  MONGO: "mongo",
  MYSQL: "mysql",
};

export const POSTGREST = {
  driver: TYPE_DATABA.POSTGREST,
  host: "",
  port: "",
  user: "",
  database: "",
  password: "",
};

export const MONGO = {
  driver: TYPE_DATABA.MONGO,
  host: "",
  port: "",
  user: "",
  database: "",
  password: "",
};

export const MYSQL = {
  driver: TYPE_DATABA.MYSQL,
  host: "localhost",
  port: "3306",
  user: "root",
  database: "dbprueb2",
  password: "",
};

//Aquí es donde deberíamos configurar la base de datos seleccionada por defecto.
console.log("config", config.database.driver);
const configuration = config.database;
export const DEFAULT = configuration;
