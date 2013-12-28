define(function(require) {

    var entities = require("collections/entities");

    return function(Model) {
        Model.bindCollection(entities);
    };

});
