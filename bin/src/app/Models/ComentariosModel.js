const Model = require('./Model');

class ComentariosModel extends Model {
    constructor() {
        super();
        this.table = 'comentarios';
        this.primaryKey = 'id_comentario';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_comentario = null;
        this.contenido = null;
        this.id_usuario = null;
        this.id_publicacion = null;
        this.fecha_creacion = null;
    }

}

module.exports = new ComentariosModel();