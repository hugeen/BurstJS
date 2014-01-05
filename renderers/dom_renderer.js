define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");

    return function(dom) {

        eventCapabilities(dom);

        dom.on("initialize", function() {

        });

        dom.on("draw", function() {

        });

        dom.on("clear", function() {

        });

        return dom;
    };

});