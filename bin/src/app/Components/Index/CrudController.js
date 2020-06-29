import GenericController from "../Generic/GenericController";
import Store from "./Store";

class CrudController extends GenericController {
  constructor() {
    super();
  }

  index(httpReq) {
    return Store.index(httpReq, crudController.getTableModel(httpReq));
  }

  store(httpReq, httpRes) {
    return Store.store(httpReq, crudController.getTableModel(httpReq));
  }

  update(httpReq, httpRes) {
    return Store.update(httpReq, crudController.getTableModel(httpReq));
  }

  show(httpReq) {
    return Store.show(httpReq, crudController.getTableModel(httpReq));
  }

  getTableModel(httpReq) {
    const table = httpReq.params.table;
    return table;
  }

  delete(httpReq) {
    return Store.delete(httpReq, crudController.getTableModel(httpReq));
  }
}

const crudController = new CrudController();
export default crudController;
