/**
 * Deplyn Class
 * ------------
 * @version 2.3 - https://deplyn.com/framework/php/2.3
 * @author John Vanegas - Starlly Software - https://starlly.com.
 * @licence GNU - https://deplyn.com/framework/php/licence.txt
 * @contact jhonjaider100015@gmail.com - developer@starlly.com
 */

const { get: getProp } = require("object-path");

class Validator {
  constructor(errorsKeys = true) {
    this.errorKeys = errorsKeys;
    this.errors = [];
    this.messagesInit = {
      required: "El campo __FIELD__ es requerido.",
      unique: "Ya existe un registro para el mismo campo __FIELD__.",
      email: "El email es inválido.",
      numeric: "El (__FIELD__) no es númerico.",
      boolean: "El (__FIELD__) no es booleano.",
    };
  }

  /**
   * Realiza las validaciones claves del atributo validations
   * sobre el atributo de los values y resuelve los mensajes haciendo uso
   * del atributo messages si están disponibles.
   * @param {Object} values
   * @param {Object} validations
   * @param {Object} messages
   */
  make(values, validations, messages = null) {
    this.errors = [];
    this.messagesInit = messages != null ? messages : this.messagesInit;
    console.log(this.messagesInit);

    //Recorremos los campos que tenemos que validar...
    for (const key in validations) {
      if (validations.hasOwnProperty(key)) {
        const validate = validations[key];
        const parts = key.split(".");
        if (parts.length == 1) {
          this.validateField(key, getProp(values, key, null), validate);
        } else {
          let value = getProp(values, key, null);
          this.validateField(key, value, validate);
        }
      }
    }
  }

  /**
   * Valida un atributo.
   * @param {String} field
   * @param {Any} value
   * @param {String} validations
   */
  validateField(field, value, validations) {
    const actions = validations.split("|");
    actions.forEach((action) => {
      this.validate(field, value, action);
    });
  }

  /**
   * Resuelve el tipo de validación que se desea realizar ej: required|email|numeric etc...
   * @param {String} field
   * @param {String} value
   * @param {String} action
   */
  validate(field, value, action) {
    action = action.split(":");
    const table = action.length == 2 ? action[1] : null;
    action = action[0];
    switch (action) {
      case "required":
        this.required(field, value);
        break;
      case "email":
        this.email(field, value);
        break;
      case "unique":
        this.unique(table, field, value);
        break;
      case "numeric":
        this.numeric(field, value);
        break;
      case "boolean":
        this.isBoolean(field, value);
        break;
      case "min":
        this.min(table, field, value);
        break;
      case "max":
        this.max(table, field, value);
        break;
    }
  }

  /**
   * Resuelve si un valor {value} es válido.
   * @param {String} field
   * @param {String} value
   * @param {Object} messages
   */
  required(field, value, messages = null) {
    const rtn = value ? value.trim() != "" : false;
    messages = messages ? messages : this.messagesInit;
    if (!rtn && Object.keys(messages).length > 0) {
      this.errors.push(this.getError(field, "required", messages));
    }
    return rtn;
  }

  /**
   * Resuelve si un valor {value} es un correo.
   * @param {String} field
   * @param {String} value
   * @param {Object} messages
   */
  email(field, value, messages = null) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rtn = value ? re.test(value) : false;
    messages = messages ? messages : this.messagesInit;
    if (!rtn && Object.keys(messages).length > 0) {
      this.errors.push(this.getError(field, "email", messages));
    }
    return rtn;
  }

  numeric(field, value, messages = null) {
    const rtn = isNaN(value);
    messages = messages ? messages : this.messagesInit;
    if (rtn && Object.keys(messages)) {
      this.errors.push(this.getError(field, "numeric", messages));
    }
    return rtn;
  }

  isBoolean(field, value, messages = null) {
    const rtn = value === true || value === false;
    messages = messages ? messages : this.messagesInit;
    if (rtn && Object.keys(messages)) {
      this.errors.push(this.getError(field, "boolean", messages));
    }
    return rtn;
  }

  unique(table, field, messages = null) {}

  min(min, field, value, messages = null) {
    value = value != null && value.trim() != "" ? value : "";
    if (!value) {
      return false;
    }
    const rtn = value.length >= min;

    messages = messages ? messages : this.messagesInit;
    if (!rtn) {
      this.errors.push(this.getError(field, "min", messages));
    }
    return rtn;
  }

  /**
   * Resuelve si un valor {value} es menor o igual al máximo {max}
   * @param {number} max
   * @param {String} field
   * @param {String} value
   * @param {Object} messages
   */
  max(max, field, value, messages = null) {
    value = value != null && value.trim() != "" ? value : false;

    if (!value) {
      return false;
    }
    const rtn = value.length <= max;
    messages = messages ? messages : this.messagesInit;
    if (!rtn) {
      this.errors.push(this.getError(field, "max", messages));
    }
    return rtn;
  }

  /**
   * Resuelve el error de una acción (required|numeric...) de validación...
   * @param {String} field
   * @param {String} action
   * @param {Object} messages
   */
  getError(field, action, messages) {
    let rtn = false;
    if (this.errorKeys) {
      rtn = messages[`${field}.${action}`]
        ? { [`${field}.${action}`]: messages[`${field}.${action}`] }
        : this.getMessage(field, action);
    } else {
      rtn = getProp(messages, `${field}.${action}`)
        ? getProp(messages, `${field}.${action}`)
        : this.getMessage(field, action);
    }
    return rtn;
  }

  /**
   * Resuelve el mensaje de una validación.
   * @param {Stirng} field
   * @param {String} action
   */
  getMessage(field, action) {
    const ms = this.messagesInit[`${action}`]
      ? this.messagesInit[`${action}`]
      : "No se encontró mensaje personalizado para __FIELD__, es posible que haya escrito mal el key de la referencia en las reglas de validación.";
    return ms.replace(new RegExp("__FIELD__"), field);
  }

  /**
   * Resuelve si hubieron fallas en las validaciones realizadas...
   * @returns {Boolean}
   */
  fails() {
    return Array.isArray(this.errors) && this.errors.length > 0;
  }

  /**
   * Obtiene la lista de errores...
   * @returns {Array}
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Resuelve si se encontró un error en específico Ej: name.required...
   * @param {Boolean} keyName
   */
  hasError(keyName) {
    if (!this.fails()) {
      return false;
    }
  }

  getErrorsKeys() {
    return this.errorsKeys;
  }

  setErrorsKeys(errorsKeys) {
    this.errorsKeys = errorsKeys;
  }
}

export default Validator;
export const ValidatorInstance = new Validator();
