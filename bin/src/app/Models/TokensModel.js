const Model = require('./Model');

class TokensModel extends Model {
    constructor() {
        super();
        this.table = 'tokens';
        this.primaryKey = 'id_token';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        this.id_token = null;
        this.token = null;
        this.id_usuario = null;
        this.estado = null;
        this.fecha_registro = null;
    }

}

module.exports = new TokensModel();