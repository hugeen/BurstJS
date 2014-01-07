define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");

    return function(asset) {

        eventCapabilities(asset);

        asset.loaded = false;

        asset.on("load", function() {

        });

        asset.on("loaded", function() {

        });

        return asset;
    };

});
