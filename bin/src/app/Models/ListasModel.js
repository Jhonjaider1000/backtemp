const Model = require('./Model');

class ListasModel extends Model {
    constructor() {
        super();
        this.table = 'listas';
        this.primaryKey = 'id_lista';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_lista = null;
        this.codigo = null;
        this.id_usuario = null;
        this.titulo = null;
        this.descripcion = null;
        this.estado = null;
        this.fecha_creacion = null;
    }

}

module.exports = new ListasModel();