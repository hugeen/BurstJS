define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var assetLoadingCapabilities = require("burst/engine/capabilities/asset_loading_capabilities");
    var Asset = modelCapabilities({});

    Asset.on("load by tag", function(tag) {
        function loadNext() {
            if(Asset.toLoad[tag].length > 0) {
                var asset = Asset.toLoad[tag][0];
                asset.on("loaded", onLoaded);
                asset.emit("load");
            } else {
                Asset.emit([tag, "loaded"]);
            }
        }
        function onLoaded() {
            this.off(onLoaded);
            loadNext();
        }
        loadNext();
    });

    Asset.on("instance created", function(asset, params) {
        assetLoadingCapabilities(asset);
        asset.url = params.url;
        asset.tag("toLoad");
    });

    return Asset;

});
