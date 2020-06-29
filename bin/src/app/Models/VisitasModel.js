const Model = require('./Model');

class VisitasModel extends Model {
    constructor() {
        super();
        this.table = 'visitas';
        this.primaryKey = 'id_visita';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_visita = null;
        this.id_publicacion = null;
        this.id_usuario = null;
        this.ip = null;
        this.pais = null;
        this.fecha_registro = null;
    }

}

module.exports = new VisitasModel();