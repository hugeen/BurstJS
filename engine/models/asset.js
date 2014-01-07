define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var assetLoadingCapabilities = require("burst/engine/capabilities/asset_loading_capabilities");

    var Asset = modelCapabilities({});

    Asset.on("instance created", function(asset, params) {
        assetLoadingCapabilities(asset);
        asset.url = params.url;
    });

    return Asset;

});
