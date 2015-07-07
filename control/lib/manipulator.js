var yapcduino = require('yapcduino');
var Servo = yapcduino.Servo;
var pins = require('./pins');

var pin = pins.END_EFFECTOR_SERVO;

pin = 5;

var servo = new Servo(pin, {
    minPWM: 1,
    maxPWM: 200,
    maxAngle: 180,
    frequency: 390
});

// module.exports = servo;
