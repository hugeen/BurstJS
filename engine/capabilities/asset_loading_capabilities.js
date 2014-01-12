define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var $ = require("burst/libs/zepto");

    return function(asset) {

        eventCapabilities(asset);

        asset.readyState = "initialized";

        asset.on("load", function() {
            if (asset.readyState === "loaded") {
                asset.emit("loaded");
            }

            if (asset.readyState === "initialized") {
                asset.readyState = "processing";
                asset.untag("toLoad");

                $.get(asset.rootPath + asset.path, function(response) {
                    asset.raw = response;
                    asset.readyState = "loaded";
                    asset.emit("loaded");
                });
            }
        });

        return asset;
    };

});
