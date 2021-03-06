import route from "../../Http/Router/Router";
import CrudController from "./CrudController";
import Model from "../../Models/Model";
import { Validator } from "../../Http/Validations/validator";
import { initSocket, sendMessage } from "./Listeners";
import { get as getProp } from "object-path";

const SOCKET_MESSAGES = {
  FETCH: "FETCH",
  GET_LAST_USER: "GET_LAST_USER",
  ADD_HISTORY: "ADD_HISTORY",
  ADD_USER: "ADD_USER",
};

route.get("/", (req, res) => {
  res.json({ code: 1, message: "Servicios Deplyn corriendo correctamente." });
});

route.get("/history/last", (req, res) => {
  const dispositivo = req.params.dispositivo;
  const sql = `select * from history where dispositivo = '${dispositivo}' AND fecha_registro > date_sub(now(), interval 60 second) ORDER BY fecha_registro DESC LIMIT 1`;
  const m = new Model("history");
  return new Promise((resolve, reject) => {
    m.query(sql).then((rows) => {
      const array = Array.isArray(rows) && rows.length > 0 ? rows[0] : [];
      const finalList =
        Array.isArray(array) && array.length > 0 ? array[0] : null;
      resolve({
        code: finalList ? 1 : 0,
        message: finalList ? "success" : "empty",
        data: finalList,
      });
    });
  });
});

const newHistory = (req, res, method = 'post') => {
  return new Promise((resolve, reject) => {
    const params = method == "get" ? req.query : req.body;
    const dispositivo = params.dispositivo ? params.dispositivo : 1;
    const documento = params.documento;
    const temperatura = params.temperatura;
    const validator = new Validator();
    validator.make(params, {
      documento: "required",
      temperatura: "required",
    });
    if (validator.fails()) {
      return resolve({ code: -1, errors: validator.getErrors() });
    }

    initSocket("http://vmi304306.contaboserver.net:82");
    const m = new Model("history");
    return m
      .insert({
        dispositivo: dispositivo,
        documento: documento,
        temperatura: temperatura,
        fecha_registro: new Date(),
      })
      .then((rows) => {
        sendMessage({
          type: SOCKET_MESSAGES.ADD_HISTORY,
          dispositivo: dispositivo,
        });
        return resolve({
          code: 1,
          message: "Se ha registrado correctamente el registro.",
        });
      });
  });
};

route.get("/new/history", (req, res) => {
  return newHistory(req, res, 'get');
});

route
  .post("/new/history", (req, res) => {
    return newHistory(req, res, 'post');
  })
  .csrfDisabled();

route
  .post("/restprueba", function (req, res) {
    return new Promise((resolve, reject) => {
      resolve({ ok: 1 });
    });
  })
  .csrfDisabled();

route.group().csrfDisabled();
route.get("/:table", CrudController.index);
route.get("/:table/:id", CrudController.show);
route.post("/:table", CrudController.store);
route.put("/:table/:id", CrudController.update);
route.delete("/:table/:id", CrudController.delete);

route.groupEnd();

module.exports = route.getRoute();
