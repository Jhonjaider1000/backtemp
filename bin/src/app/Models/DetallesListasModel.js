const Model = require('./Model');

class DetallesListasModel extends Model {
    constructor() {
        super();
        this.table = 'detalles_listas';
        this.primaryKey = 'id_detalle';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_detalle = null;
        this.id_lista = null;
        this.id_publicacion = null;
        this.fecha_registro = null;
    }

}

module.exports = new DetallesListasModel();