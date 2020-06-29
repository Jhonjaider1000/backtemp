import { DEFAULT } from "../../bin/config/database";
import knexLib from "knex";
let configDB = DEFAULT;
const driver = configDB.client;
import PackQueries, { MYSQL_QUERIES } from "../../bin/src/app/Database/SQLS";
const QUERIES = MYSQL_QUERIES;

class Database {
  constructor() {}
  setDriver(driver) {
    this.driver = driver;
  }
  setHost(host) {
    this.host = host;
  }
  setPort(port) {
    this.port = port;
  }
  setUsername(username) {
    this.username = username;
  }
  setPassword(password) {
    this.password = password;
  }
  useTunnel(flag) {
    this.useTunnel = flag;
  }

  createDatabaseIfNotExist() {
    const config = {
      client: driver,
      connection: {
        driver: configDB.driver,
        host: configDB.host,
        port: configDB.port,
        user: configDB.user,
        password: configDB.password,
      },
      useNullAsDefault: true,
    };
    const temp = knexLib(config);
    return temp.raw(QUERIES.CREATE_DATABASE(configDB.database));
  }
}
export default Database;
export const DatabaseInstance = new Database();
