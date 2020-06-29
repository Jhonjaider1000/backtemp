import Model from './Model';

class UsuarioModel extends Model {
    constructor() {
        super();
        this.table = 'usuario';
        this.primaryKey = 'id_usuario';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_usuario = null;
        this.correo = null;
        this.usuario = null;
        this.clave = null;
        this.rol = null;
        this.url_image = null;
        this.pais = null;
        this.estado = null;
        this.fecha_registro = null;
    }

}

module.exports = new UsuarioModel();