const Model = require('./Model');

class AccesosModel extends Model {
    constructor() {
        super();
        this.table = 'accesos';
        this.primaryKey = 'id_accesos';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_accesos = null;
        this.id_usuario = null;
        this.pais = null;
        this.ip = null;
        this.accion = null;
        this.fecha_registro = null;
    }

}

module.exports = new AccesosModel();