import Response from "./Response";
import EMessages from "../../Constants/EMessages";
import MiddlewareRecords from "../Middlewares/MiddlewareRecords";
import configApp from "../../../../config/app";

class Uri {
  constructor(uri, method, callback, routerActions) {
    this.uri = uri;
    this.method = method;
    this.callback = callback;
    this.routerActions = routerActions;
  }

  /**
   * Verifica los middlewares integrados en la ruta,
   * si el método es POST se valida el csrf_token.
   * @param {Object} req
   * @param {Object} res
   */
  verifyMiddlewares(req, res) {
    let next = true;
    //Validariamos los middlewares...
    const middlewares = MiddlewareRecords.load();
    const actionMiddlewares = this.routerActions.middlewares;
    if (
      configApp.methdos_csrf.includes(req.method) &&
      !this.routerActions.csrf_disabled
    ) {
      actionMiddlewares.push("csrf_token");
    }
    if (Array.isArray(actionMiddlewares)) {
      for (let index = 0; index < actionMiddlewares.length; index++) {
        const middlewareName = actionMiddlewares[index];
        const middleware = middlewares[middlewareName];
        if (middleware && !middleware.handle(req, res)) {
          next = false;
          return next;
        }
      }
    }
    return next;
  }

  printError(error, res) {
    res.status(500);
    res.json({
      code: -1,
      message: "Se ha producido un error desconocido.",
      errorMessage: error.message,
      error: error.stack,
    });
    res.end();
  }

  /**
   * Procesa la petición...
   * @param {Object} req
   * @param {Object} res
   */
  process(req, res) {
    try {
      const next = this.verifyMiddlewares(req, res);
      if (!next) {
        return;
      }
      const params = this.method == "get" ? req.query : req.body;
      //Ejecutamos las validaciones...
      if (typeof this.routerActions.validationCallback === "function") {
        const v = this.routerActions.validationCallback(params);
        if (v.fails()) {
          const response = new Response(EMessages.ERROR_VALIDATION);
          response.messages = v.getErrors();
          delete response.message;
          delete response.data;
          res.status(200);
          res.json(response);
          return res.end();
        }
      }
      this.callback(req, res)
        .then((response) => {
          res.status(200);
          res.json(response);
          res.end();
        })
        .catch((error) => {
          this.printError(error, res);
        });
    } catch (error) {
      console.log(error);
      this.printError(error, res);
    }
  }
}

export default Uri;
