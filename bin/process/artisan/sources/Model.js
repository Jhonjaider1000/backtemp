import Model from './Model';

class ModelName extends Model {
    constructor() {
        super();
        this.table = 'table_name';
        this.primaryKey = 'primary_key_name';
        this.exclude = ['table', 'primaryKey', 'exclude', 'conection'];
        {Fields}
    }

}

module.exports = new ModelName();