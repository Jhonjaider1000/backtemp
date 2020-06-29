/**
 * @author John Vanegas
 * @email contacto@starlly.com - jhonjaider100015@gmail.com
 */
var SERVER_URI = process.env.APP_URL;
const request = require('request');
const fs = require('fs');
const http = require('http');

var __app = {
    develop: true,
    token: null,
    urlbase: null,
    init: function () {
        __app.urlbase = SERVER_URI;
    },
    validResponse: function (response) {
        switch (response.code) {
            case 1:
                response = response;
                break;
            case 0:
                response = response;
                break;
            case -1:
                response = false;
                break;
            default:
                if (response.code < 0) {
                    response = false;
                } else {
                    response = response;
                }
                break;

        }
        return response;
    },
    urlTo: function (url) {
        return __app.urlbase + url;
    },
    successResponse: function (response) {
        return response.code > 0;
    },
    parseResponse: function (response) {
        var data = __app.validResponse(response);
        if (data) {
            return data.data;
        } else {
            return false;
        }
    },
    stopEvent: function (e) {
        if (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (!!e.returnValue) {
                e.returnValue = false;
            }
        }
        return;
    },
    extend: function (obj1, obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }
        return obj1;
    },
    /**
     *
     * @param {String} url
     * @param {Object} data
     * @param {function} success
     * @param {function} error
     * @param {function} before
     * @param {function} complete
     */
    get: function (url, data, success, error, before, complete) {
        var ajax = __app.getObjectAjax(url, data, success, error, "GET", before, complete);
        return __app.extend({ ajax: ajax }, __app.methods);
    },
    /**
     * @param {String} url
     * @param {Object} data
     * @param {function} success
     * @param {function} error
     * @param {function} before
     * @param {function} complete
     */
    post: function (url, data, success, error, before, complete) {
        var ajax = __app.getObjectAjax(url, data, success, error, "POST", before, complete);
        ajax = __app.extend({ ajax: ajax }, __app.methods);
        return ajax;
    },
    methods: {
        before: function (callback) {
            this.ajax.before = callback;
            return this;
        },
        complete: function (callback) {
            this.ajax.complete = callback;
            return this;
        },
        success: function (callback) {
            this.ajax.success = callback;
            return this;
        },
        error: function (callback) {
            this.ajax.error = callback;
            return this;
        },
        send: function () {
            __app.ajax(this.ajax);
        }
    },
    getObjectAjax: function (url, data, success, error, method, before, complete) {
        var ajax = new Object();
        ajax.url = url;
        ajax.data = data;
        ajax.type = method;
        ajax.success = success;
        ajax.error = (error) ? error : __app.ajaxError;
        ajax.beforeSend = (before) ? before : __app.beforeSend;
        ajax.complete = (complete) ? complete : null;
        return ajax;
    },
    beforeSend: function (data) {
    },
    validateExtensions: function (oInput, _validFileExtensions) {
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                if (!blnValid) {
                    return false;
                }
            }
        }
        return true;
    },
    ajax: function (args) {
        var ajax = new Object();
        ajax.headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        };
        if (__app.token) {
            ajax.headers.Authorization = __app.token;
        }
        ajax.url = (SERVER_URI + args.url);
        ajax.method = (args.type) ? args.type : "POST";
        ajax.json = args.data;
        require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
        request(ajax, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                if (__app.validJSON(body)) {
                    body = JSON.parse(body);
                }
                args.success(body);
            } else {
                if (args.error) {
                    args.error(error);
                } else {
                    __app.error(error);
                }
            }
        });
    },
    uploadFileTemp: function (url, files, params) {
        const uploader = {
            complete: (callback) => {
                uploader.completeCallback = callback;
                return uploader;
            },
            progress: (callback) => {
                uploader.progressCallback = callback;
                return uploader;
            },
            error: (callback) => {
                uploader.errorCallback = callback;
                return uploader;
            },
            start: () => {
                //En el futuro subirá archivos múltiples...
                if (Array.isArray(files)) {
                    const file = files[0];
                    const req = request({
                        url: SERVER_URI + url,
                        method: 'POSt',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Authorization': __app.token,
                        },
                    }, (error, response, body) => {
                        if (!error && response.statusCode === 200) {
                            if (__app.validJSON(body)) {
                                body = JSON.parse(body);
                            }
                            if (typeof uploader.completeCallback === 'function') {
                                uploader.completeCallback(body);
                            }
                        } else {
                            if (typeof uploader.errorCallback === 'function') {
                                uploader.errorCallback();
                            }
                        }
                    });
                    var form = req.form();
                    if (typeof (params) === 'object') {
                        for (key in params) {
                            form.append(key, params[key]);
                        }
                    }
                    form.append('file', fs.createReadStream(file.path));
                }
            }
        };
        return uploader;
    },
    downloadFile: (file) => {

    },
    error: function (error) {
        console.log(error);
    },
    formToJSON: function (formArray) {
        var returnArray = {};
        for (var i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        return returnArray;
    },
    getParamURL: function (param) {
        var url = new URL(location.href);
        var c = url.searchParams.get(param);
        return c;
    },
    fileToBase64: function (file, successCallback, errorCallback) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            if (typeof successCallback == 'function') {
                successCallback(reader.result);
            }
        };
        reader.onerror = function (error) {
            console.error('Error on __app.fileToBase64()', error);
            if (typeof errorCallback == 'function') {
                errorCallback(error);
            }
        }
    },
    validJSON: function (text) {
        if (!text || typeof text !== 'string') {
            return false;
        }
        return /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
    },
    getPath(src = '') {
        const path = require('os').homedir() + '/.AddllyData/' + src;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        return path;
    }
};

module.exports = __app;
