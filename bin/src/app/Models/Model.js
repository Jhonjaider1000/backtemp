import Crud from "../Models/Crud";
import EMessages from "../Constants/EMessages";
import Response from "../Http/Router/Response";

class Model extends Crud {
  constructor(table = null) {
    super(table);
    return this;
  }

  /**
   * Recibe dos arreglos, el @array es el arreglo origen donde se van a excluir cosas
   * y el @exclude es el arreglo con los items que se van a excluir.
   * @param {Array} array
   * @param {Array} exclude
   * @returns {Array}
   */
  excludeItems(array, exclude) {
    if (Array.isArray(exclude) && exclude) {
      const fieldsFinal = array.filter((field) => !exclude.includes(field));
      return fieldsFinal;
    }
    return [];
  }

  /**
   * Obtiene las fields del modelo...
   * @returns {Array}
   */
  getFields() {
    const fields = Object.keys(this);
    return this.excludeItems(fields, this.exclude);
  }

  parseFields(object) {
    const fields = this.getFields();
    for (const key in object) {
      if (!fields.includes(key)) {
        delete object[key];
      }
    }
    return object;
  }

  validRowsResponse(rows) {
    return (
      (Array.isArray(rows) && rows.length > 0) ||
      rows > 0 ||
      (typeof rows == "object" && rows != null && Object.keys(rows).length > 0)
    );
  }

  getResponse(rows, EmessagesCode = EMessages.SUCCESS) {
    if (
      rows == null &&
      (EmessagesCode === EMessages.UPDATE || EmessagesCode === EMessages.DELETE)
    ) {
      return new Response(EMessages.getEmptyMessage(EmessagesCode));
    }
    if (this.validRowsResponse(rows)) {
      return new Response(EMessages[EmessagesCode]).setData(rows);
    } else {
      return new Response(EMessages.getInverseMessage(EmessagesCode));
    }
  }
}

export default Model;
