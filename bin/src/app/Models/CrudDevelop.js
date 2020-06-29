import { config, QUERIES } from "../../app/Utils/Utils";
import { get as getProp, del as delProp } from "object-path";

class CrudDevelop {
  constructor() {}

  execFunctions(obj, key, value) {
    if (value == "date()") {
      value = new Date();
      obj[key] = value;
    }
  }

  parseObject(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];
        const parts = key.split(":");
        this.execFunctions(obj, key, value);
        if (parts.length > 1) {
          delProp(obj, key);
          obj[parts[0]] = value;
        }
      }
    }
    return obj;
  }

  detectType(key, data) {
    //Hacemos un split para detectar si el usuario ha seleccionado un tipo de dato...
    const parts = key.split(":");
    let type = "VARCHAR(50)";
    if (parts.length == 2) {
      type = parts[1];
      return { name: parts[0], type: type };
    }
    const size = data.length < 50 ? 50 : data.length;
    if (typeof data == "string" && data != "now()") {
      //Detectamos el tamaño del varchar...
      type = `VARCHAR(${size})`;
    }
    if (typeof data == "number") {
      type = "BIGINT";
    }
    if (typeof data == "boolean") {
      type = "SMALLINT";
    }
    if (data == "date()") {
      type = "TIMESTAMP";
    }
    return { name: parts[0], type: type };
  }

  createFields(tableName, fields, lastField) {
    return new Promise((resolve, reject) => {
      if (fields.length == 0) {
        resolve(true);
      }
      fields.forEach(async (field, index) => {
        try {
          const sql = QUERIES.ALTER_ADD_COLUM(
            tableName,
            lastField,
            field.name,
            field.type
          );
          await this.conection.getConnection().raw(sql);
          lastField = field;
          if (index == fields.length - 1) {
            resolve(true);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  existTable() {
    return new Promise((resolve, reject) => {
      const sql = QUERIES.EXIST_TABLE(this.table);
      this.conection
        .getConnection()
        .raw(sql)
        .catch((error) => {
          reject(error);
          throw error;
        })
        .then((rows) => {
          let result = rows[0];
          if (Array.isArray(result) && result.length > 0) {
            result = result[0];
            resolve(result.exists);
          } else {
            reject(reject);
            throw new Error(
              "Error al verificar si existe la tabla al ejecutar la consulta.",
              sql
            );
          }
        });
    });
  }

  getPrimaryId() {
    return new Promise((resolve, reject) => {
      const sql = QUERIES.GET_PRIMARY_KEY(this.table);
      this.conection
        .getConnection()
        .raw(sql)
        .then((result) => {
          if (result.length > 0) {
            result = result[0];
            result = result[0].Field;
          }
          resolve(result);
        })
        .catch(reject);
    });
  }

  verifyTableForQuery(query) {
    return new Promise((resolve, reject) => {
      //Comprobamos si existe la tabla...
      this.existTable().then((exist) => {
        if (exist == 0) {
          //Creamos la tabla...
          this.createTable()
            .then((created) => {
              query.then(resolve).catch((error) => {
                reject(error);
              });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          //Ejecutamos la consulta...
          return query
            .catch((error) => {
              reject(error);
            })
            .then(resolve);
        }
      });
    });
  }

  verifyFieldsForUpdates(promise, obj) {
    return new Promise((resolve, reject) => {
      this.getColumns()
        .then((rows) => {
          const newFields = [];
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const data = obj[key];
              const existField = rows.findIndex(
                (field) => field.Field == key.split(":")[0]
              );
              if (existField < 0) {
                newFields.push(this.detectType(key, data));
              }
            }
          }
          //Creamos los fields...
          console.log("new fiedas", newFields);
          this.createFields(this.table, newFields, rows.pop())
            .then((rows) => {
              promise
                .then((rowsInserted) => {
                  resolve(rowsInserted);
                })
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  verifyTableForUpdates(promise, obj) {
    return new Promise((resolve, reject) => {
      const task = () => {
        this.verifyFieldsForUpdates(promise, obj)
          .then((rowsInserted) => {
            resolve(rowsInserted);
          })
          .catch(reject);
      };

      //Comprobamos si existe la tabla...
      this.existTable().then((exist) => {
        if (exist == 0) {
          //Creamos la tabla...
          this.createTable()
            .then((created) => {
              task();
            })
            .catch(reject);
        } else {
          task();
        }
      });
    });
  }

  createTable() {
    return new Promise((resolve, reject) => {
      const sql = QUERIES.CREATE_TABLE(this.table);
      this.conection
        .getConnection()
        .raw(sql)
        .then((rows) => {
          resolve(rows);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getColumns() {
    return new Promise((resolve, reject) => {
      const sql = QUERIES.GET_COLUMNS(this.table);
      this.conection
        .getConnection()
        .raw(sql)
        .then((rows = []) => {
          if (rows.length > 0) {
            rows = rows[0];
          }
          resolve(rows);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default CrudDevelop;
