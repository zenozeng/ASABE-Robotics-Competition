var vision = require('./lib/vision');
var Ultrasound = require('./lib/ultrasound');
var ultrasound = new Ultrasound({pinEcho: 0, pinTrigger: 1});
var whiteSensors = require('./lib/white-sensors');

// setInterval(function() {
//     vision.log();
//     ultrasound.log();
// }, 100);

var car = require('./lib/car');

car.turnLeft();

// car.autoForward();

// setInterval(function() {
//     var leftIsBlack = whiteSensors.left.isBlack();
//     // var middleIsBlack = whiteSensors.middle.isBlack();
//     var rightIsBlack = whiteSensors.right.isBlack();
//     if (leftIsBlack && rightIsBlack) {
//         car.stopAutoForward();
//         car.stop();
//     }
// }, 20);
