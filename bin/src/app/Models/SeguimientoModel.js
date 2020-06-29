const Model = require('./Model');

class SeguimientoModel extends Model {
    constructor() {
        super();
        this.table = 'seguimiento';
        this.primaryKey = 'id_seguimiento';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_seguimiento = null;
        this.id_usuario = null;
        this.id_seguidor = null;
        this.estado = null;
        this.fecha_registro = null;
    }

}

module.exports = new SeguimientoModel();