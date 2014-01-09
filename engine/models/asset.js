define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var assetLoadingCapabilities = require("burst/engine/capabilities/asset_loading_capabilities");

    var Asset = modelCapabilities({});

    Asset.on("instance created", function(asset, params) {
        assetLoadingCapabilities(asset);
        asset.url = params.url;
        asset.name = params.name;
        asset.tag("toLoad");
    });

    Asset.on("load by tag", function(tag) {
        loadNextAssetFromCollection(tag);
    });

    function loadNextAssetFromCollection(tag) {
        if (Asset.toLoad[tag].length > 0) {
            var asset = Asset.toLoad[tag][0];
            asset.on("loaded", function() {
                loadNextAssetFromCollection(tag);
            });
            asset.emit("load");
        } else {
            Asset.emit([tag, "loaded"]);
        }
    }

    return Asset;

});
