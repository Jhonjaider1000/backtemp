const Model = require('./Model');

class SuscribersModel extends Model {
    constructor() {
        super();
        this.table = 'suscribers';
        this.primaryKey = 'id_suscriber';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_suscriber = null;
        this.email = null;
        this.accion = null;
        this.fecha_registro = null;
    }

}

module.exports = new SuscribersModel();