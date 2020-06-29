import DB from "../Database/DBSql";
import { config } from "../../app/Utils/Utils";
import CrudDevelop from "./CrudDevelop";

class Crud extends CrudDevelop {
  constructor(table) {
    super();
    this.table = table;
    this.conection = DB;
  }

  getArray(key) {
    let array = [];
    if (Array.isArray(this[key])) {
      array = this[key];
    }
    return array;
  }

  extractColumns() {
    let excludes = this.getArray("excludes");
    let columns = this.getArray("columns");
    if (excludes.length > 0) {
      columns = columns.filter((column) => {
        if (excludes.indexOf(column) >= 0) {
          return column;
        }
      });
    }
    return columns;
  }

  findById(id = null) {
    const promise = new Promise((resolve, reject) => {
      this.getPrimaryId()
        .then((primaryKey) => {
          this.conection
            .getConnection()
            .where(primaryKey, id)
            .from(this.table)
            .then((rows) => {
              if (Array.isArray(rows) && rows.length > 0) {
                resolve(rows[0]);
              } else {
                resolve(null);
              }
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        })
        .catch(reject);
    });

    if (!config.develop) {
      return promise;
    }

    return this.verifyTableForQuery(promise);
  }

  listAll() {
    //Procesamos los atributos excluidos...
    const columns = this.extractColumns();
    const query = this.conection
      .getConnection()
      .select(columns.length == 0 ? "*" : columns)
      .from(this.table);
    if (!config.develop) {
      return query;
    }
    return this.verifyTableForQuery(query);
  }

  query(sql = null) {
    let sentence = sql;
    if (sql == null || Array.isArray(sql)) {
      const run = this.conection.getConnection().from(this.table);
      return run;
    }
    return this.conection.getConnection().raw(sql);
  }

  insert(obj) {
    //Aquí deberíamos verificar las columnas...
    const promise = this.conection
      .getConnection()
      .insert(this.parseObject(obj))
      .table(this.table);
    if (config.develop) {
      return this.verifyTableForUpdates(promise, obj);
    }
    return promise;
  }

  update(obj, id) {
    const runUpdate = () => {
      const promise = new Promise((resolve, reject) => {
        this.getPrimaryId()
          .then((primaryKey) => {
            this.conection
              .getConnection()
              .where(primaryKey, id)
              .update(this.parseObject(obj))
              .table(this.table)
              .then((rows) => {
                if (rows > 0) {
                  resolve(rows);
                } else {
                  resolve(null);
                }
              })
              .catch((error) => {
                console.error(error);
                reject(error);
              });
          })
          .catch(reject);
      });
      return promise;
    };

    if (!config.develop) {
      return runUpdate();
    }

    return this.verifyTableForUpdates(runUpdate(), obj);
  }

  delete(id = null) {
    console.log(id);
    return new Promise((resolve, reject) => {
      this.getPrimaryId()
        .then((primaryKey) => {
          this.conection
            .getConnection()
            .where(primaryKey, id)
            .delete()
            .table(this.table)
            .then((rows) => {
              if (rows > 0) {
                resolve(rows);
              } else {
                resolve(null);
              }
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        })
        .catch(reject);
    });
  }
}

export default Crud;
