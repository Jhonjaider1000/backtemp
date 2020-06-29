const Model = require('./Model');

class LikesModel extends Model {
    constructor() {
        super();
        this.table = 'likes';
        this.primaryKey = 'id';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id = null;
        this.tipo = null;
        this.id_publicacion = null;
        this.id_usuario = null;
        this.fecha_registro = null;
    }

}

module.exports = new LikesModel();