import { DEFAULT, MYSQL } from "../../../config/database";
import knexLib from "knex";
let configDB = DEFAULT;
const driver = configDB.client;
delete configDB.driver;

class DB {
  constructor() {
    this.knex = null;
  }

  connect() {
    //Creamos una conexión temporal para verificar si existe la bd...
    const config = {
      client: driver,
      connection: configDB,
      useNullAsDefault: true,
    };
    this.knex = knexLib(config);
    // this.createDatabase();
    return this.knex;
  }

  getInstance() {
    if (!this.knex) {
      this.connect();
      this.testConnection();
      return this;
    }
    return this;
  }

  testConnection() {
    return this.knex
      .raw("select 1+1 as result")
      .then((result) => {
        console.log("conexion exitosa DB!");
      })
      .catch((err) => {
        console.log(err, "este es un error");
      });
  }

  getConnection() {
    this.getInstance();
    let limit = 1000;
    while (this.knex == null && limit >= 0) {
      limit--;
    }
    return this.knex;
  }
}

export default new DB().getInstance();
