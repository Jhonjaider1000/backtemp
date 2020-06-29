const Model = require('./Model');

class PublicacionModel extends Model {
    constructor() {
        super();
        this.table = 'publicacion';
        this.primaryKey = 'id_publicacion';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_publicacion = null;
        this.codigo = null;
        this.url = null;
        this.titulo = null;
        this.descripcion = null;
        this.palabras_clave = null;
        this.id_usuario = null;
        this.visibilidad = null;
        this.estado = null;
        this.id_categoria = null;
        this.vistas = null;
        this.likes_up = null;
        this.likes_down = null;
        this.id_last_reply = null;
        this.fecha_creacion = null;
    }

}

module.exports = new PublicacionModel();