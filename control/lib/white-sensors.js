var pins = require('./pins');
var pcduino = require('yapcduino');

var sensors = {
    left: pins.LEFT_BLACK_AND_WHITE_SENSOR,
    // middle: pins.MIDDLE_BLACK_AND_WHITE_SENSOR,
    right: pins.RIGHT_BLACK_AND_WHITE_SENSOR
};

var API = {};

Object.keys(sensors).forEach(function(key) {
    var pin = sensors[key];
    pcduino.pinMode(pin, pcduino.INPUT);
    API[key] = {
        isWhite: function() {
            return pcduino.digitalRead(pin) === 1;
        },
        isBlack: function() {
            return pcduino.digitalRead(pin) === 0;
        }
    };
});

module.exports = API;
