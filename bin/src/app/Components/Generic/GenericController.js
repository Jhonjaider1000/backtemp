class Controller {
  constructor() {}

  getNameModel(tableModel) {
    var re = /(\b[a-z](?!\s))/g;
    var s = tableModel.replace(/\_/g, " ");
    s = s
      .replace(re, function (x) {
        return x.toUpperCase();
      })
      .replace(/\s+/g, "_");
    return s;
  }
}

module.exports = Controller;
