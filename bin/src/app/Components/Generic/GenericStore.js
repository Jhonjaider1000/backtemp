import Response from "../../Http/Router/Response";
import EMessages from "../../Constants/EMessages";
import Model from "../../Models/Model";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

const BEARER_PREFIX = "Bearer ";

const TYPE_WHERE = {
  AND: "AND",
  OR: "OR",
};

class GenericStore {
  index(httpReq, TableModel) {
    let wheres = httpReq.header("Array-Wheres");
    if (wheres) {
      wheres = JSON.parse(wheres);
      const refQuery = new Model(TableModel).query();
      wheres.forEach((where, index) => {
        if (where.type === TYPE_WHERE.AND) {
          refQuery.where(where.field, where.condition, where.value);
        } else if (where.type == TYPE_WHERE.OR) {
          refQuery.orWhere(where.field, where.condition, where.value);
        }
      });
      return this.resolve(refQuery);
    }
    return this.resolve(new Model(TableModel).listAll());
  }

  show(httpReq, TableModel) {
    const id = httpReq.params.id;
    return this.resolve(new Model(TableModel).findById(id));
  }

  findBy(httpReq, httpRes, TableModel) {
    const field = httpReq.params.field;
    const value = httpReq.params.value;
    TableModel.listAll()
      .where(field, value)
      .then((row) => {
        httpRes.json(new Response(EMessages.SUCCESS).setData(row));
      });
  }

  queryWhere(httpReq, httpRes, TableModel) {
    const field = httpReq.params.field;
    const value = httpReq.params.value;

    var operator = "=";
    if (httpReq.params.operator == "equal_to") operator = "=";
    if (httpReq.params.operator == "not_equal") operator = "!=";
    if (httpReq.params.operator == "greater_than") operator = ">";
    if (httpReq.params.operator == "less_than") operator = "<";
    if (httpReq.params.operator == "greater_than_or_equal_to") operator = ">=";
    if (httpReq.params.operator == "less_than_or_equal_to") operator = "<=";

    TableModel.listAll()
      .where(field, operator, value)
      .then((row) => {
        httpRes.json(new Response(EMessages.SUCCESS).setData(row));
      });
  }

  queryWheregetCount(httpReq, httpRes, TableModel) {
    const field = httpReq.params.field;
    const value = httpReq.params.value;

    var operator = "=";
    if (httpReq.params.operator == "equal_to") operator = "=";
    if (httpReq.params.operator == "not_equal") operator = "!=";
    if (httpReq.params.operator == "greater_than") operator = ">";
    if (httpReq.params.operator == "less_than") operator = "<";
    if (httpReq.params.operator == "greater_than_or_equal_to") operator = ">=";
    if (httpReq.params.operator == "less_than_or_equal_to") operator = "<=";

    TableModel.query()
      .count(TableModel.primaryKey + " AS numRows")
      .where(field, operator, value)
      .then((row) => {
        httpRes.json(new Response(EMessages.SUCCESS).setData(row));
      });
  }

  async execAction(action, eMessageCode, httpRes, TableModel) {
    const callback = this.getCallback(httpRes);
    let response;
    await action.then((rows) => {
      response = TableModel.getResponse(rows, eMessageCode).setData(rows);
    });
    this.execCallback(callback, response);
  }

  store(httpReq, TableModel) {
    const action = new Model(TableModel).insert(httpReq.body);
    return this.resolve(action, EMessages.INSERT);
  }

  update(httpReq, TableModel) {
    const id = httpReq.params.id;
    const action = new Model(TableModel).update(httpReq.body, id);
    return this.resolve(action, EMessages.UPDATE);
  }

  delete(httpReq, TableModel) {
    const id = httpReq.params.id;
    const action = new Model(TableModel).delete(id);
    return this.resolve(action, EMessages.DELETE);
  }

  /**
   * Comrpueba si un callback es una función y la ejecuta, también recibe parámetros que enviará al callback ejecutado.
   * @param {function} callback
   * @param {Object} data
   */
  execCallback(callback, data = null) {
    if (typeof callback === "function") {
      callback(data);
    } else if (typeof callback === "object") {
      callback.exected++;
      if (callback.tasks.length == callback.exected) {
      }
    }
  }

  writeResponse(response, httpRes) {
    if (!response) {
      response = new Response(EMessages.ERROR_ACTION);
    }
    httpRes.json(response);
  }

  getCallback(httpRes) {
    return (response) => this.writeResponse(response, httpRes);
  }

  getMultiCallback(httpRes) {
    return {
      exected: 0,
      tasks: [],
      httpRes: httpRes,
      add: (any) => {
        tasks.push(1);
      },
    };
  }

  processRecordResponse(callback, EMessageCode = EMessages.UPDATE) {
    return (rows) => {
      const response = Model.getResponse(rows, EMessageCode);
      if (response.code > 0) {
        //Obtiene el id insertado para obtener el id del customer..
        const idRecord = rows[0];
        response.setData(idRecord);
      }
      this.execCallback(callback, response);
    };
  }

  normaliceObjects(object, keys = []) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const element = object[key];
        if (
          Array.isArray(element) &&
          element.length == 1 &&
          !keys.includes(key)
        ) {
          object[key] = element[0];
        }
      }
    }
  }

  getObtionsJWT() {
    const i = "daFlores.com"; //Issuer
    const s = "contacto@daflores.com"; //Subject
    const a = "http://daflores.com"; //Audience
    const options = {
      issuer: i,
      subject: s,
      audience: a,
      expiresIn: "12h",
      algorithm: "RS256",
    };
    return options;
  }

  profile(httpReq, httpRes = null) {
    const pathPublicKey = path.resolve("bin", "src", "keys", "public.key");
    const publicKey = fs.readFileSync(pathPublicKey);
    let token = httpReq.header("Authorization");
    if (!token || token.trim() == "") {
      return new Response(
        EMessages.ERROR,
        "No tiene permisos para solicitar esta acción."
      );
    }
    try {
      token = token.replace(new RegExp(BEARER_PREFIX), "");
      const legit = jwt.verify(token, publicKey, this.getObtionsJWT());
      return new Response(
        EMessages.SUCCESS,
        "Se ha verificado el token correctamente"
      ).setData(legit);
    } catch (error) {
      return new Response(EMessages.ERROR, "El token es inválido.").setData(
        error.toString()
      );
    }
  }

  resolve(ps, eMessageCode) {
    return new Promise((resolve, reject) => {
      ps.then((rows) => {
        const res = new Model().getResponse(rows, eMessageCode);
        res.setData(rows);
        resolve(res);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

export default GenericStore;
