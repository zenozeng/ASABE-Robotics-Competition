var vision = require('./lib/vision');
var Ultrasound = require('./lib/ultrasound');
var ultrasound = new Ultrasound({pinEcho: 0, pinTrigger: 1});
var whiteSensors = require('./lib/white-sensors');

// setInterval(function() {
//     vision.log();
//     ultrasound.log();
// }, 100);

// 在夹持之前，就地保证处于黑线正中
// 利用五个循迹片实现

var car = require('./lib/car');

car.autoForward();

var i = setInterval(function() {
    var leftIsBlack = whiteSensors.left.isBlack();
    var rightIsBlack = whiteSensors.right.isBlack();
    if (leftIsBlack && rightIsBlack) {
        clearInterval(i);
        car.stopAutoForward();
        car.stop();
        car.turnRound();
    }
}, 20);
