requirejs.config({
    paths: {
        burstcore: '../../burstcore',
        burstjquery: '../../burstjquery/jquery',
        burstutils: '../../burstutils',
        livewire: '../../livewire'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['burstjquery', 'game'], function($, game) {
    $(function() {
        game.emit("start");
    });
});
