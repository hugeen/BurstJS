define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var $ = require("burst/libs/zepto");

    return function(asset) {

        eventCapabilities(asset);

        asset.loaded = false;

        asset.on("load", function() {
            $.get(asset.url, function(response) {
                asset.raw = response;
                asset.loaded = true;
                asset.emit("loaded");
            });
        });

        return asset;
    };

});
