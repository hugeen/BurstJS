define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");

    return function() {

        var Asset = modelCapabilities({});

        return Asset;
    };

});
