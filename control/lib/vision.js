var path = require('path');
var bin = path.join(__dirname, '../../vision/vision');
var spawn = require('child_process').spawn;

function Vision() {
    this.process = spawn(bin);
    this.process.stdout.on('data', function(data) {
        var msg = data.toString();
        var obj = null;
        try {
            obj = JSON.parse(msg);
            if (obj) {
                this.exists = obj.exists;
                this.color = obj.color;
                this.hue = obj.hue;
            }
        } catch (e) {
        }
    });
    this.process.stderr.on('data', function(data) {
        console.error(data.toString());
    });
    return this;
}

var vision = new Vision();

module.exports = vision;
