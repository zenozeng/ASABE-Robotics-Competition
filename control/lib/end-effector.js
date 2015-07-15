var yapcduino = require('yapcduino');
var Servo = yapcduino.Servo;
var pins = require('./pins');

var pin = pins.END_EFFECTOR_SERVO;

pwmfreq_set(3, 126);

module.exports = {
    open: function() {
        analogWrite(pin, 5);
        analogWrite(pin, 0);
    },
    close: function() {
        analogWrite(pin, 30);
    }
};
