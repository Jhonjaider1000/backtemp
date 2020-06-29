const Middleware = require("../Router/Middleware");

class AuthMiddleware extends Middleware {
  handle(req, res) {
    const ControlDelegate = new Delegate();
    const profile = ControlDelegate.profile(req, res);
    res.status(403);
    res.json(profile);
    res.end();
    return profile.getCode() > 0;
  }
}

module.exports = new AuthMiddleware();
