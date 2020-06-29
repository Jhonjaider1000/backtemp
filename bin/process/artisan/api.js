/**
 * @author John Vanegas
 * @email jhonjaider100015@gmail.com
 */
import DB from "../../src/app/Database/DBSql";
import { DATABASES, DEFAULT } from "../../config/database";
const fs = require("fs");
const { get: getProp } = require("object-path");

const DATABASE_QUERIES = {
  [DATABASES.MYSQL]: {
    SHOW_TABLES: "SHOW TABLES",
    LIST_COLUMNS: "LIST COLUMNS",
  },
  [DATABASES.POSTGREST]: {
    SHOW_TABLES: `SELECT *
                    FROM
                      pg_catalog.pg_tables
                    WHERE
                      schemaname != 'pg_catalog'
                    AND schemaname != 'information_schema';`,
  },
  LIST_COLUMNS: `SELECT *
                  FROM information_schema.columns
                  WHERE table_schema = '${DEFAULT.database}'
                  AND table_name   = '%tablename%'`,
};

const api = {
  args: [],
  connection: DB.getConnection(),
  getTables: (callback) => {
    let tables = [];
    api.connection
      .raw("SHOW TABLES")
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          tables = rows[0].map((table) => {
            const tableName = Object.keys(table)[0];
            return table[tableName];
          });
        }
      })
      .finally(() => callback(tables));
  },
  getColums: (table, callback) => {
    const query = `SHOW COLUMNS FROM ${table}`;
    let columns = [];
    api.connection
      .raw(query)
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          columns = rows;
        }
      })
      .finally(() => {
        callback(columns);
      });
  },
  getNameModel(table) {
    var re = /(\b[a-z](?!\s))/g;
    var s = table.replace(/\_/g, " ");
    s = s
      .replace(re, function (x) {
        return x.toUpperCase();
      })
      .replace(/\s+/g, "");
    return s;
  },
  getFields: (columns) => {
    const fields = columns
      .map((col) => {
        return `this.${getProp(col, "Field")} = null;`;
      })
      .join("\n        ");
    return fields;
  },
  getPrimaryKey: (columns) => {
    const primaryColumn = columns.find((column) => {
      return getProp(column, "Key") === "PRI";
    });
    return getProp(primaryColumn, "Field", "unapply");
  },
  generateModel: (table) => {
    api.getColums(table, (columns) => {
      let contents = fs
        .readFileSync("./bin/process/artisan/sources/Model.js")
        .toString();
      const entityName = api.getNameModel(table) + "Model";
      columns = columns[0];
      contents = contents
        .replace(new RegExp("ModelName", "g"), entityName)
        .replace("table_name", table)
        .replace("primary_key_name", api.getPrimaryKey(columns))
        .replace("{Fields}", api.getFields(columns));

      const fileExport = `./bin/src/app/Models/${entityName}.js`;
      fs.writeFileSync(fileExport, contents);
      api.printSucces(
        `✅  Se ha escrito correctamente tu módelo ${entityName} en:  ${fileExport}\n`
      );
      api.end();
    });
  },
  end: () => {
    api.index++;
    if (api.index == api.limit) {
      process.exit(0);
    }
  },
  generateModels: (tag) => {
    if (tag === "--all") {
      api.getTables((tables) => {
        api.index = 0;
        api.limit = tables.length;
        tables.forEach((table) => {
          api.generateModel(table);
        });
      });
    } else {
      api.index = 0;
      api.limit = 1;
      api.generateModel(tag);
    }
  },
  commandController: (args) => {
    api.args = args;
    let command = args[2],
      tag = null;
    if (args.length >= 4) {
      tag = args[3];
    }
    api.processCommand(command, tag);
  },
  processCommand: (command, tag) => {
    switch (command) {
      case "make:model":
        api.generateModels(tag);
        break;
      default:
        api.printError(`El comando ${command} no existe.`, api.args);
        break;
    }
  },
  printInfo: (message) => {
    console.log("\x1b[37m%s\x1b[0m", message);
  },
  printSucces: (message) => {
    console.log("\x1b[32m%s\x1b[0m", message);
  },
  printError: (message, args) => {
    console.log("\x1b[41m%s\x1b[0m", message, args);
  },
};
module.exports = api;
