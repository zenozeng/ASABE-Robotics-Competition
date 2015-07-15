var path = require('path');
var bin = path.join(__dirname, '../../vision/vision');
var spawn = require('child_process').spawn;

// Usage:
// v = require('./vision');
// will run on background
// you can read this.exists || this.color || this.hue when you need it

function Vision(options) {
    options = options || {};
    this.process = spawn(bin);
    var v = this;
    this.process.stdout.on('data', function(data) {
        var msg = data.toString();
        var obj = null;
        msg.split('\n').forEach(function(msg) {
            try {
                obj = JSON.parse(msg);
                if (obj) {
                    v.exists = (obj.exists == "1");
                    v.color = obj.color == "null" ? null : obj.color;
                    v.hue = parseInt(obj.hue);
                    v.position = parseFloat(obj.position);
                    v.time = new Date();
                }
            } catch (e) {
                // console.warn('Ignore: ', e);
                // console.warn(msg);
            }
        });
    });
    this.process.stderr.on('data', function(data) {
        console.error(data.toString());
    });
    return this;
}

Vision.prototype.isTree = function() {
    return this.exists && this.position > 0.4 && this.position < 0.6;
};

var vision = new Vision({debug: true});

process.on('exit', function(code) {
    console.info('lib/vision.js: about to exit with code(' + code + '), try to kill vision bin process.');
    if (vision.process) {
        console.info('lib/vision.js: vision binary process detected - ', vision.process.pid);
        vision.process.kill('SIGKILL');
        console.info('lib/vision.js: process killed.');
    }
});

module.exports = vision;
