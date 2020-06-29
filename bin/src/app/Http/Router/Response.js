import EMessages from "../../Constants/EMessages";
class Response {
  constructor(code = null, message = null, data = null) {
    if (code && !message) {
      const res = this.getResponse(code);
      this.code = res.code;
      this.message = res.message;
      // this.data = res.data;
      this.data = data;
      return this;
    }
    if (typeof code == "string") {
      const temp = this.getResponse(code);
      code = temp.getCode();
    }
    this.code = code;
    this.message = message;
    this.data = data;
    return this;
  }

  getResponse(code) {
    switch (code) {
      case EMessages.ERROR_VALIDATION:
        const response = new Response(-3, "Errores de validación.");
        return response;
      case EMessages.SUCCESS:
        return new Response(1, "Se ha consultado con éxito.");
      case EMessages.SUCCESS_AUTENTICATION:
        return new Response(1, "Se ha autenticado correctamente.");
      case EMessages.ERROR_AUTENTICATION:
        return new Response(-1, "Error en el usuario o la clave.");
      case EMessages.NULL_DATA:
        return new Response(-2, "Datos no definidos.");
      case EMessages.EMPTY_LIST:
        return new Response(0, "No se encontraron registros.");
      case EMessages.INSERT:
        return new Response(1, "Se ha insertado el registro con éxito.");
      case EMessages.UPDATE:
        return new Response(1, "Se ha actualizado el registro con éxito.");
      case EMessages.DELETE:
        return new Response(1, "Se ha eliminado el registro con éxito.");
      case EMessages.WARNING:
        return new Response(0, "No se han encontrado datos.");
      case EMessages.ERROR:
        return new Response(-1, "Error");
      case EMessages.ALREADY_UPDATE:
        return new Response(0, "No se encontró el registro.");
      case EMessages.ALREADY_DELETED:
        return new Response(0, "No se encontró el registro.");
      case EMessages.ERROR_CSRF_TOKEN:
        return new Response(-1, "Error, el csrf_token no es válido.");
      case EMessages.ERROR_QUERY:
        return new Response(-1, "Error al consultar.");
      case EMessages.ERROR_INSERT:
        return new Response(-1, "Error al insertar.");
      case EMessages.ERROR_UPDATE:
        return new Response(-1, "Error al actualizar.");
      case EMessages.ERROR_DELETE:
        return new Response(-1, "Error al eliminar.");
      case EMessages.ERROR_ACTION:
        return new Response(-1, "Error al ejecutar la acción solicitada.");
      case EMessages.ERROR_FATAL:
        return new Response(-99, "Error Fatal");
      case EMessages.SOCKET_OPEN:
        return new Response(100, "Se ha conectado un nuevo usuario al socket.");
      case EMessages.SOCKET_CLOSED:
        return new Response(-100, "Se ha desconectado del socket.");
      case EMessages.SOCKET_MESSAGE:
        return new Response(150, "Se ha recibido un nuevo mensaje.");
      case EMessages.SOCKET_NO_FOUND_USERS:
        return new Response(
          -100,
          "No se han encontrado más usuarios conectados al socket."
        );
      case EMessages.ACCESS_DENIED:
        return new Response(-1, "Acceso denegado.");
    }
  }

  json(obj = null) {
    this.header("Content-Type", "application/json");
    if (is_array(obj) || is_object(obj)) {
      return json_encode(obj);
    } else {
      return json_encode(this);
    }
  }

  toString(obj = null) {
    if (is_array(obj) || is_object(obj)) {
      return json_encode(obj);
    } else {
      return json_encode(this);
    }
  }

  set(code) {
    return json(EMessages.getResponse(code));
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }

  getData() {
    return this.data;
  }

  setCode(code) {
    this.code = code;
    return this;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }

  setData(data) {
    this.data = data;
    // console.log(data)
    if (data == null || typeof data == "undefined") {
      return new Response(EMessages.NULL_DATA);
    }
    if (Array.isArray(data) && data.length == 0) {
      return new Response(EMessages.EMPTY_LIST);
    }
    return this;
    // return data;
  }
}

export default Response;
