define(function(require) {

    return function(Model) {
        Model.bindCollection(require("collections/entities"));
    };

});
