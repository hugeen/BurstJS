define(function(require) {

    var modelCapabilities = require("burst_core/model_capabilities");
    var ajaxCapabilities = require("wild_loader/ajax_capabilities");

    var Ajax = eventCapabilities({});
    Ajax.on("create", function(ajax, type, url, params) {
        ajaxCapabilities(ajax);
    });

    Ajax.get = function(url, params, complete) {
        var ajax = Ajax.create("GET", url, params);
        ajax.on("complete", complete);
        ajax.emit("start");
        return ajax;
    };

    return Ajax;

});