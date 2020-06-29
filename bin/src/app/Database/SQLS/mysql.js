import { config } from "../../Utils/Utils";

export default {
  CREATE_DATABASE: (databaseName) => {
    return `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
  },
  EXIST_TABLE: (tableName) => {
    return `(SELECT count(*) as \`exists\` FROM information_schema.tables WHERE table_schema = '${config.database.database}' AND table_name = '${tableName}')`;
  },
  CREATE_TABLE: (tableName) => {
    return `CREATE TABLE \`${tableName}\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (\`id\`)
    )
    ENGINE=InnoDB
    AUTO_INCREMENT=1
    ;
    `;
  },
  GET_COLUMNS: (tableName) => {
    return `SHOW COLUMNS FROM ${tableName}`;
  },
  GET_PRIMARY_KEY: (tableName) => {
    return `SHOW COLUMNS FROM ${tableName} WHERE \`Key\` = 'PRI';`;
  },
  ALTER_ADD_COLUM: (tableName, lastField, column, type) => {
    return `ALTER TABLE \`${tableName}\`
              ADD COLUMN \`${column}\` ${type} NULL DEFAULT NULL`;
  },
};
