import express from "express";
const router = express.Router();
import Uri from "./Uri";
import RouterActions from "./RouterActions";

class Route {
  constructor() {
    this.routes = [];
    this.routerActionsActual = null;
  }

  all(uri, callback) {
    return this.add("all", uri, callback);
  }

  group() {
    this.routerActionsActual = new RouterActions();
    return this.routerActionsActual;
  }

  groupEnd() {
    this.routerActionsActual = null;
  }

  get(uri, callback) {
    return this.add("get", uri, callback);
  }

  post(uri, callback) {
    return this.add("post", uri, callback);
  }

  put(uri, callback) {
    return this.add("put", uri, callback);
  }

  delete(uri, callback) {
    return this.add("delete", uri, callback);
  }

  add(method, uri, callback) {
    const routeActions = new RouterActions();
    if (this.routerActionsActual) {
      routeActions.csrf_disabled = this.routerActionsActual.csrf_disabled;
      routeActions.middlewares = this.routerActionsActual.middlewares;
    }
    const uriObj = new Uri(uri, method, callback, routeActions);
    this.routes.push(uriObj);
    return routeActions;
  }

  getRoute() {
    this.routes.forEach((route) => {
      router[route.method](route.uri, (req, res) => route.process(req, res));
    });
    return router;
  }
}

export default new Route();
