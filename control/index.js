var vision = require('./lib/vision');
var Ultrasound = require('./lib/ultrasound');
var ultrasound = new Ultrasound({pinEcho: 0, pinTrigger: 1});
setInterval(function() {
    vision.log();
    ultrasound.log();
}, 100);
