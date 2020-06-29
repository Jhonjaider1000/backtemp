import AuthMiddleware from "./AuthMiddleware";
import CsrfTokenMiddleware from "./CsrfTokenMiddleware";

class MiddlewareRecords {
  constructor() {}

  load() {
    return {
      auth: AuthMiddleware,
      csrf_token: CsrfTokenMiddleware,
    };
  }
}

export default new MiddlewareRecords();
