Spark.newSpecification(function(spec) {

    spec.name = 'wildloader';
    spec.version = '0.0.1';
    spec.summary = 'A WebWorker Ajax Loader (part of BurstJS).';
    spec.description = 'A WebWorker Ajax Loader.';

    spec.requiredBurstVersion = '>= 0.0.1';

    spec.license = 'MIT';

    spec.author = 'Cyrille Bogaert';
    spec.email = 'bogaert.cyrille@gmail.com';
    spec.homepage = 'http://www.burstjs.com';

    spec.path = 'lib/';
    spec.mainFile = 'wild_loader.js';

    spec.addDependency('burstcore', '0.0.1');

});
