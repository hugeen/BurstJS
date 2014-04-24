var sparks = [];

function addSpark(spark) {
    sparks.push(spark);
}

function installSpark(spark) {

}

function installAll() {
    sparks.forEach(function(spark) {
        installSpark(spark);
    });
}

module.exports = {
    install: function() {
        if (arguments.length === 0) {
            installAll();
        } else {
            installSpark(arguments[0]);
        }
    },
    spark: addSpark
};
