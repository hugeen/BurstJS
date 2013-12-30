requirejs.config({
    paths: {
        burst: '../../'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['burst/utils/dom_utils', 'game'], function($, game) {
    $.ready(function() {
        game.emit("start");
    });
});
