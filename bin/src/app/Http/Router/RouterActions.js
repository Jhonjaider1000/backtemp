import { Validator } from "../Validations/validator";

class RouterActions extends Validator {
  constructor() {
    super(false);
    this.csrf_disabled = false;
    this.middlewares = [];
  }

  validation(callback) {
    if (typeof callback !== "function") {
      return;
    }

    this.validationCallback = callback;
    return this;
  }

  middleware(...middlewareNames) {
    this.middlewares = this.middlewares.concat(middlewareNames);
    return this;
  }

  csrfDisabled() {
    this.csrf_disabled = true;
    return this;
  }
}

export default RouterActions;
