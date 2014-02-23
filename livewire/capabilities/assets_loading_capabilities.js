define(function(require) {

    var eventCapabilities = require("burstcore/event_capabilities");
    var $ = require("burstjquery");

    return function(asset) {

        eventCapabilities(asset);

        asset.readyState = "initialized";

        asset.on("load", function() {
            if (asset.readyState === "loaded") {
                asset.emit("loaded");
            }

            if (asset.readyState === "initialized") {
                asset.readyState = "processing";
                asset.untag("toLoad");

                var path = asset.rootPath + asset.path;
                if (typeof asset.noCache !== "undefined" && asset.noCache) {
                    path += path.indexOf("?") !== -1 ? "&" : "?";
                    path += "noCache=" + (new Date().getTime());
                }

                var xhr = new XMLHttpRequest(),
                    reader = new FileReader();

                xhr.open('GET', path, true);
                xhr.responseType = 'blob';

                xhr.addEventListener('load', function() {
                    if (xhr.status === 200) {
                        reader.addEventListener('load', function(e) {
                            // change location to Data URI
                            // location.href = e.target.result;
                            console.log(e.target.result);
                            asset.raw = xhr.response;
                            asset.readyState = "loaded";
                            asset.emit("loaded");
                        });
                        // Construct a new Blob with a mimetype, what a bother
                        var responseWithMimeType = new Blob(
                        new Array(xhr.response), // Blobs only take Array objects
                        {
                            'type': xhr.getResponseHeader('Content-Type')
                        });
                        // read blob as Data URI
                        if (xhr.getResponseHeader('Content-Type') === "text/css") {
                            asset.raw = xhr.response;
                            asset.readyState = "loaded";
                            asset.emit("loaded");
                        } else {
                            reader.readAsDataURL(responseWithMimeType);
                        }
                    }
                });
                xhr.send();

            }
        });

        return asset;
    };

});
