define(function() {

    return function(name, fnc, count) {

        count = count || 1;
        var total = 0;

        for (var i = 0; i < count; i++) {
            var startedAt = Date.now();
            fnc();
            total += Date.now() - startedAt;
        }

        console.log("[Benchmark] " + name, "x" + count + ": ", total+"ms", "- Average: ", "~" + total / count + "ms");
    };

});
