const EMessages = {
  SUCCESS: "SUCCESS",
  SUCCESS_AUTENTICATION: "SUCCESS_AUTENTICATION",
  INSERT: "INSERT",
  UPDATE: "UPDATE",
  ALREADY_UPDATE: "ALREADY_UPDATE",
  ALREADY_DELETED: "ALREADY_DELETED",
  DELETE: "DELETE",
  ERROR: "ERROR",
  ERROR_AUTENTICATION: "ERROR_AUTENTICATION",
  WARNING: "WARNING",
  EMPTY_LIST: "EMPTY_LIST",
  NULL_DATA: "NULL_DATA",
  ERROR_CSRF_TOKEN: "ERROR_CSRF_TOKEN",
  ERROR_QUERY: "ERROR_QUERY",
  ERROR_INSERT: "ERROR_INSERT",
  ERROR_UPDATE: "ERROR_UPDATE",
  ERROR_DELETE: "ERROR_DELETE",
  ERROR_ACTION: "ERROR_ACTION",
  ERROR_VALIDATION: "ERROR_VALIDATION",
  ERROR_FATAL: "ERROR_FATAL",
  SOCKET_OPEN: "SOCKET_OPEN",
  SOCKET_CLOSED: "SOCKET_CLOSED",
  SOCKET_NO_FOUND_USERS: "SOCKET_NO_FOUND_USER",
  SOCKET_MESSAGE: "SOCKET_NEW_USER",
  ACCESS_DENIED: "ACCESS_DENIED",

  getInverseMessage: (EMessagesCode) => {
    switch (EMessagesCode) {
      case EMessages.SUCCESS_AUTENTICATION:
        return EMessages.ERROR_AUTENTICATION;
      case EMessages.SUCCESS:
        return EMessages.WARNING;
      case EMessages.INSERT:
        return EMessages.ERROR_INSERT;
      case EMessages.UPDATE:
        return EMessages.ERROR_UPDATE;
      case EMessages.DELETE:
        return EMessages.ERROR_DELETE;
      default:
        return EMessages.ERROR;
    }
  },

  getEmptyMessage: (EMessagesCode) => {
    switch (EMessagesCode) {
      case EMessages.UPDATE:
        return EMessages.ALREADY_UPDATE;
      case EMessages.DELETE:
        return EMessages.ALREADY_DELETED;
      default:
        return EMessagesCode;
    }
  },
};

export default EMessages;
