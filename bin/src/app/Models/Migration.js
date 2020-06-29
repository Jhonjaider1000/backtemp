class Migration {
  constructor(table) {
    this.table = table;
    this.fields = [];
  }
  getObjField() {}
  
  addField(field) {
    const objField = this.getObjField(field);
    this.fields.push(objField);
  }
}
