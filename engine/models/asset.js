define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var assetLoadingCapabilities = require("burst/engine/capabilities/asset_loading_capabilities");

    var Asset = modelCapabilities({});

    Asset.createOrFind = function(path) {
        var asset = Asset.find("path", path);
        if (asset === null) {
            asset = Asset.create({
                path: path
            });
        }

        return asset;
    };

    Asset.loadManifest = function(manifest, tagName) {
        manifest.forEach(function(assetPath) {
            var asset = Asset.createOrFind(assetPath);
            if (typeof tagName !== "undefined") {
                asset.tag(tagName);
            }
        });

        return Asset;
    };

    Asset.on("instance created", function(asset, params) {
        assetLoadingCapabilities(asset);
        asset.url = params.url;
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
