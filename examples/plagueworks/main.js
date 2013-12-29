requirejs.config({
    paths: {
        burst: '../../'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['burst/utils/dom_utils', 'game'], function(domUtils, game) {
    domUtils(function() {
        game.emit("start");
    });
});
