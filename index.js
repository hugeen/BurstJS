var sys = require('sys');
var exec = require('child_process').exec;
var fs = require('fs');

var sparksDir = "sparks/";

function createSparksDir() {
    if (!fs.existsSync(sparksDir)) {
        fs.mkdirSync(sparksDir);
    }
}

function installSpark(sparkName) {
    if (!sparkExists(sparkName)) {
        exec("git clone git@github.com:hugeen/burst-moltencore.git " + sparksDir + sparkName, puts);
    }
}

function sparkExists(sparkName) {
    return fs.existsSync(sparksDir + sparkName);
}

function puts(error, stdout, stderr) {
    sys.puts(stdout);
}

module.exports = {
    install: function() {
        createSparksDir();
        installSpark("moltencore");
    }
};
