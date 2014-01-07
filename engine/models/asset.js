define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var assetLoadingCapabilities = require("burst/engine/capabilities/asset_loading_capabilities");

    return function() {

        var Asset = modelCapabilities({});

        Asset("instance created", function(asset) {
            assetLoadingCapabilities(asset);
        });

        return Asset;
    };

});
