const Model = require('./Model');

class CategoriasModel extends Model {
    constructor() {
        super();
        this.table = 'categorias';
        this.primaryKey = 'id_categoria';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_categoria = null;
        this.titulo = null;
        this.descripcion = null;
        this.enlace = null;
        this.num_registros = null;
        this.estado = null;
        this.fecha_registro = null;
    }

}

module.exports = new CategoriasModel();