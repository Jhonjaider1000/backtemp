import Middleware from "../Router/Middleware";
import Response from "../Router/Response";
import EMessages from "../../Constants/EMessages";
import Tokens from "csrf";
const csrf = new Tokens();

class CsrfTokenMiddleware extends Middleware {
  handle(req, res) {
    const token = req.header("csrf-token");
    const secret = req.header("secret");
    if (!token || token.trim() == "") {
      res.status(403);
      res.json(
        new Response(EMessages.ERROR, "No se ha enviado el csrf_token", {
          token: token,
          secret: secret,
        })
      );
      res.end();
      return false;
    }

    if (!csrf.verify(secret, token)) {
      throw new Error("El csrf_token es inválido");
    }

    return true;
  }
}

export default new CsrfTokenMiddleware();
