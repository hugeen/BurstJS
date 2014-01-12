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

                var path = asset.rootPath + asset.path;
                if (typeof asset.noCache !== "undefined" && asset.noCache) {
                    path += path.indexOf("?") !== -1 ? "&" : "?";
                    path += "noCache=" + (new Date().getTime());
                }

                $.get(path, function(response) {
                    asset.raw = response;
                    asset.readyState = "loaded";
                    asset.emit("loaded");
                });
            }
        });

        return asset;
    };

});
