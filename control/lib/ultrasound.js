require('yapcduino')({global: true});
var cp = require('child_process');

function Ultrasound(options) {
    this.pinEcho = options.pinEcho;
    this.pinTrigger = options.pinTrigger;

    pinMode(this.pinTrigger, OUTPUT);
    pinMode(this.pinEcho, INPUT);

    // update distance on msg
    var child = cp.fork(__dirname + '/ultrasound-daemon.js', [this.pinEcho, this.pinTrigger]);
    var _this = this;
    child.on('message', function(msg) {
        _this.distance = msg.distance;
        _this.time = new Date();
        _this.log();
    });

    // kill child process on exit
    process.on('exit', function(code) {
        console.info('lib/ultrasound.js: about to exit with code(' + code + '), try to kill child process.');
        if (child) {
            console.info('lib/ultrasound.js: child process detected - ', child.pid);
            child.kill('SIGKILL');
            console.info('lib/ultrasound.js: process killed.');
        }
    });
}

Ultrasound.prototype.log = function() {
    var u = this;
    console.log({distance: u.distance, time: u.time});
};
